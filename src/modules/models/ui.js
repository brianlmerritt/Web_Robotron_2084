export { UserInterface };

class UserInterface {
    constructor(game) {
        this.canvas = document.querySelector("canvas");
        this.setCanvasScaledResolution(3);
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.scoreElement = document.getElementById("score");
        this.scoreElement.innerHTML = game.score.currentScore;
        this.livesElement = document.getElementById("lives");
        this.lifeIndicator = document.getElementsByClassName("life-indicator");
        this.lifeIndicatorSprite = game.spriteMngr.setSprite("life");
        this.FPSElement = document.getElementById("fps-counter");
        this.waveElement = document.getElementById("wave");
    }

    // Initializes canvas.width and height with scaled dimensions
    setCanvasScaledResolution(scaleFactor) {
        const { canvas } = this;
        const originalWidth = 292;
        const originalHeight = 240;
        const aspectRatio = originalWidth / originalHeight;
        const newWidth = Math.round(originalWidth * scaleFactor);
        const newHeight = Math.round(newWidth / aspectRatio);
        canvas.width = newWidth;
        canvas.height = newHeight;
    }
}
