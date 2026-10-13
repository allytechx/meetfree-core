/**
 * MeetFree MVP - 前端主逻辑
 */

// ===== 多语言支持 =====
const I18N = {
  zh: {
    appSubtitle: '面对面会谈 · 实时同传 · AI纪要',
    meetingNameLabel: '对话名称',
    meetingNamePlaceholder: '例如：与英国客户合作洽谈',
    languageSettings: '语言设置',
    dialogueLang: '对话语言',
    translateLang: '翻译语言',
    languageHint: '双方都说「对话语言」，系统实时翻译成「翻译语言」，双语记录',
    startDialogue: '🎙 开始对话',
    historyMeetings: '📋 历史会谈',
    refresh: '刷新',
    noHistory: '暂无历史会谈',
    inMeeting: '会谈中',
    end: '结束',
    clickToSwitch: '点击切换',
    switchLanguage: '切换翻译语言',
    dialogueLangBoth: '对话语言（双方都说）',
    translateLangListen: '翻译语言（我想听）',
    cancel: '取消',
    otherSpeaker: '对方说',
    meSpeaker: '我说',
    micNormal: '麦克风正常',
    waitingSpeech: '等待说话，双语记录将显示在这里...',
    untitledMeeting: '未命名对话',
    pause: '暂停',
    mute: '静音',
    muteOn: '已静音',
    resumeOn: '继续',
    back: '← 返回',
    dialogueRecord: '对话记录',
    generateAISummary: '✨ 生成AI总结',
    exportRecord: '📥 导出记录',
    generatingSummary: 'AI正在生成会谈总结，请稍候...',
    aiSummary: '🤖 AI智能总结',
    copy: '📋 复制',
    bilingualRecord: '📝 双语完整记录',
    copied: '已复制到剪贴板',
    exportModalTitle: '会谈记录（长按可复制）',
    copyAllText: '复制全部文本',
    tryDownload: '尝试下载文件',
    downloadTriggered: '已触发下载，可在浏览器下载栏查看',
    summaryGenerated: 'AI总结生成成功',
    summaryFailed: 'AI总结生成失败',
    noTranscript: '暂无对话记录',
    micError: '无法访问麦克风',
    connecting: '正在连接同传API...',
    sessionStarted: '会话已启动',
    connectionClosed: '连接已关闭',
    reconnecting: '正在重新连接...',
    micErrorFull: '无法访问麦克风，请检查权限设置',
    connectionLost: '连接已断开，请重新开始会谈',
    translationStarted: '同传已启动',
    meetingStarted: '对话已开始，点击标记说话人',
    paused: '已暂停',
    resumed: '已继续',
    micMuted: '麦克风已静音',
    micUnmuted: '麦克风已恢复',
    summaryGeneratedDetail: 'AI总结已生成！点击「导出记录」可保存到文件',
    translationError: '同传错误',
    ttsOn: '语音播报已开启',
    ttsOff: '语音播报已关闭',
    markedOther: '已标记：对方说话',
    markedMe: '已标记：我说话',
    switchedDialogueLang: '已切换对话语言',
    selectedDialogueLang: '已选择对话语言',
    switchedTranslateLang: '已切换翻译语言',
    selectedTranslateLang: '已选择翻译语言',
    noContentToCopy: '没有可复制的内容',
    summaryCopied: '总结已复制到剪贴板',
    recordCopied: '总结已复制',
    copiedAndSave: '已复制到剪贴板，可粘贴保存',
    ttsButtonOn: '语音开',
    ttsButtonOff: '语音关',
    waitingSound: '等待声音...',
    durationLabel: '时长',
    segmentCountLabel: '段',
    noRecord: '暂无记录',
    durationLabel: '时长',
    segmentCountLabel: '段对话',
    generating: '⏳ 生成中...',
    regenerate: '✨ 重新生成',
    simpleSummaryTitle: '📋 会谈记录摘要',
    summaryFallbackNote: '（AI总结生成失败，显示简单记录摘要）',
    exportMeetingName: '会谈名称',
    exportTime: '时间',
    exportSegmentTotal: '共 {n} 段对话',
    exportSummaryHeader: '【AI会谈总结】',
    exportTranscriptHeader: '【完整对话记录】',
    exportSegmentLabel: '第{n}段',
    noRecord: '暂无对话记录',
    sourceLabel: '原文',
    targetLabel: '译文',
    connChecking: '正在检查服务状态…',
    connReady: '服务已就绪',
    connWaking: '服务唤醒中，首次打开约需 30-60 秒',
    connOffline: '暂时无法连接服务，请稍后重试',
    connLost: '连接中断，正在恢复…',
    connRestored: '连接已恢复'
  },
  en: {
    appSubtitle: 'Face-to-face Meeting · Real-time Translation · AI Summary',
    meetingNameLabel: 'Meeting Name',
    meetingNamePlaceholder: 'e.g.: Business meeting with UK client',
    languageSettings: 'Language Settings',
    dialogueLang: 'Spoken Language',
    translateLang: 'Translation Language',
    languageHint: 'Both parties speak the "Spoken Language", system translates to "Translation Language" in real-time with bilingual records',
    startDialogue: '🎙 Start Meeting',
    historyMeetings: '📋 Meeting History',
    refresh: 'Refresh',
    noHistory: 'No meeting history yet',
    inMeeting: 'In Meeting',
    end: 'End',
    clickToSwitch: 'Click to switch',
    switchLanguage: 'Switch Translation Language',
    dialogueLangBoth: 'Spoken Language (Both parties speak)',
    translateLangListen: 'Translation Language (You hear)',
    cancel: 'Cancel',
    otherSpeaker: 'Other',
    meSpeaker: 'Me',
    micNormal: 'Microphone normal',
    waitingSpeech: 'Waiting for speech, bilingual records will appear here...',
    untitledMeeting: 'Untitled Meeting',
    pause: 'Pause',
    mute: 'Mute',
    muteOn: 'Muted',
    resumeOn: 'Resume',
    back: '← Back',
    dialogueRecord: 'Meeting Record',
    generateAISummary: '✨ Generate AI Summary',
    exportRecord: '📥 Export Record',
    generatingSummary: 'AI is generating meeting summary, please wait...',
    aiSummary: '🤖 AI Summary',
    copy: '📋 Copy',
    bilingualRecord: '📝 Bilingual Record',
    copied: 'Copied to clipboard',
    exportModalTitle: 'Meeting Record (Long press to copy)',
    copyAllText: 'Copy All Text',
    tryDownload: 'Try Download File',
    downloadTriggered: 'Download triggered, check browser download bar',
    summaryGenerated: 'AI summary generated successfully',
    summaryFailed: 'AI summary generation failed',
    noTranscript: 'No conversation records yet',
    micError: 'Cannot access microphone',
    connecting: 'Connecting to translation API...',
    sessionStarted: 'Session started',
    connectionClosed: 'Connection closed',
    reconnecting: 'Reconnecting...',
    micErrorFull: 'Cannot access microphone, please check permissions',
    connectionLost: 'Connection lost, please restart the meeting',
    translationStarted: 'Translation started',
    meetingStarted: 'Meeting started, click to mark speaker',
    paused: 'Paused',
    resumed: 'Resumed',
    micMuted: 'Microphone muted',
    micUnmuted: 'Microphone unmuted',
    summaryGeneratedDetail: 'AI summary generated! Click "Export Record" to save to file',
    translationError: 'Translation error',
    ttsOn: 'Voice playback enabled',
    ttsOff: 'Voice playback disabled',
    markedOther: 'Marked: Other speaking',
    markedMe: 'Marked: Me speaking',
    switchedDialogueLang: 'Switched dialogue language',
    selectedDialogueLang: 'Selected dialogue language',
    switchedTranslateLang: 'Switched translation language',
    selectedTranslateLang: 'Selected translation language',
    noContentToCopy: 'No content to copy',
    summaryCopied: 'Summary copied to clipboard',
    recordCopied: 'Summary copied',
    copiedAndSave: 'Copied to clipboard, you can paste and save',
    ttsButtonOn: 'Voice On',
    ttsButtonOff: 'Voice Off',
    waitingSound: 'Waiting for sound...',
    generating: '⏳ Generating...',
    regenerate: '✨ Regenerate',
    simpleSummaryTitle: '📋 Meeting Summary',
    summaryFallbackNote: '(AI summary failed, showing simple record summary)',
    exportMeetingName: 'Meeting Name',
    exportTime: 'Time',
    exportSegmentTotal: 'Total {n} segments',
    exportSummaryHeader: '[AI Meeting Summary]',
    exportTranscriptHeader: '[Full Conversation Record]',
    exportSegmentLabel: 'Segment {n}',
    noRecord: 'No conversation records yet',
    sourceLabel: 'Original',
    targetLabel: 'Translation',
    connChecking: 'Checking service status…',
    connReady: 'Service ready',
    connWaking: 'Waking up the service, first open takes 30-60s',
    connOffline: 'Cannot reach the service, please retry shortly',
    connLost: 'Connection lost, recovering…',
    connRestored: 'Connection restored'
  }
};

