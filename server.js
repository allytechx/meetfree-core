require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 10000;
const ALIYUN_API_KEY = (process.env.ALIYUN_API_KEY || '').trim();
const ALIYUN_WORKSPACE_ID = (process.env.ALIYUN_WORKSPACE_ID || '').trim();
const ALIYUN_MODEL = (process.env.ALIYUN_MODEL || 'qwen3.5-livetranslate-flash-realtime').trim();
const ALIYUN_REGION = (process.env.ALIYUN_REGION || 'cn-beijing').trim();
// 文本生成API Key（用于AI总结），如果没有单独设置就用ALIYUN_API_KEY
const DASHSCOPE_API_KEY = (process.env.DASHSCOPE_API_KEY || ALIYUN_API_KEY).trim();
// 业务空间专属域名（用于AI总结调用qwen-turbo），格式如：https://ws-xxx.cn-beijing.maas.aliyuncs.com
// 如果不设置，默认用 ALIYUN_WORKSPACE_ID 构造
const WORKSPACE_ENDPOINT = (process.env.WORKSPACE_ENDPOINT || '').trim();

// 安全的字符串截取函数，避免undefined报错
function safeSubstring(str, start, end) {
  if (!str || typeof str !== 'string') return String(str || '');
  return str.substring(start, end);
}

