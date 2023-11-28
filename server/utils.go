package main

import (
	"regexp"
	"strconv"
	"strings"
)

func validateTimeFormat(timeStr string, maxDurationMinutes int) bool {
	timeRegex := regexp.MustCompile(`^\d{1,2}:\d{2}$`)
	if !timeRegex.MatchString(timeStr) {
		return false
	}

	timeParts := strings.Split(timeStr, ":")
	if len(timeParts) != 2 {
		return false
	}

	minutes, err := strconv.Atoi(timeParts[0])
	if err != nil {
		return false
	}
	seconds, err := strconv.Atoi(timeParts[1])
	if err != nil {
		return false
	}
	if minutes > 5 || minutes < 0 {
		return false
	}
	if seconds > 60 || seconds < 0 {
		return false
	}

	totalDuration := minutes*60 + seconds
	return totalDuration < (maxDurationMinutes * 60)

}
