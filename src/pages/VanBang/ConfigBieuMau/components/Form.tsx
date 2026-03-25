import { Form, Input, InputNumber, Select, Button, Table } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

interface FormProps {
  form?: any;
  initialValue?: Partial<ConfigBieuMauVanBang.IRecord>;
}

const ConfigBieuMauForm: React.FC<FormProps> = ({ form, initialValue }) => {
  const [fieldsForm] = Form.useForm();

  useEffect(() => {
    if (form && initialValue) {
      form.setFieldsValue({
        ten: initialValue.ten,
        mieuTa: initialValue.mieuTa,
        trangThaiSuDung: initialValue.trangThaiSuDung,
      });
      fieldsForm.setFieldsValue({
        cacTruong: initialValue.cacTruong || [],
      });
    }
  }, [form, initialValue, fieldsForm]);

  const columns = [
    {
      title: 'Tên trường',
      dataIndex: 'ten',
      width: 200,
      render: (_: any, __: any, index: number) => (
        <Form.Item name={[index, 'ten']} noStyle rules={[{ required: true }]}>
          <Input placeholder="Tên trường" />
        </Form.Item>
      ),
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      width: 150,
      render: (_: any, __: any, index: number) => (
        <Form.Item name={[index, 'kieuDuLieu']} noStyle rules={[{ required: true }]}>
          <Select placeholder="Chọn kiểu dữ liệu">
            <Select.Option value="STRING">Ký tự</Select.Option>
            <Select.Option value="NUMBER">Số</Select.Option>
            <Select.Option value="DATE">Ngày</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'doBatBuoc',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Form.Item name={[index, 'doBatBuoc']} valuePropName="checked" noStyle>
          <input type="checkbox" />
        </Form.Item>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'thuTu',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Form.Item name={[index, 'thuTu']} noStyle rules={[{ required: true }]}>
          <InputNumber min={1} />
        </Form.Item>
      ),
    },
    {
      title: 'Thao tác',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const fields = fieldsForm.getFieldValue('cacTruong');
            fieldsForm.setFieldsValue({
              cacTruong: fields.filter((_: any, i: number) => i !== index),
            });
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Form.Item
        name="ten"
        label="Tên biểu mẫu"
        rules={[{ required: true, message: 'Vui lòng nhập tên biểu mẫu' }]}
      >
        <Input placeholder="VD: Biểu mẫu văn bằng cơ bản" />
      </Form.Item>

      <Form.Item name="mieuTa" label="Mô tả">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item name="trangThaiSuDung" valuePropName="checked">
        <input type="checkbox" /> Sử dụng
      </Form.Item>

      <Form.Item label="Cấu hình các trường thông tin">
        <Form form={fieldsForm}>
          <Form.List name="cacTruong">
            {(fields, { add, remove }) => (
              <>
                <Table
                  columns={columns}
                  dataSource={fields.map((field) => ({
                    ...field,
                  }))}
                  pagination={false}
                  bordered
                />
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                  style={{ marginTop: 16 }}
                >
                  Thêm trường
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Form.Item>
    </>
  );
};

export default ConfigBieuMauForm;
