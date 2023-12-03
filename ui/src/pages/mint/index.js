import React from 'react';
import { useContractWrite } from 'wagmi'
import { mockErc721ABI } from '../../generated';

export default function () {
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0xEC1fbD2a33b3a6be983e0209dA7e14b28454575c',//nft address
        abi: mockErc721ABI,
        functionName: 'mint',
    })
    const handleClick = () => {
        write({
            args: ["0x94d3130C53288921Cd620b00f1e6Fd95aA8ACF2d"]
        })
    }
    return (
        <div>
            <button onClick={handleClick}>Mint</button>
        </div>
    )
}