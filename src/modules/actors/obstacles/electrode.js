export { Electrode };
import { Obstacle } from "../../models/obstacle.js";

class Electrode extends Obstacle {
    constructor(game) {
        super(game, 18);
        this.pulseTimer = Math.random() * Math.PI * 2; // Random starting phase
        this.pulseSpeed = 0.08;
        this.baseRadius = 6;
        this.spikeCount = 8;
        this.colors = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff0000", "#ff8800", "#ffffff"];
        this.colorIndex = Math.floor(Math.random() * this.colors.length);
        this.colorTimer = 0;
        this.colorInterval = 10; // Frames between color changes
    }

    update() {
        this.pulseTimer += this.pulseSpeed;
        this.colorTimer++;
        if (this.colorTimer >= this.colorInterval) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            this.colorTimer = 0;
        }
    }

    draw(context) {
        const cx = this.screenX + this.width / 2;
        const cy = this.screenY + this.height / 2;
        const pulse = Math.sin(this.pulseTimer) * 0.3 + 1;
        const radius = this.baseRadius * pulse;
        const spikeRadius = radius * 1.8;
        const color = this.colors[this.colorIndex];

        context.beginPath();
        for (let i = 0; i < this.spikeCount; i++) {
            const angle = (i / this.spikeCount) * Math.PI * 2;
            const nextAngle = ((i + 0.5) / this.spikeCount) * Math.PI * 2;

            // Spike tip
            const tipX = cx + Math.cos(angle) * spikeRadius;
            const tipY = cy + Math.sin(angle) * spikeRadius;
            // Valley between spikes
            const valleyX = cx + Math.cos(nextAngle) * radius;
            const valleyY = cy + Math.sin(nextAngle) * radius;

            if (i === 0) {
                context.moveTo(tipX, tipY);
            } else {
                context.lineTo(tipX, tipY);
            }
            context.lineTo(valleyX, valleyY);
        }
        context.closePath();
        context.fillStyle = color;
        context.fill();

        // Inner glow circle
        const innerPulse = Math.sin(this.pulseTimer + 1) * 0.2 + 0.6;
        context.beginPath();
        context.arc(cx, cy, radius * innerPulse, 0, Math.PI * 2);
        context.fillStyle = "white";
        context.fill();

        this.game.debuggerr.drawHitboxes(this, context);
    }
}
