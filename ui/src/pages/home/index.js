import React, { useEffect } from 'react';
import { useContractWrite, useContractRead } from 'wagmi'
import { tokenizedVickeryAuctionABI, mockErc721ABI, wagmipetABI } from '../../generated';
import Mint from '../mint';

export default function () {
    const auction_address = "0x507Fb449addCCa4aC89a838d1B5f134425d63124";
    const auction_test_get_address = "0xC89FdcC3a5C92cc7Fd2bbFB22a099871416B86d2";
    const erc721_address = "0xEC1fbD2a33b3a6be983e0209dA7e14b28454575c";
    const { isLoading, isSuccess, write } = useContractWrite({
        address: auction_address,
        abi: tokenizedVickeryAuctionABI,
        functionName: 'createAuction',
    })
    const { write: approveWrite } = useContractWrite({
        address: erc721_address,
        abi: mockErc721ABI,
        functionName: 'approve',
    })
    const handleClick = () => {
        write({
            args: [
                erc721_address, // tokenContract
                1,                                          // tokenId
                "0x40CA1cd6482790f79b4bd862070Ef1236274625F", // erc20Token
                1701589170,                                     // startTime
                86400,                                          // bidPeriod
                43200,                                          // revealPeriod
                1                                          // reservePrice
            ],
        })
    }
    const handleApprove = () => {
        approveWrite({
            args: [
                auction_address, // to which address we approve
                1
            ]
        })
    }
    // const { data, isError } = useContractRead({
    //     address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    //     abi: wagmipetABI,
    //     functionName: 'getAlive',
    //     onSuccess(data) {
    //         console.log(data)
    //     }
    // })
    const { data , isError} = useContractRead({
        address: '0x2518A509fc06328E2BA70ABE5C010CaaADB9C4B9',
        abi: tokenizedVickeryAuctionABI,
        functionName: 'getAllAuctions',
        onSuccess(data) {
            console.log(data)
        }
    })
    const handleViewAuction = () => {
        
    }
    return (
        <div>
            <Mint />
            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleClick}>Create Auction</button>
            <button onClick={handleViewAuction}>View Auction</button>
            {data}
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}

        </div>
    )
}