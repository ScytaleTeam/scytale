// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "contracts/MockVRFConsumerInterface.sol";

contract AlertVerifier is MockVRFConsumerInterface {
  event VerificationTask(address indexed verifier, uint256 indexed requestId);
  event AnswerGiven(address indexed verifier, uint256 indexed id);

  Scytale scytaleContract;
  address public scytaleContractAddress;
  address public owner;
  

    VRF vrf = VRF(address(0)); //change to vrf
    mapping(uint256 => uint256) chainlinkRequestIdToRequestId;

  //add events

  constructor() {

    scytaleContractAddress = address(0);
    scytaleContract = Scytale(scytaleContractAddress);
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "not owner");
    _;
  }

    function mockWithdrawAllBalance() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

function setVRFAddress(address _vrfAddress) external onlyOwner{
    //require(_vrfAddress == address(0), "contract already set");
    vrf = VRF(_vrfAddress);
}

  //only admin function to link contract in start only
  function setScytaleContractAddress(address _scytaleContractAddress)
    external
    onlyOwner
  {
    //require(scytaleContractAddress == address(0), "contract already set");
    scytaleContractAddress = _scytaleContractAddress;
    scytaleContract = Scytale(scytaleContractAddress);
  }

  // Add the library methods
  using EnumerableSet for EnumerableSet.AddressSet;

  // Declare a set state variable
  EnumerableSet.AddressSet private activeVerifiers;

  uint256 constant VERIFIER_STAKE = 0.001 ether;
  uint256 constant ANSWER_TIME = 3 minutes;
  uint256 constant VERIFIER_NUMBER = 3;
  uint256 constant PUNISHMENT = 30; //as percent of VERIFIER_STAKE constant value

  //for establishing unique randomness
  uint256 constant RANDOM_PRIME = 325778765244908313467197;
  uint256 constant MOD_OF_RANDOM = 100000000000000000000;

  enum Answer {
    NO_ANSWER,
    NOT_HARMED,
    HARMED
  }

  struct Verifier { 
    address verifierAddress;
    Answer answer;
  }

  struct Request {
    string dataUrl;
    uint256 lastAnswerTime;
    bool isEnded;
    uint256 yesCount;
    uint256 noCount;
    uint256 rewardPool;
    bytes32 messageHash;
    uint256 randomSeed;
    uint id;
    Verifier[] selectedVerifiers;
  }

  mapping(address => ActiveVerifier) public activeVerifierInfo;
  Request[] public requests;
  uint256 punishmentPool;

  struct ActiveVerifier {
    uint256 activeVerificationCount;
    bool activenessRequest;
    uint256 balance;
  }

  function beActiveVerifier() external payable {
    address msgSender = msg.sender; //to reduce gas fees
    require(msg.value == VERIFIER_STAKE, "not enough stake");
    require(activeVerifierInfo[msgSender].balance == 0, "already have balance");
    require(
      EnumerableSet.contains(activeVerifiers, msgSender) == false,
      "already verifier"
    );
    activeVerifierInfo[msgSender].activenessRequest = true;
    EnumerableSet.add(activeVerifiers, msgSender);
    activeVerifierInfo[msgSender].balance = VERIFIER_STAKE;
  }

  function stopRequestingVerifications() external {
    address msgSender = msg.sender;
    require(EnumerableSet.contains(activeVerifiers, msgSender), "not verifier");
    EnumerableSet.remove(activeVerifiers, msgSender);
    activeVerifierInfo[msgSender].activenessRequest = false;
    uint balance = activeVerifierInfo[msgSender].balance;
    activeVerifierInfo[msgSender].balance = 0;
    payable(msgSender).send(balance);
  }

  function checkStopBeingVerifierAndExecute(address verifierAddress) internal {
    ActiveVerifier storage verifier = activeVerifierInfo[verifierAddress];
    if (verifier.activenessRequest == false) {
      if (verifier.balance > 0 && verifier.activeVerificationCount == 0) {
        uint balance = verifier.balance;
        verifier.balance = 0;
        payable(verifierAddress).send(balance);
      }
    }
  }


  modifier onlyContract() {
    require(msg.sender == scytaleContractAddress, "not scytale contract");
    _;
  }

function broadcastAlert(bytes32 messageHash, string calldata dataUrl, uint id)
external payable onlyContract {
    Request storage newRequest = requests.push();
    newRequest.messageHash = messageHash;
    newRequest.dataUrl = dataUrl;
    newRequest.rewardPool = msg.value;
    newRequest.id = id;

    uint256 requestId = vrf.requestRandom();

    chainlinkRequestIdToRequestId[requestId] = requests.length - 1;
  }


  function getIndex(Verifier[] memory addressArray, address addressToSearch)
    internal
    pure
    returns (uint256)
  {
    for (uint256 i = 0; i < addressArray.length; i++) {
      if (addressArray[i].verifierAddress == addressToSearch) {
        return i;
      }
    }
    require(false, "not verifier in that request");
  }

  //true if not harmed false if it is harmed
  function giveAnswer(uint256 requestId, bool answer) external {
    require(
      requests[requestId].lastAnswerTime > block.timestamp &&
        requests[requestId].lastAnswerTime != 0,
      "time passed or not initialized yet"
    );
    address msgSender = msg.sender;
    uint256 index = getIndex(requests[requestId].selectedVerifiers, msgSender);
    if (answer == true) {
      ++requests[requestId].yesCount;
      requests[requestId].selectedVerifiers[index].answer = Answer.NOT_HARMED;
    } else {
      ++requests[requestId].noCount;
      requests[requestId].selectedVerifiers[index].answer = Answer.HARMED;
    }
    emit AnswerGiven(msgSender, index);
  }


