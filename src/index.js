// const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');

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


//ROUTES
    app.use(require('./routes/routes.js'));


//Si no hay un puerto predefinido utilizamos el 3000
    const puerto = process.env.puerto || 3000;
    app.listen(puerto, ()=>{
        console.log('Bienvenido a InciGEO API REST... listo y escuchando puerto ' + puerto)
    });