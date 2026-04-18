# 💹 SmartFX Frontend — Real-time Arbitrage Detection

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://plozdev.github.io/SmartFxApplicationFE/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SmartFX** là giao diện người dùng hiện đại của hệ thống phát hiện chênh lệch tỷ giá (Arbitrage) và tìm đường đổi tiền tối ưu. Ứng dụng mang lại trải nghiệm mượt mà với khả năng xử lý dữ liệu thời gian thực và trực quan hóa các đường đi tỉ giá phức tạp.

---

## 🌟 Key Features

- **🚀 Optimal Exchange Finder:** Tìm kiếm lộ trình đổi tiền có tỷ giá tốt nhất thông qua nhiều bước trung gian (USD → EUR → JPY).
- **⚠️ Arbitrage Detection:** Hệ thống cảnh báo tức thì khi phát hiện cơ hội lợi nhuận (Negative Cycles) trong thị trường.
- **⏱️ Real-time Market Pulse:** Cập nhật dữ liệu tỷ giá mỗi 30 giây từ FastForex API.
- **📱 Premium UX/UI:** Thiết kế theo phong cách Glassmorphism, hỗ trợ Dark Mode và tương thích hoàn toàn với Mobile.
- **📊 Activity Logging:** Theo dõi lịch sử giao dịch và kết quả phân tích thuật toán.

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | **React 19** (với StrictMode & Concurrent Rendering) |
| **Language** | **TypeScript** (Strict Mode) |
| **Styling** | **Tailwind CSS 4.0** (Modern JIT engine) |
| **State Management** | **Zustand** (Lightweight & Reactive) |
| **Animations** | **Motion** (Framer Motion alternative for performance) |
| **Icons** | **Lucide React** |
| **Deployment** | **GitHub Actions** (CI/CD) |

---

## 🔬 Technical Highlight: Arbitrage Detection

Ứng dụng không chỉ đổi tiền đơn thuần. Nó kết nối với Backend để xử lý một bài toán đồ thị phức tạp:
- **Graph Algorithm:** Sử dụng thuật toán **SPFA (Shortest Path Faster Algorithm)** để tìm chu trình âm.
- **Mathematical Transformation:** Tỷ giá được biến đổi qua hàm số `log` để chuyển bài toán nhân (tỷ giá) sang bài toán cộng (đồ thị), cho phép phát hiện cơ hội lợi nhuận một cách chính xác tuyệt đối.

---

## 🚀 Getting Started

1. **Clone project:**
   ```bash
   git clone https://github.com/plozdev/SmartFxApplicationFE.git
   ```
2. **Setup Environment:** Tạo file `.env`
   ```env
   VITE_BACKEND_URL=https://smartfx-115054620142.us-central1.run.app
   ```
3. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```

---

## 📸 Preview

### 1. Giao diện đổi tiền thông minh
![SmartFX Dashboard](https://github.com/user-attachments/assets/9c775422-03b3-4735-9b86-e0d16eade4e0)

### 2. Phát hiện chu trình Arbitrage
![Arbitrage Alert](https://github.com/user-attachments/assets/9fcd937e-d42a-4130-9078-b6a177a56d49)

---

## 🔗 Related Projects
- **Backend (Spring Boot):** [SmartFXApplication](https://github.com/plozdev/SmartFXApplication)
