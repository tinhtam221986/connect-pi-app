const fs = require('fs');
const path = require('path');

const CONTRACTS = ['ConnectToken', 'ConnectMarketplace', 'GameFi'];
const OUTPUT_FILE = path.join(__dirname, '../src/lib/contracts-config.json');
const CHAIN_STATE_FILE = path.join(__dirname, '../src/lib/mock-chain-state.json');

function generateAddress() {
    return '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function deploy() {
    console.log('🚀 Starting Mock Deployment...');

    const deployment = {
        chainId: 314159, // Pi Network Testnet ID (unofficial/mock)
        network: "Pi Testnet (Mock)",
        contracts: {}
    };

    const chainState = {
        balances: {}, // Token balances
        nfts: {},     // NFT ownership
        listings: [], // Marketplace listings
        gamePlayers: {} // GameFi player stats
    };

    CONTRACTS.forEach(name => {
        const address = generateAddress();
        console.log(`✅ Deployed ${name} at ${address}`);
        deployment.contracts[name] = {
            address: address,
            abi: [] // Placeholder for ABI
        };

        // Initialize genesis state
        if (name === 'ConnectToken') {
            const owner = "0x" + "1".repeat(40); // Mock Owner
            chainState.balances[owner] = 1000000000; // 1 Billion tokens
        }
    });

    // Write Config
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(deployment, null, 2));
    console.log(`💾 Configuration saved to ${OUTPUT_FILE}`);

    // Write Genesis State (if not exists, to preserve data)
    if (!fs.existsSync(CHAIN_STATE_FILE)) {
        fs.writeFileSync(CHAIN_STATE_FILE, JSON.stringify(chainState, null, 2));
        console.log(`💾 Genesis Chain State saved to ${CHAIN_STATE_FILE}`);
    } else {
        console.log(`ℹ️  Chain State already exists, skipping genesis.`);
    }

    console.log('🎉 Mock Deployment Complete!');
}

deploy();
