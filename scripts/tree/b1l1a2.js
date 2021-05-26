// level design from this version of the game: http://www.thinkfun.com/play-online/rush-hour/

var game = new Phaser.Game(1300, 800, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update,
});

let correct1FX;
let correct2FX;
let correct3FX;
let correct4FX;

var lienzo2;

let incorrect1FX;
let incorrect2FX;
let incorrect3FX;
let explotarFX;
let habilitar;

var cancelaUpdate;
var cancelaUpdate2;
var _spawnCandyTimer = 0;

let nave;
var group;

let instruccionesFX;
let porcentaje;
let txtPorcentaje;
let textoTimer;
var tiempoAgotado;

let contadorNiveles;

let nivel;

let proceso0;
let proceso1;
let proceso2;
let proceso3;
let proceso4;
let proceso5;

let tiempo;

let desactivadorUpdate;
function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	/*Audios*/
	game.load.audio('correct1', 'audio/CI_excelente.mp3');
	game.load.audio('correct2', 'audio/CI_felicidades.mp3');
	game.load.audio('correct3', 'audio/CI_lo_lograste.mp3');
	game.load.audio('correct4', 'audio/CI_muy_bien.mp3');

	game.load.audio('incorrect1', 'audio/CI_intenta_otra_vez.mp3');
	game.load.audio('incorrect2', 'audio/CI_intentalo_de_nuevo.mp3');
	game.load.audio('incorrect3', 'audio/CI_vuelve_intentar.mp3');
	/*Cargas las instrucciones del juego*/
	game.load.audio('instrucciones', 'audio/insrucciones.mp3');
	game.load.audio('explotar', 'audio/_explode.mp3');

	/*Se carga la imagen de la bocina*/

	game.load.image('imgIcoBocina', 'img/bocina.png');

	/*Se cargan las imagenes que se usaran como fondo*/
	game.load.image('fondo', 'img/fondo.png');
	game.load.image('fondo2', 'img/cielo_con_estrellas.png');
	game.load.image('limite', 'img/iconoBocina.png');
	game.load.image('proceso0', 'img/Proceso0.png');
	game.load.image('proceso20', 'img/proceso20.png');
	game.load.image('proceso40', 'img/proceso40.png');
	game.load.image('proceso60', 'img/proceso60.png');
	game.load.image('proceso80', 'img/proceso80.png');
	game.load.image('proceso100', 'img/proceso100.png');

	/*Se usara para cargar las imagenes del juego esquivando meteoritos*/
	game.load.image('nave', 'img/nave.png');
	game.load.image('meteorito1', 'img/asteroide1.png');
	game.load.image('meteorito2', 'img/asteroide2.png');
	game.load.image('meteorito3', 'img/asteroide3.png');
	game.load.image('meteorito4', 'img/asteroide4.png');
	game.load.image('meteorito5', 'img/asteroide5.png');
	game.load.image('meteorito6', 'img/asteroide6.png');
	game.load.image('meteorito7', 'img/asteroide7.png');
	game.load.image('meteorito8', 'img/asteroide8.png');
	game.load.image('meteorito9', 'img/asteroide9.png');
	game.load.image('meteorito10', 'img/asteroide10.png');

	/*Se cargan las imagenes de correcto*/
	game.load.image('correcta1', 'img/CS_correcta_1.png');
	game.load.image('correcta2', 'img/CS_correcta_2.png');
	game.load.image('correcta3', 'img/CS_correcta_3.png');
	game.load.image('correcta4', 'img/CS_correcta_4.png');
	game.load.image('correcta5', 'img/CS_correcta_5.png');
	game.load.image('correcta6', 'img/CS_correcta_6.png');

	/*Se cargan las imagenes incorrectas*/
	game.load.image('incorrecta1', 'img/CS_incorrecta_1.png');
	game.load.image('incorrecta2', 'img/CS_incorrecta_2.png');
	game.load.image('incorrecta3', 'img/CS_incorrecta_3.png');
	game.load.image('incorrecta4', 'img/CS_incorrecta_4.png');
	game.load.image('incorrecta5', 'img/CS_incorrecta_5.png');
	game.load.image('incorrecta6', 'img/CS_incorrecta_6.png');

	game.load.image('letrero', 'img/darClick.png');

	game.load.image('repetir', 'img/repetir.png');
}