// 清理AI返回文本中的Markdown代码围栏等标记
function cleanSummary(text) {
  if (!text || typeof text !== 'string') return '';
  let out = text;
  // 去掉 ```markdown / ```md / ``` 这类围栏行（含行首行尾空格）
  out = out.replace(/^[ \t]*```[ \t]*(markdown|md|text)?[ \t]*$/gim, '');
  // 去掉行内残留的 ``` 标记
  out = out.replace(/```/g, '');
  // 去掉行首可能残留的 "markdown" 单独一行
  out = out.replace(/^[ \t]*markdown[ \t]*$/gim, '');
  // 压缩超过两个的连续空行
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const meetingsDir = path.join(__dirname, 'meetings');
if (!fs.existsSync(meetingsDir)) {
  fs.mkdirSync(meetingsDir, { recursive: true });
}

let meetings = {};
const meetingsFile = path.join(meetingsDir, 'meetings.json');
if (fs.existsSync(meetingsFile)) {
  try {
    meetings = JSON.parse(fs.readFileSync(meetingsFile, 'utf8'));
  } catch (e) {
    meetings = {};
  }
}

function saveMeetings() {
  fs.writeFileSync(meetingsFile, JSON.stringify(meetings, null, 2));
}

// 健康检查：供前端首页显示服务状态，也便于外部监控（UptimeRobot 等）
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/meetings', (req, res) => {
  const email = req.query.email;
  let list = Object.values(meetings);
  if (email) {
    list = list.filter(m => m.userEmail === email);
  }
  list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});

app.get('/api/meetings/:id', (req, res) => {
  const meeting = meetings[req.params.id];
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  const email = req.query.email;
  if (email && meeting.userEmail !== email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(meeting);
});

app.delete('/api/meetings/:id', (req, res) => {
  const meeting = meetings[req.params.id];
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
  const email = req.query.email;
  if (email && meeting.userEmail !== email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  delete meetings[req.params.id];
  saveMeetings();
  res.json({ success: true });
});

// ===== AI会谈总结API（调用阿里云qwen-turbo）=====
app.post('/api/summarize', async (req, res) => {
  try {
    const { meetingName, segments, language = 'zh' } = req.body;

    if (!segments || segments.length === 0) {
      return res.status(400).json({ error: '没有会谈记录可总结' });
    }

    if (!ALIYUN_API_KEY) {
      return res.status(500).json({ error: '阿里云API Key未配置，无法生成AI总结' });
    }

    // 构造对话记录文本
    let transcriptText = '';
    segments.forEach((seg, i) => {
      const speaker = seg.speaker === 'me' ? '我' : '对方';
      transcriptText += `【${speaker}】\n原文：${seg.source || ''}\n译文：${seg.target || ''}\n\n`;
    });

    // 构造prompt - 支持12种语言的AI总结指令
    const langInstructions = {
      zh: '请用中文撰写总结。',
      en: 'Please write the summary in English.',
      de: 'Bitte verfassen Sie die Zusammenfassung auf Deutsch.',
      fr: 'Veuillez rédiger le résumé en français.',
      es: 'Por favor, escriba el resumen en español.',
      ja: '日本語で要約を作成してください。',
      ko: '한국어로 요약을 작성해 주세요.',
      ru: 'Пожалуйста, напишите резюме на русском языке.',
      it: 'Si prega di scrivere il riassunto in italiano.',
      pt: 'Por favor, escreva o resumo em português.',
      nl: 'Schrijf de samenvatting alstublieft in het Nederlands.',
      ar: 'يرجى كتابة الملخص باللغة العربية.'
    };
    const langInstruction = langInstructions[language] || '请用中文撰写总结。';
    const systemPrompt = `你是一位专业的会谈记录员和总结专家。请根据以下双语会谈记录，生成一份结构化的会谈总结。

要求：
1. 会谈概述：用1-2句话概括会谈主题和主要内容
2. 核心要点：提炼3-5个最重要的讨论要点
3. 关键决策：列出会谈中达成的关键决策和共识
4. 行动项/待办：列出具体的行动项，包括责任人和时间节点（如果有提到）

格式要求：
- 使用Markdown格式
- 每个部分用清晰的标题
- 行动项使用复选框格式 - [ ]
- 语言简洁明了，避免冗余
- 如果某部分没有相关内容，写"本次会谈未涉及"

${langInstruction}`;

    console.log('[AI Summary] 开始生成会谈总结，记录段数:', segments.length);

    // 构造请求数据
    const requestData = {
      model: 'qwen-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `会谈名称：${meetingName || '未命名会谈'}\n\n会谈记录：\n${transcriptText}` }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    let summary = '';

    // ===== 方案1：优先用业务空间专属域名 + 业务空间API Key调用 =====
    // 业务空间专属域名格式：https://{workspace_id}.{region}.maas.aliyuncs.com/compatible-mode/v1/chat/completions
    // 这样sk-ws-开头的业务空间Key也能调用qwen-turbo
    if (ALIYUN_WORKSPACE_ID && ALIYUN_API_KEY) {
      const workspaceEndpoint = `https://${ALIYUN_WORKSPACE_ID}.${ALIYUN_REGION}.maas.aliyuncs.com/compatible-mode/v1/chat/completions`;
      console.log('[AI Summary] 尝试方案1：业务空间专属域名:', workspaceEndpoint);
      console.log('[AI Summary] 使用API Key前缀:', safeSubstring(ALIYUN_API_KEY, 0, 10) + '...');

      try {
        const response = await axios.post(workspaceEndpoint, requestData, {
          headers: {
            'Authorization': `Bearer ${ALIYUN_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        });
        summary = response.data.choices[0].message.content;
        console.log('[AI Summary] 方案1成功（业务空间专属域名），长度:', summary.length);
      } catch (workspaceError) {
        console.error('[AI Summary] 方案1失败（业务空间专属域名）:', workspaceError.message);
        console.error('[AI Summary] 错误状态:', workspaceError.response?.status);
        console.error('[AI Summary] 错误数据:', safeSubstring(JSON.stringify(workspaceError.response?.data), 0, 500));
      }
    }

    // ===== 方案2：如果方案1失败，用通用域名 + DASHSCOPE_API_KEY调用 =====
    if (!summary) {
      console.log('[AI Summary] 尝试方案2：通用域名 + DASHSCOPE_API_KEY');
      try {
        const response = await axios.post(
          'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 60000
          }
        );
        summary = response.data.choices[0].message.content;
        console.log('[AI Summary] 方案2成功（通用域名），长度:', summary.length);
      } catch (apiError) {
        console.error('[AI Summary] 方案2失败（通用域名）:', apiError.message);
        console.error('[AI Summary] 错误状态:', apiError.response?.status);
        console.error('[AI Summary] 错误数据:', safeSubstring(JSON.stringify(apiError.response?.data), 0, 500));

        // ===== 方案3：尝试原生格式 =====
        console.log('[AI Summary] 尝试方案3：原生格式');
        try {
          const response = await axios.post(
            'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            {
              model: 'qwen-turbo',
              input: {
                messages: requestData.messages
              },
              parameters: {
                temperature: 0.3,
                max_tokens: 2000,
                result_format: 'text'
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 60000
            }
          );
          summary = response.data.output.text;
          console.log('[AI Summary] 方案3成功（原生格式），长度:', summary.length);
        } catch (nativeError) {
          console.error('[AI Summary] 方案3也失败（原生格式）:', nativeError.message);
          console.error('[AI Summary] 原生错误状态:', nativeError.response?.status);
          console.error('[AI Summary] 原生错误数据:', safeSubstring(JSON.stringify(nativeError.response?.data), 0, 500));
          throw nativeError;
        }
      }
    }

    res.json({
      success: true,
      summary: cleanSummary(summary),
      model: 'qwen-turbo'
    });

  } catch (error) {
    console.error('[AI Summary] 生成失败:', error.message);
    if (error.response) {
      console.error('[AI Summary] 最终响应状态:', error.response.status);
      console.error('[AI Summary] 最终响应数据:', safeSubstring(JSON.stringify(error.response?.data), 0, 1000));
    }
    const errorMsg = error.response?.data?.message || error.response?.data?.output?.text || error.message;
    res.status(500).json({
      error: 'AI总结生成失败: ' + errorMsg,
      hint: '请检查DASHSCOPE_API_KEY是否正确，以及qwen-turbo模型是否已开通'
    });
  }
});


// ===== 阿里云连接管理：预连接 + 无缝切换 =====
// 阿里云实时流有 300 秒硬超时。旧方案是到点后"断开→前端重连→重建会话"，
// 实测产生约 34.5 秒无译文空窗。新方案改为：
//   1) 提前 30 秒在后台建立下一条连接（预连接）
//   2) 新连接就绪后，挑一个"语音结束"的空档瞬间切换音频路由
//   3) 旧连接异步关闭，不阻塞
// 前端 WebSocket 全程不断开，空窗趋近于 0。

// 预连接时点：距连接建立 270 秒（留 30 秒余量）
const PRECONNECT_AT = 270000;
// 强制切换时点：距连接建立 295 秒（再不让位就会撞 300 秒硬超时）
const FORCE_SWITCH_AT = 295000;

// 优雅关闭一条连接：发 session.finish 后立即 close，不等待关闭完成
function closeGracefully(ws, reason) {
  if (!ws) return;
  if (ws._reconnectTimer) { clearTimeout(ws._reconnectTimer); ws._reconnectTimer = null; }
  ws._intentionalClose = true;
  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({ event_id: `event_${Date.now()}`, type: 'session.finish' }));
    } catch (e) {}
    try {
      ws.close(1000, reason || 'switch');
      console.log('[Aliyun] 已发起关闭旧连接, 原因:', reason);
    } catch (e) {}
  }
}

wss.on('connection', (clientWs) => {
  console.log('[Client] 前端已连接');

  let aliyunWs = null;          // 当前活跃连接（音频往这里发）
  let pendingWs = null;         // 预连接好的下一条连接
  let preconnectTimer = null;   // 预连接定时器
  let forceSwitchTimer = null;  // 强制切换定时器
  let sessionId = null;
  let currentMeeting = null;
  let currentSegment = null;
  let currentSourceText = '';
  let currentTargetText = '';
  let isSessionStarted = false;
  let lastConfig = null;
  let initialReadySent = false;

  // === 延迟埋点 ===
  // 把"用户感知到的延迟"拆成三段分别计时，全部写进服务端日志，用于定位到底是哪一段慢。
  const lat = {
    segCount: 0,          // 已完成的段落数
    segSpeechAt: null,    // 本段语音开始时刻
    segFirstTextAt: null, // 本段首个非空译文时刻
    segStoppedAt: null,   // 本段语音结束时刻
    handshake: [],        // 服务器→阿里云 握手往返
    firstText: [],        // 语音开始→首个译文
    tailLatency: [],      // 语音结束→完整译文
    clientRtt: []         // 手机→服务器 往返
  };

  function stat(arr) {
    if (!arr.length) return '无样本';
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / arr.length);
    return `平均 ${avg}ms（最小 ${Math.min(...arr)} / 最大 ${Math.max(...arr)} / 样本 ${arr.length}）`;
  }

  function logLatencySummary() {
    console.log('---------- [Latency 汇总] ----------');
    console.log(`  服务器→阿里云 握手往返 : ${stat(lat.handshake)}`);
    console.log(`  语音开始→首个译文     : ${stat(lat.firstText)}`);
    console.log(`  语音结束→完整译文     : ${stat(lat.tailLatency)}`);
    console.log(`  手机→服务器 往返      : ${stat(lat.clientRtt)}`);
    console.log('------------------------------------');
  }

  function buildSessionConfig(config) {
    const enableTTS = config.enable_tts !== false;
    return {
      event_id: `event_${Date.now()}`,
      type: 'session.update',
      session: {
        modalities: enableTTS ? ['text', 'audio'] : ['text'],
        input_audio_format: 'pcm',
        output_audio_format: 'pcm',
        input_audio_transcription: {
          model: 'qwen3-asr-flash-realtime',
          language: config.source_language || 'en'
        },
        translation: {
          language: config.target_language || 'zh'
        },
        voice: 'Tina'
      }
    };
  }

  // 安排下一次预连接（相对当前活跃连接的建立时间计算）
  function schedulePreconnect() {
    clearTimeout(preconnectTimer);
    if (!aliyunWs || !lastConfig) return;
    const elapsed = Date.now() - (aliyunWs._createdAt || Date.now());
    const delay = Math.max(1000, PRECONNECT_AT - elapsed);
    console.log('[Aliyun] 已安排下一次预连接, 延迟(ms):', delay);
    preconnectTimer = setTimeout(startPreconnect, delay);
  }

  // 强制切换兜底：到点必须让位，避免旧连接撞 300 秒硬超时。
  // 注意不能只检查一次——若预连接当时还没就绪，必须持续复查，否则兜底失效。
  function armForceSwitch() {
    clearTimeout(forceSwitchTimer);
    const elapsed = aliyunWs ? (Date.now() - (aliyunWs._createdAt || Date.now())) : 0;
    const remaining = FORCE_SWITCH_AT - elapsed;
    const delay = remaining > 0 ? remaining : 1000; // 已过时点则每秒复查
    forceSwitchTimer = setTimeout(() => {
      if (!pendingWs) return;                    // 已切换或已放弃
      if (!pendingWs._ready) { armForceSwitch(); return; } // 预连接还没就绪，继续等
      if (aliyunWs) {
        console.log('[Aliyun] 到达强制切换时点，立即切换（不再等语音结束）');
        trySwitchToPending(true);
      }
    }, Math.max(200, delay));
  }

  // 建立预连接
  function startPreconnect() {
    if (!lastConfig) return;
    if (pendingWs) return;
    if (!aliyunWs || aliyunWs.readyState !== WebSocket.OPEN) return;
    console.log('[Aliyun] 到达预连接时点，开始建立下一条链路');
    pendingWs = createAliyunConnection(lastConfig, true);
    armForceSwitch();
  }

  // 切换到预连接
  function trySwitchToPending(force) {
    if (!pendingWs || !pendingWs._ready) return;
    // 已到强制时点则不再等待语音结束
    const elapsed = aliyunWs ? (Date.now() - (aliyunWs._createdAt || Date.now())) : Infinity;
    const pastDeadline = elapsed >= FORCE_SWITCH_AT;
    if (!force && !pastDeadline && aliyunWs && aliyunWs._isSpeaking) {
      console.log('[Aliyun] 正在说话，等语音结束后再切换');
      return;
    }
    const old = aliyunWs;
    aliyunWs = pendingWs;
    pendingWs = null;
    aliyunWs._isPreconnect = false;
    clearTimeout(forceSwitchTimer);
    forceSwitchTimer = null;
    console.log('[Aliyun] ✅ 已切换到新链路（前端全程无感知，空窗≈0）');
    closeGracefully(old, 'preconnect_switch');
    schedulePreconnect();
  }

  // 创建一条阿里云连接；isPreconnect=true 表示预连接（不提示前端、不重置会话状态）
  function createAliyunConnection(config, isPreconnect) {
    const apiUrl = `wss://${ALIYUN_WORKSPACE_ID}.${ALIYUN_REGION}.maas.aliyuncs.com/api-ws/v1/realtime?model=${ALIYUN_MODEL}`;
    const ws = new WebSocket(apiUrl, {
      headers: {
        'Authorization': `Bearer ${ALIYUN_API_KEY}`
      }
    });
    ws._ready = false;
    ws._msgCount = 0;
    ws._isSpeaking = false;
    ws._isPreconnect = !!isPreconnect;
    ws._intentionalClose = false;
    ws._createdAt = Date.now();

    ws.on('open', () => {
      console.log(isPreconnect
        ? '[Aliyun] 预连接已建立，发送session.update...'
        : '[Aliyun] WebSocket连接已建立，发送session.update...');
      ws._handshakeSentAt = Date.now();
      ws.send(JSON.stringify(buildSessionConfig(config)));
      const enableTTS = config.enable_tts !== false;
      console.log('[Aliyun] 会话配置已发送, 源语言:', config.source_language || 'en', ', 目标语言:', config.target_language || 'zh', ', TTS:', enableTTS);
    });

    ws.on('message', (aliyunData) => {
      try {
        const event = JSON.parse(aliyunData.toString());
        const eventType = event.type;

        // 打印所有收到的消息（前20条），方便调试
        ws._msgCount++;
        if (ws._msgCount <= 20 || eventType === 'error') {
          console.log(`[Aliyun] 收到消息 #${ws._msgCount}: type=${eventType}`, JSON.stringify(event).substring(0, 300));
        }

        if (eventType === 'session.created' || eventType === 'session.updated') {
          ws._ready = true;
          // 服务器→阿里云 握手往返：session.update 发出 → session.created 回来
          if (ws._handshakeSentAt && !ws._handshakeLogged) {
            ws._handshakeLogged = true;
            const hs = Date.now() - ws._handshakeSentAt;
            lat.handshake.push(hs);
            console.log(`[Latency] 服务器→阿里云 握手往返: ${hs}ms${isPreconnect ? '（预连接）' : ''}`);
          }
          console.log('[Aliyun] 会话已启动 ✅' + (isPreconnect ? '（预连接就绪）' : ''));
          if (isPreconnect) {
            // 预连接就绪，尽快找空档切换
            trySwitchToPending(false);
          } else {
            isSessionStarted = true;
            if (!initialReadySent) {
              initialReadySent = true;
              clientWs.send(JSON.stringify({ type: 'session_started', sessionId }));
            }
          }
          return;
        }

        // 只处理活跃连接的业务事件；预连接的其余事件一律忽略
        if (ws !== aliyunWs) return;

        if (eventType === 'input_audio_buffer.speech_started') {
          console.log('[Aliyun] 检测到语音开始');
          ws._isSpeaking = true;
          currentSourceText = '';
          currentTargetText = '';
          currentSegment = {
            startTime: Date.now(),
            speaker: 'unknown',
            source: '',
            target: ''
          };
          lat.segSpeechAt = Date.now();
          lat.segFirstTextAt = null;
          lat.segStoppedAt = null;
        }

        if (eventType === 'conversation.item.input_audio_transcription.text') {
          const text = event.text || '';
          const stash = event.stash || '';
          currentSourceText = text + stash;
          clientWs.send(JSON.stringify({
            type: 'source_partial',
            text: currentSourceText
          }));
        }

        if (eventType === 'conversation.item.input_audio_transcription.completed') {
          const transcript = event.transcript || '';
          currentSourceText = transcript;
          if (currentSegment) currentSegment.source = transcript;
        }

        if (eventType === 'response.text.text' || eventType === 'response.audio_transcript.text') {
          const text = event.text || '';
          const stash = event.stash || '';
          currentTargetText = text + stash;
          // 首个非空译文到达 = 用户真正在屏幕上看到字的时刻
          if (!lat.segFirstTextAt && currentTargetText.trim() && lat.segSpeechAt) {
            lat.segFirstTextAt = Date.now();
            const d = lat.segFirstTextAt - lat.segSpeechAt;
            lat.firstText.push(d);
            console.log(`[Latency] 语音开始→首个译文: ${d}ms`);
          }
          clientWs.send(JSON.stringify({
            type: 'target_partial',
            text: currentTargetText
          }));
        }

        if (eventType === 'response.text.done' || eventType === 'response.audio_transcript.done') {
          const text = event.text || event.transcript || '';
          currentTargetText = text;
          if (currentSegment) {
            currentSegment.target = text;
            currentSegment.endTime = Date.now();
            if (currentMeeting) currentMeeting.segments.push({ ...currentSegment });
            // 语音结束→完整译文
            if (lat.segStoppedAt) {
              const d = Date.now() - lat.segStoppedAt;
              lat.tailLatency.push(d);
              console.log(`[Latency] 语音结束→完整译文: ${d}ms`);
            }
            lat.segCount++;
            if (lat.segCount % 10 === 0) logLatencySummary();
            clientWs.send(JSON.stringify({
              type: 'segment_complete',
              segment: { ...currentSegment }
            }));
          }
        }

        if (eventType === 'response.audio.delta') {
          const audioBase64 = event.delta || '';
          if (audioBase64) {
            clientWs.send(JSON.stringify({
              type: 'tts_audio',
              audio: audioBase64
            }));
          }
        }

        if (eventType === 'input_audio_buffer.speech_stopped') {
          console.log('[Aliyun] 检测到语音结束');
          ws._isSpeaking = false;
          lat.segStoppedAt = Date.now();
          // 语音结束是切换链路的最佳时机
          if (pendingWs && pendingWs._ready) {
            trySwitchToPending(true);
          }
        }

        if (eventType === 'session.finished') {
          console.log('[Aliyun] 会话已结束');
          clientWs.send(JSON.stringify({ type: 'session_finished', meetingId: sessionId }));
        }

        if (eventType === 'error') {
          console.error('[Aliyun] 错误:', JSON.stringify(event));
          clientWs.send(JSON.stringify({
            type: 'error',
            message: event.error?.message || '阿里云API错误'
          }));
        }

      } catch (e) {
        console.error('[Aliyun] 解析消息失败:', e.message);
      }
    });

    ws.on('error', (err) => {
      console.error('[Aliyun] 连接错误:', err.message, isPreconnect ? '(预连接)' : '');
      if (ws === aliyunWs) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: '阿里云连接错误: ' + err.message
        }));
      }
    });

    ws.on('close', (code, reason) => {
      console.log('[Aliyun] 连接关闭, code:', code, ', reason:', reason ? reason.toString() : '(无)', isPreconnect ? '(预连接)' : '');
      console.log('[Aliyun] 关闭前统计: 收到前端音频帧:', clientWs._audioCount || 0, ', 收到阿里云消息:', ws._msgCount || 0);

      if (pendingWs === ws) pendingWs = null;

      // 主动切换导致的关闭：静默处理，前端不受影响
      if (ws._intentionalClose) return;

      // 预连接失败：若旧连接还有时间，重试一次
      if (isPreconnect) {
        const elapsed = aliyunWs ? (Date.now() - (aliyunWs._createdAt || Date.now())) : Infinity;
        if (aliyunWs && aliyunWs.readyState === WebSocket.OPEN && elapsed < FORCE_SWITCH_AT - 10000) {
          console.log('[Aliyun] 预连接失败，10秒后重试');
          clearTimeout(preconnectTimer);
          preconnectTimer = setTimeout(startPreconnect, 10000);
        } else {
          console.error('[Aliyun] 预连接失败且时间不足，将由旧连接超时兜底');
        }
        return;
      }

      // 活跃连接关闭
      if (ws === aliyunWs) {
        aliyunWs = null;
        clearTimeout(preconnectTimer);
        clearTimeout(forceSwitchTimer);
        if (currentMeeting && currentMeeting.segments.length > 0) {
          meetings[currentMeeting.id] = currentMeeting;
          saveMeetings();
          console.log('[Aliyun] 会谈已保存, 段落数:', currentMeeting.segments.length);
        }
        // 兜底：活跃连接意外关闭时，断开前端触发其自动重连
        if (clientWs.readyState === WebSocket.OPEN) {
          console.log('[Server] 活跃连接意外关闭，主动断开前端以触发自动重连（code=4000）');
          clientWs.close(4000, 'aliyun_reconnect');
        }
      }
    });

    return ws;
  }

  clientWs.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'start') {
        const config = msg.config || {};
        lastConfig = config;
        sessionId = uuidv4();
        currentMeeting = {
          id: sessionId,
          title: config.title || '未命名会谈',
          createdAt: new Date().toISOString(),
          segments: [],
          duration: 0,
          userEmail: config.userEmail || 'anonymous'
        };
        currentSourceText = '';
        currentTargetText = '';
        isSessionStarted = false;
        initialReadySent = false;

        console.log('[Aliyun] 正在连接同传API...');
        aliyunWs = createAliyunConnection(config, false);

        // 连接就绪后安排预连接
        const waitReady = setInterval(() => {
          if (!aliyunWs) { clearInterval(waitReady); return; }
          if (aliyunWs._ready) {
            clearInterval(waitReady);
            schedulePreconnect();
          }
        }, 500);
        setTimeout(() => clearInterval(waitReady), 30000);

      } else if (msg.type === 'audio') {
        // 统计收到的音频帧数
        if (!clientWs._audioCount) clientWs._audioCount = 0;
        clientWs._audioCount++;

        // 前10帧打印接收日志
        if (clientWs._audioCount <= 10) {
          console.log(`[Client] 收到音频帧 #${clientWs._audioCount}, base64长度: ${msg.audio ? msg.audio.length : 0}, aliyunWs状态: ${aliyunWs ? aliyunWs.readyState : 'null'}, isSessionStarted: ${isSessionStarted}`);
        }

        if (aliyunWs && aliyunWs.readyState === WebSocket.OPEN && isSessionStarted) {
          const audioEvent = {
            event_id: `event_${Date.now()}`,
            type: 'input_audio_buffer.append',
            audio: msg.audio
          };
          aliyunWs.send(JSON.stringify(audioEvent));

          // 前10帧打印转发日志
          if (clientWs._audioCount <= 10) {
            console.log(`[Aliyun] ✅ 已转发音频帧 #${clientWs._audioCount} 到阿里云`);
          }
        } else if (clientWs._audioCount <= 10) {
          // 前10帧如果没转发，打印原因
          let reason = [];
          if (!aliyunWs) reason.push('aliyunWs为null');
          else if (aliyunWs.readyState !== WebSocket.OPEN) reason.push(`aliyunWs状态=${aliyunWs.readyState}(0=连接中,1=已打开)`);
          if (!isSessionStarted) reason.push('isSessionStarted=false(会话未启动)');
          console.log(`[Client] ⚠️ 音频帧 #${clientWs._audioCount} 未转发，原因: ${reason.join(', ') || '未知'}`);
        }
      } else if (msg.type === 'stop') {
        if (aliyunWs && aliyunWs.readyState === WebSocket.OPEN) {
          const finishEvent = {
            event_id: `event_${Date.now()}`,
            type: 'session.finish'
          };
          aliyunWs.send(JSON.stringify(finishEvent));
          console.log('[Aliyun] 已发送session.finish');
        }
      } else if (msg.type === 'ping') {
        // 原样回 pong，供前端测量"手机→服务器"往返时延
        clientWs.send(JSON.stringify({ type: 'pong', id: msg.id }));
      } else if (msg.type === 'rtt') {
        // 手机→服务器 的往返时延（由前端 ping/pong 测得后回传）
        const v = Number(msg.value);
        if (Number.isFinite(v) && v >= 0) {
          const rtt = Math.round(v);
          lat.clientRtt.push(rtt);
          console.log(`[Latency] 手机→服务器 往返: ${rtt}ms`);
          if (lat.clientRtt.length % 10 === 0) logLatencySummary();
        }
      } else if (msg.type === 'summary') {
        if (currentMeeting) {
          clientWs.send(JSON.stringify({
            type: 'summary',
            meeting: currentMeeting
          }));
        }
      }

    } catch (e) {
      console.error('[Client] 处理消息失败:', e.message);
    }
  });

  clientWs.on('close', () => {
    console.log('[Client] 前端断开');
    clearTimeout(preconnectTimer);
    clearTimeout(forceSwitchTimer);
    // 前端断开时，立即关闭阿里云连接，不等待
    if (pendingWs) {
      closeGracefully(pendingWs, 'client_disconnected');
      pendingWs = null;
    }
    if (aliyunWs && aliyunWs.readyState === WebSocket.OPEN) {
      try {
        const finishEvent = {
          event_id: `event_${Date.now()}`,
          type: 'session.finish'
        };
        aliyunWs.send(JSON.stringify(finishEvent));
        console.log('[Aliyun] 前端断开，已发送session.finish');
      } catch (e) {}
      // 立即关闭，不等待
      aliyunWs.close(1000, 'client_disconnected');
    }
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('MeetFree 服务器启动成功');
  console.log('========================================');
  console.log(`端口: ${PORT}`);
  console.log(`阿里云API Key: ${ALIYUN_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`阿里云Workspace ID: ${ALIYUN_WORKSPACE_ID || '❌ 未配置'}`);
  console.log(`模型: ${ALIYUN_MODEL}`);
  console.log(`地域: ${ALIYUN_REGION}`);
  if (!ALIYUN_API_KEY || !ALIYUN_WORKSPACE_ID) {
    console.log('⚠️  警告：阿里云API Key或Workspace ID未配置，同传功能将无法使用！');
    console.log('请在Render环境变量中配置 ALIYUN_API_KEY 和 ALIYUN_WORKSPACE_ID');
  }
  console.log('========================================');
});
