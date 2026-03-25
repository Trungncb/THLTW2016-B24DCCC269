import { Form, Input, InputNumber, Select, DatePicker } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

interface FormProps {
  form?: any;
  initialValue?: Partial<SoVanBang.IRecord>;
  isEdit?: boolean;
}

const SoVanBangForm: React.FC<FormProps> = ({ form, initialValue, isEdit = false }) => {
  useEffect(() => {
    if (form && initialValue) {
      form.setFieldsValue({
        ...initialValue,
        ngayMo: initialValue.ngayMo ? moment(initialValue.ngayMo) : undefined,
        ngayDong: initialValue.ngayDong ? moment(initialValue.ngayDong) : undefined,
      });
    }
  }, [form, initialValue]);

  return (
    <>
      <Form.Item
        name="nam"
        label="Năm"
        rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
      >
        <InputNumber min={2000} max={2099} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="soThuTu"
        label="Số thứ tự sổ"
        rules={[{ required: true, message: 'Vui lòng nhập số thứ tự' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="ngayMo"
        label="Ngày mở"
        rules={[{ required: true, message: 'Vui lòng chọn ngày mở' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      {isEdit && (
        <>
          <Form.Item name="soDangMo" label="Số dòng đã cấp">
            <InputNumber min={0} disabled style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="trangThaiMo"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="MO">Mở</Select.Option>
              <Select.Option value="DONG">Đóng</Select.Option>
            </Select>
          </Form.Item>

          {(initialValue?.trangThaiMo === 'DONG' || form?.getFieldValue('trangThaiMo') === 'DONG') && (
            <Form.Item name="ngayDong" label="Ngày đóng">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          )}
        </>
      )}

      <Form.Item name="ghiChu" label="Ghi chú">
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  );
};

export default SoVanBangForm;