function create() {
	correct1FX = this.add.audio('correct1', 1, false);
	correct2FX = this.add.audio('correct2', 1, false);
	correct3FX = this.add.audio('correct3', 1, false);
	correct4FX = this.add.audio('correct4', 1, false);

	incorrect1FX = this.add.audio('incorrect1', 1, false);
	incorrect2FX = this.add.audio('incorrect2', 1, false);
	incorrect3FX = this.add.audio('incorrect3', 1, false);

	explotarFX = this.add.audio('explotar', 1, false);

	instruccionesFX = this.add.audio('instrucciones', 1, false);

	fondo2 = game.add.image(0, 0, 'fondo2');
	generaFondo(fondo2);
	fondo = game.add.image(0, 0, 'fondo');
	generaFondo(fondo);
	fondo.alpha = 0.8;

	intrucciones = game.add.text(
		270,
		-95,
		'Bienvenido a la actividad: Esquivando meteoritos. Con el ratón mueve la nave espacial para evitar que \nchoque con los meteoritos. Si chocas, la nave se regresa al lugar donde comenzó. La barra roja te muestra  \ncuanto te falta para pasar todos los meteoritos.',
		{
			fontSize: '18px',
			fill: '#ffffff',
		}
	);
	game.add.tween(intrucciones).to({ y: 5 }, 2000, Phaser.Easing.Bounce.Out, true);
	iconoBocina = game.add.image(200, 10, 'imgIcoBocina');
	iconoBocina.inputEnabled = true;
	iconoBocina.scale.setTo(0.7);
	iconoBocina.events.onInputDown.add(clickIconoBocina, this);

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;

	/*----------------------------*/

	nave = game.add.sprite(1200, 400, 'nave');
	game.physics.enable(nave, Phaser.Physics.ARCADE);
	nave.body.collideWorldBounds = true;
	nave.anchor.setTo(0.5);
	nave.scale.setTo(1);
	//game.physics.p2.enable(nave);
	//nave.body.static = true;
	nave.inputEnabled = true;
	nave.events.onInputDown.add(clickActivarJuego, this);
	/*--------------------------------*/
	letrero = game.add.image(1190, 350, 'letrero');

	limite = game.add.sprite(1000, 0, 'limite');
	game.physics.enable(limite);
	limite.height = 800;
	limite.body.collideWorldBounds = true;
	limite.body.immovable = true;
	limite.alpha = 0;

	limite2 = game.add.sprite(1300, 90, 'limite');
	game.physics.enable(limite2);
	limite2.width = 400;
	limite2.body.collideWorldBounds = true;
	limite2.body.immovable = true;
	limite2.alpha = 0;

	porcentaje = 0;
	contadorNiveles = 0;
	nivel = 1;

	proceso0 = game.add.image(400, 80, 'proceso0');
	proceso0.scale.setTo(1.5);
	proceso0.width = 500;

	txtPorcentaje = game.add.text(930, 80, porcentaje + '%', { font: '30px', fill: '#ffffff' });
	textoTimer = game.add.text(200, 80, 'Tiempo: 10:00', { font: '20pt', fill: '#ffffff' });

	lienzo2 = game.add.graphics(402.5, 88.5);
	lienzo2.beginFill(0xffffff);
	lienzo2.drawRect(0, 0, 1, 19);
	lienzo2.endFill();
	lienzo2.alpha = 1;

	group = game.add.group();
	group2 = game.add.group();

	this.cancelaUpdate = false;
	this.cancelaUpdate2 = false;
	_spawnCandyTimer = 0;

	desactivadorUpdate = true;
	habilitar = true;
	tiempo = 0;
}

function clickIconoBocina() {
	instruccionesFX.play();
}

