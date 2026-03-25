# Ứng dụng Quản lý Sổ Văn Bằng Tốt Nghiệp

## Mô tả dự án
Ứng dụng giúp phòng chuyên viên Quản lý sổ văn bằng tốt nghiệp và người dùng tra cứu thông tin văn bằng.

## Cấu trúc thư mục

```
src/
├── models/vanbang/
│   ├── sovanbang.ts                 # Model quản lý sổ văn bằng
│   ├── quyetdinhtotghiep.ts         # Model quyết định tốt nghiệp
│   ├── configbieumauvanbang.ts      # Model cấu hình biểu mẫu
│   ├── thongtinvanbang.ts           # Model thông tin văn bằng
│   ├── tracuuvanbang.ts             # Model tra cứu văn bằng
│   ├── index.ts                     # Export models
│   └── typings.d.ts                 # Type definitions
├── services/VanBang/
│   ├── sovanbang.ts                 # API service sổ văn bằng
│   ├── quyetdinhtotghiep.ts         # API service quyết định
│   ├── configbieumauvanbang.ts      # API service cấu hình
│   ├── thongtinvanbang.ts           # API service thông tin
│   └── tracuuvanbang.ts             # API service tra cứu
├── pages/VanBang/
│   ├── SoVanBang/
│   │   ├── components/Form.tsx      # Form thêm/sửa sổ
│   │   └── index.tsx                # Page danh sách sổ
│   ├── QuyetDinhTotNghiep/
│   │   ├── components/Form.tsx      # Form thêm/sửa quyết định
│   │   └── index.tsx                # Page danh sách quyết định
│   ├── ConfigBieuMau/
│   │   ├── components/Form.tsx      # Form cấu hình biểu mẫu
│   │   └── index.tsx                # Page danh sách cấu hình
│   ├── ThongTinVanBang/
│   │   ├── components/Form.tsx      # Form thêm/sửa thông tin
│   │   └── index.tsx                # Page danh sách thông tin
│   ├── TraCuuVanBang/
│   │   ├── index.tsx                # Page tra cứu văn bằng
│   │   └── index.less               # Style tra cứu
│   ├── constant.ts                  # Constants cho module
│   └── index.tsx                    # Layout wrapper
```

## Các chức năng chính

### 1. Quản lý Sổ Văn Bằng (SoVanBang)
- **Mở sổ mới** cho mỗi năm
- **Tự động tăng** số vào sổ, reset về 1 khi mở sổ mới
- **Quản lý trạng thái** sổ (Mở/Đóng)
- **Ghi chú** thông tin về sổ

**Fields:**
- `nam`: Năm
- `soThuTu`: Số thứ tự sổ
- `soDangMo`: Số dòng đã được cấp
- `trangThaiMo`: Trạng thái (MO/DONG)
- `ngayMo`: Ngày mở sổ
- `ngayDong`: Ngày đóng sổ

### 2. Quyết Định Tốt Nghiệp (QuyetDinhTotNghiep)
- **Quản lý đợt tốt nghiệp** - mỗi đợt có 1 quyết định
- **Lưu thông tin QĐ**: Số QĐ, ngày ban hành, trích yếu
- **Liên kết** với sổ văn bằng

**Fields:**
- `soQD`: Số quyết định
- `nam`: Năm
- `dot`: Số đợt
- `soVanBangId`: Reference đến sổ
- `ngayBanHanh`: Ngày ban hành
- `trichYeu`: Trích yếu nội dung
- `soHocVienDuDKi`: Số học viên dự kiến

### 3. Cấu Hình Biểu Mẫu (ConfigBieuMauVanBang)
- **Quản trị viên cấu hình** các trường thông tin
- **Kiểu dữ liệu**: String, Number, Date
- **Thêm/Sửa/Xóa** trường thông tin
- **Ví dụ**: Dân tộc, Nơi sinh, Điểm trung bình, Ngày nhập học

**Fields:**
- `ten`: Tên biểu mẫu
- `mieuTa`: Mô tả
- `cacTruong`: Danh sách các trường
  - `ten`: Tên trường
  - `kieuDuLieu`: Kiểu dữ liệu (STRING/NUMBER/DATE)
  - `doBatBuoc`: Bắt buộc hay không
  - `thuTu`: Thứ tự hiển thị
- `trangThaiSuDung`: Trạng thái sử dụng

### 4. Thông Tin Văn Bằng (ThongTinVanBang)
- **Quản lý bằng tốt nghiệp** của sinh viên
- **Fields mặc định** (5 trường):
  - Số vào sổ (tự động, không chỉnh sửa)
  - Số hiệu văn bằng
  - Mã sinh viên
  - Họ tên
  - Ngày sinh