let currentLang = localStorage.getItem('meetfree_lang') || null;

function t(key) {
  if (!currentLang) return key;
  return I18N[currentLang][key] || I18N.zh[key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('meetfree_lang', lang);
  
  // 应用所有带 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // 应用 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  
  // 更新页面标题
  document.title = lang === 'en' ? 'MeetFree - Meeting Translation Assistant' : 'MeetFree - 会谈同传助手';
  
  // 更新动态内容
  updateLangDisplay(); // 更新语言方向显示
  
  // 更新暂停按钮文字
  const pauseBtn = $('btnPause');
  if (pauseBtn) {
    pauseBtn.innerHTML = state.isPaused 
      ? '▶<span>' + t('resumeOn') + '</span>'
      : '⏸<span>' + t('pause') + '</span>';
  }
  
  // 更新静音按钮文字
  const muteBtn = $('btnMute');
  if (muteBtn) {
    muteBtn.innerHTML = state.isMuted 
      ? '🔇<span>' + t('muteOn') + '</span>'
      : '🔊<span>' + t('mute') + '</span>';
  }

  // 更新AI总结按钮文字（已生成过则显示"重新生成"）
  const summaryBtn = $('btnGenerateSummary');
  if (summaryBtn && !summaryBtn.disabled) {
    summaryBtn.textContent = state.summary ? t('regenerate') : t('generateAISummary');
  }

  // 更新音量状态文字
  const volLabel = $('volumeLabel');
  if (volLabel) {
    if (state.isMuted) volLabel.textContent = t('muteOn');
    else if (state.isRecording) volLabel.textContent = t('micNormal');
    else volLabel.textContent = t('waitingSound');
  }

  // 更新语音播报按钮
  const ttsBtn = $('btnTTS');
  if (ttsBtn) {
    ttsBtn.innerHTML = state.ttsEnabled
      ? '🔊<span>' + t('ttsButtonOn') + '</span>'
      : '🔇<span>' + t('ttsButtonOff') + '</span>';
  }
}

// 语言选择界面点击事件 + 完整初始化
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
      $('view-lang-select').classList.remove('active');
      showSetupView();
    });
  });

  // 如果已经选择过语言，直接跳过语言选择
  if (currentLang) {
    applyLanguage(currentLang);
    $('view-lang-select').classList.remove('active');
    $('view-meeting').classList.remove('active');
    $('view-result').classList.remove('active');
    $('langModal').classList.remove('active');
    showSetupView();
  }
});

// 开源版：无需登录，直接进入会谈设置页
function showSetupView() {
  $('view-setup').classList.add('active');
  state.currentView = 'setup';
  checkServiceHealth(false);
  loadHistory();
}

const state = {
  currentView: 'setup',
  ws: null,
  mediaStream: null,
  audioContext: null,
  scriptProcessor: null,
  sourceNode: null,
  isRecording: false,
  isPaused: false,
  isMuted: false,
  currentSpeaker: 'other',
  analyserNode: null,
  meetingStartTime: null,
  timerInterval: null,
  activeSeconds: 0,          // 实际录音时长（已扣除暂停时间）
  activeTimerInterval: null, // 活跃时长计时器（仅非暂停时累加）
  segments: [],
  currentSegment: null,
  meetingId: null,
  meetingName: '',
  config: null,
  ttsAudioQueue: [],
  isPlayingTTS: false,
  ttsEnabled: true, // TTS开关状态
  // 自动重连相关
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
  reconnectDelay: 1000,
  shouldReconnect: true,
  isReconnecting: false,
  currentConnectionId: 0, // 当前连接的唯一ID，用于区分新旧连接的onclose事件
  isConnecting: false, // 是否正在建立连接中，避免重复创建
};

const $ = (id) => document.getElementById(id);
const views = {
  setup: $('view-setup'),
  meeting: $('view-meeting'),
  result: $('view-result')
};

let toastTimer = null;
function showToast(msg, duration = 2500) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, duration);
}

function switchView(viewName) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[viewName].classList.add('active');
  state.currentView = viewName;
}


// ===== 服务状态提示（首页） =====
// 说明：Render 免费实例冷启动需要 30-60 秒，这里主动探测并如实告知，
// 避免用户以为"程序坏了"而反复重开（重开会丢掉当前记录）。
let healthTimer = null;
let healthAttempts = 0;

function setConnStatus(cls, text) {
  const el = $('connStatus');
  const txt = $('connStatusText');
  if (!el || !txt) return;
  el.className = 'conn-status' + (cls ? ' ' + cls : '');
  txt.textContent = text;
}

async function checkServiceHealth(isRetry) {
  if (!isRetry) {
    healthAttempts = 0;
    if (healthTimer) { clearTimeout(healthTimer); healthTimer = null; }
    setConnStatus('', t('connChecking'));
  }
  let controller = null;
  let timeoutId = null;
  try {
    controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('/api/health', { signal: controller.signal, cache: 'no-store' });
    if (timeoutId) clearTimeout(timeoutId);
    if (!res.ok) throw new Error('status ' + res.status);
    healthAttempts = 0;
    setConnStatus('is-ready', t('connReady'));
  } catch (e) {
    if (timeoutId) clearTimeout(timeoutId);
    healthAttempts++;
    if (healthAttempts <= 8) {
      setConnStatus('is-waking', t('connWaking'));
      if (healthTimer) clearTimeout(healthTimer);
      healthTimer = setTimeout(() => checkServiceHealth(true), 5000);
    } else {
      setConnStatus('is-offline', t('connOffline'));
    }
  }
}

