import React, { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi'

export default function (props) {
    const { chain, chains } = useNetwork()

    return (
        <>
            {chain && <div>Connected to {chain.name}</div>}
            {chains && (
                <div>Available chains: {chains.map((chain) => chain.name)}</div>
            )}
        </>
    )
}