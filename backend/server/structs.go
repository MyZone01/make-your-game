package main

type Payload interface {
	GetType() string
}

type GameInfo struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
	Rank  int    `json:"rank"`
}
type ScoreUpdate struct {
	Infos GameInfo `json:"content"`
	Type  string   `json:"type"`
}

type GetGameInfos struct {
	Type string `json:"type"`
}

func (s ScoreUpdate) GetType() string {
	return s.Type
}

func (g GetGameInfos) GetType() string {
	return g.Type
}
