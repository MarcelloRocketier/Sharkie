const coinsLevel2 = [];

// Zweite Welle im 2. Drittel (x: 1600–2600)
for (let i = 0; i < 10; i++) {
    let x = 1600 + i * 70;
    let y = 180 + Math.sin(i * 0.5) * 60;
    coinsLevel2.push(new Coin(x, y));
}

const level2 = new Level(
    [], // enemies
    [], // bubbles
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

        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D1.png', 719*2),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D1.png', 719*2),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D1.png', 719*2),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D1.png', 719*2),
        new BackgroundObject('assets/img/3. Background/Layers/5. Water/D2.png', 719*3),
        new BackgroundObject('assets/img/3. Background/Layers/3.Fondo 1/D2.png', 719*3),
        new BackgroundObject('assets/img/3. Background/Layers/4.Fondo 2/D2.png', 719*3),
        new BackgroundObject('assets/img/3. Background/Layers/2. Floor/D2.png', 719*3),
    ],
    coinsLevel2
);
