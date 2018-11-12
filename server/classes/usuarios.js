class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(persona => {
            return persona.id === id;
        })[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasSala = this.personas.filter(persona => {
            return persona.sala === sala;
        });
        return personasSala;
    }

    borrarPersona(id) {
        let personaBorrrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => {
            return persona.id != id;
        });

        return personaBorrrada;
    }

}

module.exports = {
    Usuarios
}