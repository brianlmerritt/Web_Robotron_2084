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

        const deadzone = 0.2;

        // Left Joystick (Movement: W, S, A, D)
        const leftX = gp.axes[0];
        const leftY = gp.axes[1];

        if (leftY < -deadzone) this.input.keysPressed.push("js_w");
        if (leftY > deadzone) this.input.keysPressed.push("js_s");
        if (leftX < -deadzone) this.input.keysPressed.push("js_a");
        if (leftX > deadzone) this.input.keysPressed.push("js_d");

        // Right Joystick (Shooting: Arrows)
        // Some controllers use axes 2 & 3 for right stick
        const rightX = gp.axes[2];
        const rightY = gp.axes[3];

        if (rightY < -deadzone) this.input.keysPressed.push("js_arrowup");
        if (rightY > deadzone) this.input.keysPressed.push("js_arrowdown");
        if (rightX < -deadzone) this.input.keysPressed.push("js_arrowleft");
        if (rightX > deadzone) this.input.keysPressed.push("js_arrowright");

        // Start Button (usually button 9 on Xbox controller)
        const isStartPressed = gp.buttons[9] && gp.buttons[9].pressed;
        if (isStartPressed && !this.wasStartPressed) {
            // Trigger Reset wave / Start
            player.game.debuggerr.processDebugKeys("r");
        }
        this.wasStartPressed = isStartPressed;
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
