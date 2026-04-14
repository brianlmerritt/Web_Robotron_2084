export { InputManager };
import { Input } from "../models/input.js";

class InputManager {
    constructor(game) {
        // REMOVE GAME WITH DEBUGGER
        this.input = new Input(game);
    }

    update(player) {
        this.updateGamepadInput(player);
        if (player.currentState === "alive") {
            this.processMovementKeys(player);
            this.processShootingKeys(player);
        }
    }

    updateGamepadInput(player) {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0];
        
        // Remove existing virtual joystick keys
        this.input.keysPressed = this.input.keysPressed.filter(key => !key.startsWith("js_"));
        
        if (!gp) return;

        const getKeysFromAxes = (x, y, bindings) => {
            const keys = [];
            // Use a radial deadzone
            if (Math.hypot(x, y) < 0.25) return keys;
            
            const angle = Math.atan2(y, x);
            // Divides the circle into 8 equal 45-degree slices
            // This perfectly balances orthogonal vs diagonal inputs
            const slice = Math.round(angle / (Math.PI / 4)); // -4 to +4
            
            if (slice === 0 || slice === 1 || slice === -1) keys.push(bindings.right);
            if (slice === 4 || slice === -4 || slice === 3 || slice === -3) keys.push(bindings.left);
            if (slice === 2 || slice === 1 || slice === 3) keys.push(bindings.down);
            if (slice === -2 || slice === -1 || slice === -3) keys.push(bindings.up);
            
            return keys;
        };

        // Left Joystick (Movement: W, S, A, D)
        const leftKeys = getKeysFromAxes(gp.axes[0], gp.axes[1], {
            up: "js_w", down: "js_s", left: "js_a", right: "js_d"
        });
        this.input.keysPressed.push(...leftKeys);

        // Right Joystick (Shooting: Arrows)
        // Some controllers use axes 2 & 3 for right stick
        const rightKeys = getKeysFromAxes(gp.axes[2], gp.axes[3], {
            up: "js_arrowup", down: "js_arrowdown", left: "js_arrowleft", right: "js_arrowright"
        });
        this.input.keysPressed.push(...rightKeys);

        // Start Button (usually button 9 on Xbox controller)
        const isStartPressed = gp.buttons[9] && gp.buttons[9].pressed;
        this.handleStartAction(player, isStartPressed);
        this.wasStartPressed = isStartPressed;

        // Select / Back Button (usually button 8 on Xbox controller)
        const isSelectPressed = gp.buttons[8] && gp.buttons[8].pressed;
        if (isSelectPressed && !this.wasSelectPressed) {
            player.game.restartGame();
        }
        this.wasSelectPressed = isSelectPressed;
    }

    handleStartAction(player, isStartPressed) {
        // Also allow Enter key or Start Gamepad Button
        const isEnterPressed = this.isKeyPressed("enter");
        
        if ((isStartPressed && !this.wasStartPressed) || (isEnterPressed && !this.wasEnterPressed)) {
            const prompt = document.getElementById("start-prompt");

            if (player.game.isWaitingToStart && player.lives > 0) {
                player.game.isWaitingToStart = false;
                const startScreen = document.getElementById("start-screen");
                if (startScreen) startScreen.style.display = "none";
                if (prompt) prompt.innerText = "PRESS START OR ENTER TO PLAY";
                player.game.startTransition(); // Automatically kick off transition directly from idle screen
                return;
            }

            if (player.lives <= 0) {
                if (prompt) prompt.innerText = "PRESS START OR ENTER TO PLAY";
                player.game.restartGame();
            } else {
                player.game.debuggerr.processDebugKeys("r");
            }
        }
        this.wasEnterPressed = isEnterPressed;
    }

    isKeyPressed(key) {
        return this.input.keysPressed.includes(key) || this.input.keysPressed.includes("js_" + key);
    }

    isPressingCombination(keys) {
        return keys.every((key) => this.isKeyPressed(key));
    }

    processKeyFunction(player, key, method) {
        if (this.isKeyPressed(key)) {
            player[method](this);
            player.stayWithinCanvas(); // Causes visual glitch if in player.update
        }
    }

    processMovementKeys(player) {
        this.processKeyFunction(player, "w", "moveUp");
        this.processKeyFunction(player, "s", "moveDown");
        this.processKeyFunction(player, "a", "moveLeft");
        this.processKeyFunction(player, "d", "moveRight");
    }

    processShootingKeys(player) {
        if (this.isPressingUpOnly()) {
            player.shoot("up");
        } else if (this.isPressingUpAndLeft()) {
            player.shoot("upleft");
        } else if (this.isPressingUpAndRight()) {
            player.shoot("upright");
        }
        if (this.isPressingDownOnly()) {
            player.shoot("down");
        } else if (this.isPressingDownAndLeft()) {
            player.shoot("downleft");
        } else if (this.isPressingDownAndRight()) {
            player.shoot("downright");
        }
        if (this.isPressingLeftOnly()) {
            player.shoot("left");
        } else if (this.isPressingRightOnly()) {
            player.shoot("right");
        }
    }

    //   Shooting methods
    isPressingUpOnly() {
        return (
            this.isKeyPressed("arrowup") &&
            !this.isKeyPressed("arrowleft") &&
            !this.isKeyPressed("arrowright")
        );
    }

    isPressingUpAndLeft() {
        return this.isKeyPressed("arrowup") && this.isKeyPressed("arrowleft");
    }

    isPressingUpAndRight() {
        return this.isKeyPressed("arrowup") && this.isKeyPressed("arrowright");
    }

    isPressingDownOnly() {
        return (
            this.isKeyPressed("arrowdown") &&
            !this.isKeyPressed("arrowleft") &&
            !this.isKeyPressed("arrowright")
        );
    }

    isPressingDownAndLeft() {
        return this.isKeyPressed("arrowdown") && this.isKeyPressed("arrowleft");
    }

    isPressingDownAndRight() {
        return (
            this.isKeyPressed("arrowdown") && this.isKeyPressed("arrowright")
        );
    }

    isPressingLeftOnly() {
        return (
            this.isKeyPressed("arrowleft") &&
            !this.isKeyPressed("arrowup") &&
            !this.isKeyPressed("arrowdown")
        );
    }

    isPressingRightOnly() {
        return (
            this.isKeyPressed("arrowright") &&
            !this.isKeyPressed("arrowup") &&
            !this.isKeyPressed("arrowdown")
        );
    }

    //   Movement methods
    isPressingWOnly() {
        return (
            !this.isKeyPressed("d") &&
            !this.isKeyPressed("a") &&
            !this.isKeyPressed("s")
        );
    }

    isPressingSOnly() {
        return (
            !this.isKeyPressed("d") &&
            !this.isKeyPressed("w") &&
            !this.isKeyPressed("a")
        );
    }

    isPressingA() {
        return this.isKeyPressed("a");
    }

    isPressingD() {
        return this.isKeyPressed("d");
    }

    isPressingDnA() {
        return this.isPressingCombination(["d", "a"]);
    }
}
