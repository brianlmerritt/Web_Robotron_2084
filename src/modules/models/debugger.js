export { Debugger };

// TEMPORARY
class Debugger {
    constructor(game) {
        this.game = game;
        this.shouldDrawHitboxes = false;
        this.playerInvincibility = false;
        this.othersInvincibility = false;
        this.shouldUpdateActors = true;
    }

    processDebugKeys(key) {
        switch (key) {
            case "h":
                this.toggleHitboxes();
                break;
            case "p":
                this.togglePlayerInvincibility();
                break;
            case "o":
                this.toggleOthersInvincibility();
                break;
            case "u":
                this.toggleActorUpdates();
                break;
            case "r":
                this.resetWave();
                break;
        }
    }

    toggleHitboxes() {
        this.shouldDrawHitboxes = !this.shouldDrawHitboxes;
        console.log("DRAW HITBOXES: " + this.shouldDrawHitboxes);
    }

    togglePlayerInvincibility() {
        this.playerInvincibility = !this.playerInvincibility;
        console.log("PLAYER INVINCIBILITY: " + this.playerInvincibility);
    }

    toggleOthersInvincibility() {
        this.othersInvincibility = !this.othersInvincibility;
        console.log("OTHER'S INVINCIBILITY: " + this.othersInvincibility);
    }

    toggleActorUpdates() {
        this.shouldUpdateActors = !this.shouldUpdateActors;
        console.log("UPDATING ACTORS: " + this.shouldUpdateActors);
    }

    resetWave(isStartOfNewWave = false) {
        if (!isStartOfNewWave) {
            // Keep the wave the same if it's just a player restart/debug restart
            // Otherwise currentWave is already incremented by game.advanceWave
        }
        
        const { projectiles } = this.game.projectileMngr;
        const { enemies, humans, obstacles, player } = this.game.actorMngr.actors;
        enemies.clear();
        humans.clear();
        obstacles.clear();
        projectiles.player.clear();
        projectiles.enemies.clear();
        player.currentState = "alive";
        player.centerOnCanvas(this.game.ui.canvas);
        player.spritesheetX = 0;
        player.spritesheetY = 0;
        
        // Let game tick for a moment safely
        this.game.globalTimer = 0;
        this.game.spawnActors();
        
        // Clear a safe zone in the center upon starting the wave
        const cx = player.screenX + player.width / 2;
        const cy = player.screenY + player.height / 2;
        const safeRadius = 250;
        for (const enemy of enemies) {
            const dx = (enemy.screenX + enemy.width / 2) - cx;
            const dy = (enemy.screenY + enemy.height / 2) - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < safeRadius) {
                const angle = dist === 0 ? Math.random() * Math.PI * 2 : Math.atan2(dy, dx);
                enemy.screenX = cx + Math.cos(angle) * safeRadius - enemy.width / 2;
                enemy.screenY = cy + Math.sin(angle) * safeRadius - enemy.height / 2;
                
                if (typeof enemy.stayWithinCanvas === "function") {
                    enemy.stayWithinCanvas();
                }
            }
        }
    }

    // Not 100% accurate due to rect() limitations
    drawHitboxes(actor, context) {
        if (this.shouldDrawHitboxes) {
            context.beginPath();
            if (actor.angle !== undefined) {
                // Projectiles only
                const halfWidth = actor.width / 2;
                const halfHeight = actor.height / 2;
                const centerX = actor.screenX + halfWidth;
                const centerY = actor.screenY + halfHeight;
                context.translate(centerX, centerY);
                context.rotate(actor.angle);
                context.rect(
                    -halfWidth,
                    -halfHeight,
                    actor.width,
                    actor.height
                );
            } else {
                for (const limb in actor.hitboxes) {
                    const hitbox = actor.hitboxes[limb];
                    context.rect(
                        actor.screenX + hitbox.xPosition,
                        actor.screenY + hitbox.yPosition,
                        hitbox.width,
                        hitbox.height
                    );
                }
            }
            context.strokeStyle = "yellow";
            context.stroke();
            context.setTransform(1, 0, 0, 1, 0, 0); // Resets the context transformation
        }
    }

    logActorCount(game) {
        console.log("Humans: " + game.actorMngr.actors.humans.size);
        console.log("Enemies: " + game.actorMngr.actors.enemies.size);
    }
}
