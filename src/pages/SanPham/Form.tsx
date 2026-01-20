import { Form, Input, InputNumber, Button, Space } from 'antd';
import { useModel } from 'umi';

interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
}

const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const { handleSaveProduct, handleCloseModal, editingProduct, isEdit } =
    useModel('sanpham');

  // Set initial values when editing
  React.useEffect(() => {
    if (isEdit && editingProduct) {
      form.setFieldsValue({
        name: editingProduct.name,
        price: editingProduct.price,
        quantity: editingProduct.quantity,
      });
    } else {
      form.resetFields();
    }
  }, [isEdit, editingProduct, form]);

  const onFinish = (values: ProductFormData) => {
    handleSaveProduct(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark="optional"
    >
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h2>

      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên sản phẩm!',
          },
          {
            min: 3,
            message: 'Tên sản phẩm phải có ít nhất 3 ký tự!',
          },
        ]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Giá"
        name="price"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập giá!',
          },
          {
            type: 'number',
            min: 0,
            message: 'Giá phải là số dương!',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Nhập giá"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>

      <Form.Item
        label="Số lượng"
        name="quantity"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập số lượng!',
          },
          {
            type: 'number',
            min: 1,
            message: 'Số lượng phải là số nguyên dương!',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Nhập số lượng"
          min={1}
          step={1}
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
