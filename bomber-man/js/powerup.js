export class PowerUp {
    constructor(type) {
        this.type = type;
        this.duration = 10;
    }

    applyEffect(player) {
        if (this.type === 'X') {
            player.increaseBombCount();
        } else if (this.type === 'S') {
            player.changeBombType('super');
        } else if (this.type === 'M') {
            player.changeBombType('manual');
        }
    }
}
