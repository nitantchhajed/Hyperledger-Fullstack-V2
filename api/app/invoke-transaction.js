/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var util = require('util');
var axios = require('axios').default
var helper = require('./Helper.js');
var logger = helper.getLogger('invoke-chaincode');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const apiServerEndPoint = `http://127.0.0.1:3002/api/v2/fabric`
// curl - X POST http://172.17.0.1:4000/api/v2/multichain  -H 'Content-Type: application/json'  -H 'cache-control: no-cache'  -d "$3"


var invokeChaincode = async function (userName, channelName, chaincodeName, functionName, args) {
	try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            return {success: false, message: `An identity for the user ${userName} does not exist in the wallet. Please register the user before proceeding`};
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        logger.debug('network has been submitted successfully, ', network);
        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        logger.debug('contract has been submitted successfully, ', contract);
        // Submit the specified transaction.
        // var result = await contract.submitTransaction(functionName, ...args);

        const transaction = contract.createTransaction(functionName);
        const result = await transaction.submit(...args);
        console.log("Result:", result.toString())
        console.log("TxID:", transaction.getTransactionId());

        logger.debug('Transaction has been submitted successfully, ', result);

        // Disconnect from the gateway.
        await gateway.disconnect();

        // return {success: true, message: "Transaction has been submitted successfully", chaincodeResponse: `${result.toString()}`}

        return transaction.getTransactionId();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return {success: false, message: `Failed to submit transaction: ${error}`}
    }
};

exports.invokeChaincode = invokeChaincode;
