// Robotron: 2084
// Developed by Vid Kidz
// Programmed by Lawrence DeMar & Eugene Jarvis
// Manufactured and Published by Williams Electronics, Inc.
// Copyrights: Williams Electronics, Inc. / Williams Electronics Games, Inc. / Midway Amusement Games, LLC / Lawrence DeMar / Eugene Jarvis

// Sprites ripped with Sean Riddle's Williams Graphics Ripper (https://seanriddle.com/ripper.html)
// Robotron font by André Nossek (http://www.thealmightyguru.com/GameFonts/Series-Robotron.html)
// Reprogrammed in JavaScript by Breno Ludgero (https://www.linkedin.com/in/breno-ludgero/)
// Based on the blue label ROM revision with default game settings

/* TO-DO LIST (IN DESCENDING ORDER OF PRIORITY):
ONE SOUND CHANNEL PER EVENT (PROJECTILE DESTRUCTION, ENEMY DESTROYED, ETC)
IMPLEMENT ALL ACTORS + SOUNDS & OBSTACLES
HUMAN, ENEMY INTERACTION WITH OBSTACLES
FIX ROTATED PROJECTILES HITBOX
IMPROVE STATES ?
IMPLEMENT TESTS
SPAWN / DEATH ANIMATIONS
IMPLEMENT WAVES
REWORK HTML SIZES, RESPONSIVENESS (CHECK PROJECTILE POSITIONS)
CHECK CROSS-BROWSER SUPPORT
ADD MOUSE FIRE SUPPORT
ADD JOYSTICK SUPPORT */

import { Game } from "./models/game.js";

window.addEventListener("load", () => {
    const game = new Game();

    // Ensures 60 updates per second across different hardware configurations
    const targetFrameDuration = 1000 / 60; // 16.67 milliseconds
    let timeSinceLastUpdate = 0;
    let frameCountThisSecond = 0;
    let lastUpdateTime = performance.now();
    let lastFPSUpdateTime = performance.now();

    function runGame() {
        let currentTime = performance.now();
        const elapsed = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;
        timeSinceLastUpdate += elapsed;

        // Game loop
        while (timeSinceLastUpdate >= targetFrameDuration) {
            game.update();
            timeSinceLastUpdate -= targetFrameDuration;
            game.globalTimer++;
            frameCountThisSecond++;
        }
        
        // Draw once per frame, regardless of how many logical updates occurred
        game.draw();

        // Updates framerate indicator
        if (currentTime - lastFPSUpdateTime >= 1000) {
            const framesPerSecond = Math.round(
                (frameCountThisSecond * 1000) /
                    (currentTime - lastFPSUpdateTime)
            );
            game.uiMngr.updateFPSElement(game.ui, framesPerSecond);
            frameCountThisSecond = 0;
            lastFPSUpdateTime = currentTime;
        }
        requestAnimationFrame(runGame);
    }

    runGame();
    game.spawnActors();
    game.debuggerr.logActorCount(game);
});
