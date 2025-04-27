const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();


bands.addBand(new Band('Motorhead'));
bands.addBand(new Band('Primal Fear'));
bands.addBand(new Band('Iron Maiden'));
bands.addBand(new Band('Pink Floyd'));




// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado.');

    client.emit('bandas-actuales', bands.getBand()); //Emite al cliente que se acaba de conectar la lista de bandas actuales

    client.on('disconnect', () => { console.log('Cliente desconectado.') });
    
    client.on('mensaje', (payload)=> {
        console.log('mensaje', payload);   

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });
    
    client.on('vote-band',(payload)=> {
        bands.voteBand(payload.id);
        io.emit('bandas-actuales', bands.getBand()); //Emite al cliente que se acaba de conectar la lista de bandas actuales
    });
    
    // escuchar: add-band
    client.on('add-band',(payload)=> {
        const newBand = new Band(payload.name)
        bands.addBand(newBand);
        io.emit('bandas-actuales', bands.getBand()); //Emite al cliente que se acaba de conectar la lista de bandas actuales
    });
    client.on('delete-band',(payload)=> {
        
        bands.deleteBand(payload.id);
        io.emit('bandas-actuales', bands.getBand()); //Emite al cliente que se acaba de conectar la lista de bandas actuales
    });
    
    // client.on('emitir-mensaje', (payload)=> {
    //     // console.log('emitir-mensaje', payload);
    //     // io.emit('nuevo-mensaje', payload); //Emite a todos los clientes
    //     client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos los clientes menos al que lo emitió
    // })
});