// ===== 连接中断横幅（会谈中） =====
function showConnBanner(restored) {
  const b = $('connBanner');
  const txt = $('connBannerText');
  if (!b || !txt) return;
  if (b._hideTimer) { clearTimeout(b._hideTimer); b._hideTimer = null; }
  if (restored) {
    b.style.display = 'flex';
    b.classList.add('is-restored');
    txt.textContent = t('connRestored');
    b._hideTimer = setTimeout(() => {
      b.style.display = 'none';
      b.classList.remove('is-restored');
      b._hideTimer = null;
    }, 2000);
  } else {
    b.style.display = 'flex';
    b.classList.remove('is-restored');
    txt.textContent = t('connLost');
  }
}

function hideConnBanner() {
  const b = $('connBanner');
  if (!b) return;
  if (b._hideTimer) { clearTimeout(b._hideTimer); b._hideTimer = null; }
  b.style.display = 'none';
  b.classList.remove('is-restored');
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ===== 音频处理 =====

async function initAudio() {
  try {
    console.log('[Audio] 开始初始化麦克风...');
    state.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000
      }
    });
    console.log('[Audio] 麦克风权限已获取，轨道数:', state.mediaStream.getAudioTracks().length);

    state.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
    console.log('[Audio] AudioContext创建，状态:', state.audioContext.state);

    // 确保AudioContext处于运行状态
    if (state.audioContext.state === 'suspended') {
      await state.audioContext.resume();
      console.log('[Audio] AudioContext已resume，状态:', state.audioContext.state);
    }

    state.sourceNode = state.audioContext.createMediaStreamSource(state.mediaStream);
    state.analyserNode = state.audioContext.createAnalyser();
    state.analyserNode.fftSize = 256;
    state.sourceNode.connect(state.analyserNode);

    state.scriptProcessor = state.audioContext.createScriptProcessor(4096, 1, 1);
    state.sourceNode.connect(state.scriptProcessor);
    // 关键修复：必须连接到destination，否则Chrome不会触发onaudioprocess事件
    // 使用GainNode控制音量为0，避免回声
    state.muteGain = state.audioContext.createGain();
    state.muteGain.gain.value = 0; // 静音，避免麦克风回声
    state.scriptProcessor.connect(state.muteGain);
    state.muteGain.connect(state.audioContext.destination);
    console.log('[Audio] ScriptProcessor已连接到destination（通过静音GainNode）');

    let audioFrameCount = 0;
    let lastAudioSendLog = 0;
    let lastWsState = -1; // 记录上一次的ws状态，用于检测状态变化
    state.scriptProcessor.onaudioprocess = (e) => {
      audioFrameCount++;

      // 检测ws状态变化
      const currentWsState = state.ws ? state.ws.readyState : -1;
      if (currentWsState !== lastWsState) {
        console.log(`[Audio] ws状态变化: ${lastWsState} -> ${currentWsState}, isRecording: ${state.isRecording}, isReconnecting: ${state.isReconnecting}`);
        lastWsState = currentWsState;
      }

      // 前10帧都打印，确认onaudioprocess持续触发
      if (audioFrameCount <= 10) {
        console.log(`[Audio] onaudioprocess #${audioFrameCount}, isRecording: ${state.isRecording}, ws: ${state.ws ? state.ws.readyState : 'null'}, inputLength: ${e.inputBuffer.getChannelData(0).length}`);
      }

      if (!state.isRecording || state.isPaused || state.isMuted) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = resampleTo16kHzPCM16(inputData, e.inputBuffer.sampleRate);

      if (pcm16.length > 0 && state.ws && state.ws.readyState === WebSocket.OPEN) {
        const base64 = arrayBufferToBase64(pcm16.buffer);
        state.ws.send(JSON.stringify({ type: 'audio', audio: base64 }));
        // 每50帧打印一次发送日志，避免日志太多
        if (audioFrameCount - lastAudioSendLog >= 50 || audioFrameCount <= 10) {
          console.log(`[Audio] ✅ 发送音频帧 #${audioFrameCount}, pcm长度: ${pcm16.length}, base64大小: ${base64.length}`);
          lastAudioSendLog = audioFrameCount;
        }
      } else if (audioFrameCount <= 10 || (audioFrameCount % 100 === 0 && !state.ws)) {
        // 前10帧如果没发送，打印原因；之后每100帧如果ws不存在，打印一次
        let reason = [];
        if (pcm16.length === 0) reason.push('pcm为空');
        if (!state.ws) reason.push('ws为null');
        else if (state.ws.readyState !== WebSocket.OPEN) reason.push(`ws状态=${state.ws.readyState}(0=连接中,1=已打开)`);
        console.log(`[Audio] ⚠️ 帧 #${audioFrameCount} 未发送，原因: ${reason.join(', ') || '未知'}`);
      }
    };

    console.log('[Audio] 初始化完成');
    return true;
  } catch (e) {
    console.error('麦克风初始化失败:', e);
    showToast(t('micErrorFull'));
    return false;
  }
}

