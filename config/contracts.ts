export const OPBNB_TESTNET_CHAIN_ID = 5611;

export const VERBA_ESCROW_ADDRESS = "0x794b1C35E2D27027BfB20199dDfe44aC9142A999"; // Default testnet deployment placeholder

export const VERBA_ESCROW_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "dealId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "client", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "contractor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "initialGraphRoot", "type": "bytes32" }
    ],
    "name": "EscrowFunded",
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
      { "internalType": "bytes32", "name": "updatedGraphRoot", "type": "bytes32" }
    ],
    "name": "submitEvidence",
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
    "inputs": [{ "internalType": "bytes32", "name": "dealId", "type": "bytes32" }],
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
          { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }
        ],
        "internalType": "struct VerbaEscrow.EscrowDeal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
