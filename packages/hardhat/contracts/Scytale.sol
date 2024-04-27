// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;


contract Scytale {

    uint public constant STAKE_AMOUNT = 1 ether;
    uint public constant MIN_STAKE_AMOUNT = 0.5 ether;

    uint public constant FREE_RIDER_ALERT_DEPOSIT = 0.1 ether;
    uint public constant FREE_RIDER_SLASH_AMOUNT = 0.1 ether;
    uint public constant FREE_RIDER_ALERT_MIN_TIME = 10 minutes;

    mapping(address => string) public rsaKeys;

    struct Message {
        address senderAddress;
        string receiverPublicKey; //RSA, notification with event
        bytes32 messageHash;
        address storeNodeAddress;
        uint storeTime;
        uint reward;

        string dataUrl;
        uint endTime;

        bool finished;
        uint lastSlashTime;
    }
    mapping( bytes32 => Message ) public messages; //messageHash to message

    struct StoreNode {
        uint stakeBalance;
        string messageRelayAPI;
        uint activeStores; //stored message number
    }
    mapping( address => StoreNode ) public storeNodes;

    struct FreeRiderAlert {
        bytes32 messageHash;
        bool isFinished;
        bool isFreeRider;
    }

    mapping(uint => FreeRiderAlert) public alerts;
    uint public lastAlert = 0;
    



    constructor() {
        require(1==1);
    }

//STORE NODE

    function updateMessageUrl(string calldata messageUrl) public {
    storeNodes[msg.sender].messageRelayAPI = messageUrl;


    }
 
    function depositNodeStake() public payable {
        storeNodes[msg.sender].stakeBalance += msg.value;
    }


    function withdrawNodeStake(uint amount) public {
        require(storeNodes[msg.sender].activeStores == 0, "there should be no active messages");
        require(storeNodes[msg.sender].stakeBalance >= amount, "not enough balance");
        storeNodes[msg.sender].stakeBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

//MESSAGE
//accept can be signed by store node?
    function broadcastMessage(
        string calldata _receiverPublicKey, bytes32 _messageHash, 
        address _storeNodeAddress, uint _storeTime
        
        ) public payable {
        require(messages[_messageHash].senderAddress == address(0), "already broadcasted" );
        //min reward?, who will accept the reward
        messages[_messageHash] = Message({
            senderAddress: msg.sender,
            receiverPublicKey: _receiverPublicKey,
            messageHash: _messageHash,
            storeNodeAddress: _storeNodeAddress,
            storeTime: _storeTime,
            reward: msg.value,

            // will be initialized by store node
            dataUrl: "", 
            endTime: 0,

            finished: false,
            lastSlashTime: 0
        });
    }

//message relaying can be cancelled before if node has not accepted yet
    function cancelBroadcast(bytes32 _messageHash) public {
        Message memory message = messages[_messageHash];
        require( message.senderAddress == msg.sender, "not owner");
        require( message.endTime == 0, "broadcasted no authorization");
        require( message.finished == false, "already finished" );

        message.finished = true;
        payable(msg.sender).transfer(message.reward);
    }

    function acceptMessage( bytes32 _messageHash, string calldata _dataUrl ) public {
        Message storage message = messages[_messageHash];
        require(message.storeNodeAddress == msg.sender, "not authorized");
        require( message.finished == false, "already finished" );
        require( storeNodes[msg.sender].stakeBalance >= MIN_STAKE_AMOUNT, "not enough stake" );
        message.dataUrl = _dataUrl;
        message.endTime = block.timestamp + message.storeTime; //maybe optimize
        storeNodes[msg.sender].activeStores++;
    }

    function changeMessageUrl(bytes32 _messageHash, string calldata _dataUrl) public {
        Message storage message = messages[_messageHash];
        require(message.storeNodeAddress == msg.sender, "not authorized");
        require( message.finished == false, "already finished" );
        message.dataUrl = _dataUrl;
    }


    function getReward(bytes32 _messageHash) public {
        Message memory message = messages[_messageHash];
        require(message.storeNodeAddress == msg.sender, "not authorized");
        require( block.timestamp >= message.endTime, "store time not ended yet" );
        require( message.finished == false, "already finished" );

        message.finished = true;
        storeNodes[msg.sender].activeStores--;
        payable(message.storeNodeAddress).transfer(message.reward);
    }

    function alertFreeRider(bytes32 _messageHash) public payable {
        alerts[lastAlert] = FreeRiderAlert({
            messageHash: _messageHash,
            isFinished: false,
            isFreeRider: false
        });

        lastAlert++;
    }

    //function slashFreeRider() 

    //function getAvailabilityProofFromVerifiers()

    function changeRsaPublicKey(string calldata publicKey) public {
        rsaKeys[msg.sender] = publicKey;
    }
    
}