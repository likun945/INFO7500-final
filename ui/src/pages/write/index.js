import { useContractWrite } from 'wagmi'
import { tokenizedVickeryAuctionABI } from '../../generated';

export function Write() {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x2A7d1A1a06E45e7bE294355F0211F1a8A6200c4E',
    abi: tokenizedVickeryAuctionABI,
    functionName: 'createAuction',
  })
}
