function createLevel3() {
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
            new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 4314),
    ];

    const enemies = [
        new Endboss(3500, 100)
    ];

    const level3 = new Level(
        enemies,
        [], // bubbles
        backgroundObjects,
        [], // coins
        [], // poisons
        []  // obstacles
    );

    return level3;
}