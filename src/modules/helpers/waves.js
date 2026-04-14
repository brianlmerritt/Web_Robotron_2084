export const waves = [
    {
        // Wave 1
        Grunt: 10,
        Hulk: 2,
        Spheroid: 1,
        Quark: 1,
        Daddy: 2,
        Mommy: 2,
        Mikey: 2,
    },
    {
        // Wave 2
        Grunt: 15,
        Hulk: 3,
        Spheroid: 2,
        Quark: 1,
        Daddy: 3,
        Mommy: 3,
        Mikey: 2,
    },
    {
        // Wave 3
        Grunt: 20,
        Hulk: 4,
        Spheroid: 2,
        Quark: 2,
        Daddy: 3,
        Mommy: 3,
        Mikey: 3,
    },
    {
        // Wave 4
        Grunt: 30,
        Hulk: 5,
        Spheroid: 3,
        Quark: 2,
        Daddy: 4,
        Mommy: 4,
        Mikey: 3,
    },
    {
        // Wave 5
        Grunt: 40,
        Hulk: 6,
        Spheroid: 4,
        Quark: 3,
        Daddy: 5,
        Mommy: 5,
        Mikey: 4,
    }
];

export function getWaveConfig(waveNumber) {
    // If the wave number exceeds the defined waves, use the last one but scale it up/loop it
    const index = Math.min(waveNumber - 1, waves.length - 1);
    const baseWave = { ...waves[index] };

    // Simple procedural scaling for waves beyond the highest defined in the array
    if (waveNumber > waves.length) {
        const extraDifficulty = waveNumber - waves.length;
        baseWave.Grunt += extraDifficulty * 5;
        baseWave.Hulk += Math.floor(extraDifficulty / 2);
        baseWave.Spheroid += Math.floor(extraDifficulty / 2);
        baseWave.Quark += Math.floor(extraDifficulty / 3);
    }
    
    return baseWave;
}