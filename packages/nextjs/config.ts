const alertVerifierArtifact = require("../../hardhat/artifacts/contracts/AlertVerifier.sol/AlertVerifier.json")
const scytaleArtifact = require("../../hardhat/artifacts/contracts/Scytale.sol/Scytale.json")

export const config = {
  alertVerifier: {
    address: "0x96D87Bbd17De59B885249A973723bA51377D70aE",
    abi: alertVerifierArtifact.abi,
  },
  scytale: {
    address: "0xDa527138560e94E7B8773e5d260B964232e76863",
    abi: scytaleArtifact.abi,
  },
}
