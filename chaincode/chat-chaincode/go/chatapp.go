/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing chats
type SmartContract struct {
	contractapi.Contract
}

// Basic definition for chat schema
type ChatSchema struct {
	DocType			string 		`json:"docType"`
	Participants  	[]string 	`json:"participants"`
	Chat			[]Chat 		`json:"chat"`
}

// A single chat element
type Chat struct {
	From      string `json:"from"`
	Message   string `json:"message"`
	TimeStamp string `json:"timeStamp"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"key"`
	Record *ChatSchema
}

// InitLedger adds a base set of chats to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	Chats := []ChatSchema{
		ChatSchema{DocType: "Chat", Participants: []string{"user1@gmail.com", "user2@gmail.com"}, Chat: []Chat{}},
		ChatSchema{DocType: "Chat", Participants: []string{"user1@gmail.com", "user3@gmail.com"}, Chat: []Chat{}},
	}

	for i, chat := range Chats {
		chatAsBytes, _ := json.Marshal(chat)
		err := ctx.GetStub().PutState("chat"+strconv.Itoa(i), chatAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

// CreateChat creates a chat schema on world state
func (s *SmartContract) CreateChat(ctx contractapi.TransactionContextInterface, chatId string, client string, broker string) (string, error) {

	if chatId == "" {
		return "", fmt.Errorf("Chat Id cannot be empty.")
	}
	if client == "" {
		return "", fmt.Errorf("Client field cannot be empty.")
	}
	if broker == "" {
		return "", fmt.Errorf("Broker field cannot be empty.")
	}

	chatAsBytes, err := ctx.GetStub().GetState(chatId)
	if err != nil {
		return "", fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if chatAsBytes == nil { // Chat doesnt exist so we can create one
		newChat := ChatSchema{DocType: "Chat", Participants: []string{client, broker}, Chat: []Chat{}}
		newChatAsBytes, _ := json.Marshal(newChat)
		err := ctx.GetStub().PutState(chatId, newChatAsBytes)

		if err != nil {
			return "", fmt.Errorf("Failed writing to world state. %s", err.Error())
		}
		return "Successfully created chat", nil

	} else {                // Chat already exist so throw error
		return "", fmt.Errorf("Failed to create chat schema, chat already exists.")

	}

}

// UpdateChat updates the exixting chat by adding the new message
func (s *SmartContract) UpdateChat(ctx contractapi.TransactionContextInterface, chatId string, from string, message string, timeStamp string) (string, error) {

	if chatId == "" {
		return "", fmt.Errorf("Chat Id cannot be empty.")
	}
	if from == "" {
		return "", fmt.Errorf("From field cannot be empty.")
	}
	if message == "" {
		return "", fmt.Errorf("Message field cannot be empty.")
	}
	if timeStamp == "" {
		return "", fmt.Errorf("TimeStamp field cannot be empty.")
	}

	chatAsBytes, err := ctx.GetStub().GetState(chatId)
	if err != nil {
		return "", fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if chatAsBytes == nil {
		return "", fmt.Errorf("%s does not exist", chatId)

	} else {
		chat := new(ChatSchema)
		_ = json.Unmarshal(chatAsBytes, chat)
		if err != nil {
			return "", err
		}
		// check if user is a participant in the chat
		result := false
		for _, user := range chat.Participants {
			if user == from {
				result = true
				break
			}
		}
		if result != true {
			return "", fmt.Errorf("You are not allowed to do this operation.")
		}

		chat.Chat = append(chat.Chat, Chat{From: from, Message: message, TimeStamp: timeStamp})
		chatAsBytes, _ := json.Marshal(chat)
		err := ctx.GetStub().PutState(chatId, chatAsBytes)

		if err != nil {
			return "", fmt.Errorf("Failed to write the update to world state. %s", err.Error())
		}
		return "Successfully updated the chat.", nil

	}
}

// QueryAllChats returns all the chats stored in the world state - only admin is permitted to do the same
func (s *SmartContract) QueryAllChats(ctx contractapi.TransactionContextInterface, userEmail string) ([]QueryResult, error) {
	
	if userEmail != "admin@gmail.com" {
		return nil, fmt.Errorf("You are not permitted to do this operation.")
	}

	startKey := ""
	endKey := ""

	// Get all the chats present in the world state
	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		chat := new(ChatSchema)
		_ = json.Unmarshal(queryResponse.Value, chat)

		queryResult := QueryResult{Key: queryResponse.Key, Record: chat}
		results = append(results, queryResult)
		
	}

	return results, nil

}

// QueryChat returns the chat stored in the world state with given id
func (s *SmartContract) QueryChat(ctx contractapi.TransactionContextInterface, chatId string, userEmail string) (*ChatSchema, error) {
	
	if chatId == "" {
		return nil, fmt.Errorf("Chat Id cannot be empty.")
	}
	if userEmail == "" {
		return nil, fmt.Errorf("User email field cannot be empty.")
	}
	
	chatAsBytes, err := ctx.GetStub().GetState(chatId)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if chatAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", chatId)
	}

	chat := new(ChatSchema)
	_ = json.Unmarshal(chatAsBytes, chat)

	// Check if user has access to this chat
	result := false
	for _, user := range chat.Participants {
        if user == userEmail {
            result = true
            break
        }
    }
	if result {
		return chat, nil

	} else {
		return nil, fmt.Errorf("You dont have access to this chat.")
	}

	
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create chat-app chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chat-app chaincode: %s", err.Error())
	}
}