function resampleTo16kHzPCM16(float32Data, sourceSampleRate) {
  const targetSampleRate = 16000;
  const ratio = sourceSampleRate / targetSampleRate;
  const targetLength = Math.floor(float32Data.length / ratio);
  const pcm16 = new Int16Array(targetLength);

  for (let i = 0; i < targetLength; i++) {
    const sourceIndex = Math.floor(i * ratio);
    let sample = float32Data[sourceIndex] || 0;
    sample = Math.max(-1, Math.min(1, sample));
    pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
  }

  return pcm16;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function playTTSAudio(base64Audio) {
  if (!base64Audio) return;
  if (!state.ttsEnabled) return; // 如果TTS已关闭，不播放

  try {
    const pcmData = new Int16Array(base64ToArrayBuffer(base64Audio));
    const sampleRate = 24000;
    const float32 = new Float32Array(pcmData.length);

    for (let i = 0; i < pcmData.length; i++) {
      float32[i] = pcmData[i] / (pcmData[i] < 0 ? 0x8000 : 0x7FFF);
    }

    if (!state.audioContext) {
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioBuffer = state.audioContext.createBuffer(1, float32.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32);

    // 加入播放队列，按顺序播放，避免重叠
    state.ttsAudioQueue.push(audioBuffer);
    if (!state.isPlayingTTS) {
      playNextTTS();
    }
  } catch (e) {
    console.error('TTS播放失败:', e);
  }
}

// 按顺序播放TTS音频队列
function playNextTTS() {
  if (state.ttsAudioQueue.length === 0) {
    state.isPlayingTTS = false;
    return;
  }

  state.isPlayingTTS = true;
  const audioBuffer = state.ttsAudioQueue.shift();

  const source = state.audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(state.audioContext.destination);

  source.onended = () => {
    // 当前片段播放完，播放下一个
    playNextTTS();
  };

  source.start(0);
}

// 清空TTS队列（切换TTS开关或结束会谈时调用）
function clearTTSQueue() {
  state.ttsAudioQueue = [];
  state.isPlayingTTS = false;
}

// ===== WebSocket 通信 =====

function connectWebSocket(config) {
  // 避免重复创建连接
  if (state.isConnecting) {
    console.log('[WS] 已有连接正在建立中，跳过本次连接');
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  // 生成新连接的唯一ID
  const connectionId = ++state.currentConnectionId;
  console.log(`[WS] 开始建立连接 #${connectionId}...`);

  // 关闭旧连接（如果存在）
  if (state.ws && state.ws.readyState !== WebSocket.CLOSED) {
    console.log(`[WS] 关闭旧连接，旧连接readyState: ${state.ws.readyState}`);
    // 给旧连接的onclose设置标志，避免旧连接的onclose触发自动重连
    state.ws._isOldConnection = true;
    state.ws.close();
    state.ws = null;
  }

  state.isConnecting = true;
  const ws = new WebSocket(wsUrl);
  state.ws = ws;
  ws._connectionId = connectionId;

  ws.onopen = () => {
    // 检查是否是当前连接（可能在连接过程中又创建了新连接）
    if (state.currentConnectionId !== connectionId) {
      console.log(`[WS] 连接 #${connectionId} 已过期（当前是 #${state.currentConnectionId}），关闭`);
      ws.close();
      return;
    }

    console.log(`[WS] 连接 #${connectionId} 已打开, isRecording: ${state.isRecording}, audioContext状态: ${state.audioContext ? state.audioContext.state : 'null'}`);
    state.isConnecting = false;
    state.reconnectAttempts = 0; // 重置重连计数
    state.isReconnecting = false;

    // 确保audioContext处于running状态（重连后可能被suspended）
    if (state.audioContext && state.audioContext.state === 'suspended') {
      console.log('[Audio] audioContext被suspended，尝试resume');
      state.audioContext.resume().then(() => {
        console.log('[Audio] audioContext已resume，状态:', state.audioContext.state);
      }).catch(e => {
        console.error('[Audio] audioContext resume失败:', e);
      });
    }

    ws.send(JSON.stringify({ type: 'start', config }));
    console.log(`[WS] 连接 #${connectionId} 已发送start消息`);

    // 延迟埋点：探测"手机→服务器"往返时延，结果回传服务端统一记录
    startRttProbe(ws, connectionId);
  };

  ws.onmessage = (event) => {
    // 检查是否是当前连接
    if (state.currentConnectionId !== connectionId) {
      console.log(`[WS] 连接 #${connectionId} 已过期，忽略消息`);
      return;
    }

    try {
      const msg = JSON.parse(event.data);
      handleServerMessage(msg);
    } catch (e) {
      console.error('WS消息解析失败:', e);
    }
  };

  ws.onerror = (e) => {
    console.error(`[WS] 连接 #${connectionId} 错误:`, e);
  };

  ws.onclose = (event) => {
    state.isConnecting = false;

    // 检查是否是旧连接的onclose（竞态条件修复）
    if (ws._isOldConnection) {
      console.log(`[WS] 旧连接 #${connectionId} 已关闭，忽略（不触发自动重连）`);
      return;
    }

    // 检查是否是当前连接（可能在关闭过程中又创建了新连接）
    if (state.currentConnectionId !== connectionId) {
      console.log(`[WS] 连接 #${connectionId} 已过期（当前是 #${state.currentConnectionId}），忽略onclose`);
      return;
    }

    console.log(`[WS] 当前连接 #${connectionId} 断开, code: ${event.code}, reason: ${event.reason}, shouldReconnect: ${state.shouldReconnect}, isRecording: ${state.isRecording}`);

    // 当前连接已断，停止 RTT 探测（重连成功后会重新启动）
    stopRttProbe();

    // 自动重连：如果用户还在会谈中，且没有主动停止，就自动重连
    if (state.shouldReconnect && state.isRecording && state.reconnectAttempts < state.maxReconnectAttempts) {
      state.reconnectAttempts++;
      state.isReconnecting = true;

      // 如果是后端主动触发的重连（code=4000），快速重连，不使用指数退避
      // 否则使用指数退避
      const delay = event.code === 4000 ? 500 : Math.min(state.reconnectDelay * Math.pow(1.5, state.reconnectAttempts - 1), 5000);
      console.log(`[WS] 自动重连中... 第 ${state.reconnectAttempts}/${state.maxReconnectAttempts} 次，延迟 ${delay}ms (code=${event.code})`);
      showToast(t('reconnecting') + ` (${state.reconnectAttempts}/${state.maxReconnectAttempts})`, 2000);
      showConnBanner(false);

      setTimeout(() => {
        // 再次检查条件，避免在延迟期间用户结束了会谈
        if (state.shouldReconnect && state.isRecording && state.currentConnectionId === connectionId) {
          console.log(`[WS] 执行重连，连接 #${connectionId} -> 新连接`);
          // 重连前确保audioContext处于running状态
          if (state.audioContext && state.audioContext.state === 'suspended') {
            console.log('[Audio] 重连前audioContext被suspended，尝试resume');
            state.audioContext.resume().then(() => {
              console.log('[Audio] audioContext已resume，状态:', state.audioContext.state);
              connectWebSocket(state.config);
            }).catch(e => {
              console.error('[Audio] audioContext resume失败:', e);
              connectWebSocket(state.config);
            });
          } else {
            connectWebSocket(state.config);
          }
        } else {
          console.log(`[WS] 重连条件不满足，取消重连, shouldReconnect: ${state.shouldReconnect}, isRecording: ${state.isRecording}, currentConnectionId: ${state.currentConnectionId}, connectionId: ${connectionId}`);
        }
      }, delay);
    } else if (state.reconnectAttempts >= state.maxReconnectAttempts) {
      console.error('[WS] 达到最大重连次数，停止重连');
      showToast(t('connectionLost'), 5000);
      state.isReconnecting = false;
    }
  };
}

// === 延迟埋点：手机→服务器 RTT 探测 ===
// 定时发一个极小的 ping，服务端原样回 pong，用来量化"手机到服务器"这一段有多慢。
let rttTimer = null;
let rttSeq = 0;
const rttPending = {};

function startRttProbe(ws, connectionId) {
  stopRttProbe();
  const probe = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (state.currentConnectionId !== connectionId) return;
    const id = ++rttSeq;
    rttPending[id] = Date.now();
    try {
      ws.send(JSON.stringify({ type: 'ping', id }));
    } catch (e) {
      console.warn('[Latency] ping 发送失败:', e);
    }
    // 3 秒未回则丢弃，避免 pending 堆积
    setTimeout(() => { delete rttPending[id]; }, 3000);
  };
  probe();                              // 连上立刻测一次
  rttTimer = setInterval(probe, 60000); // 之后每分钟一次
}

function stopRttProbe() {
  if (rttTimer) { clearInterval(rttTimer); rttTimer = null; }
}

// 收到服务端 pong，算出 RTT 并回传（服务端只负责记录，不参与业务）
function handleRttPong(msg) {
  const sentAt = rttPending[msg.id];
  if (!sentAt) return;
  delete rttPending[msg.id];
  const rtt = Date.now() - sentAt;
  console.log(`[Latency] 手机→服务器 往返: ${rtt}ms`);
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ type: 'rtt', value: rtt }));
  }
}

