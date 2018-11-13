var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



socket.on('connect', function() {
    // console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });

});

socket.on('invitacionPrivada', function(invitacion) {
    // console.log(invitacion);
    var win = window.open('chat-privado.html?nombre=' + invitacion.nombre + '&sala=' + invitacion.sala + '&contacto=' + invitacion.contacto, '_blank');
    if (win) {
        //Browser has allowed it to be opened
        win.focus();
    } else {
        //Browser has blocked it
        alert('Por favor permite la apertura de popups para este sitio');
    }
});

socket.on('crearMensaje', function(mensaje) {
    // console.log('Servidor:', mensaje);
    renderizarChat(mensaje, false);
});

socket.on('listaPersona', function(personas) {
    // console.log(personas);
    renderizarUsuarios(personas);
});