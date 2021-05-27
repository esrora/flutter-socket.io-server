const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload)=> {
        console.log('Mensaje!!!', payload);

        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (data) => {
        bands.voteBand(data.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (data) => {
        const newBand = new Band(data.name)
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (data) => {
        bands.deleteBand(data.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (data) => {
    //     //console.log(data);
    //     //io.emit('nuevo-mensaje', data); //Emite a todos
    //     client.broadcast.emit('nuevo-mensaje', data); //Emite a todos menos al que lo emite
    // });
});