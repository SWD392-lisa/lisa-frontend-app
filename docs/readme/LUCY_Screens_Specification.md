# LUCY — Đặc Tả Màn Hình (Frontend → API Gateway)

> **Kiến trúc:** Mobile Flutter → API Gateway → Microservices (.NET / Java / Node.js)
> **Phiên bản:** 1.0 | Dự án: LUCY (Language Unity & Collaborative Youth)

---

## Mục Lục

1. [Onboarding & Xác thực](#1-onboarding--xác-thực)
2. [Màn hình chính (Home)](#2-màn-hình-chính-home)
3. [Khám phá phòng (Discover Rooms)](#3-khám-phá-phòng-discover-rooms)
4. [Phòng Live Audio](#4-phòng-live-audio)
5. [Hồ sơ & Cài đặt](#5-hồ-sơ--cài-đặt)
6. [Lộ trình học tập (LMS)](#6-lộ-trình-học-tập-lms)
7. [Dashboard Mentor (LUCY Pro)](#7-dashboard-mentor-lucy-pro)
8. [Podcast & Nội dung lưu trữ (LUCY Super)](#8-podcast--nội-dung-lưu-trữ-lucy-super)
9. [Ví & Thanh toán](#9-ví--thanh-toán)
10. [Bảng xếp hạng](#10-bảng-xếp-hạng)
11. [Thông báo](#11-thông-báo)

---

## 1. Onboarding & Xác thực

### 1.1 Màn hình Splash / Giới thiệu

**Mô tả:** Hiển thị logo, tagline, và slideshow tính năng khi mở app lần đầu.

**API:** Không có (static/local)

---

### 1.2 Màn hình Đăng ký (Register)

**Mô tả:** Người dùng tạo tài khoản mới. Chọn loại tài khoản: LUCY (ẩn danh), Pro, Super.

**Thành phần UI:**
- Input: Email, Password, Confirm Password
- Chọn loại tài khoản (LUCY / Pro / Super)
- Nút "Đăng ký"
- Link "Đã có tài khoản? Đăng nhập"

**API Call:**
```
POST /api/auth/register
Body: { email, password, account_type }
Service: .NET (User & Identity)
```

**Response xử lý:**
- Thành công → Chuyển sang màn hình Tạo Avatar Persona (1.4)
- Lỗi → Hiển thị inline error (email đã tồn tại, mật khẩu yếu...)

---

### 1.3 Màn hình Đăng nhập (Login)

**Mô tả:** Đăng nhập bằng email/password hoặc mạng xã hội (Google/Apple).

**Thành phần UI:**
- Input: Email, Password
- Nút "Đăng nhập"
- Nút Social Login (Google, Apple)
- Link "Quên mật khẩu?"

**API Call:**
```
POST /api/auth/login
Body: { email, password }
Service: .NET (User & Identity)
Response: { access_token, refresh_token, account_type }
```

---

### 1.4 Màn hình Tạo Avatar Persona (Ẩn danh)

**Mô tả:** Người dùng LUCY chọn Avatar ảo (tên, hình đại diện ảo) để bảo vệ danh tính.

**Thành phần UI:**
- Grid chọn Avatar (hình minh họa)
- Input: Tên hiển thị ảo (Persona Name)
- Nút "Xác nhận"

**API Call:**
```
PUT /api/users/persona
Headers: Authorization: Bearer <token>
Body: { avatar_id, persona_name }
Service: .NET
```

---

### 1.5 Màn hình Quên mật khẩu

**Thành phần UI:**
- Input: Email
- Nút "Gửi link đặt lại"

**API Call:**
```
POST /api/auth/forgot-password
Body: { email }
Service: .NET
```

---

## 2. Màn hình chính (Home)

**Mô tả:** Trang chủ sau khi đăng nhập. Hiển thị phòng đang diễn ra, gợi ý theo level, và các phòng nổi bật.

**Thành phần UI:**
- Header: Avatar Persona + Điểm kinh nghiệm (XP) + Icon thông báo
- Banner: "Phòng đang Hot" (carousel)
- Section: "Phòng phù hợp với bạn" (theo level hiện tại)
- Section: "Mentor nổi bật tuần này"
- Bottom Navigation: Home | Discover | My Learning | Profile

**API Calls:**
```
GET /api/rooms/featured
GET /api/rooms/recommended?user_level={level}
GET /api/users/mentors/top
Service: Java (Content & LMS), Node.js (Real-time status)
```

**Dữ liệu hiển thị mỗi phòng:** Tên phòng, Ngôn ngữ (EN/CN/JP), Level, Số người đang nghe, Tên Mentor, Trạng thái (LIVE / Sắp bắt đầu).

---

## 3. Khám phá phòng (Discover Rooms)

### 3.1 Danh sách phòng

**Mô tả:** Tìm kiếm và lọc tất cả phòng đang hoạt động.

**Thành phần UI:**
- Thanh tìm kiếm
- Bộ lọc: Ngôn ngữ (EN / CN / JP) | Stage (Sơ cấp / Trung cấp / Cao cấp) | Trạng thái (LIVE / Sắp tới)
- Danh sách phòng dạng card

**API Call:**
```
GET /api/rooms?language={lang}&stage={stage}&status={status}&keyword={kw}&page={n}
Service: Java (Content & LMS)
```

---

### 3.2 Chi tiết phòng (Room Preview)

**Mô tả:** Xem thông tin phòng trước khi tham gia.

**Thành phần UI:**
- Tên phòng, mô tả, ngôn ngữ, level
- Thông tin Mentor (avatar, tên, rating)
- Danh sách chủ đề (Sub-levels) trong phòng
- Số lượng người tham gia / giới hạn
- Nút "Tham gia phòng"
- Nút "Thêm vào lịch" (nếu phòng chưa bắt đầu)

**API Call:**
```
GET /api/rooms/{room_id}
Service: Java
```

---

## 4. Phòng Live Audio

**Màn hình trọng tâm của ứng dụng.**

### 4.1 Giao diện phòng (Dành cho LUCY — Ẩn danh)

**Mô tả:** Người dùng ẩn danh nghe và tương tác trong phòng.

**Thành phần UI:**
- Header: Tên phòng + Thời gian đã qua + Level hiện tại (Sub-level)
- Khu vực Mentor: Avatar, tên, mic đang bật
- Khu vực người nói (Speakers): Danh sách avatar ẩn danh đang được phát biểu
- Khu vực khán giả: Số lượng người nghe
- Thanh Sub-level Progress: Hiển thị tiến độ chặng hiện tại (10-20 phút)
- Thanh tương tác dưới:
  - 🙋 Nút "Giơ tay phát biểu"
  - 🎁 Nút "Tặng quà ảo"
  - 🔇 Nút Mute/Unmute mic (khi được phép nói)
  - 🚪 Nút Rời phòng

**API Calls:**
```
POST /api/rooms/{room_id}/join
  Service: Node.js → Agora SDK (lấy token audio)
  Response: { agora_token, channel_name }

POST /api/rooms/{room_id}/raise-hand
  Service: Node.js (Socket.io)

POST /api/rooms/{room_id}/gifts
  Body: { gift_id, recipient_id }
  Service: .NET (trừ ví) + Node.js (broadcast hiệu ứng)

DELETE /api/rooms/{room_id}/leave
  Service: Node.js
```

**Real-time Events (Socket.io):**
- `room:user_joined` — cập nhật số người
- `room:stage_changed` — chuyển sang Sub-level mới
- `room:speaker_changed` — cập nhật ai đang nói
- `room:gift_received` — hiển thị hiệu ứng quà
- `room:hand_approved` — được phép bật mic

---

### 4.2 Giao diện phòng (Dành cho LUCY Pro — Mentor)

**Mô tả:** Mentor điều hành phòng, quản lý người nói và nội dung.

**Thành phần UI (bổ sung so với 4.1):**
- Panel AI Suggest: Gợi ý câu hỏi thảo luận từ tài liệu LISA/Chinese/Japanese
- Danh sách người giơ tay (xếp hàng) + nút "Cho phép nói" / "Từ chối"
- Nút "Chuyển Stage tiếp theo" (hoặc tự động sau countdown)
- Nút "Ghim tài liệu / Slide" vào phòng
- Nút "Kết thúc phòng"
- Mini dashboard: Số người đang nghe, tổng quà nhận được

**API Calls:**
```
POST /api/rooms/create
  Body: { title, language, stage, level_ids[], duration_minutes }
  Service: Java

PUT /api/rooms/{room_id}/approve-speaker
  Body: { user_id }
  Service: Node.js

PUT /api/rooms/{room_id}/next-stage
  Service: Node.js + Java

POST /api/rooms/{room_id}/pin-document
  Body: { document_id }
  Service: Java

GET /api/ai/suggestions?level_id={id}
  Service: Java (AI Support)

DELETE /api/rooms/{room_id}/end
  Service: Node.js + Java
```

---

### 4.3 Giao diện phòng (Dành cho LUCY Super — Content Creator)

**Mô tả:** Bao gồm toàn bộ quyền Pro + thêm tính năng ghi âm.

**Thành phần UI (bổ sung):**
- Nút "⏺ Bắt đầu ghi âm" / "⏹ Dừng ghi âm"
- Indicator đang ghi âm (màu đỏ nhấp nháy)
- Sau phòng: Popup "Lưu thành Podcast?"

**API Calls:**
```
POST /api/rooms/{room_id}/recording/start
  Service: Node.js (Agora Cloud Recording)

POST /api/rooms/{room_id}/recording/stop
  Service: Node.js
  Response: { recording_url }

POST /api/podcasts
  Body: { room_id, title, description, is_premium }
  Service: Java
```

---

## 5. Hồ sơ & Cài đặt

### 5.1 Trang hồ sơ cá nhân

**Thành phần UI:**
- Avatar Persona + Tên hiển thị
- Badge loại tài khoản (LUCY / Pro / Super)
- Thống kê: Tổng giờ học | Số phòng đã tham gia | XP tích lũy
- Các ngôn ngữ đang học + Level hiện tại (EN/CN/JP)
- Lịch sử phòng đã tham gia
- (Pro/Super) Lịch sử phòng đã tổ chức + tổng quà nhận

**API Call:**
```
GET /api/users/me
GET /api/users/me/stats
GET /api/users/me/history
Service: .NET + Java
```

---

### 5.2 Cài đặt tài khoản

**Thành phần UI:**
- Đổi Avatar / Persona Name
- Cài đặt thông báo
- Ngôn ngữ ứng dụng
- Quyền riêng tư (xác nhận ẩn danh)
- Đổi mật khẩu
- Đăng xuất / Xóa tài khoản

**API Calls:**
```
PUT /api/users/me/settings
PUT /api/auth/change-password
DELETE /api/users/me
Service: .NET
```

---

## 6. Lộ trình học tập (LMS)

### 6.1 Màn hình My Learning

**Mô tả:** Hiển thị lộ trình học 100 Level theo từng ngôn ngữ, tiến độ của người dùng.

**Thành phần UI:**
- Tab chọn ngôn ngữ: English (LISA) | Chinese | Japanese
- Cây lộ trình (Learning Tree): 3 Stage × nhiều Level
  - Stage 1 — Sơ cấp (Level 1-33): Survival Speaking
  - Stage 2 — Trung cấp (Level 34-66)
  - Stage 3 — Cao cấp (Level 67-100)
- Mỗi Level: icon trạng thái (Chưa học / Đang học / Hoàn thành), tên chủ đề
- Nút "Tìm phòng cho Level này"

**API Call:**
```
GET /api/lms/languages/{lang}/levels?user_id={id}
Service: Java (Content & LMS)
Response: [{ level_id, title, stage, status, progress_pct }]
```

---

### 6.2 Chi tiết Level

**Mô tả:** Xem nội dung học của một Level cụ thể.

**Thành phần UI:**
- Tiêu đề Level + Stage
- Danh sách Sub-topics (chặng 10-20 phút)
- Từ vựng / cụm từ chính
- Tài liệu đính kèm (từ file LISA/Chinese/Japanese)
- Nút "Tìm phòng Live cho Level này"

**API Call:**
```
GET /api/lms/levels/{level_id}
Service: Java
```

---

## 7. Dashboard Mentor (LUCY Pro)

### 7.1 Quản lý phòng của tôi

**Mô tả:** Mentor xem, tạo, chỉnh sửa các phòng của mình.

**Thành phần UI:**
- Danh sách phòng đã/đang/sắp tổ chức
- Thống kê mỗi phòng: Số lượt tham gia, tổng giờ dạy, tổng quà nhận
- Nút "Tạo phòng mới"
- Nút "Xem chi tiết"

**API Calls:**
```
GET /api/rooms/mine
POST /api/rooms
Service: Java + Node.js
```

---

### 7.2 Tạo phòng mới

**Thành phần UI:**
- Input: Tên phòng, mô tả
- Chọn ngôn ngữ (EN / CN / JP)
- Chọn Stage (Sơ cấp / Trung cấp / Cao cấp)
- Chọn các Level sẽ dạy (multi-select)
- Thời lượng phòng (60 / 90 / 120 phút)
- Đặt lịch (ngay bây giờ / chọn thời gian)
- Giới hạn số người tham gia
- Nút "Tạo phòng"

**API Call:**
```
POST /api/rooms
Body: { title, description, language, stage, level_ids[], duration, scheduled_at, max_participants }
Service: Java
```

---

### 7.3 Quản lý học viên trong phòng (In-room Dashboard)

*(Tích hợp vào màn hình 4.2 — xem phần Phòng Live)*

---

## 8. Podcast & Nội dung lưu trữ (LUCY Super)

### 8.1 Danh sách Podcast

**Mô tả:** Người dùng nghe lại các buổi Live đã được ghi âm và xuất bản thành Podcast.

**Thành phần UI:**
- Tab: Miễn phí | Premium
- Danh sách Podcast (thumbnail, tiêu đề, ngôn ngữ, thời lượng, tên tác giả)
- Bộ lọc: Ngôn ngữ | Level | Tác giả

**API Call:**
```
GET /api/podcasts?type={free|premium}&language={lang}&level={level}
Service: Java
```

---

### 8.2 Nghe Podcast

**Thành phần UI:**
- Tiêu đề + thông tin Podcast
- Audio player (Play/Pause, tua, tốc độ nghe)
- Nội dung ghi chú / transcript (nếu có)
- Nút Subscribe tác giả
- Nút Tặng quà tác giả

**API Calls:**
```
GET /api/podcasts/{podcast_id}
  Service: Java
  Response: { audio_url, metadata }

POST /api/podcasts/{podcast_id}/gift
  Body: { gift_id }
  Service: .NET
```

---

### 8.3 Quản lý Podcast của tôi (Super)

**Thành phần UI:**
- Danh sách Podcast đã xuất bản
- Thống kê: Lượt nghe, Doanh thu từ Premium
- Nút "Chỉnh sửa" / "Ẩn" / "Xóa"
- Nút "Tạo chuỗi nội dung" (Series)

**API Calls:**
```
GET /api/podcasts/mine
PUT /api/podcasts/{podcast_id}
DELETE /api/podcasts/{podcast_id}
Service: Java
```

---

## 9. Ví & Thanh toán

### 9.1 Màn hình Ví (Wallet)

**Mô tả:** Quản lý số dư, lịch sử giao dịch.

**Thành phần UI:**
- Số dư hiện tại (đơn vị: LUCY Coin)
- Nút "Nạp tiền"
- Tab: Lịch sử nạp tiền | Lịch sử tặng quà | Lịch sử nhận quà

**API Call:**
```
GET /api/wallet/balance
GET /api/wallet/transactions?type={topup|sent|received}&page={n}
Service: .NET
```

---

### 9.2 Nạp tiền

**Thành phần UI:**
- Chọn gói nạp (ví dụ: 20k / 50k / 100k / 200k)
- Chọn phương thức thanh toán (VNPay / MoMo / Card)
- Nút "Xác nhận thanh toán"

**API Call:**
```
POST /api/wallet/topup
Body: { amount, payment_method }
Service: .NET
Response: { payment_url }
→ Mở WebView / redirect đến cổng thanh toán
```

---

### 9.3 Cửa hàng quà tặng (Gift Shop)

**Mô tả:** Mua và tặng quà ảo cho Mentor trong phòng Live.

**Thành phần UI:**
- Grid quà ảo (icon, tên, giá LUCY Coin)
- Hiệu ứng animation preview

**API Calls:**
```
GET /api/gifts
POST /api/gifts/send
  Body: { gift_id, recipient_id, room_id }
  Service: .NET (trừ ví) → Node.js (broadcast animation)
```

---

## 10. Bảng xếp hạng

**Mô tả:** Hiển thị top Mentor/Creator được nhận nhiều quà nhất, top học viên tích cực.

**Thành phần UI:**
- Tab: Mentor | Learner | Weekly | All-time
- Danh sách top 100: Rank, Avatar, Tên Persona, Điểm/Quà nhận, Level

**API Call:**
```
GET /api/leaderboard/mentors?period={weekly|alltime}&page={n}&pageSize={n}
Service: .NET (User & Payment)
```

---

## 11. Thông báo

**Thành phần UI:**
- Danh sách thông báo (có phân loại: Hệ thống | Phòng | Quà | Học tập)
- Trạng thái đã đọc / chưa đọc
- Action khi nhấn (điều hướng đến phòng, level, ví...)

**API Call:**
```
GET /api/notifications?page={n}
PUT /api/notifications/{id}/read
PUT /api/notifications/read-all
Service: .NET
```

---

## Tổng hợp API Gateway — Routing

| Prefix | Service đích | Ghi chú |
|---|---|---|
| `/api/auth/*` | .NET Core | Login, Register, Token |
| `/api/users/*` | .NET Core | Identity, Persona, Settings |
| `/api/wallet/*` | .NET Core | Ví, thanh toán, quà tặng |
| `/api/gifts/*` | .NET Core + Node.js | Giao dịch quà |
| `/api/rooms/*` | Java + Node.js | CRUD phòng, join, leave |
| `/api/lms/*` | Java | 100 Level, nội dung học |
| `/api/podcasts/*` | Java + Node.js | Ghi âm, lưu trữ, nghe |
| `/api/ai/*` | Java | Gợi ý câu hỏi AI |
| `/api/leaderboard/*` | .NET Core | Xếp hạng Mentor theo giao dịch quà |
| `/api/notifications/*` | .NET Core | Push notification |
| `wss://gateway/rooms/*` | Node.js (Socket.io) | Real-time events |

---

## Ghi chú kỹ thuật cho Frontend

- **Authentication:** Mọi request (trừ `/api/auth/*`) đều cần header `Authorization: Bearer <access_token>`.
- **Ẩn danh tuyệt đối:** Frontend KHÔNG bao giờ gửi thông tin định danh thật lên Node.js hoặc Java. .NET Service chỉ trả về `anonymous_token` để xác thực phòng.
- **Real-time:** Sử dụng Socket.io client, kết nối đến `wss://gateway` sau khi có `agora_token` từ `POST /api/rooms/{id}/join`.
- **Agora Audio:** Flutter sử dụng Agora Flutter SDK, khởi tạo channel bằng `agora_token` và `channel_name` nhận từ API.
- **Pagination:** Mặc định `page=1&limit=20` cho tất cả danh sách.
- **Lỗi chuẩn:** API Gateway trả về định dạng `{ success, message, data, error_code }`.
