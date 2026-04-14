export { ActorManager };
import { Player } from "../actors/player.js";
import {
    generateRandomNumber,
    getDistanceBetween,
} from "../helpers/globals.js";

class ActorManager {
    constructor(game) {
        this.game = game;
        this.actors = {
            player: new Player(game),
            enemies: new Set(),
            humans: new Set(),
        };
    }

    update() {
        const { player, enemies, humans } = this.actors;
        if (this.game.debuggerr.shouldUpdateActors) {
            this.updateActors(enemies);
            this.updateActors(humans);
        }
        player.update();
    }

    draw(context) {
        const { player, enemies, humans } = this.actors;
        this.drawActors(enemies, context);
        this.drawActors(humans, context);
        player.draw(context);
    }

    isAwayFromOthers(actor, otherActors, minDistance) {
        if (!minDistance) return true;
        for (const otherActor of otherActors) {
            if (getDistanceBetween(actor, otherActor) < minDistance) {
                return false;
            }
        }
        return true;
    }

    placeActorInRandomPosition(newActor) {
        const minXPosition = 3;
        const minYPosition = 3;
        newActor.screenX = generateRandomNumber(
            minXPosition,
            newActor.movementBoundaries.x
        );
        newActor.screenY = generateRandomNumber(
            minYPosition,
            newActor.movementBoundaries.y
        );
    }

    // Checks if the newActor is at a sufficient distance from other actors before spawning
    isSafeToSpawn(newActor) {
        const { player, enemies, humans } = this.actors;
        const {
            minPlayerSpawnDistance,
            minHumanSpawnDistance,
            minEnemySpawnDistance,
        } = newActor;

        const maxAttempts = 100;
        let attempt = 0;
        
        const centerX = this.game.ui.canvas.width / 2;
        const centerY = this.game.ui.canvas.height / 2;

        while (attempt < maxAttempts) {
            this.placeActorInRandomPosition(newActor);
            
            // Ensure a safe zone around the very center of the screen
            const distFromCenter = Math.hypot(newActor.screenX - centerX, newActor.screenY - centerY);
            
            if (distFromCenter < 200) { // 200-pixel safe zone around the middle
                attempt++;
                continue;
            }

            const playerDistance = getDistanceBetween(newActor, player);
            const isAwayFromPlayer = playerDistance >= minPlayerSpawnDistance;
            const isAwayFromHumans = this.isAwayFromOthers(
                newActor,
                humans,
                minHumanSpawnDistance
            );
            const isAwayFromEnemies = this.isAwayFromOthers(
                newActor,
                enemies,
                minEnemySpawnDistance
            );

            if (isAwayFromPlayer && isAwayFromEnemies && isAwayFromHumans) {
                return true;
            }
            attempt++;
        }
        
        // If we fail to find a perfect spot, just let it spawn wherever it ended up 
        // to avoid infinite loops, BUT force it outside the center safe zone
        const finalDistFromCenter = Math.hypot(newActor.screenX - centerX, newActor.screenY - centerY);
        if (finalDistFromCenter < 200) {
            const angle = Math.atan2(newActor.screenY - centerY, newActor.screenX - centerX);
            newActor.screenX = centerX + Math.cos(angle) * 200;
            newActor.screenY = centerY + Math.sin(angle) * 200;
            
            // Re-apply boundaries in case it gets pushed out of bounds
            if (typeof newActor.stayWithinCanvas === "function") {
                newActor.stayWithinCanvas();
            }
        }
        return true;
    }

    getParentClass(actorType) {
        return Object.getPrototypeOf(actorType).name;
    }

    addActor(newActor, actorType) {
        const type = this.getParentClass(actorType);
        switch (type) {
            case "Human":
                this.actors.humans.add(newActor);
                break;
            case "Enemy":
            case "Spawner":
                this.actors.enemies.add(newActor);
                break;
            case "Obstacle":
                this.actors.obtacles.add(newActor);
                break;
        }
    }

    addActors(numberActors, actorType) {
        for (let i = 0; i < numberActors; i++) {
            const newActor = new actorType(this.game);
            if (this.isSafeToSpawn(newActor)) {
                this.addActor(newActor, actorType);
            }
        }
    }

    addSpawner(spawner, numberEnemies, enemyType) {
        for (let i = 0; i < numberEnemies; i++) {
            const newEnemy = new enemyType(this.game);
            newEnemy.screenX = spawner.screenX;
            newEnemy.screenY = spawner.screenY;
            this.addActor(newEnemy, enemyType);
        }
    }

    updateActors(actors) {
        actors.forEach((actor) => {
            actor.update(this.game);
        });
    }

    drawActors(actors, context) {
        actors.forEach((actor) => {
            actor.draw(context);
        });
    }
}
