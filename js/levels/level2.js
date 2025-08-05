function createLevel2() {
    const coins_level2 = [];
    for (let i = 0; i < 6; i++) {
        let x = 1600 + i * 120;
        let y = 200 + Math.sin(i * 0.7) * 40;
        coins_level2.push(new Coin(x, y));
    }

    const poisons_level2 = [
    new Poison(1650, 326), // innerhalb der Höhle
    new Poison(2020, 290), // leicht versetzt
    new Poison(1970, 100)  // frei schwimmend
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

            new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 1438),
            new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 1438),
            new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 1438),
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 1438),

            new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 2157),
            new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 2157),
            new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 2157),
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 2157),

            new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 2876),
            new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 2876),
            new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 2876),
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 2876),

            new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 3595),
            new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 3595),
            new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 3595),
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 3595),

            new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 4314),
            new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 4314),
            new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 4314),
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 4314)
    ];


    const obstacles = [
    new Obstacle(1600, 0, 'assets/img/3. Background/Barrier/1.png')
];
    
    const enemies = [
    new Pufferfish(1800, 250),
    new Pufferfish(2000, 270),
    new Pufferfish(2200, 260)
];


    const level2 = new Level(
        enemies,
        [], // bubbles
        backgroundObjects,
        coins_level2,
        poisons_level2,
        obstacles
    );

    level2.poisonObjects = poisons_level2;
    return level2;
}