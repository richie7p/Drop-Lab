# Drop Lab · 掉落實驗室

**繁體中文** | [English](README.en.md)

**[線上展示 / Live Demo](https://bay-gem-iris-pilot.grok.me/)**

3D 物理遊樂場：掉落球體、盒子與圓柱，讓它們在重力下堆疊、彈跳、傾倒。拖曳物體、甩出去，並即時調整重力與彈性。

![Drop Lab](public/og.jpg)

## 功能

- 掉落 **球體 / 盒子 / 圓柱**（點一下一顆，長按連發）
- 拖曳剛體，鬆手帶速度甩出
- 空白處拖曳旋轉視角，滾輪縮放
- 即時調整 **重力**（0–20）與 **彈性**（0–1）
- 清除場景、暫停 / 繼續模擬
- 開場不穩塔，立刻看到碰撞
- 最多約 56 個物體，超出會從最舊的開始移除
- 桌面與手機皆可操作

## 操作

| 輸入 | 作用 |
| --- | --- |
| 球體 / 盒子 / 圓柱 | 從上方掉落該形狀 |
| 長按形狀按鈕 | 連續掉落 |
| 拖曳物體 | 抓起來移動；鬆手會甩出 |
| 拖空白處 | 旋轉視角 |
| 滾輪 / 捏合 | 縮放 |
| 清除 | 移除所有動態物體 |
| 暫停 | 凍結模擬 |
| `1` `2` `3` | 掉落球 / 盒 / 柱 |
| `Space` | 再掉一顆目前形狀 |
| `C` 或 `Delete` | 清除 |
| `P` | 暫停 / 繼續 |

## 技術

- [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start)
- [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) + [drei](https://github.com/pmndrs/drei)
- [Rapier](https://rapier.rs/) 剛體物理（固定 1/60 步進）
- [Tailwind CSS v4](https://tailwindcss.com/) + [Zustand](https://github.com/pmndrs/zustand)
- Vite 8，部署目標 Vercel

## 本機執行

需要 **Node.js 22**。

```bash
npm install
npm run dev
```

開發伺服器預設 `http://localhost:8080`。

```bash
npm run build      # 生產建置
npm run typecheck  # TypeScript
npm run preview    # 預覽建置結果
```

## 專案結構

```
src/
  components/playground/   # 場景、剛體、拖曳、工具列
  routes/                  # TanStack Router 頁面
  styles.css               # 設計 token
public/                    # favicon、og 圖
```

## 授權

MIT
