var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
const MySql = require('./modulos/mysql.js')


var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */
app.get('/saludo', function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    res.send(`Hola ${req.query.nombre}, que tal?`)
})

app.post('/nombreDelPedido', function(req,res) {
    console.log(req.body) //Los pedidos post reciben los datos del req.body
    res.send("ok")
})


// PUNTO 2:

app.get('/obtenerPilotos', async function(req,res) {
    console.log(" [GET] /obtenerPilotos ")
    const respuesta = await MySql.realizarQuery(
        'SELECT * FROM Pilotos;')
    res.send(respuesta)
})

app.get('/obtenerGP', async function(req,res) {
    console.log(" [GET] /obtenerGP ")
    const respuesta = await MySql.realizarQuery(
        'SELECT * FROM GP;')
    res.send(respuesta)
})

app.get('/obtenerPilotosXGP', async function(req,res) {
    console.log(" [GET] /obtenerPilotosXGP ")
    const respuesta = await MySql.realizarQuery(
        'SELECT * FROM PilotosXGP;')
    res.send(respuesta)
})
//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('   [GET] http://localhost:3000/');
    console.log('   [GET] http://localhost:3000/saludo');
    console.log('   [GET] http://localhost:3000/obtenerPilotos');
    console.log('   [GET] http://localhost:3000/obtenerGP');
    console.log('   [GET] http://localhost:3000/obtenerPilotosXGP');
    console.log('   [POST] http://localhost:3000/nombreDelPedido');
});
// PUNTO 3:

app.get('/buscarPiloto', async function(req,res) {
    console.log(" [GET] /buscarPiloto ")
    const respuesta = await MySql.realizarQuery(
        `SELECT * FROM Pilotos WHERE piloto_ID=${req.query.id};`)
    res.send(respuesta)
})

app.get('/buscarGP', async function(req,res) {
    console.log(" [GET] /buscarPilotosGP ")
    const respuesta = await MySql.realizarQuery(
        `SELECT * FROM GP WHERE gp_ID=${req.query.id};`)
    res.send(respuesta)
})

app.get('/buscarPilotosXGP', async function(req,res) {
    console.log(" [GET] /buscarPilotosXGP ")
    const respuesta = await MySql.realizarQuery(
        `SELECT * FROM PilotosXGP WHERE Piloto_ID=${req.query.id};`)
    res.send(respuesta)
})


// PUNTO 4 y 7:

app.post('/insertarGp', async function(req,res) {
    let GP = await MySql.realizarQuery(`SELECT * FROM GP WHERE gp_ID = '${req.body.gp_ID}'`);
    if (GP.length != 0) {
        res.send("Ya existe");
    } else {
        await MySql.realizarQuery (`INSERT INTO GP (gp_ID,nombre, fecha, pista)
        VALUES ('${req.body.gp_ID}', '${req.body.nombre}', '${req.body.fecha}', '${req.body.pista}')`);
        res.send("OK");     
    }
})

app.post('/insertarPiloto', async function(req,res) {
    let Pilotos = await MySql.realizarQuery(`SELECT * FROM Pilotos WHERE piloto_ID = '${req.body.piloto_ID}'`);
    if (Pilotos.length != 0) {
        res.send("Ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Pilotos (nombre, apellido, escuderia, numero, nacionalidad, nacimiento, puntaje_Campeonato, piloto_ID)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.escuderia}', '${req.body.numero}', '${req.body.nacionalidad}', '${req.body.nacimiento}', '${req.body.puntaje_Campeonato}', '${req.body.piloto_ID}')`);
        res.send("OK");     
    }
})

app.post('/insertarPilotoXGP', async function(req,res) {
    let PilotosXGP = await MySql.realizarQuery(`SELECT * FROM PilotosXGP WHERE piloto_ID = '${req.body.piloto_ID}' AND gp_ID = '${req.body.gp_ID}'`);
    if (PilotosXGP.length != 0) {
        res.send("Ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO PilotosXGP (piloto_ID,gp_ID, posicion, tiempo, puntos)
        VALUES ('${req.body.piloto_ID}', '${req.body.gp_ID}', '${req.body.posicion}', '${req.body.tiempo}', '${req.body.puntos}')`);
        res.send("OK");     
    }
})


// PUNTO 5:

app.put('/cambiarDatoGP', async function(req,res) {
    console.log("[POST] /cambiarDatoGP req.body:", req.body)
    await MySql.realizarQuery(`UPDATE GP SET  nombre = '${req.body.nombre}' WHERE gp_ID = '${req.body.gp_ID}'`)
    res.send("OK")
})

app.put('/cambiarDatoPiloto', async function(req,res) {
    console.log("[POST] /cambiarDatoPiloto req.body:", req.body)
    await MySql.realizarQuery(`UPDATE Pilotos SET nombre = '${req.body.nombre}' WHERE piloto_ID = '${req.body.piloto_ID}'`)
    res.send("OK")
})

app.put('/cambiarDatoPilotosXGP', async function(req,res) {
    console.log("[POST] /cambiarDatoPilotosXGP req.body:", req.body)
    await MySql.realizarQuery(`UPDATE PilotosXGP SET posicion = '${req.body.posicion}' WHERE piloto_ID = '${req.body.piloto_ID}'`)
    res.send("OK")
})

// PUNTO 6: 

app.delete('/borrarGP', async function(req,res) {
    console.log("[DELETE] /borrarGP req.body:", req.body)
    await MySql.realizarQuery(`DELETE FROM GP WHERE gp_ID = '${req.body.gp_ID}'`)
    res.send("OK")
})

app.delete('/borrarPiloto', async function(req,res) {
    console.log("[DELETE] /borrarPiloto req.body:", req.body)
    await MySql.realizarQuery(`DELETE FROM Pilotos WHERE piloto_ID = '${req.body.piloto_ID}'`)
    res.send("OK")
})

app.delete('/borrarPilotoGP', async function(req,res) {
    console.log("[DELETE] /borrarPilotoGP req.body:", req.body)
    await MySql.realizarQuery(`DELETE FROM PilotosXGP WHERE piloto_ID = '${req.body.piloto_ID}'`)
    res.send("OK")
})



