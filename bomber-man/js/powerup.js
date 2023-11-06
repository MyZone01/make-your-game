export class PowerUp {
    constructor(type) {
        this.type = type;
        this.duration = 5; // in second
    }

    applyEffect(player) {
        if (this.type === 'X') {
            player.increaseBombCount();
            // TODO: Use the same logic in bomb timer to pause the timer when the game is paused
            setTimeout(() => {
                player.resetBombCount();
            }, this.duration * 1000);
        } else if (this.type === 'S') {
            player.changeBombType('super');
            setTimeout(() => {
                player.changeBombType('simple');
            }, this.duration * 1000);
        } else if (this.type === 'M') {
            player.changeBombType('manual');
            setTimeout(() => {
                player.changeBombType('simple');
            }, this.duration * 1000);
        }
    }
}
