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
    }

    update() {
        const { score, ui, soundMngr, actorMngr, stateMngr } = this;
        const player = actorMngr.actors.player;
        
        // Input should always be checked so the user can press Start
        this.inputMngr.update(player);
        
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
    }

    restartGame() {
        this.currentWave = 1;
        this.score.currentScore = 0;
        this.score.rescueBonus = 0;
        this.score.nextExtraLife = 25000;
        this.actorMngr.actors.player.lives = 3;
        this.debuggerr.resetWave(true);
    }

    draw() {
        const { ui, uiMngr, actorMngr, projectileMngr } = this;
        uiMngr.clearPreviousFrameSprites(ui);
        actorMngr.draw(ui.context);
        projectileMngr.draw(this, ui.context);
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
        // Note: For actual spawn logic, we might need to include logic for Brain, Enforcers, Tanks, etc.
        // based on configurations if they start scaling in later waves.
    }
}
