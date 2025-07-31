function createLevel2() {
    const coins_level2 = [];
    for (let i = 0; i < 6; i++) {
        let x = 1600 + i * 120;
        let y = 200 + Math.sin(i * 0.7) * 40;
        coins_level2.push(new Coin(x, y));
    }

    const poisons_level2 = [
        new Poison(1800, 340),
        new Poison(2100, 360)
    ];

    const backgroundObjects = [
        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', -719),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', -719),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', -719),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', -719),

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 0),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 0),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 0),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 0),

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 719),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 719),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 719),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 719),

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 1438),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 1438),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 1438),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 1438),

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 1438 + 719),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 1438 + 719),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 1438 + 719),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 1438 + 719),

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 1438 + 719 * 2),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 1438 + 719 * 2),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 1438 + 719 * 2),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 1438 + 719 * 2)
    ];

    const obstacles = [
    new Obstacle(1600, 0, 'assets/img/3. Background/Barrier/1.png')
];
    

    const level2 = new Level(
        [], // enemies
        [], // bubbles
        backgroundObjects,
        coins_level2,
        poisons_level2,
        obstacles
    );

    level2.poisonObjects = poisons_level2;
    return level2;
}