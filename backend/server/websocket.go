package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"sort"

	"github.com/gorilla/websocket"
)

// Handler for the WebSocket connection
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	fmt.Println(conn.RemoteAddr())
	if err != nil {
		return
	}
	defer conn.Close()

	// Continuously read messages from the client
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			return
		}

		// Handle the received message (you can define your own protocol)
		if err := handleMessage(conn, messageType, p); err != nil {
			return
		}
	}
}

// Handle the received WebSocket message
func handleMessage(conn *websocket.Conn, messageType int, payload []byte) error {

	// Assuming JSON messages for simplicity
	var content GetGameInfos
	fmt.Println("payload:", string(payload))

	err := json.Unmarshal(payload, &content)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(content)

	// Check the message type and take appropriate action
	switch content.GetType() {
	case "scoreUpdate":
		var content ScoreUpdate
		err := json.Unmarshal(payload, &content)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(content.Infos)
		// Handle score update

		gameInfos = append(gameInfos, content.Infos)
		//Calculate the position percentile for the submitted score
		var percentile float64
		percentile, content.Infos.Rank = calculatePercentileAndRank(content.Infos.Score)

		message := fmt.Sprintf("Congrats %s, you are in the top %.1f%%, on the %d position.\n", content.Infos.Name, math.Round(percentile), content.Infos.Rank)
		fmt.Println(message)
		err = conn.WriteMessage(messageType, []byte(message))
		if err != nil {
			return err
		}

		// Save the updated data to the file
		err = saveData()
		if err != nil {
			fmt.Println(err)
		}

	case "getGameData":

		// Sort gameInfos by score in descending order
		sort.Slice(gameInfos, func(i, j int) bool {
			return gameInfos[i].Score > gameInfos[j].Score
		})

		// Assign ranks based on the sorted order
		for i := range gameInfos {
			gameInfos[i].Rank = i + 1
		}

		// Convert game information to JSON format
		jsonData, err := json.Marshal(gameInfos)
		if err != nil {
			fmt.Println(err)
		}

		// Send JSON data to the client
		err = conn.WriteMessage(messageType, jsonData)
		if err != nil {
			return err
		}
	default:
		fmt.Println("Doesn't know this type of message.")
	}

	return nil
}
