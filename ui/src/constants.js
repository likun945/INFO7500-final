import { boardGameNftABI, mockErc721ABI, tokenizedVickeryAuctionABI } from './generated';
export const address_map = {
    auction_address: '0x507Fb449addCCa4aC89a838d1B5f134425d63124',
    QBT_address: '0x2f698CB14D8150785AcCbEd9d9544999631ec0dF',
    BGT_address: '0xab9b88e591AE6Df69F9B0765d83112814e22Ed05', //Boardgame token(NFT)
    token_address: '0x40CA1cd6482790f79b4bd862070Ef1236274625F',
    user_address: '0x94d3130C53288921Cd620b00f1e6Fd95aA8ACF2d'
}

export const AUCTION_CONTRACT = {
    address: address_map.auction_address,
    abi: tokenizedVickeryAuctionABI,
}

export const BGT_CONTRACT = {
    address: address_map.BGT_address,
    abi: boardGameNftABI,
}
export const QBT_CONTRACT = {
    address: address_map.QBT_address,
    abi: mockErc721ABI,
}