import React from 'react';
import { Button, Flex } from 'antd';
import { SketchOutlined, MoneyCollectOutlined, TagOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function () {
    const navigate = useNavigate();

    return (
        <div style={{ margin: '15px' }}>
            <Flex 
                wrap="wrap" 
                gap="small" 
                className="site-button-ghost-wrapper"
                style={{ justifyContent: 'space-between' }}
            >
                <Flex wrap="wrap" gap="small" >
                    <Button
                        type="default"
                        icon={<SketchOutlined />}
                        onClick={() => navigate('/mint-nft')}
                    >
                        Mint NFT
                    </Button>
                    <Button
                        type="dashed"
                        icon={<MoneyCollectOutlined />}
                        onClick={() => navigate('/mint-erc20')}
                    >
                        Mint ERC20 token
                    </Button>
                    <Button
                        type="primary"
                        icon={<TagOutlined />}
                        onClick={() => navigate('/auction')}
                    >
                        Start Auction
                    </Button>
                </Flex>

                <Button
                    type="ghost"
                    icon={<EyeOutlined />}
                    onClick={() => navigate('/view-assets')}
                >
                    View My Assets
                </Button>
            </Flex>
        </div>
    )
}
