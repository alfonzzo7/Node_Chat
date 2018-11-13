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

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${ usuario.nombre } se unió al chat`));

        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('enviarInvitacionPrivada', (invitacion) => {
        client.broadcast.to(invitacion.id).emit('invitacionPrivada', { nombre: invitacion.nombre, contacto: invitacion.nombreAnfitrion, sala: invitacion.sala });
    });

    client.on('entrarChatPrivado', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'Nombre y sala son necesarios'
            });
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));

        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        if (!personaBorrada) {
            return;
        }

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('buscarContacto', (busqueda, callback) => {
        callback(usuarios.buscarPersona(busqueda.termino, busqueda.sala));
    });

});