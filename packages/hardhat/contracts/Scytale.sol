// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;


contract Scytale {


    uint public constant STAKE_AMOUNT = 1 ether;
    uint public constant MIN_STAKE_AMOUNT = 0.5 ether;

    uint public constant FREE_RIDER_ALERT_DEPOSIT = 0.1 ether;
    uint public constant FREE_RIDER_SLASH_AMOUNT = 0.1 ether;
    uint public constant FREE_RIDER_ALERT_MIN_TIME = 10 minutes;


    mapping(address => string) public rsaKeys;
    address public alertVerifierAddress;

    uint slashPool;

    address owner;
    modifier onlyOwner {

        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function setAlertVerifier(address _address) external onlyOwner {
        //owner = address(0);
        alertVerifierAddress = _address;
    }


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
        bool isAlerted;
    }
    mapping( bytes32 => Message ) public messages; //messageHash to message

    struct StoreNode {
        uint stakeBalance;
        string messageRelayAPI;
        uint activeStores; //stored message number
        uint price;
    }

    mapping( address => StoreNode ) public storeNodes;

    mapping( address => uint ) public balances;

    struct FreeRiderAlert {
        bytes32 messageHash;
        bool isFinished;
        bool isFreeRider;
        address alerter;
    }

    mapping(uint => FreeRiderAlert) public alerts;
    uint public lastAlert = 0;
    



    constructor() {
        owner = msg.sender;
    }

//STORE NODE

function updateNode(string calldata messageUrl, uint price) public payable {
    storeNodes[msg.sender].stakeBalance += msg.value;
     storeNodes[msg.sender].messageRelayAPI = messageUrl;
     storeNodes[msg.sender].price = price;

}

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
        require(msg.value >= storeNodes[_storeNodeAddress].price, "not enough price");
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
            lastSlashTime: 0,
            isAlerted: false
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

        require(messages[_messageHash].isAlerted == false, "already alerted" );
        require(msg.value >= FREE_RIDER_ALERT_DEPOSIT, "not enough deposiit");
        require(block.timestamp >= messages[_messageHash].lastSlashTime + FREE_RIDER_ALERT_MIN_TIME);
        messages[_messageHash].isAlerted = true;
        alerts[lastAlert] = FreeRiderAlert({
            messageHash: _messageHash,
            isFinished: false,
            isFreeRider: false,
            alerter: msg.sender
        });

        AlertVerifier(alertVerifierAddress).broadcastAlert{value: FREE_RIDER_ALERT_DEPOSIT}
        (_messageHash, messages[_messageHash].dataUrl, lastAlert);


        lastAlert++;
    }
 

    function submitAvailabilityProof(uint id, bool result) external {
        require(msg.sender == alertVerifierAddress, "not authorized");
        FreeRiderAlert memory alert = alerts[id];
        alert.isFinished = true;
        alert.isFreeRider = result;
        Message storage message = messages[alert.messageHash];
        StoreNode storage storeNode = storeNodes[message.senderAddress];

        if(result) {
        //slash stake
        if(storeNode.stakeBalance >= FREE_RIDER_SLASH_AMOUNT) {
            storeNode.stakeBalance -= FREE_RIDER_SLASH_AMOUNT;
        } else {
            storeNode.stakeBalance = 0;
        }
        message.lastSlashTime = block.timestamp;
        slashPool += message.reward *4/5;
        balances[alert.alerter] += FREE_RIDER_ALERT_DEPOSIT + message.reward * 1/5; //if not correct, slash alerter by not giving back deposit
        message.reward = 0;
        }
        message.isAlerted = false;
        
    }

    function changeRsaPublicKey(string calldata publicKey) public {
        rsaKeys[msg.sender] = publicKey;
    }

    function withdrawBalance() external {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
}

interface AlertVerifier {
    function broadcastAlert(bytes32 messageHash, string calldata dataUrl, uint id) external payable;
}