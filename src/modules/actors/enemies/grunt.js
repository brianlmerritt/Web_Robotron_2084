export { Grunt };
import { Enemy } from "../../models/enemy.js";

class Grunt extends Enemy {
    constructor(game) {
        super(game, 18, 27);
        this.pointsAwarded = 100;
        this.baseMovementSpeed = 8;
        this.movementSpeed = this.baseMovementSpeed;
        this.movementTimer = 0;
        this.baseMovementInterval = 10;
        this.movementInterval = this.baseMovementInterval;
        this.framesAlive = 0;
        this.hitboxes = {
            head: { width: 10, height: 11, xPosition: 8, yPosition: 0 },
            torso: { width: 20, height: 10, xPosition: 4, yPosition: 12 },
            rightArm: { width: 3, height: 12, xPosition: 0, yPosition: 12 },
            leftArm: { width: 3, height: 12, xPosition: 24, yPosition: 12 },
            legs: { width: 15, height: 10, xPosition: 6, yPosition: 23 },
        };
    }

    update(game) {
        // Ramp up speed over 10 seconds (assuming ~60 FPS = 600 frames)
        if (this.framesAlive < 600) {
            this.framesAlive++;
            let rampFactor = this.framesAlive / 600;
            // Ramp interval from 10 down to 5 to double movement frequency
            this.movementInterval = this.baseMovementInterval - (rampFactor * 5);
        }

        this.move(game);
    }

    canMove() {
        return this.movementTimer > this.movementInterval;
    }

    move(game) {
        if (this.canMove()) {
            this.ai.moveAtRandomIntervals(this, game);
            this.stayWithinCanvas();
            this.movementTimer = 0;
        } else {
            this.movementTimer++;
        }
    }
}