function update() {
	if (!desactivadorUpdate) {
		cronomentroOnRender();

		if (habilitar) {
			lienzo2.width += 0.1;
			tiempo += 1;

			if (tiempo > 48) {
				tiempo = 0;
				porcentaje += 1;
				txtPorcentaje.text = porcentaje + '%';

				if (porcentaje == 100) {
					desactivadorUpdate = true;
					setTimeout(lanzaEstrella, 200);
				}
			}
		}

		contadorNiveles += 1;
		game.physics.arcade.collide(nave, limite);
		game.physics.arcade.collide(nave, limite2);
		//game.debug.spriteBounds(nave);
		//game.debug.spriteBounds(limite);
		//game.debug.spriteBounds(group);
		/*Prueba----------------*/

		if (game.input.mousePointer.isDown) {
			game.physics.arcade.moveToPointer(nave, 400);
			if (Phaser.Rectangle.contains(nave.body, game.input.x, game.input.y)) {
				nave.body.velocity.setTo(0, 0);
			}
		} else {
			nave.body.velocity.setTo(0, 0);
		}

		if (!this.cancelaUpdate) {
			game.physics.arcade.collide(nave, group, collisionHandler, processHandler, this);
			game.physics.arcade.collide(nave, group2, collisionHandler, processHandler, this);

			_spawnCandyTimer += this.time.elapsed;
			if (_spawnCandyTimer > 1500) {
				// reset it
				_spawnCandyTimer = 0;
				// and spawn new candy
				spawnCandy(this);
				spawnCandy2(this);
			}
		}
	}
}

function move(pointer, x, y, isDown) {
	nave.x = x;
	nave.y = y;
}

function clickActivarJuego() {
	game.input.addMoveCallback(move, this);

	letrero.kill();
	intrucciones.kill();
	iconoBocina.kill();
	timer = game.time.create();

	// Create a delayed event 1m and 30s from now
	timerEvent = timer.add(Phaser.Timer.MINUTE * 9 + Phaser.Timer.SECOND * 59, endTimer, this);
	timer.start();
	desactivadorUpdate = false;
}

/*Se utiliza para sacar los meteoritos*/
function spawnCandy() {
	var arregloGlobos = [
		'meteorito1',
		'meteorito2',
		'meteorito3',
		'meteorito4',
		'meteorito5',
		'meteorito6',
		'meteorito7',
		'meteorito8',
		'meteorito9',
		'meteorito10',
	];
	var dropPos = Math.round(Math.random() * (800 - 100) + 100);
	var dropX = Math.round(Math.random() * (500 - 0) + 0);
	var candyType = Math.floor(Math.random() * 5);
	newAsterio = game.add.sprite(0, dropPos, arregloGlobos[this.numeroAleatorio3(10)]);

	game.physics.enable(newAsterio, Phaser.Physics.ARCADE);
	newAsterio.body.velocity.set(230, 0);
	newAsterio.scale.setTo(1);
	//newAsterio.inputEnabled = true;
	//newAsterio.events.onInputOver.add(over, this, null, nave);
	//newAsterio.events.onInputOut.add(this.out, this);
	group.add(newAsterio);
}

function over(imagen) {
	imagen.kill();

	console.log(nave.alive);
	if (nave.alive) {
		game.physics.p2.removeSpring(nave);
		nave.kill();
	}
}

function out(imagen) {
	//console.log(imagen.frameName);
	imagen.scale.setTo(1, 1);
	// this.estoySobre=null;
}

function clickActivarJuego2() {
	game.input.addMoveCallback(move, this);
}

function spawnCandy2() {
	var arregloGlobos = [
		'meteorito1',
		'meteorito2',
		'meteorito3',
		'meteorito4',
		'meteorito5',
		'meteorito6',
		'meteorito7',
		'meteorito8',
		'meteorito9',
		'meteorito10',
	];
	var dropPos = Math.round(Math.random() * (800 - 0) + 0);
	var dropX = Math.round(Math.random() * (500 - 0) + 0);
	var candyType = Math.floor(Math.random() * 5);
	newAsterio2 = game.add.sprite(0, dropPos, arregloGlobos[this.numeroAleatorio3(10)]);

	game.physics.enable(newAsterio2, Phaser.Physics.ARCADE);
	newAsterio2.body.velocity.set(250, 0);
	newAsterio2.scale.setTo(0.5);
	group2.add(newAsterio2);
}

