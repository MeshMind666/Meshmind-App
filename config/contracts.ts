export const OPBNB_TESTNET_CHAIN_ID = 5611;

// Verified Live Contract Deployed on opBNB Testnet
export const MESHMIND_ESCROW_ADDRESS = "0xb0870AA7E16D9bCdB278f55617091040777b1e19";
export const VERBA_ESCROW_ADDRESS = MESHMIND_ESCROW_ADDRESS;

export const MESHMIND_ESCROW_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": false, "internalType": "address", "name": "initiator", "type": "address" }
    ],
    "name": "DisputeRaised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "resolutionRoot", "type": "bytes32" }
    ],
    "name": "DisputeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "clientAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "contractorAmount", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "resolutionRoot", "type": "bytes32" }
    ],
    "name": "DisputeResolvedWithSplit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "contractor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "initialGraphRoot", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "EscrowFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "EscrowRefunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "finalSettlementRoot", "type": "bytes32" }
    ],
    "name": "EscrowReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "bytes32", "name": "updatedGraphRoot", "type": "bytes32" },
      { "indexed": false, "internalType": "address", "name": "submitter", "type": "address" }
    ],
    "name": "EvidenceSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "cancelAndRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "address payable", "name": "contractor", "type": "address" },
      { "internalType": "address", "name": "arbiter", "type": "address" },
      { "internalType": "bytes32", "name": "initialGraphRoot", "type": "bytes32" }
    ],
    "name": "createAndFundEscrow",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "address payable", "name": "contractor", "type": "address" },
      { "internalType": "address", "name": "arbiter", "type": "address" },
      { "internalType": "bytes32", "name": "initialGraphRoot", "type": "bytes32" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "createAndFundEscrowWithDeadline",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" }
    ],
    "name": "getDeal",
    "outputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
          { "internalType": "address payable", "name": "client", "type": "address" },
          { "internalType": "address payable", "name": "contractor", "type": "address" },
          { "internalType": "address", "name": "arbiter", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "bytes32", "name": "graphStateRoot", "type": "bytes32" },
          { "internalType": "bytes32", "name": "finalSettlementRoot", "type": "bytes32" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "internalType": "struct MeshmindEscrow.EscrowDeal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" }
    ],
    "name": "raiseDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "bytes32", "name": "finalGraphRoot", "type": "bytes32" }
    ],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "address payable", "name": "winner", "type": "address" },
      { "internalType": "bytes32", "name": "resolutionRoot", "type": "bytes32" }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "uint256", "name": "clientAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "contractorAmount", "type": "uint256" },
      { "internalType": "bytes32", "name": "resolutionRoot", "type": "bytes32" }
    ],
    "name": "resolveDisputeWithSplit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "internalType": "bytes32", "name": "updatedGraphRoot", "type": "bytes32" }
    ],
    "name": "submitEvidence",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const VERBA_ESCROW_ABI = MESHMIND_ESCROW_ABI;
