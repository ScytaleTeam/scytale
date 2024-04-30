# Scytale

**Scytale is a Decentralized Incentivized Data Sharing Protocol built on Scroll in VORTEx 01 by Scytale Team.

​https://scytale-nextjs.vercel.app/

There are many problems in communication protocols.

- Censorship: Companies can block the communication rights of people they want and subject them to censorship because of their own interests, without giving any reason.

- Centralized: The servers of many communication protocols (for example, Gmail and WhatsApp) are concentrated in a few places, which sometimes causes communication to be completely interrupted.

- Transparency: We know that data is kept somewhere in communication applications, but we do not know whether this data is actually encrypted, read or shared. This hinders the privacy of users and destroys transparency of the user’s security.



## Description

​Scytale is a Decentralized Incentivized Data Sharing Protocol. There are 4 basic layers in the protocol we have developed: Sender, Storage Node, Consensus Mechanism and Receiver. 

The communication starts with the sender wanting to send any type of data; message, file or e-mail etc. to the receiver. The basic element that will ensure communication is the storage nodes.

After selecting the file they want to send, the sender can choose which storage node to send it to on the website, thanks to the permissionless structure here, anyone can become a storage node.

The fee does not reach the storage node directly, it will be staked until the data’s store time is ended. All the storage node has to do is store and provide the data for the specified period of time. 

The receiver and all other peers can access this file at any time through the storage node; however, this does not mean that everyone can read the message. 

Because Scytale protocol uses end to end encryption with RSA public key, that ensures only reader can read the message content and can be sure no one can read the message.

Everything done so far is based on the most optimistic scenario, but Scytale attaches importance to four basic things: Security, Incentivization, Permissionless, Decentralized.


- When users sending messages in the sender layer upload a file, no one except the receiver should be able to read this file. We used the RSA encryption algorithm to ensure confidentiality here.

- As we mentioned above, since our aim is to develop a decentralized protocol, we have developed an incentive mechanism for people who install storage nodes to ensure that everyone can install a storage node and to ensure decentralization. 
This incentive mechanism is based on the fact that the nodes that perform this data storage earn money in amounts determined by the sender per certain byte and time.

- We need to know whether storage nodes hold data and this needs to be audited. Here, we have created a structure where storage nodes can be penalized if they do not hold data. 
This mechanism works as follows: Someone who wants to become a storage node must first stake a certain amount of ETH (this can be a token in the future). 
If the storage node stops keeping this data, anyone can detect that the data does not exist and a challenge is initiated. 
In this challenge, nodes in the consensus mechanism layer are randomly selected, and if the majority decides that the data is not kept, 
some of the staked tokens are deducted as a penalty. Also, if the challenge is successful challenger will be rewarded, too.

## Contracts

- [**MockVRF**]([https://sepolia.scrollscan.com/address/0x15683C0Ee54416d8ba84F7226bd8ca5F015c14b9])
- 
- [**ScyTale**]([https://sepolia.scrollscan.com/address/0x0aF36aEef5E696701B85185CEDC534538008990F#code])
- 
- [**AlertVerifier**]([https://sepolia.scrollscan.com/address/0xC3e5C369AD47495a82925F762912703DC65Cd60B#code])



