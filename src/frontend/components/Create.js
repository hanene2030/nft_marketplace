import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'

// import fs from "fs";

import { v4 as uuidv4 } from 'uuid';
import { Web3Storage, getFilesFromPath } from 'web3.storage'
// const webStorageClient = require('webStorage-http-client');
// const projectId = 'first_test';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEwY0Q2NzE0NTIzZmVlMzhlZjdBOGJGRkNCOUJhZWVDMGExMjY4NTciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTI2MTQ3MTgxMDgsIm5hbWUiOiJmaXJzdF90ZXN0In0.A-qHbOVBLA4jZF514R55tAKLpnGrcJKFYmrOc4bPBdU'

function makeGatewayURLImage(imgCID, imgName) {
  return `https://${imgCID}.ipfs.w3s.link/${imgName}`;
}

/* Function for gateway URL for json */
function makeGatewayURLJSON(jsonCID, jsonName) {
  return `https://${jsonCID}.ipfs.w3s.link/${jsonName}`;
}

// Construct with token and endpoint
const client = new Web3Storage({ token: API_TOKEN })

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadTowebStorage = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {


        // const result = await client.add(file)
        // console.log(result)
        // setImage(`https://api.web3.storage/pins/${result.path}`)
        const ext = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${ext}`;
        const newFile = new File([file], fileName, {type: file.type});
        const cid = await client.put([newFile], {
            name: fileName,
        });
        const imageURI = `https://${cid}.ipfs.dweb.link/${fileName}`;
        console.log(imageURI)
        setImage(imageURI);





      } catch (error){
        console.log("webStorage image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      
      // const result = await client.add(JSON.stringify({image, price, name, description}))


      //const result = await client.put(JSON.stringify({image, price, name, description}));
      const metadata = JSON.stringify({image, price, name, description})
            /* conversion to json file using fs*/
            // const element = document.createElement("a");
            const textFile = new Blob([[metadata], {type: 'text/plain'}]); //pass data from localStorage API to blob
            // element.href = URL.createObjectURL(textFile);
            // element.download = "userFile.txt";
            // document.body.appendChild(element); 
            // element.click();
      //fs.writeFileSync("metadata.json", JSON.stringify(metadata));

      /* Get file from path for json */
      //const json = await getFilesFromPath("./metadata.json");
      /* Get json name from path */
      const jsonName = 'metadata.json'//json[0].name;

      /* get jsonCID from web3.storage */
      console.log('---------1')
      const file = new File([metadata], jsonName, { type: 'application/json' })
      const cid = await client.put([file])
    //   const jsonCID = await client.put([metadata], {
    //     name: 'metadata.json',
        
    // });
    console.log('---------2')
      //console.log("jsonCID: ", jsonCID);
      /* Make gateway URL for json */
      //const jsonURL = makeGatewayURLJSON(cid, jsonName);
      //console.log('jsonURL: ',jsonURL);




      mintThenList(cid, jsonName)


    } catch(error) {
      console.log("webStorage uri upload error: ", error)
    }
  }
  const mintThenList = async (cid, fileName) => {
    //const uri = result//` https://api.web3.storage/pins/${result.path}`
    const metadata_uri = `https://${cid}.ipfs.dweb.link/${fileName}`;
    console.log('metadata_uri ',metadata_uri)
    // mint nft 
    await(await nft.mint(metadata_uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadTowebStorage}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create