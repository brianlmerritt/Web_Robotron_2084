export { Game };
import { Score } from "./score.js";
import { UserInterface } from "./ui.js";
import { SpriteManager } from "../managers/sprite-mngr.js";
import { HitboxManager } from "../managers/hitbox-mngr.js";
import { UIManager } from "../managers/ui-mngr.js";
import { SoundManager } from "../managers/sound-mngr.js";
import { ActorManager } from "../managers/actor-mngr.js";
import { ProjectileManager } from "../managers/projectile-mngr.js";
import { InputManager } from "../managers/input-mngr.js";
import { CollisionManager } from "../managers/collision-mngr.js";
import { StateManager } from "../managers/state-mngr.js";
import { Debugger } from "./debugger.js";

import { Grunt } from "../actors/enemies/grunt.js";
import { Hulk } from "../actors/enemies/hulk.js";
import { Mommy } from "../actors/humans/mommy.js";
import { Daddy } from "../actors/humans/daddy.js";
import { Mikey } from "../actors/humans/mikey.js";
import { Spheroid } from "../actors/enemies/spheroid.js";
import { Quark } from "../actors/enemies/quark.js";
import { Electrode } from "../actors/obstacles/electrode.js";
import { getWaveConfig } from "../helpers/waves.js";

// Updates and draws all game elements. Instantiated in main.js
class Game {
    constructor() {
        this.globalTimer = 0;
        this.score = new Score();
        this.spriteMngr = new SpriteManager();
        this.hitboxMngr = new HitboxManager();
        this.ui = new UserInterface(this);
        this.uiMngr = new UIManager();
        this.soundMngr = new SoundManager();
        this.actorMngr = new ActorManager(this);
        this.projectileMngr = new ProjectileManager();
        this.inputMngr = new InputManager(this);
        this.collisionMngr = new CollisionManager();
        this.stateMngr = new StateManager(this);
        this.debuggerr = new Debugger(this);
        this.currentWave = 1;
        this.isWaitingToStart = true;
        this.isPaused = false;
        this.isTransitioning = false;
        this.transitionPhase = "in";
        this.transitionTimer = 0;
        
        // Show start screen strictly on load
        setTimeout(() => {
            const startScreen = document.getElementById("start-screen");
            if (startScreen) startScreen.style.display = "flex";
        }, 100);
    }

    startTransition() {
        this.isTransitioning = true;
        this.transitionPhase = "in";
        this.transitionTimer = 0;
        this.soundMngr.playSound("regularWave");
    }

    update() {
        const { score, ui, soundMngr, actorMngr, stateMngr } = this;
        const player = actorMngr.actors.player;
        
        // Input should always be checked so the user can press Start
        this.inputMngr.update(player);

        if (this.isWaitingToStart) {
            this.uiMngr.update(score, ui, actorMngr, this);
            return;
        }

        if (this.isPaused) {
            // Do not update game logic or animations while paused
            return;
        }

        if (this.isTransitioning) {
            const speed = 7; // Speed of the concentric lines
            
            if (this.transitionPhase === "in") {
                this.transitionTimer += speed;
                const maxDepth = ui.canvas.width / 2;
                if (this.transitionTimer >= maxDepth) {
                    this.transitionPhase = "out";
                    this.transitionTimer = maxDepth;
                }
            } else {
                this.transitionTimer -= speed;
                if (this.transitionTimer <= 0) {
                    this.isTransitioning = false;
                    this.transitionTimer = 0;
                }
            }
            return;
        }
        
        if (!stateMngr.isDestroyed(player)) {
            actorMngr.update();
            this.collisionMngr.update(this);
            score.update(player, soundMngr);
            stateMngr.update();
            this.uiMngr.update(score, ui, actorMngr, this);
            this.checkWaveCompletion();
        }
    }

    checkWaveCompletion() {
        const enemies = this.actorMngr.actors.enemies;
        let hasVulnerableEnemies = false;

        // Hulks are indestructible
        for (const enemy of enemies) {
            if (enemy.constructor.name !== "Hulk") {
                hasVulnerableEnemies = true;
                break;
            }
        }

        if (!hasVulnerableEnemies && enemies.size > 0 && this.globalTimer > 60) {
            // Need the globalTimer check so it doesn't instantly trigger on frame 1
            this.advanceWave();
        } else if (enemies.size === 0 && this.globalTimer > 60) {
            this.advanceWave();
        }
    }