// 停止自动重连（用户主动结束会谈时调用）
function stopReconnect() {
  state.shouldReconnect = false;
  state.isReconnecting = false;
  state.isConnecting = false;
  if (state.ws) {
    state.ws._isOldConnection = true;
    state.ws.close();
    state.ws = null;
  }
}

function handleServerMessage(msg) {
  switch (msg.type) {
    case 'pong':
      handleRttPong(msg);
      break;

    case 'session_started':
      console.log('[WS] 会话已启动');
      showToast(t('translationStarted'));
      // 若之前显示过"连接中断"，恢复后给出确认
      if ($('connBanner') && $('connBanner').style.display !== 'none') {
        showConnBanner(true);
      }
      break;

    case 'source_partial':
      // 更新当前正在进行的segment的原文
      updateCurrentSegment('source', msg.text || '');
      break;

    case 'target_partial':
      // 更新当前正在进行的segment的译文
      updateCurrentSegment('target', msg.text || '');
      break;

    case 'segment_complete':
      // 完成当前segment，添加到列表
      finishCurrentSegment(msg.segment);
      break;

    case 'tts_audio':
      // 不需要语音播报，忽略
      break;

    case 'error':
      console.error('[WS] 错误:', msg.message);
      showToast(msg.message || t('translationError'), 5000);
      break;

    case 'session_finished':
      state.meetingId = msg.meetingId;
      break;
  }
}

// 当前正在进行的segment（用于实时更新显示）
let currentSegmentEl = null;
let currentSegmentData = null;

// 更新当前正在进行的segment
function updateCurrentSegment(type, text) {
  // 如果没有当前segment，创建一个
  if (!currentSegmentEl) {
    const list = $('transcriptList');
    // 移除空状态提示
    const empty = list.querySelector('.transcript-empty');
    if (empty) empty.remove();

    currentSegmentEl = document.createElement('div');
    currentSegmentEl.className = 'transcript-item current';
    currentSegmentData = {
      speaker: state.currentSpeaker,
      source: '',
      target: ''
    };

    const speakerDiv = document.createElement('div');
    speakerDiv.className = 'transcript-speaker';
    speakerDiv.textContent = speakerLabel(state.currentSpeaker);

    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'transcript-source';
    sourceDiv.textContent = '';

    const targetDiv = document.createElement('div');
    targetDiv.className = 'transcript-target';
    targetDiv.textContent = '';

    currentSegmentEl.appendChild(speakerDiv);
    currentSegmentEl.appendChild(sourceDiv);
    currentSegmentEl.appendChild(targetDiv);
    list.appendChild(currentSegmentEl);
  }

  // 更新文本
  if (type === 'source') {
    currentSegmentData.source = text;
    currentSegmentEl.querySelector('.transcript-source').textContent = text;
  } else if (type === 'target') {
    currentSegmentData.target = text;
    currentSegmentEl.querySelector('.transcript-target').textContent = text;
  }

  // 自动滚动到底部
  const scroll = $('transcriptScroll');
  scroll.scrollTop = scroll.scrollHeight;
}

// 完成当前segment
function finishCurrentSegment(segment) {
  if (currentSegmentEl) {
    // 移除current类
    currentSegmentEl.classList.remove('current');
    // 更新最终文本
    if (segment.source) currentSegmentEl.querySelector('.transcript-source').textContent = segment.source;
    if (segment.target) currentSegmentEl.querySelector('.transcript-target').textContent = segment.target;
    // 说话人以用户手动标记为准：服务端返回的 'unknown' 不可信，不能覆盖用户标记
    const manualSpeaker = currentSegmentData && currentSegmentData.speaker;
    const speaker = normalizeSpeaker(manualSpeaker || segment.speaker);
    currentSegmentEl.querySelector('.transcript-speaker').textContent = speakerLabel(speaker);

    // 保存到state
    state.segments.push({
      ...segment,
      speaker: speaker
    });
  }

  // 重置当前segment
  currentSegmentEl = null;
  currentSegmentData = null;

  // 自动滚动到底部
  const scroll = $('transcriptScroll');
  scroll.scrollTop = scroll.scrollHeight;
}

// 添加转录segment（备用，直接添加完整segment）
function addTranscriptSegment(segment) {
  state.segments.push(segment);

  const list = $('transcriptList');
  // 移除空状态提示
  const empty = list.querySelector('.transcript-empty');
  if (empty) empty.remove();

  const item = document.createElement('div');
  item.className = 'transcript-item';

  const speakerDiv = document.createElement('div');
  speakerDiv.className = 'transcript-speaker';
  speakerDiv.textContent = speakerLabel(normalizeSpeaker(segment.speaker));

  const sourceDiv = document.createElement('div');
  sourceDiv.className = 'transcript-source';
  sourceDiv.textContent = segment.source || '';

  const targetDiv = document.createElement('div');
  targetDiv.className = 'transcript-target';
  targetDiv.textContent = segment.target || '';

  item.appendChild(speakerDiv);
  item.appendChild(sourceDiv);
  item.appendChild(targetDiv);
  list.appendChild(item);

  $('transcriptScroll').scrollTop = $('transcriptScroll').scrollHeight;
}

// ===== 说话人切换 =====

// 归一化说话人标记：只认 'me' / 'other'，其余（含服务端的 'unknown'）回退到用户当前标记
function normalizeSpeaker(raw) {
  if (raw === 'me' || raw === 'other') return raw;
  return state.currentSpeaker === 'me' ? 'me' : 'other';
}

// 渲染说话人标签文字
function speakerLabel(speaker) {
  return speaker === 'me' ? '🎙 ' + t('meSpeaker') : '🗣 ' + t('otherSpeaker');
}

function updateSpeakerUI() {
  document.querySelectorAll('.speaker-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.speaker === state.currentSpeaker) {
      btn.classList.add('active');
    }
  });
}

// 更新TTS按钮UI（已停用，保留用于未来扩展）
function updateTTSButtonUI() {
  const btn = $('btnTTS');
  if (!btn) return; // 安全检查：按钮不存在时直接返回
  if (state.ttsEnabled) {
    btn.innerHTML = '🔊<span>' + t('ttsButtonOn') + '</span>';
    btn.classList.add('active');
  } else {
    btn.innerHTML = '🔇<span>' + t('ttsButtonOff') + '</span>';
    btn.classList.remove('active');
  }
}

// 切换TTS开关
function toggleTTS() {
  state.ttsEnabled = !state.ttsEnabled;
  updateTTSButtonUI();

  if (!state.ttsEnabled) {
    // 关闭TTS：清空播放队列
    clearTTSQueue();
  }

  // 重新连接以应用新的TTS设置
  if (state.isRecording && state.ws) {
    state.config = buildConfig();
    console.log('[TTS] 切换TTS状态，重新连接, ttsEnabled:', state.ttsEnabled);
    connectWebSocket(state.config);
    showToast(state.ttsEnabled ? t('ttsOn') : t('ttsOff'));
  }
}

