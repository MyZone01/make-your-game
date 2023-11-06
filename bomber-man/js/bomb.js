import { destroyWall } from "./board.js";
import { affectEnemies } from "./enemy.js";
import { affectPlayer } from "./game.js";

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
  }

  explode() {
    this.element.classList.add("explosion");
    let keepUpDirection = true;
    let keepDownDirection = true;
    let keepLeftDirection = true;
    let keepRightDirection = true;
    for (let i = 1; i <= this.explosionRadius; i++) {
      if (keepUpDirection) {
        keepUpDirection = this.explodeInDirection(this.x, this.y - i); // Up
      }
      if (keepDownDirection) {
        keepDownDirection = this.explodeInDirection(this.x, this.y + i); // Down
      }
      if (keepLeftDirection) {
        keepLeftDirection = this.explodeInDirection(this.x - i, this.y); // Left
      }
      if (keepRightDirection) {
        keepRightDirection = this.explodeInDirection(this.x + i, this.y); // Right
      }
    }
    return this.damageScore
  }

  explodeInDirection(x, y) {
    affectPlayer(x, y);
    this.damageScore += affectEnemies(x, y) * 50;
    const isDestroyWall = destroyWall(x - 1, y - 1);
    if (isDestroyWall === 1) {
      this.damageScore += 10
      console.log(this.damageScore);
    }
    return isDestroyWall !== 0
  }
}
