import alertVerifierArtifact from "./abi/alertVerifier.json"
import scytaleArtifact from "./abi/scytale.json"

const config = {
  alertVerifier: {
    address: "0xC3e5C369AD47495a82925F762912703DC65Cd60B" as `0x${string}`,
    abi: alertVerifierArtifact.abi,
  },
  scytale: {
    address: "0x0aF36aEef5E696701B85185CEDC534538008990F" as `0x${string}`,
    abi: scytaleArtifact.abi,
  },
}

export default config
