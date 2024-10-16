// const Phaser = require("/phaser");
var fondoJuego,nave,balas,tiempoBala=0,botonDisparo,enemigos;
var sonidoDisparo, sonidoExplosion;
var juego=  new Phaser.Game(370,550,Phaser.CANVAS,"bloque_juego");

var estadoPrincipal={

    preload:()=>{
        juego.load.image("fondo","img/space.png");
        juego.load.image("personaje","img/nave.png");
        juego.load.image("laser","img/laser.png");
        juego.load.image("enemigo","img/enemigo.png");

        juego.load.audio("sonidoDisparo", "audio/disparo.mp3");
        juego.load.audio("sonidoExplosion", "audio/explosion.mp3");
    },

    create:()=>{
        fondoJuego=juego.add.tileSprite(0,0,370,550,"fondo");
        nave=juego.add.sprite(juego.width/2,500,"personaje");
        
        nave.anchor.setTo(0.5);

        cursores = juego.input.keyboard.createCursorKeys();    
        botonDisparo= juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas=juego.add.group();
        balas.enableBody=true;
        balas.physicsBodyType=Phaser.Physics.ARCADE;
        balas.createMultiple(20,"laser");
        balas.setAll("anchor.x",0.5);
        balas.setAll("anchor.y",1);
        balas.setAll("outOfBoundsKill",true);
        balas.setAll("checkWorldBounds",true);

        enemigos=juego.add.group();
        enemigos.enableBody=true;
        enemigos.physicsBodyType=Phaser.Physics.ARCADE;

        for (let i = 0; i < 6; i++) {
            for (let a = 0; a < 7; a++) {
                var enemigo=enemigos.create(a*40,i*20,"enemigo");                
                enemigo.anchor.setTo(0.5);
            }
        }

        enemigo.x=50;
        enemigo.y=30;
        var animacion=juego.add.tween(enemigos).to({x:100},1000,Phaser.Easing.Linear.None,true,0,1000,true);
        sonidoDisparo = juego.add.audio("sonidoDisparo");
        sonidoExplosion = juego.add.audio("sonidoExplosion");

    },

    update:()=>{
        
        if(cursores.right.isDown){
            nave.position.x+=3;            
        }else if(cursores.left.isDown){
            nave.position.x-=3;     
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
        if(botonDisparo.isDown){
            if(juego.time.now> tiempoBala){
                bala=balas.getFirstExists(false);
            }
            if(bala){
                bala.reset(nave.x,nave.y);
                bala.body.velocity.y=-300;
                tiempoBala=juego.time.now+100;
                sonidoDisparo.play();
            }
        };

        juego.physics.arcade.overlap(balas,enemigos,colision,null,estadoPrincipal);
    }

}

function colision(bala,enemigo){
    bala.kill();
    enemigo.kill();
    sonidoExplosion.play();
}   



juego.state.add("principal",estadoPrincipal);
juego.state.start("principal");