function switchSpeaker(speaker) {
  if (state.currentSpeaker === speaker) return;

  state.currentSpeaker = speaker;
  updateSpeakerUI();

  // 同步更新"正在进行的这一段"的说话人，避免该段完成后被服务端字段覆盖
  if (currentSegmentData) {
    currentSegmentData.speaker = speaker;
  }
  if (currentSegmentEl) {
    const spEl = currentSegmentEl.querySelector('.transcript-speaker');
    if (spEl) {
      spEl.textContent = speakerLabel(speaker);
    }
  }

  // 只标记说话人，不切换翻译方向（单向翻译）
  console.log('[Speaker] 标记说话人:', speaker);
  showToast(speaker === 'other' ? t('markedOther') : t('markedMe'));
}

// ===== 语言切换（会谈中切换对话语言和翻译语言）=====

const LANGUAGES = [
  { code: 'zh', name: '中文', native: '中文' },
  { code: 'en', name: '英语', native: 'English' },
  { code: 'de', name: '德语', native: 'Deutsch' },
  { code: 'fr', name: '法语', native: 'Français' },
  { code: 'es', name: '西班牙语', native: 'Español' },
  { code: 'ja', name: '日语', native: '日本語' },
  { code: 'ko', name: '韩语', native: '한국어' },
  { code: 'ru', name: '俄语', native: 'Русский' },
  { code: 'it', name: '意大利语', native: 'Italiano' },
  { code: 'pt', name: '葡萄牙语', native: 'Português' },
  { code: 'nl', name: '荷兰语', native: 'Nederlands' },
  { code: 'ar', name: '阿拉伯语', native: 'العربية' }
];

// 获取语言名称（根据当前界面语言返回）
function getLangName(code) {
  const lang = LANGUAGES.find(l => l.code === code);
  if (!lang) return code;
  // 如果当前是英文界面，返回本地语言名称；否则返回中文名称
  return currentLang === 'en' ? lang.native : lang.name;
}

// 更新顶部语言显示（单向翻译，固定显示对话语言→翻译语言）
function updateLangDisplay() {
  const sourceLang = $('sourceLang').value;
  const targetLang = $('targetLang').value;
  const sourceName = getLangName(sourceLang);
  const targetName = getLangName(targetLang);

  $('langDirection').textContent = `${sourceName} → ${targetName}`;
}

// 打开语言选择弹窗（同时选择源语言和目标语言）
function openLangModal() {
  const sourceList = $('langModalSourceList');
  const targetList = $('langModalTargetList');
  const currentSource = $('sourceLang').value;
  const currentTarget = $('targetLang').value;

  // 渲染源语言列表
  sourceList.innerHTML = '';
  LANGUAGES.forEach(lang => {
    const option = document.createElement('div');
    option.className = 'lang-option' + (lang.code === currentSource ? ' active' : '');
    option.textContent = `${lang.name} ${lang.native}`;
    option.addEventListener('click', () => {
      selectSourceLanguage(lang.code);
    });
    sourceList.appendChild(option);
  });

  // 渲染目标语言列表
  targetList.innerHTML = '';
  LANGUAGES.forEach(lang => {
    const option = document.createElement('div');
    option.className = 'lang-option' + (lang.code === currentTarget ? ' active' : '');
    option.textContent = `${lang.name} ${lang.native}`;
    option.addEventListener('click', () => {
      selectTargetLanguage(lang.code);
    });
    targetList.appendChild(option);
  });

  $('langModal').style.display = 'flex';

  // 把当前选中项滚动到各自列表的可视区域（只滚列表本身，不滚动页面）
  setTimeout(() => {
    [sourceList, targetList].forEach(list => {
      const active = list.querySelector('.lang-option.active');
      if (active) {
        list.scrollTop = active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2;
      }
    });
  }, 50);
}

// 选择源语言
function selectSourceLanguage(langCode) {
  if ($('sourceLang').value === langCode) {
    closeLangModal();
    return;
  }

  $('sourceLang').value = langCode;
  const langName = getLangName(langCode);
  updateLangDisplay();

  // 如果正在会谈中，重新连接应用新语言
  if (state.isRecording && state.ws) {
    state.config = buildConfig();
    console.log('[Lang] 切换对话语言，重新连接，新对话语言:', langCode);
    connectWebSocket(state.config);
    showToast(t('switchedDialogueLang') + `: ${langName}`);
  } else {
    showToast(t('selectedDialogueLang') + `: ${langName}`);
  }
  closeLangModal();
}

// 选择目标语言
function selectTargetLanguage(langCode) {
  if ($('targetLang').value === langCode) {
    closeLangModal();
    return;
  }

  $('targetLang').value = langCode;
  const langName = getLangName(langCode);
  updateLangDisplay();

  // 如果正在会谈中，重新连接应用新语言
  if (state.isRecording && state.ws) {
    state.config = buildConfig();
    console.log('[Lang] 切换翻译语言，重新连接，新翻译语言:', langCode);
    connectWebSocket(state.config);
    showToast(t('switchedTranslateLang') + `: ${langName}`);
  } else {
    showToast(t('selectedTranslateLang') + `: ${langName}`);
  }
  closeLangModal();
}

// 关闭语言选择弹窗
function closeLangModal() {
  $('langModal').style.display = 'none';
}

function buildConfig() {
  const sourceLang = $('sourceLang').value;
  const targetLang = $('targetLang').value;

  // 单向翻译：对话语言→翻译语言（不管谁说话，翻译方向固定）
  // 不需要TTS语音播报，只用s2t模式（语音转文字）
  return {
    mode: 's2t',
    enable_tts: false,
    source_language: sourceLang,
    target_language: targetLang,
    title: state.meetingName
  };
}

// ===== 音量指示器 =====

function updateVolumeMeter() {
  if (!state.analyserNode) return;

  const dataArray = new Uint8Array(state.analyserNode.frequencyBinCount);
  state.analyserNode.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const average = sum / dataArray.length;
  const percentage = Math.min(100, (average / 128) * 100);

  $('volumeBar').style.width = percentage + '%';

  if (state.isMuted) {
    $('volumeLabel').textContent = t('muteOn');
  } else if (percentage > 5) {
    $('volumeLabel').textContent = t('micNormal');
  } else {
    $('volumeLabel').textContent = t('waitingSound');
  }
}

// ===== 会谈控制 =====

async function startMeeting() {
  const meetingName = $('meetingName').value.trim() || t('untitledMeeting');
  state.meetingName = meetingName;
  state.segments = [];
  state.summary = null;
  currentSegmentEl = null;
  currentSegmentData = null;

  const audioOk = await initAudio();
  if (!audioOk) return;

  $('meetingTitleDisplay').textContent = meetingName;
  $('transcriptList').innerHTML = '<div class="transcript-empty">' + t('waitingSpeech') + '</div>';
  hideConnBanner();
  switchView('meeting');

  state.meetingStartTime = Date.now();
  state.activeSeconds = 0;
  state.timerInterval = setInterval(() => {
    const elapsed = Date.now() - state.meetingStartTime;
    $('meetingTimer').textContent = formatTime(elapsed);
  }, 1000);

  // 活跃时长计时器：仅非暂停状态累加（暂停不计入用户额度）
  state.activeTimerInterval = setInterval(() => {
    if (state.isRecording && !state.isPaused && !state.isMuted) {
      state.activeSeconds++;
    }
  }, 1000);

  state.volumeInterval = setInterval(updateVolumeMeter, 100);

  state.isRecording = true;
  state.shouldReconnect = true; // 允许自动重连
  state.reconnectAttempts = 0; // 重置重连计数
  state.currentSpeaker = 'other';
  updateSpeakerUI();
  updateLangDisplay(); // 更新语言显示
  state.config = buildConfig();
  connectWebSocket(state.config);

  showToast(t('meetingStarted'));
}

