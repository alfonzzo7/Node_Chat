var socket = io();

var params = new URLSearchParams(window.location.search);

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
    contacto: params.get('contacto')
};

socket.on('connect', function() {
    // console.log('Conectado al chat privado', usuario);

    socket.emit('entrarChatPrivado', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });

});

socket.on('listaPersona', function(personas) {
    // console.log(personas);
    renderizarUsuarios(personas);
});

socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderizarChat(mensaje, false);
});