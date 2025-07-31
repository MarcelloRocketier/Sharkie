function createLevel1() {
    const obstacles = [
];
    const coins = [];

    // Kompaktere Welle im 1. Drittel (x: 400–1100)
    for (let i = 0; i < 6; i++) {
        let x = 400 + i * 120;
        let y = 200 + Math.sin(i * 0.7) * 40;
        coins.push(new Coin(x, y));
    }

    const poisons = [
        new Poison(600, 340),
        new Poison(900, 360)
    ];

    const enemies = [
        new Jellyfish(600, 350),
        new Pufferfish(800, 360),
        new fish(800, 380)
    ];

    const bubbles = [
        new Bubble(500, 300)
    ];

    return new Level(
        enemies,
        bubbles,
        [
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
        ],
        coins,
        poisons,
    );
}