function pauseMeeting() {
  state.isPaused = !state.isPaused;
  const btn = $('btnPause');
  if (state.isPaused) {
    btn.innerHTML = '▶<span>' + t('resumeOn') + '</span>';
    showToast(t('paused'));
  } else {
    btn.innerHTML = '⏸<span>' + t('pause') + '</span>';
    showToast(t('resumed'));
  }
}

function muteMeeting() {
  state.isMuted = !state.isMuted;
  const btn = $('btnMute');
  if (state.isMuted) {
    // 已静音：显示喇叭加斜杠
    btn.innerHTML = '🔇<span>' + t('muteOn') + '</span>';
    showToast(t('micMuted'));
  } else {
    // 未静音（正常录音）：显示正常喇叭
    btn.innerHTML = '🔊<span>' + t('mute') + '</span>';
    showToast(t('micUnmuted'));
  }
}

function endMeeting() {
  state.isRecording = false;

  // 清除会谈中定时器
  if (state.activeTimerInterval) { clearInterval(state.activeTimerInterval); state.activeTimerInterval = null; }

  // 重置当前segment
  currentSegmentEl = null;
  currentSegmentData = null;

  // 先发送stop消息给后端（如果连接还在）
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    try {
      state.ws.send(JSON.stringify({ type: 'stop' }));
      console.log('[WS] 已发送stop消息');
    } catch (e) {
      console.log('发送stop消息失败:', e);
    }
  }

  // 停止自动重连并关闭连接
  stopReconnect();

  if (state.timerInterval) clearInterval(state.timerInterval);
  if (state.volumeInterval) clearInterval(state.volumeInterval);

  if (state.mediaStream) {
    state.mediaStream.getTracks().forEach(track => track.stop());
  }

  showResultPage();
}

function showResultPage() {
  $('resultMeetingName').textContent = state.meetingName;
  const duration = state.meetingStartTime ? formatTime(Date.now() - state.meetingStartTime) : '00:00';
  $('resultMeta').textContent = `${t('durationLabel')}: ${duration} | ${state.segments.length} ${t('segmentCountLabel')}`;

  const transcriptDiv = $('resultTranscript');
  transcriptDiv.innerHTML = '';

  if (state.segments.length === 0) {
    transcriptDiv.innerHTML = '<div class="history-empty">' + t('noRecord') + '</div>';
  } else {
    state.segments.forEach(seg => {
      const item = document.createElement('div');
      item.className = 'transcript-item';
      const speaker = speakerLabel(normalizeSpeaker(seg.speaker));
      item.innerHTML = `
        <div class="transcript-speaker">${speaker}</div>
        <div class="transcript-source">${escapeHtml(seg.source || '')}</div>
        <div class="transcript-target">${escapeHtml(seg.target || '')}</div>
      `;
      transcriptDiv.appendChild(item);
    });
  }

  $('summaryContent').style.display = 'none';
  $('summaryLoading').style.display = 'none';
  // 重置AI总结按钮状态（新会谈重新开始）
  const sumBtn = $('btnGenerateSummary');
  if (sumBtn) {
    sumBtn.disabled = false;
    sumBtn.textContent = t('generateAISummary');
  }
  switchView('result');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== AI会谈总结（调用阿里云qwen-turbo）=====

async function generateSummary() {
  if (state.segments.length === 0) {
    showToast(t('noTranscript'));
    return;
  }

  // 显示加载状态
  $('summaryLoading').style.display = 'flex';
  $('summaryContent').style.display = 'none';
  $('btnGenerateSummary').disabled = true;
  $('btnGenerateSummary').textContent = t('generating');

  try {
    console.log('[AI Summary] 开始生成总结，段数:', state.segments.length);

    // 动态获取翻译语言，用于AI总结的语言（优先用state.config，兜底用下拉框值，默认中文）
    const summaryLang = state.config?.target_language || ($('targetLang') ? $('targetLang').value : 'zh') || 'zh';
    console.log('[AI Summary] 总结语言:', summaryLang);

    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingName: state.meetingName,
        segments: state.segments,
        language: summaryLang
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || '生成失败');
    }

    console.log('[AI Summary] 总结生成成功，长度:', result.summary.length);

    // 保存总结内容到state，供导出使用（先清掉代码围栏标记）
    state.summary = stripCodeFence(result.summary);

    // 渲染Markdown格式的总结
    $('summaryText').innerHTML = renderMarkdown(state.summary);
    $('summaryContent').style.display = 'block';
    showToast(t('summaryGeneratedDetail'));

  } catch (error) {
    console.error('[AI Summary] 生成失败:', error);
    showToast(t('summaryFailed') + ': ' + error.message, 4000);
    // 失败时显示简单的记录摘要
    showSimpleSummary();
  } finally {
    $('summaryLoading').style.display = 'none';
    $('btnGenerateSummary').disabled = false;
    $('btnGenerateSummary').textContent = t('regenerate');
  }
}

