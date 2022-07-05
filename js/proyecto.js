"use strict";
const myImage = new Image();
myImage.src = '/mandalorian.webp';
//establecemos dentro de un listener por que si la imagen antes no esta cargada 
//no podra obtener los valores de la imagen.
myImage.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 706;
    //hace el recorrido empezando desde la posicion x=0 y=0 hasta el ancho y alto de la imagen.
    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient1.addColorStop(0.1, 'orange');
    /*gradient1.addColorStop(0.2, 'red');
    gradient1.addColorStop(0.4, 'orange');
    gradient1.addColorStop(0.5, 'yellow');
    gradient1.addColorStop(0.6, 'green');
    gradient1.addColorStop(0.7, 'green');
    gradient1.addColorStop(0.8, 'violet');*/
    //const letters = ['M'];
    let switcher = 1;
    let counter = 0;
    let cellColor;
    let cellBrightness;
    //intervalo que toma 2 elementos funcion de llamada para ejecutar y frecuencia en ejecutar
    /*setInterval(function(){
        counter++;
        if (counter % 12 === 0){
            switcher *= -1;
        }
    }, 500);*/
    //pinta la imagen inicinado en las pociciones cero y recorreindo todo lo ancho y lo alto
    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let particlesArray = [];
    const numberOfParticles = 5000;
    let mappedImage = [];
    //recorremos el pixel fila x fila
    for (let y = 0; y < canvas.height; y++) {
        let row = [];
        //recorremos la imagen vertical hasta lo ancho del pixel.
        for (let x = 0; x < canvas.width; x++) {
            //se lean sus valores de color por cada pixel recorrido
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calculateRelativeBrightness(red, green, blue);
            const cell = [cellBrightness = brightness, cellColor = 'rgb(' + red + ',' + green + ',' + blue + ')'];
            row.push(cell);
        }
        mappedImage.push(row);
    }
    console.log(mappedImage);
    function calculateRelativeBrightness(red, green, blue) {
        return Math.sqrt((red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114) / 100;
    }
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = 0; //velocidad de caida
            this.velocity = Math.random() * 0.5; // la velocidad sera mas rapido en donde aya mas brillo y lento donde este mas obscuro
            this.size = Math.random() * 2.5 + 0.3;
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.angle = 0;
            //this.letter = letters[Math.floor(Math.random() * letters.length)];
            this.random = Math.random();
        }
        //calculara la posicion de las particulas para cada cuadro
        update() {
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            //calcula la velocidad de las particulas en funcion de sus coordenadas
            if ((mappedImage[this.position1]) && (mappedImage[this.position1][this.position2])) {
                this.speed = mappedImage[this.position1][this.position2][0];
            }
            let movement = (5 - this.speed) + this.velocity;
            this.angle += this.speed / 20;
            this.size = this.speed * 2.5;
            /*if (switcher === 1){
                 ctx.globalCompositeOperation = 'luminosity';
             } else {
                ctx.globalCompositeOperation = 'soft-light';
             }
             if (counter % 22 === 0){
                 this.x = Math.random() * canvas.width;
                 this.y = 0;
             }*/
            //calculamos la direccion de las particulas
            this.y -= movement + Math.cos(this.angle) * 2;
            this.x += movement + Math.sin(this.angle) * 2;
            if (this.y <= 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            if (this.x >= canvas.width) {
                this.x = 0;
                this.y = Math.random() * canvas.height;
            }
        }
        draw() {
            ctx.beginPath();
            //estilo de relleno
            ctx.fillStyle = gradient1;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle);
        }
    }
    init();
    function animate() {
        //rectangulo negro que da efecto de desvanecimiento
        ctx.globalAlpha = 0.05; //valor de transparencia
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            ctx.globalAlpha = particlesArray[i].speed * 0.3;
            //ctx.globalAlpha = 1;
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
});
