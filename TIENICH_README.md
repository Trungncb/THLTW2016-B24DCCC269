# Ứng Dụng Quản Lý Dịch Vụ (Salon, Spa, Khám Bệnh, v.v.)

## 📋 Giới Thiệu

Ứng dụng quản lý dịch vụ là một hệ thống toàn diện cho phép:
- Quản lý nhân viên và lịch làm việc
- Quản lý danh sách các dịch vụ
- Đặt và quản lý lịch hẹn
- Đánh giá dịch vụ và nhân viên
- Xem thống kê và báo cáo doanh thu

## 🏗️ Cấu Trúc Dự Án

### Models (`src/models/tienich/`)

1. **staff.ts** - Quản lý nhân viên
   - Thêm/Sửa/Xóa nhân viên
   - Lưu thông tin chức vụ, giờ làm việc

2. **service.ts** - Quản lý dịch vụ
   - Thêm/Sửa/Xóa dịch vụ
   - Lưu giá, thời lượng dịch vụ

3. **booking.ts** - Quản lý lịch hẹn
   - Đặt lịch hẹn mới
   - Kiểm tra xung đột lịch
   - Cập nhật trạng thái lịch hẹn

4. **rating.ts** - Quản lý đánh giá
   - Thêm đánh giá từ khách hàng
   - Phản hồi từ nhân viên
   - Tính đánh giá trung bình

### Services (`src/services/TienIch/`)

- **staff.ts** - API cho nhân viên
- **service.ts** - API cho dịch vụ
- **booking.ts** - API cho lịch hẹn
- **rating.ts** - API cho đánh giá
- **index.ts** - API cho thống kê

### Components (`src/components/TienIch/`)

1. **StaffManagement** - Giao diện quản lý nhân viên
2. **ServiceManagement** - Giao diện quản lý dịch vụ
3. **BookingManagement** - Giao diện quản lý lịch hẹn
4. **RatingManagement** - Giao diện đánh giá & phản hồi
5. **Statistics** - Giao diện thống kê & báo cáo

### Pages (`src/pages/TienIch/`)

- **index.tsx** - Trang chính với các tab

## 💾 Lưu Trữ Dữ Liệu

Dữ liệu được lưu trữ trong `localStorage` với các key:
- `staff` - Danh sách nhân viên
- `service` - Danh sách dịch vụ
- `booking` - Danh sách lịch hẹn
- `rating` - Danh sách đánh giá

## 🔧 Các Functionality

### 1. Quản Lý Nhân Viên & Dịch Vụ

#### Thêm/Sửa/Xóa Nhân Viên
```typescript
const { staffList, addStaff, updateStaff, deleteStaff } = useStaff();

// Thêm nhân viên mới
addStaff({
  name: 'Nguyễn Văn A',
  position: 'Thợ cắt tóc',
  phone: '0123456789',
  email: 'a@example.com',
  workingHours: '9h-17h'
});
```

#### Thêm/Sửa/Xóa Dịch Vụ
```typescript
const { serviceList, addService, updateService, deleteService } = useService();

// Thêm dịch vụ mới
addService({
  name: 'Cắt tóc',
  description: 'Cắt tóc nam',
  price: 50000,
  duration: 30 // phút
});
```

### 2. Quản Lý Lịch Hẹn

#### Đặt Lịch Hẹn
```typescript
const { addBooking, checkConflict } = useBooking();

// Kiểm tra xung đột
const isConflict = checkConflict(staffId, '2025-03-18', '10:00', '10:30');

if (!isConflict) {
  addBooking({
    staffId: 1,
    serviceId: 1,
    customerName: 'Trần Văn B',
    customerPhone: '0987654321',
    date: '2025-03-18',
    startTime: '10:00',
    endTime: '10:30',
    status: 'pending'
  });
}
```

#### Kiểm Tra Xung Đột Lịch
Hệ thống tự động kiểm tra:
- Không cho phép đặt lịch khi nhân viên đang bận
- Không cho phép các lịch trùng thời gian

### 3. Đánh Giá Dịch Vụ & Nhân Viên

#### Thêm Đánh Giá
```typescript
const { addRating } = useRating();

addRating({
  bookingId: 1,
  staffId: 1,
  serviceId: 1,
  score: 5,
  comment: 'Dịch vụ rất tốt!',
  staffReply: 'Cảm ơn bạn!'
});
```

#### Xem Đánh Giá Trung Bình
```typescript
const { getAverageRating, getStaffRatings } = useRating();

// Lấy đánh giá trung bình của nhân viên
const avgRating = getAverageRating(staffId);

// Lấy tất cả đánh giá của nhân viên
const ratings = getStaffRatings(staffId);
```

### 4. Thống Kê & Báo Cáo

Các chỉ tiêu theo dõi:
- **Số lượng lịch hẹn theo ngày/tháng** - Xem xu hướng khách hàng
- **Doanh thu theo dịch vụ & nhân viên** - Phân tích hiệu quả kinh doanh
- **Biểu đồ** - Trực quan hóa dữ liệu

## 📊 Thông Tin Dữ Liệu

### Staff Interface
```typescript
interface Staff {
  id?: number;
  name: string;
  phone?: string;
  email?: string;
  position?: string;
  workingHours?: string; // "9h-17h"
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Service Interface
```typescript
interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  duration?: number; // in minutes
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Booking Interface
```typescript
interface Booking {
  id?: number;
  staffId: number;
  serviceId: number;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Rating Interface
```typescript
interface Rating {
  id?: number;
  bookingId: number;
  staffId: number;
  serviceId: number;
  score: number; // 1-5
  comment?: string;
  staffReply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🚀 Sử Dụng

1. Điều hướng đến trang TienIch trong ứng dụng
2. Sử dụng các tab để:
   - Quản lý nhân viên
   - Quản lý dịch vụ
   - Đặt lịch hẹn
   - Xem đánh giá
   - Xem thống kê

## 📝 Ghi Chú

- Dữ liệu được lưu trong localStorage (tạm thời)
- Để deploy production, cần kết nối API backend thực tế
- Cần cập nhật API endpoints trong `src/services/TienIch/`
- Type definitions được khai báo trong `src/typings.d.ts`

## 🔄 Tương Lai

Để hoàn thành ứng dụng:
1. Kết nối với backend API thực tế
2. Thêm xác thực người dùng
3. Thêm khả năng gửi email/SMS thông báo
4. Thêm tính năng book online cho khách hàng
5. Thêm thanh toán trực tuyến
