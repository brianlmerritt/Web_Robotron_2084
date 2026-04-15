export { Obstacle };

class Obstacle {
    constructor(game, size) {
        this.game = game;
        this.currentState = "alive";
        this.size = size;
        this.width = size;
        this.height = size;
        this.screenX = 0;
        this.screenY = 0;
        this.minPlayerSpawnDistance = 200;
        this.minHumanSpawnDistance = 0;
        this.minEnemySpawnDistance = 40;
        this.setMovementBoundaries(game);
        this.hitboxes = {
            itself: { width: size, height: size, xPosition: 0, yPosition: 0 },
        };
    }

    setMovementBoundaries(game) {
        const { ui } = game;
        this.movementBoundaries = {
            x: ui.canvas.width - this.width,
            y: ui.canvas.height - this.height,
        };
    }

    stayWithinCanvas() {
        if (this.screenX <= 2) this.screenX = 2;
        else if (this.screenX >= this.movementBoundaries.x) this.screenX = this.movementBoundaries.x;
        if (this.screenY <= 2) this.screenY = 2;
        else if (this.screenY >= this.movementBoundaries.y) this.screenY = this.movementBoundaries.y;
    }

    update() {
        // Static — no movement
    }
}
