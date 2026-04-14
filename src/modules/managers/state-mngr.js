export { StateManager };
import { isActorOfType } from "../helpers/globals.js";

class StateManager {
    constructor(game) {
        this.game = game;
        this.score = game.score;
        this.soundMngr = game.soundMngr;
        this.projectileMngr = game.projectileMngr;
        this.actors = game.actorMngr.actors;
        this.projectiles = game.projectileMngr.projectiles;
        this.player = this.actors.player;
    }

    update() {
        this.handleAllStates();
    }

    isDestroyed(actor) {
        return actor.currentState === "destroyed";
    }

    handlePlayerDestroyed() {
        if (this.isDestroyed(this.player)) {
            this.player.lives--;
            this.score.resetRescueBonus();
            this.soundMngr.playSound("playerDestroyed");
            this.projectileMngr.eraseAllPlayerProjectiles();

            if (this.player.lives > 0) {
                setTimeout(() => {
                    this.player.currentState = "alive";
                    this.player.screenX = this.game.ui.canvas.width / 2 - this.player.originalWidth;
                    this.player.screenY = this.game.ui.canvas.height / 2 - this.player.originalHeight;
                    this.player.spritesheetX = 0;
                    this.player.spritesheetY = 0;
                    this.projectiles.enemies.clear();
                    
                    // Clear a safe zone in the center
                    const cx = this.game.ui.canvas.width / 2;
                    const cy = this.game.ui.canvas.height / 2;
                    const safeRadius = 250;

                    for (const enemy of this.actors.enemies) {
                        const dx = (enemy.screenX + enemy.width / 2) - cx;
                        const dy = (enemy.screenY + enemy.height / 2) - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < safeRadius) {
                            const angle = dist === 0 ? Math.random() * Math.PI * 2 : Math.atan2(dy, dx);
                            enemy.screenX = cx + Math.cos(angle) * safeRadius - enemy.width / 2;
                            enemy.screenY = cy + Math.sin(angle) * safeRadius - enemy.height / 2;
                            if (typeof enemy.stayWithinCanvas === "function") {
                                enemy.stayWithinCanvas();
                            }
                        }
                    }
                    
                    this.game.startTransition();
                }, 2000);
            } else {
                // Game Over logic: show the Start Screen but allow them to restart
                setTimeout(() => {
                    const startScreen = document.getElementById("start-screen");
                    if (startScreen) {
                        const prompt = document.getElementById("start-prompt");
                        if (prompt) prompt.innerText = "GAME OVER - PRESS START TO PLAY AGAIN";
                        startScreen.style.display = "flex";
                    }
                }, 2000);
            }
        }
    }

    handleHumanDestroyed(human) {
        if (this.isDestroyed(human)) {
            this.actors.humans.delete(human);
            this.soundMngr.playSound("humanDestroyed");
        }
    }

    isHumanRecued(human) {
        return human.currentState === "rescued";
    }

    handleHumanRescued(human) {
        if (this.isHumanRecued(human)) {
            this.score.awardRecuePoints(human);
            this.actors.humans.delete(human);
            this.soundMngr.playSound("humanRescued");
        }
    }

    handleHumanStates() {
        for (const human of this.actors.humans) {
            this.handleHumanDestroyed(human);
            this.handleHumanRescued(human);
        }
    }

    handleEnemyDestroyed(enemy) {
        if (this.isDestroyed(enemy)) {
            this.score.awardPoints(enemy);
            this.actors.enemies.delete(enemy);
            if (isActorOfType(enemy, "Spheroid")) {
                this.soundMngr.playSound("spheroidDestroyed");
                return;
            }
            if (isActorOfType(enemy, "Quark")) {
                this.soundMngr.playSound("quarkDestroyed");
                return;
            }
            this.soundMngr.playSound("enemyDestroyed");
        }
    }

    isEnemySpawner(enemy) {
        return (
            isActorOfType(enemy, "Spheroid") || isActorOfType(enemy, "Quark")
        );
    }

    isSpawnerSpawning(spawner) {
        return spawner.currentState === "spawning";
    }

    handleSpawnerSpawning(spawner) {
        if (this.isSpawnerSpawning(spawner)) {
            spawner.startingSprite = 0;
            spawner.lastSprite = 7;
            spawner.animationDelay = 3;
            spawner.spawnEnemies();
        }
    }

    isSpawnerVanished(spawner) {
        return spawner.currentState === "vanished";
    }

    // Wait for the last sprite before vanishing
    handleSpawnerVanishing(spawner) {
        if (this.isSpawnerVanished(spawner)) {
            spawner.fadeOut();
            if (spawner.currentSprite === spawner.lastSprite) {
                setTimeout(() => {
                    this.actors.enemies.delete(spawner);
                }, 80);
            }
        }
    }

    handleEnemyStates() {
        for (const enemy of this.actors.enemies) {
            this.handleEnemyDestroyed(enemy);
            if (this.isEnemySpawner(enemy)) {
                this.handleSpawnerSpawning(enemy);
                this.handleSpawnerVanishing(enemy);
            }
        }
    }

    shouldDeleteProjectile(projectile) {
        return (
            projectile.currentState === "outOfBounds" ||
            projectile.currentState === "destroyed" ||
            projectile.currentState === "vanished"
        );
    }

    destroyedProjectileAwardsPoints(projectile) {
        return projectile.pointsAwarded && this.isDestroyed(projectile);
    }

    handleProjectileStates() {
        Object.values(this.projectiles).forEach((projectileSet) => {
            projectileSet.forEach((projectile) => {
                if (this.shouldDeleteProjectile(projectile)) {
                    projectileSet.delete(projectile);
                    if (this.destroyedProjectileAwardsPoints(projectile)) {
                        this.game.score.awardPoints(projectile);
                        this.soundMngr.playSound("projectileDestroyed");
                    }
                } else {
                    projectile.update(this.game);
                }
            });
        });
    }

    handleAllStates() {
        this.handlePlayerDestroyed();
        this.handleHumanStates();
        this.handleEnemyStates();
        this.handleProjectileStates();
    }
}
