export { UIManager };

class UIManager {
    update(score, ui, actorMngr, game) {
        this.updateScoreElement(ui, score.currentScore);
        this.updateLivesElement(ui, actorMngr);
        this.updateWaveElement(ui, game.currentWave);
    }

    clearPreviousFrameSprites(ui) {
        const { context, canvas } = ui;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    updateWaveElement(ui, currentWave) {
        if (!ui.waveElement) return;
        ui.waveElement.innerHTML = `WAVE ${currentWave.toString().padStart(3, "0")}`;
    }

    // Creates a string indicating the amount of lives beyond 20
    createSurplusLivesIndicator(ui) {
        const surplusIndicator = document.createElement("span");
        surplusIndicator.id = "surplus-lives-indicator";
        ui.livesElement.appendChild(surplusIndicator);
        return surplusIndicator;
    }

    removeSurplusLivesIndicator(surplusIndicator) {
        if (surplusIndicator) {
            surplusIndicator.parentNode.removeChild(surplusIndicator);
        }
    }

    isSurplusLivesIndicatorOutdated(surplusLivesCount, surplusIndicator) {
        return surplusLivesCount !== parseInt(surplusIndicator.innerHTML);
    }

    updateSurplusLivesCount(surplusLivesCount, surplusIndicator) {
        if (
            this.isSurplusLivesIndicatorOutdated(
                surplusLivesCount,
                surplusIndicator
            )
        ) {
            surplusIndicator.innerHTML = `+${surplusLivesCount}`;
        }
    }

    updateSurplusLivesIndicator(ui, currentLives) {
        const surplusLivesCount = currentLives - 20;
        let surplusIndicator = document.querySelector(
            "#surplus-lives-indicator"
        );
        if (surplusLivesCount > 0) {
            if (!surplusIndicator) {
                surplusIndicator = this.createSurplusLivesIndicator(ui);
            }
            this.updateSurplusLivesCount(surplusLivesCount, surplusIndicator);
        } else {
            this.removeSurplusLivesIndicator(surplusIndicator);
        }
    }

    isLivesIndicatorOutdated(ui, playerLives) {
        const interfaceLivesCount = ui.livesElement.childElementCount;
        return interfaceLivesCount !== playerLives;
    }

    createLifeIcon(ui) {
        const lifeIndicator = document.createElement("img");
        lifeIndicator.src = ui.lifeIndicatorSprite.src;
        lifeIndicator.alt = "Life Indicator";
        lifeIndicator.className = "life-indicator";
        lifeIndicator.width = "";
        lifeIndicator.height = "";
        return lifeIndicator;
    }

    updateLivesIndicator(ui, currentLives) {
        ui.livesElement.innerHTML = "";
        for (let i = 0; i < currentLives; i++) {
            const lifeIndicator = this.createLifeIcon(ui);
            ui.livesElement.appendChild(lifeIndicator);
        }
    }

    enoughSpaceForLives(ui) {
        return ui.livesElement.childElementCount < 20;
    }

    updateLivesElement(ui, actorMngr) {
        const playerLives = actorMngr.actors.player.lives;
        if (!this.isLivesIndicatorOutdated(ui, playerLives)) {
            return;
        }
        if (this.enoughSpaceForLives(ui)) {
            this.updateLivesIndicator(ui, playerLives);
        } else {
            this.updateSurplusLivesIndicator(ui, playerLives);
        }
    }

    isScoreIndicatorOutdated(ui, score) {
        return ui.scoreElement.innerHTML != score;
    }

    updateScoreElement(ui, score) {
        if (this.isScoreIndicatorOutdated(ui, score)) {
            ui.scoreElement.innerHTML = score;
        }
    }

    updateFPSElement(ui, FPS) {
        ui.FPSElement.innerHTML = FPS;
    }
}