    advanceWave() {
        this.currentWave++;
        this.actorMngr.actors.player.lives++;
        this.score.resetRescueBonus();
        this.debuggerr.resetWave(true); 
        this.startTransition();
    }

    restartGame() {
        this.currentWave = 1;
        this.score.currentScore = 0;
        this.score.rescueBonus = 0;
        this.score.nextExtraLife = 25000;
        this.actorMngr.actors.player.lives = 3;
        this.debuggerr.resetWave(true);
        this.isWaitingToStart = true;
        this.isPaused = false;
        
        const startScreen = document.getElementById("start-screen");
        if (startScreen) {
            startScreen.style.display = "flex";
            const prompt = document.getElementById("start-prompt");
            if (prompt) prompt.innerText = "PRESS START OR ENTER TO PLAY";
        }
        
        const pauseScreen = document.getElementById("pause-screen");
        if (pauseScreen) pauseScreen.style.display = "none";
    }

    togglePause() {
        if (this.isWaitingToStart) return;
        this.isPaused = !this.isPaused;
        const pauseScreen = document.getElementById("pause-screen");
        if (pauseScreen) {
            pauseScreen.style.display = this.isPaused ? "flex" : "none";
        }
    }

    draw() {
        const { ui, uiMngr, actorMngr, projectileMngr } = this;
        uiMngr.clearPreviousFrameSprites(ui);
        actorMngr.draw(ui.context);
        projectileMngr.draw(this, ui.context);

        if (this.isTransitioning) {
            this.drawTransition(ui.context, ui.canvas);
        }
    }

    drawTransition(ctx, canvas) {
        const cw = canvas.width;
        const ch = canvas.height;
        const cx = cw / 2;
        const cy = ch / 2;
        
        ctx.fillStyle = "black";
        if (this.transitionPhase === "in") {
            // Screen fills black fully, lines draw on top
            ctx.fillRect(0, 0, cw, ch);
        } else {
            // Draw a mask with a hole exactly mapping to transition depth to reveal level
            const holeW = cw - this.transitionTimer * 2;
            const holeH = ch - this.transitionTimer * (ch / cw) * 2;
            
            ctx.beginPath();
            ctx.rect(0, 0, cw, ch); // Outer clockwise mask
            if (holeW > 0 && holeH > 0) {
                // Inner counter-clockwise mask punch out
                ctx.rect(cx + holeW/2, cy - holeH/2, -holeW, holeH); 
            }
            ctx.fill();
        }
        
        // Draw the concentric colored neon rectangles over the black parts
        const colors = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff0000", "#0000ff", "#ff8800"];
        ctx.lineWidth = 4;
        
        for (let d = 0; d <= Math.round(this.transitionTimer); d += 15) {
            ctx.strokeStyle = colors[Math.floor(d / 15) % colors.length];
            const rw = cw - d * 2;
            const rh = ch - d * (ch / cw) * 2;
            if (rw > 0 && rh > 0) {
                ctx.strokeRect(cx - rw/2, cy - rh/2, rw, rh);
            }
        }
    }

    spawnActors() {
        const { actorMngr } = this;
        const waveConfig = getWaveConfig(this.currentWave);

        actorMngr.addActors(waveConfig.Daddy || 0, Daddy);
        actorMngr.addActors(waveConfig.Mommy || 0, Mommy);
        actorMngr.addActors(waveConfig.Mikey || 0, Mikey);
        actorMngr.addActors(waveConfig.Hulk || 0, Hulk);
        actorMngr.addActors(waveConfig.Spheroid || 0, Spheroid);
        actorMngr.addActors(waveConfig.Quark || 0, Quark);
        actorMngr.addActors(waveConfig.Grunt || 0, Grunt);
        actorMngr.addActors(waveConfig.Electrode || 0, Electrode);
        // Ensure you import Brain, Enforcer and Prog in your imports when making their classes
        // actorMngr.addActors(waveConfig.Enforcer || 0, Enforcer);
        // actorMngr.addActors(waveConfig.Brain || 0, Brain);
        // actorMngr.addActors(waveConfig.Prog || 0, Prog);
    }
}
