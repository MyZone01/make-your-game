const pauseSound = document.getElementById("pauseSound")
const inGameAudio = document.getElementById('inGame');

export class HUDManager {
    constructor(callBackOnPause) {
        this.score = 0;
        this.lives = 3;
        this.bombType = 'SIMPLE';
        this.bombsCount = 1;
        this.timer = 300; // 5 minutes in seconds
        this.canDecrementLives = true

        this.callBackOnPause = callBackOnPause;
        this.modal = document.getElementById('pause-menu');
        this.hudContainer = document.createElement('div');
        this.hudContainer.className = 'hud';
        document.body.appendChild(this.hudContainer);

        this.scoreElement = this.createHUDElement(`Score: ${this.score}`);
        this.livesElement = this.createHUDElement(`Lives: ${this.lives}`);
        this.bombTypeElement = this.createHUDElement(`Bomb Type: ${this.bombType}`);
        this.bombsCountElement = this.createHUDElement(`Bombs: ${this.bombsCount}`);
        this.timerElement = this.createHUDElement(`Timer: ${this.formatTime(this.timer)}s`);

        this.hudContainer.appendChild(this.scoreElement);
        this.hudContainer.appendChild(this.livesElement);
        this.hudContainer.appendChild(this.bombTypeElement);
        this.hudContainer.appendChild(this.bombsCountElement);
        this.hudContainer.appendChild(this.timerElement);

        const resumeButton = this.modal.querySelector('button#resume');
        const restartButton = this.modal.querySelector('button#restart');

        restartButton.addEventListener('click', () => {
            window.location.reload(); // Reload the page to restart the game.
        });

        resumeButton.addEventListener('click', () => {
            this.modal.close();
            this.callBackOnPause(); // You can call your onGamePause callback to resume the game.
        });

    }

    createHUDElement(text) {
        const element = document.createElement('div');
        element.className = 'hud-element';
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
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    decrementTimer() {
        this.timer--;
        this.timerElement.innerText = `Timer: ${this.formatTime(this.timer)}s`;
    }

    decrementLives() {
        if (this.lives > 0 && this.canDecrementLives) {
            this.lives -= 1;
            this.livesElement.innerText = `Lives: ${this.lives}`;
            this.canDecrementLives = false
        }    
        // Ajoutez un délai de 3 secondes avant de permettre la prochaine décrémentation
        setTimeout(() => {
            this.canDecrementLives = true;
        }, 3000);
    }

    showPauseMenu() {
        inGameAudio.pause()
        pauseSound.play()
        this.modal.showModal();
    }

    hidePauseMenu() {
        inGameAudio.play()
        if (this.modal) {
            this.modal.close();
        }
    }

    togglePauseResume(gamePause) {
        if (gamePause) {
            this.showPauseMenu();
        } else {
            this.hidePauseMenu();
        }
    }
}
