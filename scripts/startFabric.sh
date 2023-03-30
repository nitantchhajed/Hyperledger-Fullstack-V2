#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"go"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

if [ "$CC_SRC_LANGUAGE" = "go" -o "$CC_SRC_LANGUAGE" = "golang" ] ; then
	CC_SRC_PATH="../chaincode/chat-chaincode/go/"
fi

# clean out any old identites in the wallets
rm -rf ../api/wallet/*

# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
#./network.sh deployCC -ccn chat-app -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
./network.sh deployCC -ccn birthcert -ccp ../chaincode/birthCert -ccl javascript -ccv 1 -cci initLedger 
popd

# creating the connection profile for SDK
pushd ../test-network
./organizations/ccp-generate.sh
popd
