export { Input };

class Input {
    constructor(game) {
        // REMOVE GAME WITH DEBUGGER
        this.keysPressed = [];
        this.playerControls = [
            "w",
            "a",
            "s",
            "d",
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
            "enter"
        ];
        this.listenToPlayerControls(game);
    }

    isPlayerKeyStored(key) {
        return (
            this.playerControls.includes(key) && this.keysPressed.includes(key)
        );
    }

    // Stores one instance of each pressed playerControls key in keysPressed
    handlePressedKey(event, keysPressed) {
        const key = event.key.toLowerCase();
        if (!this.isPlayerKeyStored(key)) {
            keysPressed.push(key);
        }
    }

    isKeyUnpressed(keyIndex) {
        return keyIndex > -1;
    }

    // Removes the key from keysPressed when unpressed
    handleUnpressedKey(event, game, keysPressed) {
        const key = event.key.toLowerCase();
        const keyIndex = keysPressed.indexOf(key);
        if (this.isKeyUnpressed(keyIndex)) {
            keysPressed.splice(keyIndex, 1);
        }
        game.debuggerr.processDebugKeys(key);
    }

    listenToPlayerControls(game) {
        const { keysPressed } = this;
        window.addEventListener("keydown", (event) =>
            this.handlePressedKey(event, keysPressed)
        );
        window.addEventListener("keyup", (event) =>
            this.handleUnpressedKey(event, game, keysPressed)
        );
        //window.addEventListener("mousedown", (event) => console.log("CLICK"));
        //window.addEventListener("mouseup", (event) => console.log("NO CLICK"));
    }
}
