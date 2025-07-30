const level1 = new Level(
    [], // Gegner (Fische + Endboss)
    [], // Blasen
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
    ]
);

// Dynamisches Spawning:
setInterval(() => {
    level1.enemies.push(new fish());
}, 3200);

setInterval(() => {
    level1.enemies.push(new Bubble());
}, 10000);

// Endboss nach kurzer Zeit initial erzeugen
setTimeout(() => {
    level1.enemies.push(new Endboss());
}, 2000);
