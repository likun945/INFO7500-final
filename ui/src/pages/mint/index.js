import React, { useEffect } from 'react';
import { Button, Input, Select, Row, Col, Form } from 'antd';
import { useContractWrite } from 'wagmi';
import { mockErc721ABI } from '../../generated';
import { useAccount } from 'wagmi'

const { Option } = Select;

export default function MintNFT() {
    const [form] = Form.useForm();
    const { address } = useAccount()
    const { write } = useContractWrite({
        address: '0xEC1fbD2a33b3a6be983e0209dA7e14b28454575c', // NFT 合约地址
        abi: mockErc721ABI,
        functionName: 'mint',
    });

    const handleMint = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
                // write({
                //   args: [values.recipientAddress]
                // });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };
    const handleUseDefaultAddress = () => {
        form.setFieldsValue({
            recipientAddress: address,
        });
    };
    useEffect(() => {
        console.log(address)
        if (address) {
            form.setFieldsValue({
                recipientAddress: address,
            });
        }
    }, [address, form]);
    return (
        <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12} offset={6}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Recipient Address"
                        name="recipientAddress"
                        rules={[{ required: true, message: 'Please input the recipient address!' }]}
                    >
                        <Input
                            placeholder="Enter recipient address"
                        />
                    </Form.Item>
                    <Form.Item
                        label="NFT Type"
                        name="nftType"
                        rules={[{ required: true, message: 'Please select the NFT type!' }]}
                    >
                        <Select
                            placeholder="Choose NFT type"
                            onChange={value => form.setFieldsValue({ nftType: value })}
                        >
                            <Option value="type1">NFT Type 1</Option>
                            <Option value="type2">NFT Type 2</Option>
                            <Option value="type3">NFT Type 3</Option>
                            {/* 更多 NFT 类型选项 */}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block onClick={handleMint}>
                            Mint NFT
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
