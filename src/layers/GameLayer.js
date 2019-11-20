class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.mapa = new Mapa(60, 80);

        this.jugadores = ["Miguel", "Nacho", "Jose"];
        this.gestorDeUnidades = new GestorDeUnidades(25, 3);
        this.gestorDeTurnos = new GestorDeTurnos(this.gestorDeUnidades, this.jugadores);

        this.continentes = {
            'A': new Continente("#c26100", "#ff8600", [], 0, "A"),
            'B': new Continente("#064f00", "#109c00", [], 0, "B"),
            'C': new Continente("#0040ae", "#0052f2", [], 0, "C"),
            'D': new Continente("#c2ac04", "#f3dc04", [], 0, "D"),
            'E': new Continente("#c50002", "#fb0002", [], 0, "E"),
            'F': new Continente("#ae0570", "#da0594", [], 0, "F"),
        };

        this.provincias = {
            'A': new Provincia([], "A"),
            'B': new Provincia([], "B"),
            'C': new Provincia([], "C"),
            'D': new Provincia([], "D"),
            'E': new Provincia([], "E"),
            'F': new Provincia([], "F"),
            'G': new Provincia([], "G"),
            'H': new Provincia([], "H"),
            'I': new Provincia([], "I"),
            'J': new Provincia([], "J"),
            'K': new Provincia([], "K"),
            'L': new Provincia([], "L"),
            'M': new Provincia([], "M"),
            'N': new Provincia([], "N"),
            'O': new Provincia([], "O"),
            'P': new Provincia([], "P"),
            'Q': new Provincia([], "Q"),
            'R': new Provincia([], "R"),
            'S': new Provincia([], "S"),
            'T': new Provincia([], "T"),
            'U': new Provincia([], "U"),
            'V': new Provincia([], "V"),
            'W': new Provincia([], "W"),
            'X': new Provincia([], "X"),
            'Y': new Provincia([], "Y"),
            'Z': new Provincia([], "Z"),
        };

        this.turnoActual = new Texto(this.gestorDeTurnos.jugadorActual, 600*0.45, 320*0.97);
        this.botonAtacar = new Boton(imagenes.attack, 600*0.95, 320*0.9);

        this.cargarMapa("res/" + nivelActual + "_continents.txt", "res/" + nivelActual + "_provinces.txt");
        this.addProvinceInfo("res/" + nivelActual + "_info.json");
        this.calculateCentroids();
    }

    actualizar() {
    }

    dibujar() {
        this.mapa.dibujar();
        this.turnoActual.dibujar();
        this.botonAtacar.dibujar();
    }

    procesarControles() {
    }

    cargarMapa(rutaContinentes, rutaProvincias) {
        let ficheroC = new XMLHttpRequest();
        let ficheroP = new XMLHttpRequest();
        ficheroC.open("GET", rutaContinentes, false);
        ficheroP.open("GET", rutaProvincias, false);

        ficheroC.onreadystatechange = function () {
            ficheroP.onreadystatechange = function () {
                let textoC = ficheroC.responseText;
                let textoP = ficheroP.responseText;
                let lineasC = textoC.split('\n');
                let lineasP = textoP.split('\n');
                for (let i = 0; i < lineasC.length; i++) {
                    let lineaC = lineasC[i];
                    let lineaP = lineasP[i];
                    for (let j = 0; j < lineaC.length; j++) {
                        let simboloC = lineaC[j];
                        let simboloP = lineaP[j];
                        //console.log("Coor: " + i + " " + j);
                        this.cargarObjetoMapa(simboloC, simboloP, j, i);
                    }
                }
            }.bind(this);
        }.bind(this);

        ficheroC.send(null);
        ficheroP.send(null);
    }

    cargarObjetoMapa(simboloC, simboloP, x, y) {
        if (this.continentes[simboloC] !== undefined && this.provincias[simboloP] !== undefined) {
            let tile = new Tile(x, y, this.continentes[simboloC], this.provincias[simboloP]);
            if (!this.continentes[simboloC].provincias.includes(this.provincias[simboloP])) {
                this.continentes[simboloC].provincias.push(this.provincias[simboloP]);
            }
            this.provincias[simboloP].tiles.push(tile);
            this.mapa.addTile(tile, x, y);
        }
    }

    calcularPulsaciones(pulsaciones) {
        for (let i = 0; i < pulsaciones.length; i++) {
            if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
                let clickedTile = this.mapa.getTileForCoords(pulsaciones[i].x, pulsaciones[i].y);
                if (clickedTile !== undefined) {
                    console.log("Click en tile: " + clickedTile.px + ", " + clickedTile.py);
                    console.log("   Coords: " + pulsaciones[i].x + ", " + pulsaciones[i].y);
                    console.log("   Continente: " + clickedTile.continente.code);
                    console.log("   Provincia: " + clickedTile.province.code);
                    console.log("   Climate: " + clickedTile.province.climate);
                    console.log("   hasSea? " + clickedTile.province.hasSea);
                } else {
                    console.log("Click en agua");
                }
            }
        }
    }

    calculateCentroids() {
        for (let key in this.provincias)
            if (this.provincias.hasOwnProperty(key)) {
                this.provincias[key].calculateCentroid();
                console.log("Calculated centroid: " + this.provincias[key].centroid.x + " " + this.provincias[key].centroid.y + " (for " + this.provincias[key].code + " province)");
            }
    }

    addProvinceInfo(rutaInfo) {
        let ficheroI = new XMLHttpRequest();
        ficheroI.open("GET", rutaInfo, false);
        ficheroI.onreadystatechange = function() {
            let text = ficheroI.responseText;
            let json = JSON.parse(text);
            console.log(json);
            for (let key in this.provincias) {
                if (this.provincias.hasOwnProperty(key)) {
                    if (this.provincias.hasOwnProperty(key)) {
                        this.provincias[key].climate = climates[json[key].climate];
                        this.provincias[key].hasSea = json[key].hasSea;
                    }
                }
            }
        }.bind(this);
        ficheroI.send(null);
    }
}
