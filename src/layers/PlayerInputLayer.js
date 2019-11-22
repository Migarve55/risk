class MenuLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.fondo = new Fondo(imagenes.menu_fondo, 0, 0);
        this.boton = new Boton(imagenes.boton_empezar, 480 * 0.5, 320 * 0.7);
    }

    dibujar() {
        this.fondo.dibujar();
        this.boton.dibujar();

    }

    calcularPulsaciones(pulsaciones) {
        this.boton.pulsado = false;

        for (let i = 0; i < pulsaciones.length; i++) {
            if (this.boton.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.boton.pulsado = true;
                if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
                    controles.continuar = true;
                }
            }
        }

        // No pulsado - Botón Disparo
        if (!this.boton.pulsado) {
            controles.continuar = false;
        }
    }

    procesarControles() {
        // siguiente pantalla
        if (controles.continuar) {
            gameLayer = new GameLayer();
            layer = gameLayer;
            controles.continuar = false;
        }
    }
}
