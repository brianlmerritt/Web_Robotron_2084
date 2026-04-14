export { SoundManager };
import { soundFxIndex } from "../helpers/indexes.js";

// Manages concurrent sound playback using an Audio pool to avoid patchiness.
class SoundManager {
    constructor() {
        this.pools = {};
        this.lastPlayed = {};

        for (const [key, val] of Object.entries(soundFxIndex)) {
            const src = Array.isArray(val) ? val[0] : val;
            this.pools[key] = [];
            // Create a small pool of 3 audio elements per sound to allow overlapping
            for (let i = 0; i < 3; i++) {
                this.pools[key].push(new Audio(src));
            }
            this.lastPlayed[key] = 0;
        }
    }

    userInteractedWithPage() {
        return navigator.userActivation.hasBeenActive;
    }

    playSound(sound) {
        if (!this.userInteractedWithPage()) {
            return;
        }

        const now = Date.now();
        const conf = soundFxIndex[sound];
        
        // Default 50ms cooldown for spam prevention (can be very fast, just not simultaneous)
        let cooldownMs = 50; 
        
        // Many sounds in soundFxIndex use their own timing, we can scale it down
        // so they can overlap slightly but not clip into a single massive wave.
        if (Array.isArray(conf) && conf[2]) {
            // We use half the minimum duration as a localized cooldown for the exact same sound
            cooldownMs = (conf[2] * 1000) * 0.5;
        }

        if (this.lastPlayed[sound] && (now - this.lastPlayed[sound]) < cooldownMs) {
            return;
        }

        this.lastPlayed[sound] = now;

        const pool = this.pools[sound];
        if (pool) {
            let played = false;
            for (const audio of pool) {
                if (audio.paused || audio.ended) {
                    audio.currentTime = 0;
                    audio.play().catch(e => {}); // Catch interact restrictions
                    played = true;
                    break;
                }
            }
            
            // If all elements in the pool are busy, force restart the first one
            if (!played) {
                pool[0].currentTime = 0;
                pool[0].play().catch(e => {});
            }
        }
    }
}