- **Fields động** từ cấu hình biểu mẫu
- **Import/Export** dữ liệu từ Excel

**Fields:**
- `soVaoSo`: Số vào sổ (tự động tăng)
- `soHieuVanBang`: Số hiệu văn bằng
- `maSinhVien`: Mã sinh viên
- `hoTen`: Họ tên
- `ngaySinh`: Ngày sinh
- `quyetDinhId`: Reference đến quyết định
- `cacTruongDong`: Các trường động từ cấu hình

### 5. Tra Cứu Văn Bằng (TraCuuVanBang)
- **Người dùng tra cứu** (ít nhất 2 tham số)
- **Tham số tìm kiếm**:
  - Số hiệu văn bằng
  - Số vào sổ
  - Mã sinh viên
  - Họ tên
  - Ngày sinh
- **Ghi nhận lượt tra cứu** theo quyết định
- **Thống kê tra cứu**

## API Endpoints

### Sổ Văn Bằng
- `GET /api/so-van-bang` - Danh sách
- `GET /api/so-van-bang/:id` - Chi tiết
- `POST /api/so-van-bang` - Tạo mới
- `PUT /api/so-van-bang/:id` - Cập nhật
- `DELETE /api/so-van-bang/:id` - Xóa
- `POST /api/so-van-bang/open/:nam` - Mở sổ mới
- `PUT /api/so-van-bang/:id/close` - Đóng sổ

### Quyết Định Tốt Nghiệp
- `GET /api/quyet-dinh-tot-nghiep` - Danh sách
- `GET /api/quyet-dinh-tot-nghiep/:id` - Chi tiết
- `POST /api/quyet-dinh-tot-nghiep` - Tạo mới
- `PUT /api/quyet-dinh-tot-nghiep/:id` - Cập nhật
- `DELETE /api/quyet-dinh-tot-nghiep/:id` - Xóa

### Cấu Hình Biểu Mẫu
- `GET /api/config-bieu-mau-van-bang` - Danh sách
- `GET /api/config-bieu-mau-van-bang/current` - Cấu hình hiện tại
- `POST /api/config-bieu-mau-van-bang` - Tạo mới
- `PUT /api/config-bieu-mau-van-bang/:id` - Cập nhật
- `DELETE /api/config-bieu-mau-van-bang/:id` - Xóa

### Thông Tin Văn Bằng
- `GET /api/thong-tin-van-bang` - Danh sách
- `GET /api/thong-tin-van-bang/:id` - Chi tiết
- `POST /api/thong-tin-van-bang` - Tạo mới
- `PUT /api/thong-tin-van-bang/:id` - Cập nhật
- `DELETE /api/thong-tin-van-bang/:id` - Xóa
- `POST /api/thong-tin-van-bang/import` - Import từ Excel
- `GET /api/thong-tin-van-bang/export/:quyetDinhId` - Export thành Excel

### Tra Cứu Văn Bằng
- `GET /api/tra-cuu-van-bang/search` - Tìm kiếm
- `GET /api/tra-cuu-van-bang/thong-ke` - Thống kê
- `POST /api/tra-cuu-van-bang` - Ghi nhận tra cứu

## Routing

### Menu
```
Văn Bằng (/van-bang)
├── Sổ Văn Bằng (/van-bang/so-van-bang)
├── Quyết Định Tốt Nghiệp (/van-bang/quyet-dinh-tot-nghiep)
├── Cấu Hình Biểu Mẫu (/van-bang/config-bieu-mau)
├── Thông Tin Văn Bằng (/van-bang/thong-tin-van-bang)
└── Tra Cứu (/van-bang/tra-cuu)
```

## Công nghệ sử dụng
- **Frontend**: React, TypeScript, Ant Design, UMI
- **State Management**: UMI Models (DVA)
- **API Client**: axios (via umi request)
- **UI Components**: Ant Design Pro Components

## Hạn chế / TODO
- [ ] Implement backend APIs
- [ ] Tích hợp upload/download Excel
- [ ] Quyền truy cập (role-based access control)
- [ ] PDF generation cho biểu mẫu
- [ ] Quy trình ký số điện tử
- [ ] Thống kê/Dashboard tổng quát
- [ ] Audit log cho các thay đổi

## Chú ý
1. **Số vào sổ** được tự động tăng dần theo sổ, không được chỉnh sửa thủ công
2. **Số hiệu văn bằng** cần được sinh tự động từ năm, số sổ, số vào sổ
3. **Minh bạch dữ liệu**: Phải ghi nhận lịch sử tra cứu cho mục đích kiểm tra
4. **Validation**: Phải kiểm tra tối thiểu 2 tham số trước khi tra cứu

## Tác giả
Tạo cho bài tập: RIPT1307-20252-04
Hạn nộp: 25/03/2026 17h
