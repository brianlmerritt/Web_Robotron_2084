export { spritesIndex, spritesheetYIndex, soundFxIndex };

const imgPath = "./assets/sprites/";
const soundFxPath = "./assets/sound_fx/";

const spritesIndex = {
    life: imgPath + "ui/life.png",
    daddy: imgPath + "actors/humans/daddy.png",
    enforcer: imgPath + "actors/enemies/enforcer.png",
    grunt: imgPath + "actors/enemies/grunt.png",
    hulk: imgPath + "actors/enemies/hulk.png",
    mikey: imgPath + "actors/humans/mikey_alt.png",
    mommy: imgPath + "actors/humans/mommy.png",
    player: imgPath + "actors/player.png",
    quark: imgPath + "actors/enemies/quark.png",
    spheroid: imgPath + "actors/enemies/spheroid.png",
    tank: imgPath + "actors/enemies/tank.png",
    enforcerProjectile: imgPath + "projectiles/spark.png",
    playerProjectile: imgPath + "projectiles/player_prjctl.png",
    tankProjectile: imgPath + "projectiles/bounce_bomb.png",
};

const spritesheetYIndex = {
    daddy: {
        up: 28,
        down: 0,
        left: 56,
        right: 82,
        upleft: 56,
        upright: 82,
        downleft: 56,
        downright: 82,
    },
    hulk: {
        up: 0,
        down: 0,
        left: 33,
        right: 65,
    },
    mikey: {
        up: 24,
        down: 0,
        left: 48,
        right: 70,
        upleft: 48,
        upright: 70,
        downleft: 48,
        downright: 70,
    },
    mommy: {
        up: 30,
        down: 0,
        left: 59,
        right: 88,
        upleft: 59,
        upright: 88,
        downleft: 59,
        downright: 88,
    },
    player: {
        up: 26,
        down: 0,
        left: 51,
        right: 75,
    },
};

const soundFxIndex = {
    // Sound file, sound priority, minimum sound duration
    bombBounce: [soundFxPath + "bomb_bounce.mp3", 2, 0.12],
    bombShot: [soundFxPath + "bomb_shot.mp3", 3, 0.16],
    brainWave: soundFxPath + "brain_wave.mp3",
    cruiseDestroyed: soundFxPath + "cruise_destroyed.mp3",
    cruiseShot: soundFxPath + "cruise_shot.mp3",
    enemyDestroyed: [soundFxPath + "enemy_destroyed.mp3", 3, 0.09],
    enforcerSpawn: [soundFxPath + "enforcer_spawn.mp3", 4, 0.2],
    extraLife: [soundFxPath + "extra_life.mp3", 5, 0.604],
    gameStart: soundFxPath + "game_start.mp3",
    gruntStep: [soundFxPath + "grunt_step.mp3", 1, 0.15],
    highscore: soundFxPath + "highscore.mp3",
    humanDestroyed: [soundFxPath + "human_destroyed.mp3", 4, 0.36],
    humanRescued: [soundFxPath + "human_rescued.mp3", 4, 0.4],
    obstacleDestroyed: soundFxPath + "obstacle_destroyed.mp3",
    playerDestroyed: [soundFxPath + "player_destroyed.mp3", 6, 2],
    playerShot: [soundFxPath + "player_shot.mp3", 2, 0.12],
    progConversion: soundFxPath + "prog_conversion.mp3",
    projectileDestroyed: [soundFxPath + "projectile_destroyed.mp3", 3, 0.1],
    quarkDestroyed: [soundFxPath + "quark_destroyed.mp3", 4, 0.09],
    regularWave: soundFxPath + "regular_wave.mp3",
    sparkShot: [soundFxPath + "spark_shot.mp3", 3, 0.2],
    spheroidDestroyed: [soundFxPath + "spheroid_destroyed.mp3", 4, 0.09],
    tankSpawn: [soundFxPath + "tank_spawn.mp3", 4, 0.2],
};
