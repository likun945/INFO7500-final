import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { generateCommitment } from '../../utils';
import { useContractWrite, useContractRead, useAccount } from 'wagmi';
import { AUCTION_CONTRACT } from '../../constants';
import { ethers } from 'ethers';
import Web3 from 'web3';

const RevealBidModal = ({ isVisible, onClose, auctionInfo }) => {
    const [bidPrice, setBidPrice] = useState(0.01); // 初始化为最小值
    const [nonce, setNonce] = useState('');
    const [foundRecord, setFoundRecord] = useState(false);
    const { toWei } = Web3.utils;
    const { address } = useAccount();
    // const c = generateCommitment(
    //     "test",
    //     toWei(5, "ether"),
    //     "0x2f698cb14d8150785accbed9d9544999631ec0df",
    //     10,
    //     1
    // )
    // console.log(c)
    const { write: revealBid } = useContractWrite({
        ...AUCTION_CONTRACT,
        functionName: 'revealBid',
        onSuccess(data) {
            console.log(data);
        }
    })
    useContractRead({
        ...AUCTION_CONTRACT,
        functionName: 'getBid',
        args: [
            auctionInfo.nftType,
            auctionInfo.nftId,
            auctionInfo.index,
            address
        ],
        onSuccess(data) {
            console.log(data);
        }
    })
    const handleSubmit = () => {
        if (nonce === 'test') {
            const nonceBytes32 = ethers.utils.formatBytes32String(nonce);
            const commitment = generateCommitment(nonce, toWei(5, "ether"), auctionInfo.nftType, auctionInfo.nftId, auctionInfo.index);
            console.log(commitment);
            const args = [
                auctionInfo.nftType,
                ethers.BigNumber.from(auctionInfo.nftId).toString(), // tokenId, 转换为字符串
                ethers.utils.parseUnits("5", "ether").toString(),
                nonceBytes32
            ];
            revealBid({ args })
            // setFoundRecord(true);
            // message.success('Bid record found!');
        } else {
            setFoundRecord(false);
            message.error('Nonce is incorrect, please retry.');
        }
    };

    return (
        <Modal
            title="Reveal Your Bid"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Reveal
                </Button>
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="NFT Type">
                    <Input value={auctionInfo.nftType} disabled />
                </Form.Item>
                <Form.Item label="NFT ID">
                    <Input value={auctionInfo.nftId} disabled />
                </Form.Item>
                <Form.Item label="Bid Price">
                    <InputNumber
                        min={0.01}
                        step={0.01}
                        value={bidPrice}
                        onChange={value => setBidPrice(value)}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item label="Nonce">
                    <Input value={nonce} onChange={e => setNonce(e.target.value)} />
                </Form.Item>
                {foundRecord && <p>Bid record found!</p>}
            </Form>
        </Modal>
    );
};

export default RevealBidModal;