function handleRandom(uint id, uint random) external {
    require(msg.sender == address(vrf), "not vrf contract");
    uint256 VDAORequestId = chainlinkRequestIdToRequestId[id];
    requests[VDAORequestId].randomSeed = random % MOD_OF_RANDOM;
    selectVerifiers(random, VDAORequestId);
    requests[VDAORequestId].lastAnswerTime = block.timestamp + ANSWER_TIME;
  }

  function selectVerifiers(uint256 randomSeed, uint256 index) internal {
    uint256 setLength = EnumerableSet.length(activeVerifiers);

    for (uint256 i = 0; i < VERIFIER_NUMBER; i++) {
      uint256 randomIndex = (i * RANDOM_PRIME + randomSeed) % setLength;
      address addedVerifierAddress = EnumerableSet.at(
        activeVerifiers,
        randomIndex
      );
      Verifier storage verifier = requests[index].selectedVerifiers.push();
      verifier.verifierAddress = addedVerifierAddress;
      emit VerificationTask(addedVerifierAddress, index);
      ++activeVerifierInfo[addedVerifierAddress].activeVerificationCount;
    }
  }

  function fetchVerifierAddresses(uint256 index)
    external
    view
    returns (Verifier[] memory)
  {
    return requests[index].selectedVerifiers;
  }

  //EDIT
  function endRequest(uint256 requstIndex) public {
    Request memory request = requests[requstIndex];
    Request storage requestToChange = requests[requstIndex];
    Verifier[] memory verifiers = request.selectedVerifiers;
    require(request.isEnded == false, "request already ended");
    require(
      (request.lastAnswerTime <= block.timestamp || request.yesCount + request.noCount == VERIFIER_NUMBER) 
      && request.lastAnswerTime != 0,
      "time has not come yet"
    );
    requestToChange.isEnded = true;
    Answer result;
    uint256 trueAnswerCount;

    if (request.yesCount > request.noCount) {
      result = Answer.NOT_HARMED;
      trueAnswerCount = request.yesCount;
    } else {
      result = Answer.HARMED;
      trueAnswerCount = request.noCount;
    }
    uint256 toBeAddedToPunishmentPool;
    uint256 currentPunishmentPool = request.rewardPool;
    uint256 removedFromPunishmentPool;
    uint256 rewardPool = request.rewardPool;
    for (uint256 i = 0; i < verifiers.length; i++) {
      address currentAddress = verifiers[i].verifierAddress;
      --activeVerifierInfo[currentAddress].activeVerificationCount;
      if (verifiers[i].answer == result) {
        uint256 balanceToAdd;
        balanceToAdd += rewardPool / trueAnswerCount;
        balanceToAdd += currentPunishmentPool / trueAnswerCount;
        removedFromPunishmentPool += currentPunishmentPool / trueAnswerCount;

        activeVerifierInfo[currentAddress].balance += balanceToAdd;
      } else {
        uint256 punishment = (VERIFIER_STAKE * PUNISHMENT) /
          100 /
          (VERIFIER_NUMBER - trueAnswerCount);
        uint256 balanceValue = activeVerifierInfo[currentAddress].balance;
        if (punishment > balanceValue) {
          punishment = balanceValue;
        }
        activeVerifierInfo[currentAddress].balance -= punishment;
        toBeAddedToPunishmentPool += punishment;
      }

      checkStopBeingVerifierAndExecute(currentAddress);
    }

    punishmentPool =
      currentPunishmentPool +
      toBeAddedToPunishmentPool -
      removedFromPunishmentPool;

    if (result == Answer.NOT_HARMED) {
      scytaleContract.submitAvailabilityProof(request.id, true);
    } else {
      scytaleContract.submitAvailabilityProof(request.id, false);
    }
  }


  function bytesToUint(bytes memory b) internal pure returns (uint256) {
    uint256 number;
    for (uint256 i = 0; i < b.length; i++) {
      number = number + uint256(uint8(b[i])) * (2**(8 * (b.length - (i + 1))));
    }
    return number;
  }




  function viewAllActiveVerifiers() external view returns (address[] memory) {
    return EnumerableSet.values(activeVerifiers);
  }
}

interface Scytale {
  function submitAvailabilityProof(uint id, bool result) external;
}

interface VRF {
function requestRandom() external returns(uint);
}