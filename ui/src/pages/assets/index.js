import React, { useState } from 'react';
import { Button, Statistic, Flex, Spin, List, Avatar, Col, Segmented, Row } from 'antd';
import Web3 from 'web3';
import { useContractRead } from 'wagmi'
import { mockErc20ABI } from '../../generated';
import { address_map } from '../../constants'
import { QqOutlined } from '@ant-design/icons';
import pic from '../../../src/random.png';

export default function Assets() {
    const [tokenAmount, setTokenAmount] = useState('')
    const [showWei, setShowWei] = useState(true);
    const { token_address } = address_map;
    const { isLoading } = useContractRead({
        address: token_address,
        abi: mockErc20ABI,
        functionName: 'balanceOf',
        args: ['0x94d3130C53288921Cd620b00f1e6Fd95aA8ACF2d'],
        onSuccess(data) {
            setTokenAmount(data);
        }
    })
    const { fromWei } = Web3.utils;
    const handleClick = () => {
        setShowWei(!showWei);
        console.log(fromWei(tokenAmount, "ether"))
    }
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    return (
        <div style={{ background: '#eee' }}>
            <Spin tip="Loading..." spinning={isLoading}>

                <Flex gap="middle" justify='space-around' style={{ 'marginTop': '20px', 'paddingTop': '20px', 'paddingBottom': '20px' }}>
                    <div>
                        <Statistic title="Account Balance(LKToken)" value={showWei ? tokenAmount + ' wei' : fromWei(tokenAmount, "ether")} />
                        <Button onClick={handleClick}>Convert</Button>
                    </div>
                    <Statistic title="NFT quantity" value={6} />
                </Flex>
            </Spin>
            <Segmented
                options={[
                    {
                        label: (
                            <div style={{ padding: 4 }}>
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<QqOutlined />} />
                                <div>QBT</div>
                            </div>
                        ),
                        value: 'user3',
                    },
                    {
                        label: (
                            <div style={{ padding: 4 }}>
                                <Avatar src={pic} />
                                <div>BGT</div>
                            </div>
                        ),
                        value: 'user1',
                    }
                ]}
            />            
            <Row>
                <Col span={16} offset={4}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                    title={<span href="https://ant.design">{item.title}</span>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
}