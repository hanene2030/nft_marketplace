
// Setup
const { Network, Alchemy } = require('alchemy-sdk');

const settings = {
    apiKey: "ah-4Wq4nc8ulnU-cIiSuBKxWY1wW1kXU",
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// Get the latest block
const latestBlock = alchemy.core.getBlockNumber();

my_adress = '0x7893f5B49C7A8C8C31d102664E89E5e3D5d7a9fD'
mark_adress = '0x7893f5B49C7A8C8C31d102664E89E5e3D5d7a9fD'
nft_adress = '0xAa1328a04159B11867595b465FA587A837FAC1cc'
my_account_adress = '0x7A76B702aCB1C4E4241781aF6F3472Ce90E6fBd7'
// Get all outbound transfers for a provided address
// alchemy.core
//     .getTokenBalances(my_account_adress)
//     .then(console.log);

// Get all the NFTs owned by an address
// const nfts =  alchemy.nft.getNftsForOwner(my_account_adress).then(d => console.log(d.ownedNfts));

const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";

// Flag to omit metadata
const omitMetadata = false;

// Get all NFTs
let nfts = []
alchemy.nft.getNftsForContract(nft_adress, {
  omitMetadata: omitMetadata,
}).then((d)=> {nfts = d.nfts

    console.log(nfts)

});





// alchemy.nft
//   .getNftsForContract(nft_adress)
//   .then(console.log);

// Listen to all new pending transactions
// alchemy.ws.on(
//     { method: "alchemy_pendingTransactions",
//     fromAddress: my_adress },
//     (res) => console.log(res)
// );
// var request = require('request');


// const my_url = 'https://eth-sepolia.g.alchemy.com/v2/ah-4Wq4nc8ulnU-cIiSuBKxWY1wW1kXU/getNFTs/?owner=0x7A76B702aCB1C4E4241781aF6F3472Ce90E6fBd7'


// const data =  {
//   "method": "alchemy_getAssetTransfers",
//   "params": [
//     {
//       "category": [
//         "external"
//       ],
//       "withMetadata": false,
//       "excludeZeroValue": true,
//       "fromAddress": "0x7A76B702aCB1C4E4241781aF6F3472Ce90E6fBd7"
//     }
//   ]
// }
// console.log("-------------------")                
// request.post({
//   // headers: {'content-type' : 'application/x-www-form-urlencoded'},
//   url:     my_url,
//   // body:    data
// }, function(error, response, body){
//   console.log(body);
// });