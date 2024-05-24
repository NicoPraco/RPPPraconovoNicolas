export class Persona {
    static lastID = 0;
    static personasID = {};

    constructor(id, nombre, apellido, fechaDeNacimiento) {
        if (this.#ValidarDatos(nombre, apellido, fechaDeNacimiento)) {
            this.id = id || Persona.nextID();
            this.nombre = nombre;
            this.apellido = apellido;
            this.fechaNacimiento = fechaDeNacimiento;
        } else {
            console.error('Ha ingresado un dato invalido en alguno de los campos.');
        }
    }

    /*
    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId;
    }
        */

    static nextID() {
        let nextID = Persona.lastID + 1;

        // Verificar si hay un ID no utilizado en el rango actual
        for (let i = 1; i < nextID; i++) {
            if (!Persona.personasID[i]) {
                Persona.lastID = i;
                Persona.personasID[i] = true; // Registrar el nuevo ID
                return i;
            }
        }

        // Si todos los IDs en el rango actual están en uso, continuar con el siguiente
        while (Persona.personasID[nextID]) {
            nextID++;
        }

        Persona.lastID = nextID; // Actualizar el último ID utilizado
        return nextID;
    }

    #ValidarDatos(nombre, apellido, fechaDeNacimiento) {
        return this.#ValidarNombre(nombre) && this.#ValidarApellido(apellido) && this.#ValidarFecha(fechaDeNacimiento);
    }

    #ValidarNombre(nombre) {
        return typeof nombre === 'string';
    }

    #ValidarApellido(apellido) {
        return typeof apellido === 'string';
    }

    #ValidarFecha(fechaDeNacimiento) {
        return (
            typeof fechaDeNacimiento === 'number' && fechaDeNacimiento > 0 && Math.ceil(Math.log10(fechaDeNacimiento + 1)) == 8
        );
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad));
    }

    /*
    static fromJson(jsonString) {
        const personas = JSON.parse(jsonType);
        let maxID = 0;

        personas.forEach((persona) => {
            if (persona.id > maxID) {
                maxID = persona.id;
            }

            this.personasID[persona.id] = true;
        });

        this.lastID = maxID;

        return personas;
    }
    */
}
