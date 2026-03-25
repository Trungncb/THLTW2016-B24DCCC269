import { Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

interface FormProps {
  form?: any;
  initialValue?: Partial<QuyetDinhTotNghiep.IRecord>;
  soVanBangId?: string;
}

const QuyetDinhTotNghiepForm: React.FC<FormProps> = ({ form, initialValue, soVanBangId }) => {
  useEffect(() => {
    if (form && initialValue) {
      form.setFieldsValue({
        ...initialValue,
        ngayBanHanh: initialValue.ngayBanHanh ? moment(initialValue.ngayBanHanh) : undefined,
      });
    }
  }, [form, initialValue]);

  return (
    <>
      <Form.Item
        name="soQD"
        label="Số quyết định"
        rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
      >
        <Input placeholder="VD: 001/QĐ-..." />
      </Form.Item>

      <Form.Item
        name="nam"
        label="Năm"
        rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
      >
        <InputNumber min={2000} max={2099} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="dot"
        label="Số đợt"
        rules={[{ required: true, message: 'Vui lòng nhập số đợt' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="ngayBanHanh"
        label="Ngày ban hành"
        rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="trichYeu"
        label="Trích yếu"
        rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
      >
        <Input.TextArea rows={3} placeholder="Nội dung tóm tắt của quyết định" />
      </Form.Item>

      <Form.Item
        name="soHocVienDuDKi"
        label="Số học viên dự kiến"
        rules={[{ required: true, message: 'Vui lòng nhập số học viên' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="ghiChu" label="Ghi chú">
        <Input.TextArea rows={2} />
      </Form.Item>
    </>
  );
};

export default QuyetDinhTotNghiepForm;
