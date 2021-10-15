const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.on('disconnect', () => {

    });
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('ultimos4-tickets', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('atender-ticket', (escritorio, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }
        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('ultimos4-tickets', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    })

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    })

}



module.exports = {
    socketController
}