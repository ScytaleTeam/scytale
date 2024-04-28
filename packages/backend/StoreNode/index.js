const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('node:fs');
const { ethers } = require("ethers");
const chainConfig = require("../chainConfig.json");
require('dotenv').config()
const sha256 = require('js-sha256');
const scytaleArtifact = require("../../hardhat/artifacts/contracts/Scytale.sol/Scytale.json");

const port = process.env.PORT || 8080;
const app = express();
app.use(
    cors()
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const folderName = "./files";

app.post("/postMessage", async (req, res) => {
    try {

        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }

        const messageHash = sha256(req.body.message);
        fs.writeFileSync(`${folderName}/${messageHash}`, req.body.message);

        return res.status(200).json({
            messageHash: messageHash,
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json("Error!");
    }

});


app.get("/getMessage", async (req, res) => {
    try {

        const data = fs.readFileSync(`${folderName}/${req.query.messageHash}`, 'utf8');
        return res.status(200).json(data);
    } catch (e) {
        console.error(e.message);
        return res.status(500).json("Error!");
    }

});


async function setupSigner() {
    const provider = new ethers.JsonRpcProvider(chainConfig.providerUrl);
    let signer = new ethers.Wallet(process.env.PRIVATE_KEY);
    signer = signer.connect(provider);
    console.log("Signer address: ", await signer.getAddress());
    return signer;
}


async function initializeEthers() {
    const signer = await setupSigner();
    try {
        const scytale = new ethers.Contract(chainConfig.scytaleAddress, scytaleArtifact.abi, signer);

        vrf.on("RandomRequested", async (value) => {
            try {
                console.log("Random requested: ", value);
                let randValue = Math.floor(Math.random() * 100000);
                await vrf.submitRandom(value, randValue);
                console.log("successful on: ", value);
            } catch (e) {

            }

        })


    } catch (e) {
        console.error("Error: ", e.message);
    }
}

initializeEthers();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
