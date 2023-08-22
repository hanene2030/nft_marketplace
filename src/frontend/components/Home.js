import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'



// Setup
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "ah-4Wq4nc8ulnU-cIiSuBKxWY1wW1kXU",
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);


const my_adress = '0x7893f5B49C7A8C8C31d102664E89E5e3D5d7a9fD'
const mark_adress = '0x7893f5B49C7A8C8C31d102664E89E5e3D5d7a9fD'
const nft_adress = '0x34F99adc5b57b7bdc130d5714Cf37F2eA0dF91Fa'
const my_account_adress = '0x7A76B702aCB1C4E4241781aF6F3472Ce90E6fBd7'


// Flag to omit metadata
const omitMetadata = false;

// Get all NFTs
let response = await alchemy.nft.getNftsForContract(nft_adress, {
  omitMetadata: omitMetadata,
});

let nfts = response.nfts


console.log("----------")
console.log(nfts)
console.log("----------")



const transform_to_item = (dataItem) =>{

 let  item =  {
    "itemId": dataItem.tokenId ,
    "tokenId" :dataItem.tokenId ,
    // "totalPrice": dataItem.rawMetadata.price,
    "seller" : dataItem.seller,
     "sold": false,
    //  "name": "",
    //  "description": "",
    //  "image": ""
}

// let  item = 
// {
//   uint itemId;
//   IERC721 nft;
 
// }
return item
}


const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []



    for (let i = 0; i <= nfts.length-1; i++) {
      const item = transform_to_item(nfts[i])
      console.log('--------------',i)
      // console.log(item)

      if ( !item.sold) {
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        console.log('^^^coooll^')
        console.log(item)
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)

        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }

    //push owned ones 

    //push available on the market


    console.log("------From here----")

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      //console.log(item)
      if (false && !item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        console.log('^^^coooll^')
        console.log(item)
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home