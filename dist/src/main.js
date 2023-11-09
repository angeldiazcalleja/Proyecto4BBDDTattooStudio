"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenJedi = exports.OrdenJedi = void 0;
class OrdenJedi {
    constructor() {
        this.jedis = [];
        this.contadorJedi = 0;
    }
    guardarAlumnoJedi(nombre, apellido) {
        this.contadorJedi++;
        const nuevoJedi = {
            id: this.contadorJedi,
            nombre: nombre,
            apellido: apellido,
        };
        this.jedis.push(nuevoJedi);
        return nuevoJedi;
    }
    buscarAlumnoJedi(id) {
        const jedi = this.jedis.find((jedi) => jedi.id === id);
        return jedi || null;
    }
    borrarAlumnoJedi(id) {
        const index = this.jedis.findIndex((jedi) => jedi.id === id);
        if (index !== -1) {
            this.jedis.splice(index, 1);
        }
    }
    modificarAlumnoJedi(id, nuevoNombre, nuevoApellido) {
        const jedi = this.buscarAlumnoJedi(id);
        if (jedi) {
            jedi.nombre = nuevoNombre;
            jedi.apellido = nuevoApellido;
        }
    }
    mostrarAlumnosJedi(sort, search) {
        let jedis = [...this.jedis];
        if (sort === "ASC") {
            jedis = jedis.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
        }
        else if (sort === "DSC") {
            jedis = jedis.sort((a, b) => (a.nombre > b.nombre ? -1 : 1));
        }
        if (search) {
            jedis = jedis.filter((jedi) => jedi.nombre.toLowerCase().includes(search.toLowerCase()));
        }
        return jedis;
    }
}
exports.OrdenJedi = OrdenJedi;
exports.ordenJedi = new OrdenJedi();
// ordenJedi.guardarAlumnoJedi("Anakin", "Skywalker");
// ordenJedi.guardarAlumnoJedi("Obi-Wan", "Kenobi");
// ordenJedi.guardarAlumnoJedi("Ahsoka", "Tano");
// ordenJedi.guardarAlumnoJedi("Mace", "Windu");
// console.log(ordenJedi.buscarAlumnoJedi(1));
// ordenJedi.borrarAlumnoJedi();
// ordenJedi.modificarAlumnoJedi(4, "Rey", "Skywalker");
// ordenJedi.mostrarAlumnosJedi()
//# sourceMappingURL=main.js.map