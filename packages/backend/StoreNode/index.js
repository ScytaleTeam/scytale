const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('node:fs');
const { ethers } = require("ethers");
const chainConfig = require("../chainConfig.json");
require('dotenv').config()
const sha256 = require('js-sha256');
const mockVrfArtifact = require("../../hardhat/artifacts/contracts/MockVRF.sol/MockVRF.json");

const port = process.env.PORT || 8080;
const app = express();
app.use(
    cors()
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/postMessage", async (req, res) => {
    try {
        const folderName = "./files";
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

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
