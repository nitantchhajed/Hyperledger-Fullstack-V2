
'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
var hfc = require('fabric-client');
const fs = require('fs');
const path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');
var util = require('util');
hfc.setLogger(logger);


async function getClientForOrg (userorg, username) {
	logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
	// get a fabric client loaded with a connection profile for this org
	let config = '-connection-profile-path';

	// build a client context and load it with a connection profile
	// lets only load the network settings and save the client for later
	let client = hfc.loadFromConfig(hfc.getConfigSetting('network'+config));

	// This will load a connection profile over the top of the current one one
	// since the first one did not have a client section and the following one does
	// nothing will actually be replaced.
	// This will also set an admin identity because the organization defined in the
	// client section has one defined
	client.loadFromConfig(hfc.getConfigSetting(userorg+config));

	// this will create both the state store and the crypto store based
	// on the settings in the client section of the connection profile
	await client.initCredentialStores();

	// The getUserContext call tries to get the user from persistence.
	// If the user has been saved to persistence then that means the user has
	// been registered and enrolled. If the user is found in persistence
	// the call will then assign the user to the client object.
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('User was not found :', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}

var setupChaincodeDeploy = function() {
	process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('CC_SRC_PATH'));
};


var getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel('DEBUG');
	return logger;
};


exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
