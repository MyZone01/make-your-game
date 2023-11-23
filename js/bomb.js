import { destroyWall } from "./board.js";
import { affectEnemies } from "./enemy.js";
import { affectPlayer, affectBombs } from "./game.js";

export default class Bomb {
  constructor(x, y, explosionRadius) {
    this.id = Date.now();
    this.x = x;
    this.y = y;
    this.explosionRadius = explosionRadius;
    this.element = document.createElement("div");
    this.element.classList.add("bomb");
    this.element.style.gridRowStart = this.y;
    this.element.style.gridColumnStart = this.x;
    this.manualBomb = false;
    this.damageScore = 0;
    this.verticalBlast = document.createElement("div")
    this.verticalBlast.classList.add("blast")
    this.element.appendChild(this.verticalBlast)
    this.horizontalBlast = document.createElement("div")
    this.horizontalBlast.classList.add("blast")
    this.element.appendChild(this.horizontalBlast)
  }

  explode() {
    const explodeSound = document.getElementById('explodeSound');
    explodeSound.play();
    this.element.classList.add('exploding');
    affectPlayer(this.x, this.y);
    affectEnemies(this.x, this.y);
    affectBombs(this.x, this.y);
    const directions = [
      { dx: 0, dy: -1, blast: this.verticalBlast, axis: 'top' },
      { dx: 0, dy: 1, blast: this.verticalBlast, axis: 'bottom' },
      { dx: -1, dy: 0, blast: this.horizontalBlast, axis: 'left' },
      { dx: 1, dy: 0, blast: this.horizontalBlast, axis: 'right' },
    ];

    directions.forEach(({ dx, dy, blast, axis }) => {
      for (let i = 1; i <= this.explosionRadius; i++) {
        if (this.explodeInDirection(this.x + dx * i, this.y + dy * i, blast, axis)) {
          blast.style.opacity = '1';
          blast.style[axis] = `-${i * 100}%`;
        } else {
          break;
        }
      }
    });

    return this.damageScore;
  }

  explodeInDirection(x, y) {
    affectPlayer(x, y);
    affectBombs(x, y);
    this.damageScore += affectEnemies(x, y) * 50;
    const isDestroyWall = destroyWall(x - 1, y - 1);
    if (isDestroyWall === 1) {
      this.damageScore += 10
    }
    return isDestroyWall !== 0
  }
}
