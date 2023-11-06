import { timerManager } from "./timer.js";

export class PowerUp {
    constructor(type) {
        this.id = Date.now();
        this.type = type;
        this.duration = 15; // in seconds
    }

    applyEffect(player) {
        if (this.type === 'X') {
            player.increaseBombCount();
            timerManager.addTimer(this.id, () => {
                player.resetBombCount();
            }, this.duration * 1000);
            timerManager.startTimer(this.id);
        } else if (this.type === 'S') {
            player.changeBombType('super');
            timerManager.addTimer(this.id, () => {
                player.changeBombType('simple');
            }, this.duration * 1000);
        } else if (this.type === 'M') {
            player.changeBombType('manual');
            timerManager.addTimer(this.id, () => {
                player.changeBombType('simple');
            }, this.duration * 1000);
        }
    }
}
