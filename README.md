# MeetFree Core

> 面对面会谈 · 实时同传 · 双语记录 · AI 纪要
> Face-to-face Meeting · Real-time Translation · Bilingual Record · AI Summary

**版本 / Version:** v1.5.0 (开源版 / Open Source Edition)
**协议 / License:** [Fair Code License](./LICENSE)

---

## 中文

### 这是什么

MeetFree Core 是 MeetFree 的核心翻译引擎开源版本。它提供：

- **实时同传**：基于阿里云百炼 qwen3.5-livetranslate 模型，支持 12 种语言互译
- **双语记录**：自动保存原文和译文，逐句标注说话人
- **AI 纪要**：会谈结束后一键生成结构化总结（要点、决策、行动项）
- **预连接无缝切换**：解决阿里云 WebSocket 300 秒硬超时问题，切换空窗趋近于 0
- **无需登录**：开箱即用，选择语言后直接开始会谈

本版本为开源核心版，**不包含**用户系统、支付订阅和用量限制。
如需完整商业版（含 Stripe 支付、用户管理、用量控制），请访问 [meetfree.org](https://meetfree.org)。

### 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Node.js + Express + ws (WebSocket) |
| 实时翻译 | 阿里云百炼 qwen3.5-livetranslate-flash-realtime |
| AI 总结 | 阿里云百炼 qwen-turbo |
| 前端 | 原生 HTML/CSS/JavaScript（无框架依赖） |
| 音频处理 | Web Audio API + ScriptProcessorNode (16kHz PCM16) |
| 部署 | Render / 任何支持 Node.js 的平台 |

### 快速开始

#### 1. 克隆并安装

```bash
git clone <your-repo-url>
cd meetfree-core
npm install
```

#### 2. 配置环境变量

复制 `.env.example` 为 `.env`，填入你的阿里云 API Key：

```bash
cp .env.example .env
```

需要配置的变量：

| 变量 | 说明 | 必填 |
|---|---|---|
| `ALIYUN_API_KEY` | 阿里云百炼 API Key（用于实时翻译） | ✅ |
| `ALIYUN_WORKSPACE_ID` | 阿里云业务空间 Workspace ID | ✅ |
| `ALIYUN_MODEL` | 翻译模型，默认 `qwen3.5-livetranslate-flash-realtime` | 可选 |
| `ALIYUN_REGION` | 地域，默认 `cn-beijing` | 可选 |
| `DASHSCOPE_API_KEY` | 文本生成 API Key（用于 AI 总结），不填则用 ALIYUN_API_KEY | 可选 |
| `PORT` | 服务端口，默认 10000 | 可选 |

> **获取 API Key**：登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/)，创建 API Key 和业务空间。
> 确保已开通 `qwen3.5-livetranslate-flash-realtime` 和 `qwen-turbo` 模型。

#### 3. 启动

```bash
npm start
```

浏览器打开 `http://localhost:10000`，选择语言，开始会谈。

### 部署到 Render

本项目包含 `render.yaml`，可一键部署：

1. Fork 本仓库到你的 GitHub
2. 在 Render  Dashboard 选择 "New → Web Service"
3. 连接你的仓库，Render 会自动识别 `render.yaml`
4. 在 Environment 中填入阿里云 API Key
5. 部署完成后即可使用

### 支持的语言

英语、中文、德语、法语、西班牙语、日语、韩语、俄语、意大利语、葡萄牙语、荷兰语、阿拉伯语（共 12 种）

### 项目结构

```
meetfree-core/
├── server.js          # 后端：WebSocket 翻译 + AI 总结 + 会谈记录
├── package.json
├── .env.example       # 环境变量模板
├── render.yaml        # Render 部署配置
├── .gitignore
├── LICENSE            # Fair Code 协议
├── README.md
└── public/
    ├── index.html     # 前端页面
    ├── app.js         # 前端逻辑（音频采集、WebSocket、UI）
    └── style.css      # 样式
```

### 协议说明

本项目采用 **Fair Code 协议**，不是标准的 OSI 开源协议。核心要点：

