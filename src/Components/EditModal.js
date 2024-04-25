import React, {useEffect} from "react";
import { Button, Col, Form, Input, Modal, Row} from "antd";

const EditModal = ({ showPopup, setShowPopup, editItemCallback, item}) => {

  const [editForm] = Form.useForm()

  useEffect(() => {
      const itemPrice = parseInt(item?.price?.split('$')?.[1])
      const itemValue = parseInt(item?.value?.split('$')?.[1])
      editForm.setFieldsValue({
          category: item?.category,
          price: itemPrice || null,
          quantity: item?.quantity,
          value: itemValue || null
      })
  }, [item, showPopup, editForm])

  const submitForm = (values) => {
    const parsedValues = {
        ...values,
        price: parseInt(values?.price),
        values: parseInt(values?.value),
        quantity: parseInt(values?.quantity)
    }
    editItemCallback(item?.id, parsedValues)
    handleCancel()
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Modal
        title={"Edit Product"}
        open={showPopup}
        onCancel={handleCancel}
        closable={true}
        footer={false}
        width={"400px"}
      >
        <div className={'edit-modal-content-main'}>
            <h4>{item?.name}</h4>
            <Form
                form={editForm}
                onFinish={submitForm}
                layout={'vertical'}
                requiredMark={false}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={'Category'}
                            name='category'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter category'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Price'}
                            name='price'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter price'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Quantity'}
                            name='quantity'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter quantity'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={'Value'}
                            name='value'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter value'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify={'end'} gutter={16}>
                    <Col>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Col>
                    <Col>
                        <Button htmlType={'submit'} type={'primary'}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
      </Modal>

    </>
  );
};

export default EditModal;
