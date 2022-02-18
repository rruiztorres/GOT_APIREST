const express = require('express');
const app = express();
const morgan = require('morgan');


//api web -> montar web con metodos y demás
    app.get("/api", (req, res) => {
        res.sendFile(__dirname + '/webapi/index.html');
    });

//MIDDLEWARES
    //permite formatear datos mostrados en JSON
    app.use(express.json());
    //si queremos enviar archivos como fotos y demas extended: true
    app.use(express.urlencoded({extended: false}));


    //LOGGER
        //ZONA HORARIA -logger
        const moment = require('moment-timezone');
        morgan.token('date', (req, res, tz) => {
            return moment().tz(tz).format();
        })

    app.use(morgan(':date[Europe/Madrid]  |   :remote-addr    |   :method |   :status |   :url    |   :response-time ms'));

    
    //Manejo errores
    app.use(function errorHandler(err, req, res, next) {
        res.status(500);
        res.render('error', { error: err });
    });

//OTRAS CONFIGURACIONES
    app.set('json spaces', 3);


// CABECERAS + CORS
    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    });

//ROUTES (routes.js)
    app.use(require('./routes/routes.js'));

//PORT (Si no hay un puerto predefinido utilizamos el 3000)
    const puerto = process.env.puerto || 3000;
    const fechaServer = moment().tz('Europe/Madrid').format()
    app.listen(puerto, ()=>{
        console.log("[morgan] logger ready...")
        console.log("");
        console.log('===============================================================')
        console.log('Bienvenido a GOT API REST...Preparada y escuchando puerto ' + puerto)
        console.log('Fecha actual: ' + fechaServer)
        console.log('Esperando peticiones...')
        console.log('===============================================================')
        console.log("");
    });

// HANDLER 404
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
})

//GLOBALS
const getTransformArrays = require("../src/dist/transformArray");
global.params = getTransformArrays(); 