/*Metodo Handler, funcion utilizada en el juego del payaso*/
function processHandler(player, veg) {
	return true;
}
/*Metodo colicion, funcion utilizada en el juego del payaso, nivel 1*/
function collisionHandler(player, veg) {
	explotarFX.play();
	contadorNiveles = 0;

	this.cancelaUpdate = true;
	this.cancelaUpdate2 = true;

	group.kill();
	group2.kill();

	game.input.deleteMoveCallback(move, this);
	porcentaje = 0;
	txtPorcentaje.text = porcentaje + '%';
	lienzo2.width = 0;
	habilitar = false;
	var x = player.x;
	var y = player.y;

	player.kill();
	veg.kill();

	this.cancelaUpdate = false;
	_spawnCandyTimer = 0;

	nave = game.add.sprite(x, y, 'nave');
	game.physics.enable(nave, Phaser.Physics.ARCADE);
	nave.body.collideWorldBounds = true;
	nave.anchor.setTo(0.5);
	nave.scale.setTo(1);
	nave.alpha = 0;
	//game.physics.p2.enable(nave);
	//nave.body.static = true;
	nave.inputEnabled = true;
	var tween = game.add.tween(nave).to({ alpha: 1 }, 3000, Phaser.Easing.Bounce.Out, true);

	setTimeout(clicActivar, 1000);
}

function clickPlay() {
	cancelaUpdate = false;
	game.paused = false;
}

function clicActivar() {
	group = game.add.group();
	group2 = game.add.group();
	this.cancelaUpdate = false;
	this.cancelaUpdate2 = false;
	habilitar = true;
	game.input.addMoveCallback(move, this);
}

/*Se coloca*/

function clickPausa() {
	game.paused = true;
}

function lanzaEstrella() {
	desactivadorUpdate = true;
	nave.kill();
	var delay = 0;

	group.kill();
	group2.kill();

	let arreglo = ['correcta1', 'correcta2', 'correcta3', 'correcta4', 'correcta5', 'correcta6'];

	this.estrella = game.add.sprite(game.width * 0.5, game.height * 0.5, arreglo[randon(6) - 1]);
	this.ajustaImagen2(this.estrella);
	this.estrella.scale.setTo(0, 0);
	this.estrella.x = game.width * 0.52;
	this.estrella.y = game.height * 0.5;

	var miTween = game.add
		.tween(this.estrella.scale)
		.to({ x: 2, y: 2 }, 1000, Phaser.Easing.Bounce.Out, true, delay);

	miTween.onStart.add(this.onStart, this);

	this.btnSiguiente = game.add.sprite(650, 700, 'repetir');

	this.btnSiguiente.events.onInputDown.add(this.onClickRepetir, this);
	this.btnSiguiente.inputEnabled = true;
	this.btnSiguiente.anchor.setTo(0.5);
	this.btnSiguiente.scale.setTo(1.5);
	this.btnSiguiente.input.useHandCursor = true;
	this.btnSiguiente.events.onInputOver.add(over, this);
	this.btnSiguiente.events.onInputOut.add(out, this);

	function over(imagen) {
		imagen.scale.setTo(1.55, 1.55);

		//console.log(imagen.frameName+' | valor: '+imagen.valor);
		this.estoySobre = imagen;
	}
	function out(imagen) {
		//console.log(imagen.frameName);
		imagen.scale.setTo(1.5, 1.5);
		// this.estoySobre=null;
	}
}

