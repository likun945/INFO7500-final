import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'antd';
import { useContractRead } from 'wagmi'
import { tokenizedVickeryAuctionABI } from '../../generated';
import { address_map } from '../../constants'

export default function () {
    const [tableData, setTableData] = useState()
    const { auction_address } = address_map;
    const [loading, setLoading] = useState(true);
    const columns = [
        {
            title: 'Index',
            dataIndex: 'key',
            key: 'key'
        },
        {
          title: 'Seller',
          dataIndex: 'seller',
          key: 'seller',
        },
        {
          title: 'Auction Start time',
          dataIndex: 'startTime',
          key: 'startTime',
          render: (timeStamp) => <span>{convertTimeStampToDate(timeStamp)}</span>
        },
        {
            title:'Reveal Time',
            dataIndex: 'endOfRevealPeriod',
            key: 'endOfRevealPeriod',
            render: (timeStamp) => <span>{convertTimeStampToDate(timeStamp)}</span>
        },
        {
            title: 'Time to Reveal Bids',
            dataIndex: 'timeUntilRevealEnds',
            key: 'timeUntilRevealEnds',
            render: renderCountDown
        },
        {
          title: 'Auction End Time',
          dataIndex: 'endOfBiddingPeriod',
          key: 'endOfBiddingPeriod',
          render: (timeStamp) => <span>{convertTimeStampToDate(timeStamp)}</span>
        },
        {
            title: 'Time to Auction Close',
            dataIndex: 'timeUntilAuctionEnds',
            key: 'timeUntilAuctionEnds',
            render: (seconds) => {
                const days = Math.floor(seconds / (3600 * 24));
                const hours = Math.floor((seconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                if (days > 0) {
                    return <span>{days}d {hours}h</span>;
                } else {
                    return <span>{hours}h {minutes}m {secs}s</span>;
                }
            }
        },
        {
            title: 'Status',
            width: 150,
            render: (record) => {
                const currentTime = Math.floor(Date.now() / 1000);
                let status, text;
        
                if (currentTime < record.startTime) {
                    // 拍卖未开始
                    status = "default";
                    text = "Pending";
                } else if (currentTime >= record.startTime && currentTime < record.endOfBiddingPeriod) {
                    // 拍卖正在进行
                    status = "processing";
                    text = "In Progress";
                } else if (currentTime >= record.endOfBiddingPeriod && currentTime < record.endOfRevealPeriod) {
                    // 揭示阶段
                    status = "success";
                    text = "Revealing";
                } else {
                    // 拍卖已结束
                    status = "error";
                    text = "Finished";
                }
                return <Badge status={status} text={text} />;
            }
        }         
    ];
    useContractRead({
        address: auction_address,
        abi: tokenizedVickeryAuctionABI,
        functionName: 'getAllAuctions',
        isRefetching: true,
        staleTime: 2000,
        onSuccess(data) {
            if(!data) {
                return;
            }
            const formattedData = data.map((auction, index) => {
                const highestBid = Number(auction.highestBid);
                const indexNumber = Number(auction.index);
                const numUnrevealedBids = Number(auction.numUnrevealedBids);
                const secondHighestBid = Number(auction.secondHighestBid);
                const currentTime = Math.floor(Date.now() / 1000);
                return {
                    ...auction,
                    highestBid,
                    index: indexNumber,
                    numUnrevealedBids,
                    secondHighestBid,
                    key: index + 1, // 或使用其他生成的唯一标识符
                    timeUntilRevealEnds: Math.max(0, auction.endOfRevealPeriod - currentTime),
                    timeUntilAuctionEnds: Math.max(0, auction.endOfBiddingPeriod - currentTime)
                };
            });
            setTableData(formattedData);
            setLoading(false);
        }
    })
    useEffect(() => {
        const updateCountdown = () => {
            if(tableData) {
                const newTableData = tableData.map(auction => ({
                    ...auction,
                    timeUntilAuctionEnds: Math.max(auction.timeUntilAuctionEnds - 1, 0),
                    timeUntilRevealEnds: Math.max(auction.timeUntilRevealEnds - 1, 0)
                }));
                setTableData(newTableData);
            }
        };

        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval); 
    }, [tableData]);

    const convertTimeStampToDate = (timeStamp) => {
        const date = new Date(timeStamp * 1000);
        return date.toISOString().replace('T', ' ').substring(0, 19);
    }
    function renderCountDown(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (days > 0) {
            return <span>{days}d {hours}h {minutes}m</span>;
        } else {
            return <span>{hours}h {minutes}m {secs}s</span>;
        }
    }
    return (
        <div>
            <Table loading={loading} columns={columns} dataSource={tableData}></Table>
        </div>
    )
}