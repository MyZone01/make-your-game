export class PowerUp {
    constructor(type) {
        this.id = Date.now();
        this.type = type;
        this.duration = 15 * 1000; // in seconds
    }

    applyEffect(game) {
        if (this.type === 'X') {
            game.increaseBombCount();
            game.timerManager.addTimer(this.id, () => {
                game.resetBombCount();
            }, this.duration);
            game.timerManager.startTimer(this.id);
        } else if (this.type === 'S') {
            game.changeBombType('super');
            game.timerManager.addTimer(this.id, () => {
                game.changeBombType('simple');
            }, this.duration);
            game.timerManager.startTimer(this.id);
        } else if (this.type === 'M') {
            game.changeBombType('manual');
            game.timerManager.addTimer(this.id, () => {
                game.changeBombType('simple');
            }, this.duration);
            game.timerManager.startTimer(this.id);
        }
    }
}
