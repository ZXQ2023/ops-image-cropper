# Ops Image Cropper

一个面向运营人员的图片快速裁剪工具，帮助用户一键生成符合不同社交平台尺寸标准的图片物料。

## ✨ 功能特性

- 🖼️ **拖拽上传** — 支持拖拽或点击上传图片
- 📐 **多平台预设尺寸** — 内置微信、微博、抖音、Instagram、Facebook 等主流平台的标准尺寸
- ✏️ **自定义尺寸** — 支持输入自定义宽高，满足特殊需求
- ✂️ **可视化裁剪** — 拖拽调整裁剪区域，实时预览裁剪效果
- 🔄 **多尺寸独立编辑** — 每个尺寸拥有独立的裁剪区域，互不影响
- 👀 **实时预览** — 同时预览所有尺寸的裁剪结果
- 📥 **批量下载** — 支持单个下载或批量下载所有尺寸的裁剪图片
- 📱 **响应式设计** — 适配桌面端和移动端，支持触摸操作

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/<your-username>/ops-image-cropper.git
cd ops-image-cropper

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| [React 18](https://react.dev/) | 前端 UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite](https://vitejs.dev/) | 构建工具 |
| [Tailwind CSS 3](https://tailwindcss.com/) | 原子化 CSS 框架 |
| [Zustand](https://zustand.docs.pmnd.rs/) | 状态管理 |
| [Lucide React](https://lucide.dev/) | 图标库 |

## 📁 项目结构

```
src/
├── components/
│   ├── CropEditor.tsx        # 裁剪编辑器，支持拖拽调整裁剪区域
│   ├── DownloadManager.tsx   # 下载管理，支持单个/批量下载
│   ├── Empty.tsx             # 空状态组件
│   ├── ImageUploader.tsx     # 图片上传组件，支持拖拽上传
│   ├── ResultPreview.tsx     # 裁剪结果预览
│   └── SizeSelector.tsx      # 尺寸选择器，预设 + 自定义尺寸
├── hooks/
│   └── useTheme.ts           # 主题 Hook
├── lib/
│   └── utils.ts              # 工具函数
├── pages/
│   └── Home.tsx              # 主页面
├── App.tsx                   # 应用根组件
├── main.tsx                  # 入口文件
└── index.css                 # 全局样式
```

## 🎯 使用流程

1. **上传图片** — 拖拽或点击上传需要裁剪的图片
2. **选择尺寸** — 从预设尺寸中选择目标平台，或输入自定义尺寸
3. **调整裁剪** — 在各尺寸间切换，独立调整每个尺寸的裁剪区域
4. **预览结果** — 查看所有尺寸的裁剪效果
5. **下载图片** — 单个下载或一键批量下载

## 📸 界面预览

### 上传界面
![上传界面](./screenshots/upload.png)

### 裁剪编辑
![裁剪编辑](./screenshots/crop-editor.png)

### 结果预览与下载
![结果预览与下载](./screenshots/result-preview.png)

## 📄 License

MIT License
