
var fondoJuego, nave, balas, tiempoBala = 0, botonDisparo, enemigos, nivel = 1, puntaje = 0, textoPuntaje, textoNivel, textoFinal;
var sonidoDisparo, sonidoExplosion;
var enemigosRestantes;
var juego = new Phaser.Game(370, 550, Phaser.CANVAS, "bloque_juego");

var estadoPrincipal = {

    preload: () => {
        juego.load.image("fondo", "img/space.png");
        juego.load.image("personaje", "img/nave.png");
        juego.load.image("laser", "img/laser.png");
        juego.load.image("enemigo", "img/enemigo.png");

        juego.load.audio("sonidoDisparo", "audio/disparo.mp3");
        juego.load.audio("sonidoExplosion", "audio/explosion.mp3");
    },

    create: () => {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 550, "fondo");
        nave = juego.add.sprite(juego.width / 2, 500, "personaje");

        nave.anchor.setTo(0.5);

        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, "laser");
        balas.setAll("anchor.x", 0.5);
        balas.setAll("anchor.y", 1);
        balas.setAll("outOfBoundsKill", true);
        balas.setAll("checkWorldBounds", true);

        textoPuntaje = juego.add.text(10, 10, "Puntaje: 0", { font: "20px Arial", fill: "#FFF" });
        textoNivel = juego.add.text(250, 10, "Nivel: 1", { font: "20px Arial", fill: "#FFF" });

        estadoPrincipal.crearEnemigos();

        sonidoDisparo = juego.add.audio("sonidoDisparo");
        sonidoExplosion = juego.add.audio("sonidoExplosion");
    },

    crearEnemigos: () => {
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        let filas = nivel + 5;
        let columnas = 7;

        for (let i = 0; i < filas; i++) {
            for (let a = 0; a < columnas; a++) {
                var enemigo = enemigos.create(a * 40, i * 20, "enemigo");
                enemigo.anchor.setTo(-2);
            }
        }

        enemigo.x = 50;
        enemigo.y = 80;
        var animacion = juego.add.tween(enemigos).to({ x: 20 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        enemigosRestantes = filas * columnas;
    },

    update: () => {

        if (cursores.right.isDown) {
            nave.position.x += 3;
        } else if (cursores.left.isDown) {
            nave.position.x -= 3;
        }

        if (nave.position.x < nave.width / 2) {
            nave.position.x = nave.width / 2;
        } else if (nave.position.x > juego.width - nave.width / 2) {
            nave.position.x = juego.width - nave.width / 2;
        }

        if (cursores.up.isDown) {
            nave.position.y -= 3;
        } else if (cursores.down.isDown) {
            nave.position.y += 3;
        }

        var bala;
        if (botonDisparo.isDown) {
            if (juego.time.now > tiempoBala) {
                bala = balas.getFirstExists(false);
            }
            if (bala) {
                bala.reset(nave.x, nave.y);
                bala.body.velocity.y = -300;
                tiempoBala = juego.time.now + 100;
                sonidoDisparo.play();
            }
        }

        juego.physics.arcade.overlap(balas, enemigos, colision, null, estadoPrincipal);
    },

    mostrarTextoFinal: () => {
        textoFinal = juego.add.text(juego.width / 2, juego.height / 2, "¡GANASTE!", { font: "40px Arial", fill: "#FFF" });
        textoFinal.anchor.setTo(0.5);
        juego.input.onTap.addOnce(reiniciarJuego, this);
    }
}

function colision(bala, enemigo) {
    bala.kill();
    enemigo.kill();
    sonidoExplosion.play();
    puntaje += 10;
    enemigosRestantes--;

    textoPuntaje.setText("Puntaje: " + puntaje);

    if (enemigosRestantes <= 0) {
        if (nivel === 2) {
            estadoPrincipal.mostrarTextoFinal();
        } else {
            nivel++;
            textoNivel.setText("Nivel: " + nivel);
            estadoPrincipal.crearEnemigos();
        }
    }
}

function reiniciarJuego() {
    nivel = 1;
    puntaje = 0;
    textoPuntaje.setText("Puntaje: " + puntaje);
    textoNivel.setText("Nivel: " + nivel);
    if (textoFinal) textoFinal.destroy();
    estadoPrincipal.crearEnemigos();
}

juego.state.add("principal", estadoPrincipal);
juego.state.start("principal");
