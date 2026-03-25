import { Form, Input, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

interface FormProps {
  form?: any;
  initialValue?: Partial<ThongTinVanBang.IRecord>;
  configFields?: ConfigBieuMauVanBang.IField[];
  quyetDinhOptions?: any[];
}

const ThongTinVanBangForm: React.FC<FormProps> = ({
  form,
  initialValue,
  configFields = [],
  quyetDinhOptions = [],
}) => {
  useEffect(() => {
    if (form && initialValue) {
      const formValues: any = {
        maSinhVien: initialValue.maSinhVien,
        hoTen: initialValue.hoTen,
        ngaySinh: initialValue.ngaySinh ? moment(initialValue.ngaySinh) : undefined,
        soHieuVanBang: initialValue.soHieuVanBang,
        quyetDinhId: initialValue.quyetDinhId,
      };

      // Thêm các trường động
      configFields.forEach((field) => {
        const value = (initialValue.cacTruongDong || {})[field.ten];
        if (field.kieuDuLieu === 'DATE' && value) {
          formValues[`custom_${field.ten}`] = moment(value);
        } else {
          formValues[`custom_${field.ten}`] = value;
        }
      });

      form.setFieldsValue(formValues);
    }
  }, [form, initialValue, configFields]);

  return (
    <>
      <Form.Item
        name="quyetDinhId"
        label="Quyết định"
        rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
      >
        <Select placeholder="Chọn quyết định tốt nghiệp">
          {quyetDinhOptions.map((qd) => (
            <Select.Option key={qd._id} value={qd._id}>
              {qd.soQD} - Năm {qd.nam} - Đợt {qd.dot}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="maSinhVien"
        label="Mã sinh viên"
        rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
      >
        <Input placeholder="VD: 20210001" />
      </Form.Item>

      <Form.Item
        name="hoTen"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input placeholder="Họ và tên sinh viên" />
      </Form.Item>

      <Form.Item
        name="ngaySinh"
        label="Ngày sinh"
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
        <Input placeholder="Sẽ được tự động tạo" disabled />
      </Form.Item>

      {/* Các trường động từ cấu hình biểu mẫu */}
      {configFields.map((field) => (
        <Form.Item
          key={field._id}
          name={`custom_${field.ten}`}
          label={field.ten}
          rules={field.doBatBuoc ? [{ required: true, message: `Vui lòng nhập ${field.ten}` }] : []}
        >
          {field.kieuDuLieu === 'STRING' && (
            <Input placeholder={`Nhập ${field.ten}`} />
          )}
          {field.kieuDuLieu === 'NUMBER' && (
            <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${field.ten}`} />
          )}
          {field.kieuDuLieu === 'DATE' && (
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          )}
        </Form.Item>
      ))}
    </>
  );
};

export default ThongTinVanBangForm;
