import React, { useState } from 'react';
import { Form, Button, Select, DatePicker, InputNumber, Row, Col, Input } from 'antd';
import { useAccount, useContractReads } from 'wagmi';
import { address_map, BGT_CONTRACT, QBT_CONTRACT } from '../../constants';
const { Option } = Select;

const AuctionForm = () => {
    const [form] = Form.useForm();
    const { address } = useAccount();
    const [assets, setAssets] = useState([]);
    const [availableNFT, setAvailableNFT] = useState([]);
    const { token_address, QBT_address, BGT_address } = address_map;
    const options = [
        {
            "id": 0,
            "name": "QBToken",
            "tag": "QBT",
            "contract_address": QBT_address
        },
        {
            "id": 1,
            "name": "BoardgameToken",
            "tag": "BGT",
            "contract_address": BGT_address
        }
    ];
    const daysToTimestamp = (days) => days * 86400000;
    const onFinish = (values) => {
        // console.log('Received values from form: ', values);
        let auctionStartTimeTimestamp = values.auctionStartTime.valueOf();
        const { nftTypeID, nftTokenId, startingPrice, erc20ContractAddress, bidPeriod,
            revealPeriod } = values;
        const nftAddress = options[nftTypeID].contract_address;
        const args = [
            nftAddress,
            nftTokenId,
            erc20ContractAddress,
            auctionStartTimeTimestamp,
            bidPeriod,
            revealPeriod,
            startingPrice
        ]
    };
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const transform = (data) => {
        return data.map(item => {
            if (item.status === 'success') {
                return {
                    ...item,
                    result: item.result.map(bigIntValue => {
                        if (bigIntValue <= Number.MAX_SAFE_INTEGER) {
                            return Number(bigIntValue);
                        } else {
                            return bigIntValue;
                        }
                    })
                };
            } else {
                return item;
            }
        });
    }
    useContractReads({
        contracts: [
          {
            ...BGT_CONTRACT,
            functionName: 'tokensOfOwner',
            args: [address]
          },
          {
            ...QBT_CONTRACT,
            functionName: 'tokensOfOwner',
            args: [address]
          }
        ],
        select: (data) => transform(data),
        onSuccess(data) {
            setAssets(data);
        }
    })
    const onFormValuesChange = (changedValues) => {
        const { nftTypeID } = changedValues;
        if (assets.length > 0 && (nftTypeID || nftTypeID === 0)) { 
            const nftAssets = assets[nftTypeID];
            if (nftAssets) {
                setAvailableNFT(nftAssets.result);
                console.log(nftAssets.result)
            }
        }
    };
    return (
        <div style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
            <Form
                onValuesChange={onFormValuesChange}
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: '500px', width: '100%' }}
            >
                <Form.Item name="seller" label="Seller" rules={[{ required: true }]} initialValue={address}>
                    <Input disabled={true} ></Input>
                </Form.Item>
                <Form.Item name="nftTypeID" label="NFT Type" rules={[{ required: true }]}>
                    <Select placeholder="Select a NFT type">
                        {
                            options.map((option, index) => (
                                <Option key={option.id} value={option.id}>{`${option.tag}(${option.name})`}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Row gutter={8}>
                    <Col span={16}>
                        <Form.Item name="nftTokenId" label="NFT Token ID" rules={[{ required: true }]}>
                            <Select placeholder="Select a Token ID">
                                {
                                    availableNFT.map((token, index) => {
                                       return <Option key={index} value={token}>TokenID {token}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button type="primary">Approve</Button>
                    </Col>
                </Row>

                <Form.Item
                    name="erc20ContractAddress"
                    label="ERC20 Token"
                    rules={[{ required: true, message: 'Please select an ERC20 token!' }]}
                >
                    <Select placeholder="Select ERC20 Token">
                        <Select.Option value={token_address}>LKT</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="auctionStartTime" label="Auction Start Time" rules={[{ required: true }]}>
                    <DatePicker showTime />
                </Form.Item>

                <Form.Item name="bidPeriod" label="Bid Period" rules={[{ required: true }]}>
                    <Select placeholder="Select bid period">
                        <Option value={daysToTimestamp(3)}>3 Days</Option>
                        <Option value={daysToTimestamp(7)}>7 Days</Option>
                        <Option value={daysToTimestamp(30)}>1 Month</Option>
                        <Option value={daysToTimestamp(90)}>3 Months</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="revealPeriod" label="Reveal Period" rules={[{ required: true }]}>
                    <Select placeholder="Select reveal period">
                        <Option value={daysToTimestamp(3)}>3 Days</Option>
                        <Option value={daysToTimestamp(7)}>7 Days</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="startingPrice" label="Starting Price" rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                    <Button type="primary" htmlType="submit">
                        Create Auction
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuctionForm;
