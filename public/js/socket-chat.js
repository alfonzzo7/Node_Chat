var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala') || params.get('nombre').length <= 0 || params.get('sala').length <= 0) {
    window.location = 'index.html';
    throw new Error('Nombre y Sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
// socket.emit('crearMensaje', {
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
});

socket.on('listaPersonas', function(personas) {
    console.log(personas);
});