var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');
var contacto = params.get('contacto');

// referencias
var divUsuarios = $('#divUsuarios');
var divUsuariosPrivado = $('#divUsuariosPrivado');
var formEnviar = $('#formEnviar');
var formBuscar = $('#formBuscar');
var txtMensaje = $('#txtMensaje');
var txtBuscar = $('#txtBuscar');
var divChatbox = $('#divChatbox');
var smallSala = $('#sala');

if (!contacto) {
    contacto = sala;
}

// funcion para renderizar
function renderizarUsuarios(personas) {
    // console.log(personas);

    smallSala.text(contacto);

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + contacto + '</span></a>';
    html += '</li>';

    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" data-nombre="' + personas[i].nombre + '" href="javascript:void(0)"><img src="assets/images/users/no-img.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuariosPrivado.html(html);

    divUsuarios.html(html);
}

function renderizarChat(mensaje, yo) {
    // console.log(mensaje);

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/no-img.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/no-img.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
    scrollBottom();
}

// listeners
divUsuarios.on('click', 'a', function() {
    var idInvitado = $(this).data('id');
    var nombreInvitado = $(this).data('nombre');
    if (idInvitado) {
        var salaPrivada = nombre + '|' + nombreInvitado + '|' + new Date().getMilliseconds();
        var win = window.open('chat-privado.html?nombre=' + nombre + '&sala=' + salaPrivada + '&contacto=' + nombreInvitado, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
            socket.emit('enviarInvitacionPrivada', {
                id: idInvitado,
                nombre: nombreInvitado,
                nombreAnfitrion: nombre,
                sala: salaPrivada
            });
        } else {
            //Browser has blocked it
            alert('Por favor permite la apertura de popups para este sitio');
        }
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus();
        renderizarChat(resp, true);
        // console.log('respuesta server: ', resp);
    });
});

txtBuscar.on('keyup', function() {
    // console.log(txtBuscar.val());

    socket.emit('buscarContacto', { termino: txtBuscar.val(), sala: sala }, function(personas) {
        renderizarUsuarios(personas);
        // console.log('respuesta server: ', personas);
    });
});

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}