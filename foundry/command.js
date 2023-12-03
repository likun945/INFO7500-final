var rpc_url = "https://eth-sepolia.g.alchemy.com/v2/Ar08CeP55EpgbRw1Osj_41IpKQr-PO_J";
var etherscan_api_key = "4PDHGGUZ1UGCHPZXMFP7P4X2MHGTBBI2Q3";
var private_key = "a59e8f9d8d52750eab1cb8e66bce676600ddb8d89eabdd818af1c2b8d82b0a47";

var command = "forge create src/TokenizedVickeryAuction.sol:TokenizedVickeryAuction";
var c = "forge create src/MockERC20.sol:MockERC20 --rpc-url https://eth-sepolia.g.alchemy.com/v2/iwQs6UfJLzwSt5bxcc8aBw8g0xCvJsWD --private-key a59e8f9d8d52750eab1cb8e66bce676600ddb8d89eabdd818af1c2b8d82b0a47";


const erc720address = "0xEC1fbD2a33b3a6be983e0209dA7e14b28454575c";

const command_deploy_auction = 
"forge create src/WagmitPet.sol:Wagmipet --rpc-url https://eth-sepolia.g.alchemy.com/v2/nZ_BUOB0QRFF1VXy0A6Gj0kBJi7znXwP --private-key a59e8f9d8d52750eab1cb8e66bce676600ddb8d89eabdd818af1c2b8d82b0a47 --etherscan-api-key 4PDHGGUZ1UGCHPZXMFP7P4X2MHGTBBI2Q3 \
--verify"
