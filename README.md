# Teacher Management System

Bài test khóa học **WEB98** — Hệ thống quản lý giáo viên (Full-stack: React + Node.js/Express + MongoDB).

## Cấu trúc dự án

```
TeacherManagementSystem/
├── backend/                    # API server (Express + Mongoose)
│   ├── index.js                # Entry point, kết nối MongoDB, mount routes, CORS
│   ├── models/
│   │   ├── users.model.js          # Schema người dùng
│   │   ├── teachers.model.js       # Schema giáo viên (code tối đa 10 ký tự)
│   │   └── teacherPositions.model.js # Schema vị trí/chức vụ giáo viên
│   ├── controllers/
│   │   ├── teachers.controller.js      # GET/POST /teachers
│   │   └── teacherPositions.controller.js # GET/POST /teacher-positions
│   └── routes/
│       ├── teachers.route.js
│       └── teacherPositions.route.js
└── frontend/                   # React (Vite)
    └── src/
        ├── App.jsx             # Trang quản lý giáo viên
        ├── App.css             # Style: header, bảng, drawer, phân trang
        └── index.css
```

## Tính năng

### Backend (port 3000)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET  | `/teachers` | Danh sách giáo viên (code, name, email, phoneNumber, state, degrees) |
| POST | `/teachers` | Tạo giáo viên mới — `code` tối đa 10 ký tự & duy nhất (tự sinh nếu bỏ trống), `email` phải duy nhất |
| GET  | `/teacher-positions` | Danh sách vị trí/chức vụ |
| POST | `/teacher-positions` | Tạo vị trí mới — `code` phải duy nhất |

### Frontend (port 5173)
- **Header**: thanh tìm kiếm (lọc theo mã, tên, email, số điện thoại, học vị) + nút **Create new**.
- **Drawer form**: thêm giáo viên mới, các trường bắt buộc đánh dấu `*`:
  ID (code, max 10 ký tự), Name, Email, Phone number, Degree type, Degree major.
- **Bảng**: hiển thị đúng các trường bắt buộc ở form.
- **Phân trang**: 10 giáo viên mỗi trang.

## Yêu cầu môi trường

- Node.js >= 18
- Kết nối mạng tới MongoDB Atlas

## Cài đặt & chạy

```powershell
# 1. Backend
cd backend
npm install
node index.js
# Server is running on port 3000
# Connected to MongoDB with mongoose

# 2. Frontend (terminal khác)
cd frontend
npm install
npm run dev
# http://localhost:5173
```

Mở trình duyệt tại **http://localhost:5173**.

> Lưu ý: phải chạy backend trước/cùng lúc với frontend.

## Ghi chú kỹ thuật

- **MongoDB connection**: dùng connection string dạng `mongodb://` (chỉ rõ 3 shard host) thay vì `mongodb+srv://`, vì một số máy không phân giải được bản ghi DNS SRV của Atlas (lỗi `querySrv ECONNREFUSED`). Database: `WEB98-FinalTest`.
- **Schema khớp DB thật**: `teachers` dùng các field `userId`, `teacherPositionsId`, và `degrees` là **mảng** object `{ type, school, major, year, isGraduated }`.
- **CORS**: backend cho phép mọi origin (phục vụ dev, có thể siết chặt khi production).

## Công nghệ

- **Backend**: Express 5, Mongoose 9
- **Frontend**: React 19, Vite 8
- **Database**: MongoDB Atlas
