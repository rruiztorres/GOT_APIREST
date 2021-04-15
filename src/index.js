const express = require('express');
const app = express();


//api web -> montar web con metodos y demás
    app.get("/api", (req, res) => {
        res.sendFile(__dirname + '/webapi/index.html');
    });


//MIDDLEWARES
    //permite formatear datos mostrados en JSON
    app.use(express.json());
    //si queremos enviar archivos como fotos y demas extended: true
    app.use(express.urlencoded({extended: false}));
    

// Configurar cabeceras y cors
    app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    });



//ROUTES
    app.use(require('./routes/routes.js'));


//Si no hay un puerto predefinido utilizamos el 3000
    const puerto = process.env.puerto || 3000;
    app.listen(puerto, ()=>{
        console.log('Bienvenido a InciGEO API REST... listo y escuchando puerto ' + puerto)
    });