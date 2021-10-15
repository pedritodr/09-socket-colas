//referencia html
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Es escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlert.style.display = 'none'
const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
    if (payload == 0) {
        lblPendientes.style.display = 'none'
    } else {
        lblPendientes.style.display = ''
    }
    lblPendientes.innerText = payload;
});

btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', escritorio, ({ ok, msg, ticket }) => {
        if (ok) {
            lblTicket.innerText = `Ticket ${ticket.numero}`;
        } else {
            lblTicket.innerText = 'Nadie.';
            divAlert.innerText = msg;
            divAlert.style.display = ''
        }

    });

});