const factoryAddress = "YOUR_FACTORY_CONTRACT_ADDRESS"; // 替换为您的合约地址
const factoryABI = [
    {
        "inputs": [
            {"internalType": "string","name": "name","type": "string"},
            {"internalType": "string","name": "symbol","type": "string"},
            {"internalType": "uint256","name": "initialSupply","type": "uint256"},
            {"internalType": "string","name": "website","type": "string"},
            {"internalType": "string","name": "socialMedia","type": "string"}
        ],
        "name": "createToken",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false,"internalType": "address","name": "tokenAddress","type": "address"},
            {"indexed": false,"internalType": "string","name": "name","type": "string"},
            {"indexed": false,"internalType": "string","name": "symbol","type": "string"},
            {"indexed": false,"internalType": "uint256","name": "initialSupply","type": "uint256"},
            {"indexed": false,"internalType": "string","name": "website","type": "string"},
            {"indexed": false,"internalType": "string","name": "socialMedia","type": "string"}
        ],
        "name": "TokenCreated",
        "type": "event"
    }
];

let web3;
let tokenFactory;

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            tokenFactory = new web3.eth.Contract(factoryABI, factoryAddress);
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Please install MetaMask!');
    }
}

async function createToken() {
    const name = document.getElementById('tokenName').value;
    const symbol = document.getElementById('tokenSymbol').value;
    const initialSupply = document.getElementById('initialSupply').value;
    const website = document.getElementById('website').value;
    const socialMedia = document.getElementById('socialMedia').value;

    if (!name || !symbol || !initialSupply) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const result = await tokenFactory.methods.createToken(name, symbol, initialSupply, website, socialMedia).send({ from: accounts[0] });
        document.getElementById('result').innerHTML = `Token created successfully! Contract address: ${result.events.TokenCreated.returnValues.tokenAddress}`;
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = "An error occurred while creating the token.";
    }
}

window.addEventListener('load', async () => {
    await init();
    document.getElementById('createTokenBtn').addEventListener('click', createToken);
});