function incorrecto() {
	var delay = 0;
	desactivadorUpdate = true;
	nave.kill();

	group.kill();
	group2.kill();
	let arreglo = [
		'incorrecta1',
		'incorrecta2',
		'incorrecta3',
		'incorrecta4',
		'incorrecta5',
		'incorrecta6',
	];

	this.estrella = game.add.sprite(game.width * 0.5, game.height * 0.5, arreglo[randon(6) - 1]);
	this.ajustaImagen2(this.estrella);
	this.estrella.scale.setTo(0, 0);
	this.estrella.x = game.width * 0.52;
	this.estrella.y = game.height * 0.5;

	var miTween = game.add
		.tween(this.estrella.scale)
		.to({ x: 2, y: 2 }, 1000, Phaser.Easing.Bounce.Out, true, delay);

	miTween.onStart.add(this.onStartInco, this);

	this.btnSiguiente = game.add.sprite(650, 700, 'repetir');

	this.btnSiguiente.events.onInputDown.add(this.onClickRepetir, this);
	this.btnSiguiente.inputEnabled = true;
	this.btnSiguiente.anchor.setTo(0.5);
	this.btnSiguiente.scale.setTo(1.5);
	this.btnSiguiente.input.useHandCursor = true;
	this.btnSiguiente.events.onInputOver.add(over, this);
	this.btnSiguiente.events.onInputOut.add(out, this);

	function over(imagen) {
		imagen.scale.setTo(1.55, 1.55);

		//console.log(imagen.frameName+' | valor: '+imagen.valor);
		this.estoySobre = imagen;
	}
	function out(imagen) {
		//console.log(imagen.frameName);
		imagen.scale.setTo(1.5, 1.5);
		// this.estoySobre=null;
	}
}

function onStart() {
	let numero = randon(4);

	if (numero == 1) {
		correct1FX.play();
	}
	if (numero == 2) {
		correct2FX.play();
	}
	if (numero == 3) {
		correct3FX.play();
	}
	if (numero == 4) {
		correct4FX.play();
	}
}

function onStartInco() {
	let numero = randon(3);

	if (numero == 1) {
		incorrect1FX.play();
	}
	if (numero == 2) {
		incorrect2FX.play();
	}
	if (numero == 3) {
		incorrect3FX.play();
	}
}

function onClickRepetir() {
	cancelaUpdate = false;
	game.bloque = 0;
	window.location = 'index.html';
}

function siguienteNivel() {
	window.location = 'nivel2.html';
}

function ajustaImagen(imagen) {
	imagen.width = imagen.width * 3;
	imagen.heiht = imagen.height * 3;
	imagen.scale.setTo(2, 2);
	imagen.anchor.setTo(0.5, 0.5); // anchor x y;
}
function ajustaImagen2(imagen) {
	imagen.width = imagen.width * 3;
	imagen.heiht = imagen.height * 3;
	imagen.scale.setTo(1, 1);
	imagen.anchor.setTo(0.5, 0.5); // anchor x y;
}
function ajustaImagen3(imagen) {
	imagen.width = imagen.width;
	imagen.heiht = imagen.height;
	imagen.scale.setTo(2, 2);
	imagen.anchor.setTo(0.5, 0.5); // anchor x y;
}

function randon(n) {
	return Math.floor(Math.random() * n + 1);
}

function generaFondo(imagen) {
	//imagen = game.add.sprite(0,0,'fondo');
	imagen.height = game.height;
	imagen.width = game.width;
	imagen.anchor.x = 0.5;
	imagen.anchor.y = 0.5;
	imagen.x = game.width * 0.5;
	imagen.y = game.height * 0.5;
}

function numeroAleatorio3(de) {
	return Math.floor(Math.random() * de);
}

function numeroAleatorio(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function cronomentroOnRender() {
	//--------------cronometro--render------------------
	if (!tiempoAgotado) {
		// If our timer is running, show the time in a nicely formatted way, else show 'Done!'
		if (timer.running) {
			//game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
			textoTimer.text =
				'Tiempo: ' + formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
		} else {
			//game.debug.text("Done!", 2, 14, "#0f0");
			// this.textoTimer.text="Alto";
			textoTimer.text = '00:00';
			tiempoAgotado = true;
			incorrecto();
		}
	}
	//-----------------------cierra cronometro render----------------
}

function endTimer() {
	// Stop the timer when the delayed event triggers
	timer.stop();
}
function formatTime(s) {
	// Convert seconds (s) to a nicely formatted and padded time string
	var minutes = '0' + Math.floor(s / 60);
	var seconds = '0' + (s - minutes * 60);
	return minutes.substr(-2) + ':' + seconds.substr(-2);
}
