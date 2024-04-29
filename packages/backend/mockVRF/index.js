const { ethers } = require("ethers");
const chainConfig = require("../chainConfig.json");
require('dotenv').config()
const mockVrfArtifact = require("../../hardhat/artifacts/contracts/MockVRF.sol/MockVRF.json");

const rpc = process.env.SCROLL_SEPOLIA_RPC || chainConfig.providerUrl;


async function setupSigner() {
    const provider = new ethers.JsonRpcProvider(rpc);
    let signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    signer = signer.connect(provider);
    console.log("Signer address: ", await signer.getAddress());
    return signer;
}

async function main() {
    const signer = await setupSigner();
    try {
        const vrf = new ethers.Contract(chainConfig.vrfAddress, mockVrfArtifact.abi, signer);

        vrf.on("RandomRequested", async (value) => {
            try {
                console.log("Random requested: ", value);
                let randValue = Math.floor(Math.random() * 100000);
                await vrf.submitRandom(value, randValue);
                console.log("successful on: ", value);
            } catch (e) {
                console.log("Error: ", e.message);
            }

        })


    } catch (e) {
        console.error("Error: ", e.message);
    }
}


main();