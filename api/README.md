## Birth-Registery App
App to register the bith data on the HyperLedger Fabric Network using CouchDB to store the data.
REST APIs to Integrate it to the front-end.

Make sure you have all the necessary Dependencies Installed on your system (Fabric Binaries, docker, node etc.)

Steps to start the project-

*1. Creating the Channel*

	-first Navigate to Scrips directory [cd scripts]
	
	-then run the cleanup script to clean the docker [./cleanup.sh]
	
	-Create the channel Artifacts [./create-artifacts.sh]
	
	-Then do the docker up [./docker-up.sh]
	
	-Create the channel [./createChannel.sh]

*2. Deploying the Chaincode*

	-open the **deployChaincode.sh** file and scroll to the bottom where functions are called
	
	-commend all the fuction calls except **presetup** fuction and run the script [./deployChaincode.sh]
		--This install dependencies, if there is an error in installation, then go to chaincode folder and install dependencies directly from there
	
	-Similarly now commend all the function calls except **packageChaincode** function and run the script again.
	
	-Do the same process for all the functions by running one function at a time in a sequence.
		--After calling the function **queryInstalled** run the command [ export PACKAGE_ID= '<Package ID that is returned after Installation on chaincode>' ]
	
	-Run remaining functions. 
	
	-now the chain code is installed, approved and Invoked.
	
*3. start REST API*

	-in the main directory install the node dependencies [npm install / npm install --force]
	-then type the command **node app.js** to start the REST API

*4. Setup the front-end*

	-Navigate to front-end folder and do **npm install**
	-start the server **npm start**

*5. View the couchDB*
	
	-to view the database running on the local host navigate to http://localhost:5984/_utils/#/_all_dbs
	
	
