package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"sort"
	"strings"

	"github.com/gorilla/websocket"
)

// TODO : Check the calculus of the percentile.

// Structure to represent game information

var (
	gameInfos []GameInfo
	dataFile  = "game_data.json"
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

// Load game information from the data file
func loadData() error {
	fileContent, err := os.ReadFile(dataFile)
	if err != nil {
		return err
	}

	err = json.Unmarshal(fileContent, &gameInfos)
	if err != nil {
		return err
	}

	return nil
}

// Save game information to the data file
func saveData() error {

	// Sort gameInfos by score in descending order
	sort.Slice(gameInfos, func(i, j int) bool {
		return gameInfos[i].Score > gameInfos[j].Score
	})

	// Assign ranks based on the sorted order
	for i := range gameInfos {
		gameInfos[i].Rank = i + 1
	}

	jsonData, err := json.Marshal(gameInfos)
	if err != nil {
		return err
	}

	err = os.WriteFile(dataFile, jsonData, 0644)
	if err != nil {
		return err
	}

	return nil
}

// Handler for the POST request to save game information
func saveGameInfo(w http.ResponseWriter, r *http.Request) {
	var newGameInfo GameInfo
	err := json.NewDecoder(r.Body).Decode(&newGameInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(newGameInfo.Name) == "" {
		http.Error(w, "The name cannot be empty.", http.StatusBadRequest)
		return
	}
	if newGameInfo.Score < 0 {
		http.Error(w, "The score cannot be < 0 .", http.StatusBadRequest)
		return
	}
	if newGameInfo.Rank != 0 {
		http.Error(w, "Don't set the rank.", http.StatusBadRequest)
		return
	}
	if !validateTimeFormat(newGameInfo.Time, 5) {
		http.Error(w, "Your time is not correct set the rank.", http.StatusBadRequest)
		return
	}

	// Add new information to the list

	gameInfos = append(gameInfos, newGameInfo)
	var percentile float64
	percentile, newGameInfo.Rank = calculatePercentileAndRank(newGameInfo.Score)

	message := fmt.Sprintf("Congrats %s, you are in the top %.1f%%, on the %d position.\n", newGameInfo.Name, math.Round(percentile), newGameInfo.Rank)
	fmt.Println(message)

	// Save the updated data to the file
	err = saveData()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(message))
}

// Handler for the GET request to retrieve all game information with ranks
func getGameInfos(w http.ResponseWriter, r *http.Request) {

	// Return JSON data in response
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)

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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return JSON data in response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

// Helper function to calculate the position percentile for a given score
func calculatePercentileAndRank(score int) (float64, int) {

	// Sort gameInfos by score in descending order
	sort.Slice(gameInfos, func(i, j int) bool {
		return gameInfos[i].Score > gameInfos[j].Score
	})

	// Find the index of the submitted score
	index := sort.Search(len(gameInfos), func(i int) bool {
		return gameInfos[i].Score <= score
	})

	// Calculate the percentile
	percentile := (float64(index+1) / float64(len(gameInfos))) * 100.0

	return percentile, index + 1
}

func main() {
	// Load existing data from the file
	err := loadData()
	if err != nil {
		fmt.Println("Error loading data:", err)
	}

	// Define routes directly
	http.HandleFunc("/api/game", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			saveGameInfo(w, r)
		case http.MethodGet:
			getGameInfos(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/ws", handleWebSocket)

	// Start the server on port 8080
	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}
