const { ethers } = require("hardhat");

const VRF_ADDRESS = "0xe04378e7171f91b157A04c1Fa4aA2154ACbb2259";



async function main() {
    try {
        
        const signer = (await ethers.getSigners())[1];
        let vrf = (await ethers.getContractAt("MockVRF", VRF_ADDRESS)).connect(signer);

    vrf.on("RandomRequested", async (value) => {
    // do whatever you want here
    // I'm pretty sure this returns a promise, so don't forget to resolve it
    try {
    let randValue = Math.floor(Math.random()* 10000);
    await vrf.submitRandom(value, randValue);
    console.log("successfull on: ", value);
    } catch(e) {
        console.error("en son:", e.message);
    }
})


    }catch(e) {
        console.log("dis:", e.message);
    }
}
main();