- ✅ 可以自由查看、学习、自行部署
- ✅ 可以内部修改和集成到自己的产品中
- ❌ 不得公开再分发修改后的源码
- ❌ 不得基于本代码构建竞争性翻译 SaaS 服务

完整条款请阅读 [LICENSE](./LICENSE)。

### 商业合作

如需商业授权、技术合作或硬件集成（如 WiFi 音箱、会议设备），请联系：
**hello@meetfree.org**

---

## English

### What is this

MeetFree Core is the open-source edition of MeetFree's core translation engine. It provides:

- **Real-time translation**: Powered by Alibaba Cloud Bailian qwen3.5-livetranslate, supporting 12 languages
- **Bilingual records**: Auto-saves source and translation, with speaker labels
- **AI summary**: One-click structured summary after meeting (key points, decisions, action items)
- **Pre-connect seamless switch**: Solves Alibaba Cloud WebSocket 300s hard timeout with near-zero gap
- **No login required**: Works out of the box — pick a language and start

This is the open-source core edition, **without** user accounts, payment subscription, or usage limits.
For the full commercial version (with Stripe payments, user management, usage control), visit [meetfree.org](https://meetfree.org).

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express + ws (WebSocket) |
| Real-time translation | Alibaba Cloud Bailian qwen3.5-livetranslate-flash-realtime |
| AI summary | Alibaba Cloud Bailian qwen-turbo |
| Frontend | Vanilla HTML/CSS/JavaScript (no framework) |
| Audio | Web Audio API + ScriptProcessorNode (16kHz PCM16) |
| Deployment | Render / any Node.js platform |

### Quick Start

#### 1. Clone and install

```bash
git clone <your-repo-url>
cd meetfree-core
npm install
```

#### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Alibaba Cloud API keys:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|---|---|---|
| `ALIYUN_API_KEY` | Alibaba Cloud Bailian API Key (for real-time translation) | ✅ |
| `ALIYUN_WORKSPACE_ID` | Alibaba Cloud workspace ID | ✅ |
| `ALIYUN_MODEL` | Translation model, default `qwen3.5-livetranslate-flash-realtime` | Optional |
| `ALIYUN_REGION` | Region, default `cn-beijing` | Optional |
| `DASHSCOPE_API_KEY` | Text generation API Key (for AI summary), falls back to ALIYUN_API_KEY | Optional |
| `PORT` | Server port, default 10000 | Optional |

> **Get API Keys**: Go to [Alibaba Cloud Bailian Console](https://bailian.console.aliyun.com/), create an API Key and workspace.
> Ensure `qwen3.5-livetranslate-flash-realtime` and `qwen-turbo` models are activated.

#### 3. Run

```bash
npm start
```

Open `http://localhost:10000` in your browser, pick a language, and start.

### Deploy to Render

This project includes `render.yaml` for one-click deployment:

1. Fork this repo to your GitHub
2. In Render Dashboard, select "New → Web Service"
3. Connect your repo — Render auto-detects `render.yaml`
4. Fill in Alibaba Cloud API keys in Environment
5. Deploy and use

### Supported Languages

English, Chinese, German, French, Spanish, Japanese, Korean, Russian, Italian, Portuguese, Dutch, Arabic (12 total)

### Project Structure

```
meetfree-core/
├── server.js          # Backend: WebSocket translation + AI summary + meeting records
├── package.json
├── .env.example       # Environment variable template
├── render.yaml        # Render deployment config
├── .gitignore
├── LICENSE            # Fair Code License
├── README.md
└── public/
    ├── index.html     # Frontend page
    ├── app.js         # Frontend logic (audio capture, WebSocket, UI)
    └── style.css      # Styles
```

### License

This project uses the **Fair Code License**, not a standard OSI open-source license. Key points:

- ✅ Free to view, learn, and self-host
- ✅ Internal modification and integration into your own products
- ❌ No public redistribution of modified source code
- ❌ No competitive translation SaaS built on this code

See [LICENSE](./LICENSE) for full terms.

### Commercial Inquiries

For commercial licensing, tech partnership, or hardware integration (WiFi speakers, conference devices), contact:
**hello@meetfree.org**
