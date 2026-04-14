export { Player };
import { Actor } from "../models/actor.js";

class Player extends Actor {
    constructor(game) {
        super(game, 14, 24);
        this.screenX = game.ui.canvas.width / 2 - this.originalWidth / 2;
        this.screenY = game.ui.canvas.height / 2 - this.originalHeight / 2;
        this.lives = 3; // Updated in collisionMngr.checkPlayerCollision
        this.movementSpeed = 3.8;
        this.animationDelay = 2;
        this.projectileSpeed = 25;
        this.projectileTimer = 0;
        this.projectileDelay = 7;
        this.hitboxConfig = {
            up: {
                head: { width: 17, xPosition: 2, yPosition: 1 },
                torso: { width: 15, height: 8, xPosition: 3, yPosition: 14 },
                rightArm: { width: 3, height: 6, xPosition: 0, yPosition: 18 },
                leftArm: { width: 3, height: 6, xPosition: 18, yPosition: 18 },
                legs: { width: 9, height: 7, xPosition: 6 },
            },
            down: {
                head: { width: 17, height: 9, xPosition: 2, yPosition: 3 },
                torso: { width: 15, height: 8, xPosition: 3, yPosition: 15 },
                rightArm: { width: 3, height: 6, xPosition: 0, yPosition: 18 },
                leftArm: { width: 3, height: 6, xPosition: 18, yPosition: 18 },
                legs: { width: 9, height: 7, xPosition: 6, yPosition: 23 },
            },
            left: {
                head: { width: 11, xPosition: 4, yPosition: 2 },
                torso: { width: 8, height: 11, xPosition: 6, yPosition: 16 },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 6, height: 12, xPosition: 7 },
            },
            right: {
                head: { width: 11, xPosition: 6, yPosition: 2 },
                torso: { width: 8, height: 11, xPosition: 7, yPosition: 16 },
                rightArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                leftArm: {
                    width: 0,
                    height: 0,
                    xPosition: this.hiddenHitboxPosition,
                    yPosition: this.hiddenHitboxPosition,
                },
                legs: { width: 6, height: 12, xPosition: 8 },
            },
        };
        game.hitboxMngr.setAllHitboxes(this);
    }

    update() {
        this.updateProjectileTimer();
    }

    getProjectileOffsets(direction) {
        const offsets = {
            up: { x: 9, y: 0 },
            down: { x: 9, y: 16 },
            left: { x: 9, y: 9 },
            right: { x: 9, y: 9 },
            upleft: { x: 16, y: 0 },
            upright: { x: 0, y: 0 },
            downleft: { x: 16, y: 0 },
            downright: { x: 0, y: 0 },
        };
        return offsets[direction];
    }

    // Called in inputMngr.processShootingKeys
    shoot(direction) {
        const { projectileMngr, soundMngr } = this.game;
        const { screenX, screenY, projectileSpeed, projectileDelay } = this;
        const { x: xOffset, y: yOffset } = this.getProjectileOffsets(direction);
        const playerX = screenX + xOffset;
        const playerY = screenY + yOffset;
        if (this.canShoot()) {
            projectileMngr.createProjectile(
                this,
                playerX,
                playerY,
                projectileSpeed,
                direction
            );
            this.projectileTimer = projectileDelay;
            soundMngr.playSound("playerShot");
        }
    }

    // Methods below called in inputMngr.processMovementKeys
    moveUp(inputMngr) {
        this.screenY -= this.movementSpeed;
        if (inputMngr.isPressingWOnly() || inputMngr.isPressingDnA()) {
            this.animate(this, "up");
        }
    }

    moveDown(inputMngr) {
        this.screenY += this.movementSpeed;
        if (inputMngr.isPressingSOnly() || inputMngr.isPressingDnA()) {
            this.animate(this, "down");
        }
    }

    moveLeft(inputMngr) {
        if (!inputMngr.isPressingD()) {
            this.screenX -= this.movementSpeed;
            this.animate(this, "left");
        }
    }

    moveRight(inputMngr) {
        if (!inputMngr.isPressingA()) {
            this.screenX += this.movementSpeed;
            this.animate(this, "right");
        }
    }
}
