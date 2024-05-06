async function vaultEvent(client) {
    const { ethers } = require("ethers");
    const { ADDRESS } = require("./src/constants/toucanAddress.js");
    const { ABI } = require("./src/constants/toucanAbi.js");
    const { sendVaultToDiscord } = require("./sendMessages.js");

    const optimismProvider = new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io");
    const newVaultAddress = ADDRESS.OPTIMISM.VAULTFACTORY;
    const newVaultAbi = ABI.VAULTFACTORY;

    const newVaultContract = new ethers.Contract(newVaultAddress, newVaultAbi, optimismProvider);


newVaultContract.on("*", async (vaultName) => {
    try {
        console.log("NewVaultCreated event received:");
        console.log("Vault Name:", vaultName);

        const txHash = vaultName.transactionHash;
        console.log("Transaction hash: ", vaultName.transactionHash);

        const name = vaultName.args[3];
        console.log("Vault Name: ", vaultName.args[3]);

        const etherscanLink = `https://optimistic.etherscan.io/tx/${txHash}`;
        console.log("Etherscan Link:", etherscanLink);

        const transaction = await optimismProvider.getTransaction(txHash);
        const sender = transaction.from;
        console.log("Created By:", sender);

        const address = vaultName.address;
        console.log("Address: ", vaultName.address);

        // Send message to Discord
        sendVaultToDiscord(client, txHash, name, etherscanLink, sender, address);
    } catch (error) {
        console.error("Error handling NewVaultCreated event:", error);
    }
});
}

module.exports = vaultEvent;
