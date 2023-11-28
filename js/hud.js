const pauseSound = document.getElementById("pauseSound");
const inGameAudio = document.getElementById("inGame");

export class HUDManager {
  constructor(bombsCount, currentBombType, callBackOnPause) {
    this.score = 0;
    this.lives = 3;
    this.bombType = currentBombType.toUpperCase();
    this.bombsCount = bombsCount;
    this.timer = 300; // 5 minutes in seconds
    this.canDecrementLives = true;
    this.callBackOnPause = callBackOnPause;
    this.PlayerName = "";
    this.askNameModal = document.getElementById("ask-name");
    this.pauseMenuModal = document.getElementById("pause-menu");
    this.gameOverMenuModal = document.getElementById("game-over-menu");
    this.leaderboardModal = document.getElementById("leaderboard");
    this.hudContainer = document.createElement("div");
    this.hudContainer.className = "hud";
    this.socket = new WebSocket("ws://localhost:8080/ws");
    document.body.appendChild(this.hudContainer);

    this.createHUDElements();
    const resumeButton = this.pauseMenuModal.querySelector("button#resume");
    const restartButton = this.pauseMenuModal.querySelector("button#restart");
    const restartFromLeaderboardButton = this.leaderboardModal.querySelector(".pagination-container .button button");

    restartFromLeaderboardButton.addEventListener("click", () => {
      window.location.reload();
    });
    restartButton.addEventListener("click", () => {
      window.location.reload(); // Reload the page to restart the game.
    });
    this.socket.onmessage = (event) => {
      this.leaderboardModal.querySelector(".pagination-container #percentile").style.color = "green";
      this.leaderboardModal.querySelector(".pagination-container #percentile").innerText = event.data;
      console.log(event.data);
    };
    resumeButton.addEventListener("click", () => {
      this.pauseMenuModal.close();
      this.callBackOnPause(); // You can call your onGamePause callback to resume the game.
    });
  }

  createHUDElements() {
    const elements = [
      { name: "Score", property: "score", value: this.score },
      { name: "Lives", property: "lives", value: this.lives },
      { name: "Bomb Type", property: "bombType", value: this.bombType },
      { name: "Bombs", property: "bombsCount", value: this.bombsCount },
      { name: "Timer", property: "timer", value: this.formatTime(this.timer) },
    ];

    elements.forEach((item) => {
      const element = this.createHUDElement(`${item.name}: ${item.value}`);
      this[item.property + "Element"] = element;
      this.hudContainer.appendChild(element);
    });
  }

  createHUDElement(text) {
    const element = document.createElement("div");
    element.className = "hud-element";
    element.innerText = text;
    return element;
  }

  updateScore(score) {
    this.score += score;
    this.scoreElement.innerText = `Score: ${this.score}`;
  }

  updateLives(lives) {
    this.lives = lives;
    this.livesElement.innerText = `Lives: ${lives}`;
  }

  updateBombType(bombType) {
    this.bombType = bombType;
    this.bombTypeElement.innerText = `Bomb Type: ${bombType}`;
  }

  updateBombsCount(count) {
    this.bombsCount = count;
    this.bombsCountElement.innerText = `Bombs: ${count}`;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  decrementTimer() {
    this.timer--;
    this.timerElement.innerText = `Timer: ${this.formatTime(this.timer)}s`;
  }

  decrementLives() {
    if (this.lives > 0 && this.canDecrementLives) {
      this.lives -= 1;
      this.livesElement.innerText = `Lives: ${this.lives}`;
      this.canDecrementLives = false;
    }
    // Ajoutez un délai de 3 secondes avant de permettre la prochaine décrémentation
    setTimeout(() => {
      this.canDecrementLives = true;
    }, 3000);
  }

  showPauseMenu() {
    inGameAudio.pause();
    pauseSound.play();
    this.pauseMenuModal.showModal();
  }

  hidePauseMenu() {
    inGameAudio.play();
    if (this.pauseMenuModal) this.pauseMenuModal.close();
  }

  showGameOverMenu(message) {
    const bonusTimer = Math.round((3000 - this.timer) / 10);
    this.updateScore(bonusTimer);
    this.gameOverMenuModal.querySelector(".message").innerText = message + `Your score: ${this.score}\n`;
    const restartButton = this.gameOverMenuModal.querySelector("#restart");
    const submitButton = this.gameOverMenuModal.querySelector("#score-submit");

    submitButton.addEventListener("click", () => {
      const usernameInput = this.gameOverMenuModal.querySelector("#username");
      var username = usernameInput.value;
      console.log(username);
      if (username.trim() !== "") {
        this.PlayerName = username.trim();
        usernameInput.value = "";
        const jsonGame = `{
          "type": "scoreUpdate",
          "content": {
              "name": "${this.PlayerName}",
              "score": ${this.score},
              "time": "${this.formatTime(this.timer)}",
              "rank": 0
          }
        }`;
        const toto = JSON.stringify(jsonGame);
        console.log(toto);
        this.socket.send(jsonGame);
        this.gameOverMenuModal.close();
        fetchDataAndRender();
        this.leaderboardModal.show();
      } else {
        const response = this.gameOverMenuModal.querySelector("#response");
        response.style.color = "red";
        this.gameOverMenuModal.querySelector("#response").innerText = "Enter a valid Name !";
        return;
      }
    });
    restartButton.addEventListener("click", () => {
      window.location.reload(); // Reload the page to restart the game.
    });
    setTimeout(() => {
      this.gameOverMenuModal.showModal();
    }, 750);
  }
  togglePauseResume(gamePause) {
    if (gamePause) {
      this.showPauseMenu();
    } else {
      this.hidePauseMenu();
    }
  }
}
const contentDiv = document.getElementById("content");
const paginationDiv = document.getElementById("pagination");

const itemsPerPage = 4;
let currentPage = 1;

function generateContent(data, page) {
  contentDiv.innerHTML = "";
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const item = data[i];
    contentDiv.innerHTML += `<p>Rank:  ${item.rank}, 
          Name: ${item.name}, Score: ${item.score}, Time: ${item.time}</p>`;
  }
}

function generatePagination(totalPages) {
  paginationDiv.innerHTML = "";

  const prevArrow = document.createElement("span");
  prevArrow.className = "arrow";
  prevArrow.textContent = "←";
  prevArrow.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchDataAndRender();
    }
  });
  paginationDiv.appendChild(prevArrow);

  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = i;

    if (i === currentPage) {
      link.classList.add("active");
    }

    link.addEventListener("click", function () {
      currentPage = i;
      fetchDataAndRender();
    });

    paginationDiv.appendChild(link);
  }

  const nextArrow = document.createElement("span");
  nextArrow.className = "arrow";
  nextArrow.textContent = "→";
  nextArrow.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchDataAndRender();
    }
  });
  paginationDiv.appendChild(nextArrow);
}

function fetchDataAndRender() {
  fetch("http://localhost:8080/api/game")
    .then((response) => response.json())
    .then((data) => {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      generateContent(data, currentPage);
      generatePagination(totalPages);
    })
    .catch((error) => console.error("Error fetching data:", error));
}
