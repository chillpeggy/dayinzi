# 更新日志 (Changelog)

## 当前版本 (Latest Version)

### ✨ 新特性与架构变更 (New Features & Architecture)
- **GitHub 驱动的免后端架构 (Serverless Backend via GitHub)**：
  - 完全移除了 Firebase 依赖，通过 GitHub REST API 实现轻量化数据同步。
  - **云打印队列 (Cloud Print Queue)**：使用 GitHub Issues 模拟免费消息队列。PC端发单创建 Issue，手机端轮询监听 Open Issues，处理完毕后自动关闭 (Close) Issue，实现设备间的通信与出纸。
  - 配置通过根目录下的 `.env` 文件读取 `VITE_GITHUB_TOKEN` 和 `VITE_GITHUB_REPO`。
- **大茵子智能移动端 UI (Mobile UI Overhaul)**：
  - **沉浸式樱花烂漫主题**：新增艺术字体 (谷歌字体/ZCOOL XiaoWei) 与动态发光樱花花瓣背景。
  - **扁长型高级拟物卡片**：全面优化了菜单块的视觉形态，提供更好的左图右文比例，并辅以立体玻璃质感、内发光和深层浮雕阴影，凸显极致的女性化 "Girly" 审美。
  - **云端打印实时指示器**：移动端云打印菜单底部集成了四态指示灯条。红色(未连接) -> 绿色(已连) -> 蓝色呼吸(有排队任务) -> 绿色呼吸(正在出纸)。
- **PWA 类原生支持 (Progressive Web App)**：
  - 构建底层已配置，支持通过 iOS Safari "添加到主屏幕" 免签安装为独立应用形态，隐藏浏览器地址栏，实现全屏沉浸体验。
- **WebBLE 蓝牙热敏协议**：
  - 在 iOS 上，依靠 Bluefy 这类支持 `Web Bluetooth API` 的浏览器，系统不仅能展示高级前端，还能通过浏览器层面直接下发指令控制无线低功耗蓝牙 (BLE) 热敏打印机。

### 🐞 优化与修复 (Optimizations)
- 修正了主界面的部分文字错误。
- 优化了扫码商品页界面的结账流程与购物车状态存储。
- 添加了基础的项目忽略配置 (`.gitignore`)，保护您的安全凭证。