// 简单Markdown渲染（支持标题、列表、粗体、换行）
// 去掉AI返回文本里的Markdown代码围栏标记（```markdown / ``` 等）
function stripCodeFence(text) {
  if (!text || typeof text !== 'string') return '';
  let out = text;
  out = out.replace(/^[ \t]*```[ \t]*(markdown|md|text)?[ \t]*$/gim, '');
  out = out.replace(/```/g, '');
  out = out.replace(/^[ \t]*markdown[ \t]*$/gim, '');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

// 把Markdown总结转成便于阅读/粘贴的纯文本（导出记录时用）
function markdownToPlain(text) {
  if (!text || typeof text !== 'string') return '';
  let out = stripCodeFence(text);
  // 复选框
  out = out.replace(/^[ \t]*-[ \t]*\[ \][ \t]*/gm, '☐ ');
  out = out.replace(/^[ \t]*-[ \t]*\[x\][ \t]*/gim, '☑ ');
  // 标题标记（### / ## / #）
  out = out.replace(/^[ \t]*#{1,6}[ \t]*/gm, '');
  // 粗体 / 斜体标记
  out = out.replace(/\*\*(.*?)\*\*/g, '$1');
  out = out.replace(/__(.*?)__/g, '$1');
  // 分割线
  out = out.replace(/^[ \t]*-{3,}[ \t]*$/gm, '————————');
  // 列表符号统一
  out = out.replace(/^[ \t]*[-*][ \t]+/gm, '· ');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

function renderMarkdown(text) {
  // 先转义，保证安全；Markdown 符号不受转义影响
  const src = stripCodeFence(escapeHtml(text || ''));
  const lines = src.split('\n');
  let html = '';
  let inList = false;

  const closeList = () => {
    if (inList) { html += '</ul>'; inList = false; }
  };
  const openList = (cls) => {
    if (!inList) { html += cls ? '<ul class="' + cls + '">' : '<ul>'; inList = true; }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { closeList(); continue; }

    let m;
    // 复选框（必须先于普通列表判断，否则 "- [ ] xxx" 会被当成普通列表项）
    if ((m = line.match(/^\s*[-*]\s*\[([ xX])\]\s*(.*)$/))) {
      openList('checklist');
      html += '<li>' + (m[1].toLowerCase() === 'x' ? '☑' : '☐') + ' ' + m[2] + '</li>';
      continue;
    }
    // 无序列表
    if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      openList();
      html += '<li>' + m[1] + '</li>';
      continue;
    }
    // 有序列表
    if ((m = line.match(/^\s*\d+[.、)]\s+(.*)$/))) {
      openList('ordered');
      html += '<li>' + m[1] + '</li>';
      continue;
    }
    // 分割线
    if (/^\s*[-*_]{3,}\s*$/.test(line)) { closeList(); html += '<hr>'; continue; }
    // 标题：# -> h2，## -> h3，### 及更深 -> h4（紧凑层级）
    if ((m = line.match(/^\s*(#{1,6})\s+(.*)$/))) {
      closeList();
      const lvl = Math.min(m[1].length + 1, 6);
      html += '<h' + lvl + '>' + m[2] + '</h' + lvl + '>';
      continue;
    }
    // 普通段落
    closeList();
    html += '<p>' + line + '</p>';
  }
  closeList();

  // 行内强调
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}

// 失败时显示简单摘要
function showSimpleSummary() {
  let summaryHtml = '<h3>' + t('simpleSummaryTitle') + '</h3>';
  summaryHtml += `<p><strong>${t('exportMeetingName')}: </strong>${escapeHtml(state.meetingName)}</p>`;
  summaryHtml += `<p><strong>${t('segmentCountLabel')}: </strong>${state.segments.length}</p>`;
  summaryHtml += '<p style="color:#999;font-size:13px;">' + t('summaryFallbackNote') + '</p>';
  $('summaryText').innerHTML = summaryHtml;
  $('summaryContent').style.display = 'block';
}

// 复制AI总结
async function copySummary() {
  const text = $('summaryText').innerText;
  if (!text) {
    showToast(t('noContentToCopy'));
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    const btn = $('btnCopySummary');
    btn.textContent = '✅ ' + t('copied');
    btn.classList.add('copied');
    showToast(t('summaryCopied'));
    setTimeout(() => {
      btn.textContent = t('copy');
      btn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(t('recordCopied'));
  }
}

// ===== 导出记录 =====

function exportTranscript() {
  let text = `${t('exportMeetingName')}: ${state.meetingName}\n`;
  text += `${t('exportTime')}: ${new Date().toLocaleString()}\n`;
  text += t('exportSegmentTotal').replace('{n}', state.segments.length) + '\n\n';

  // 如果有AI总结，先输出总结部分
  if (state.summary) {
    text += '='.repeat(50) + '\n';
    text += t('exportSummaryHeader') + '\n';
    text += '='.repeat(50) + '\n\n';
    text += markdownToPlain(state.summary) + '\n\n';
  }

  text += '='.repeat(50) + '\n';
  text += t('exportTranscriptHeader') + '\n';
  text += '='.repeat(50) + '\n\n';

  state.segments.forEach((seg, i) => {
    const speaker = normalizeSpeaker(seg.speaker) === 'me' ? t('meSpeaker') : t('otherSpeaker');
    text += `【${t('exportSegmentLabel').replace('{n}', i + 1)} - ${speaker}】\n`;
    text += `${t('sourceLabel')}: ${seg.source || ''}\n`;
    text += `${t('targetLabel')}: ${seg.target || ''}\n\n`;
  });

  // 显示导出内容模态框（解决微信浏览器下载问题）
  showExportModal(text);
}

function showExportModal(text) {
  // 创建模态框
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;
  
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `<span style="font-weight: 600; font-size: 16px;">${t('exportModalTitle')}</span>`;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
  `;
  closeBtn.onclick = () => document.body.removeChild(modal);
  header.appendChild(closeBtn);
  
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = `
    flex: 1;
    border: none;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    outline: none;
    font-family: monospace;
  `;
  textarea.readOnly = true;
  
  const footer = document.createElement('div');
  footer.style.cssText = `
    padding: 12px 16px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
  `;
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = t('copyAllText');
  copyBtn.style.cssText = `
    flex: 1;
    padding: 12px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
  `;
  copyBtn.onclick = () => {
    textarea.select();
    document.execCommand('copy');
    showToast(t('copiedAndSave'));
  };
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = t('tryDownload');
  saveBtn.style.cssText = `
    flex: 1;
    padding: 12px;
    background: #f3f4f6;
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
  `;
  saveBtn.onclick = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.meetingName}_会谈记录.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('downloadTriggered'));
  };
  
  footer.appendChild(copyBtn);
  footer.appendChild(saveBtn);
  
  content.appendChild(header);
  content.appendChild(textarea);
  content.appendChild(footer);
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ===== 历史会谈 =====

async function loadHistory() {
  try {
    const response = await fetch('/api/meetings');
    const meetings = await response.json();

    const list = $('historyList');
    if (meetings.length === 0) {
      list.innerHTML = '<div class="history-empty">' + t('noHistory') + '</div>';
      return;
    }

    list.innerHTML = '';
    meetings.forEach(m => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const date = new Date(m.createdAt).toLocaleString();
      const segCount = m.segments ? m.segments.length : 0;
      item.innerHTML = `
        <div class="history-name">${escapeHtml(m.title || m.id.substring(0, 8))}</div>
        <div class="history-meta">${date} | ${segCount}${t('segmentCountLabel')}</div>
      `;
      list.appendChild(item);
    });
  } catch (e) {
    console.error('加载历史失败:', e);
  }
}

// ===== 事件绑定 =====

document.addEventListener('DOMContentLoaded', async () => {
  $('btnStart').addEventListener('click', startMeeting);
  $('btnEndMeeting').addEventListener('click', endMeeting);
  $('btnPause').addEventListener('click', pauseMeeting);
  $('btnMute').addEventListener('click', muteMeeting);
  $('btnGenerateSummary').addEventListener('click', generateSummary);
  $('btnExport').addEventListener('click', exportTranscript);
  $('btnCopySummary').addEventListener('click', copySummary);
  $('btnBackHome').addEventListener('click', () => {
    switchView('setup');
    loadHistory();
  });
  $('btnRefreshHistory').addEventListener('click', loadHistory);

  // 语言切换相关
  $('langDisplay').addEventListener('click', openLangModal);
  $('btnCloseLangModal').addEventListener('click', closeLangModal);
  $('langModal').addEventListener('click', (e) => {
    if (e.target.id === 'langModal') closeLangModal();
  });

  document.querySelectorAll('.speaker-btn').forEach(btn => {
    btn.addEventListener('click', () => switchSpeaker(btn.dataset.speaker));
  });
});
