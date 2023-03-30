## Birth-Registery App
App to register the bith data on the HyperLedger Fabric Network, Fabric-explorer to view transactions, APIs to Interact with network.

***IF YOU HAVE ANY QUESTIONS OR PROBLEMS, FEEL FREE TO RAISE A ISSUE IN REPO.***

**I recomend you to update your docker/Compose to latest version**

**- Make sure you have all the necessary Dependencies Installed on your system (Fabric Binaries, docker, node etc.)**


Steps to start the project-

*1. Creating Network*
    -Navigate to *{chaincode/birthcert}* and install the dependencies by [npm install].

	-Navigate to Scrips directory [cd scripts]
	
	-then run the StartFabric script to start the fabric network [./startFabric.sh]
	
*2. Copying the network artifacts*

    -Navigate to { test-network/organizations } [cd test-network/organizations].
    
    ![image](https://user-images.githubusercontent.com/96972634/228813627-c7e092ef-d487-47c9-a6be-84909bc5c3c7.png)

    -copy the *ordererorganizations* and *peerOrganizations* folder.
	
    -Navigate to *{ fabric-explorer/organizations }* and paste those two folders.
	![image](https://user-images.githubusercontent.com/96972634/228813900-766c0716-558e-466e-94cf-a291ee8cb1fb.png)
	paste it here
	
*3. setting up explorer*

	-Inside the *{ fabric-explorer/organizations }* directory navigate to *{peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore}* and copy the name of the key.

![image](https://user-images.githubusercontent.com/96972634/228814194-42154809-24b8-43b3-abc3-6edec623b9c7.png)


  -then navigate to *{/fabric-explorer/connection-profile/test-network.json}* and replace the "adminPrivateKey" path with the key name you copied.
  
  ![image](https://user-images.githubusercontent.com/96972634/228814583-f0913030-8ae2-414e-b4e8-ce27b70b092e.png)


  - navigate to *{fabric-explorer}* and run [docker-compose up -d]

   - This will start your Block Explorer at http://localhost:8080 .
   - ![image](https://user-images.githubusercontent.com/96972634/228820468-e5f4db0b-5f81-4afb-af1c-abeb56a1f97d.png)


*4. Setup the API*  

	-Navigate to  *{Hyperledger-birthCertificate-V2/api}*  and install dependencies [npm install].
	
	-start the API **node app.js**

## API overview -
	
	***port is set to 4000 by default***

    -Interact with the chain with the help of APIs using Postman

    *1. enroll the Admin by using /enrollAdmin. (Admin is enrolled only once)*
        
        - API(POST):  http://localhost:4000/enrollAdmin

            Body :  {
                         "userName": "Nitantadmin",
                         "orgName" : "Org1"
                    }
    
    *2. enroll the User by using /users*
        
        - API(POST): http://localhost:4000/enrollUser

            Body : {
                      "userName": "User",
                        "orgName" : "Org1"
                    }
    
    *3. Invoke Chaincode to create new Birth Certificate by using /api/v1/birthcertificate/create.

        - API(POST):  http://localhost:4000/api/v1/birthcertificate/create

            Body: {
                    name":"Nitant",
                    "father_name":"Surendra",
                    "mother_name":"Monika",
                    "dob":"2002-01-09",
                    "gender":"male",
                    "weight":"3",
                    "country":"India",
                    "state":"Mp",
                    "city":"indore",
                    "hospital_name":"test",
                    "permanent_address":"Elite Tower Indore"
                }

    *4. Invoke chaincode to GET all Birth Certificates  *

        - API(GET): http://localhost:4000/api/v1/birthcertificate/getAll?args=["cc112711d2ba04f07fc1b2f92c2d7c9f4fcd695f15c4db31b9e81a728ec76fb2"]

    *5. Invoke the chaincode to GET Birth Certificate of a Specific Key.*

        - API(GET): http://localhost:4000/api/v1/birthcertificate/certificate?args=["<KEY>"]

            - You have to pass KEY of the person's Birthcertificate you want to get (returned in API response after cretificate is created successfully).

***IF YOU HAVE ANY QUESTIONS OR PROBLEMS, FEEL FREE TO RAISE A ISSUE IN REPO.***
