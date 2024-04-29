const { ethers } = require("ethers");
const chainConfig = require("../chainConfig.json");
require('dotenv').config()
const alertVerifierArtifact = require("../../hardhat/artifacts/contracts/AlertVerifier.sol/AlertVerifier.json");
const axios = require("axios");
const sha256 = require('js-sha256');

//node index.js PRIVATE_KEY
//or it can be added to env
const args = process.argv;
const privateKeyArg = args[2];

async function setupSigner() {
    const provider = new ethers.JsonRpcProvider(chainConfig.providerUrl);
    let signer = new ethers.Wallet(privateKeyArg ? privateKeyArg : process.env.PRIVATE_KEY);
    signer = signer.connect(provider);
    console.log("Signer address: ", await signer.getAddress());
    return signer;
}

async function checkData(url, hash) {
    try {
        const response = await axios.get(url);
        const resData = response.data;
        const tryHash = sha256(resData);
        return hash.toLowerCase().substring(2) == tryHash.toLowerCase();
    } catch (e) {
        return false;
    }
}
const VERIFIER_STAKE = ethers.parseEther("0.001");

async function main() {
    const signer = await setupSigner();
    try {
        const alertVerifier = new ethers.Contract(chainConfig.alertVerifierAddress, alertVerifierArtifact.abi, signer);

        try 
        {
            let res = await alertVerifier.beActiveVerifier({value: VERIFIER_STAKE});
            console.log("Became a verifier");
        } catch(e) {
            console.log("Already verifier or no balance, continuing...");
        }

        alertVerifier.on("VerificationTask", async (verifier, id) => {
            try {
                if (verifier == signer.address) {
                    console.log("Verification requested: ", verifier, id);

                    const request = await alertVerifier.requests(id);
                    const res = await checkData(request.dataUrl, request.messageHash);

                    const reciept = await alertVerifier.giveAnswer(id, !res); //if equal, alert is wrong, so it is opposite

                    console.log("verification result on: ", id, res, request.dataUrl, request.messageHash);
                }

            } catch (e) {
                console.log("Error: ", e.message);
            }

        })


    } catch (e) {
        console.error("Error: ", e.message);
    }
}


main();