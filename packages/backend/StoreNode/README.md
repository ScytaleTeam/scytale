# How To Initialize A Scytale Store Node
## Clone and import required libraries and modules
git clone https://github.com/ScytaleTeam/scytale.git

cd scytale/packages/backend/StoreNode

yarn

## Compile contracts
cd ../../hardhat

yarn compile

cd ../backend/StoreNode

## After setting up .env variables according to .env.example:
node index.js

### Done!
