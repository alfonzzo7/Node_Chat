const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'Nombre y sala son necesarios'
            });
        }

        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        let personasSala = usuarios.getPersonasPorSala(usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', personasSala);

        callback(personasSala);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        if (!personaBorrada) {
            return;
        }

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('crearMensaje', mensaje);
    });

});