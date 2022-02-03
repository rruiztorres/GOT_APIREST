const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { response } = require("express");

const check = { check: true };
const token = jwt.sign(check, process.env.JWTKEY, { expiresIn: 1440 });

const database = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

//Transformer
const transformer = require ("../dist/transformer");

//=============================================METODOS==================================================//

const createVersion = async (req, res) => {
    const job = req.body[0];
    const resultado = Math.round((Math.random()))

    if (resultado == 0 ){
        await database.query ('UPDATE got.jobs SET id_estado_job = $1 WHERE id_job = $2', [
            transformer('estadosJobs', 'Versión generada'),
            job.id_job,
        ])
    } else {
        await database.query ('UPDATE got.jobs SET id_estado_job = $1 WHERE id_job = $2', [
            transformer('estadosJobs', 'Error versión'),
            job.id_job,
        ])
    }

    function response(resultado){
        if(resultado == 0){
            console.log("Versión generada correctamente")
            res.status(201),
            res.json({
                mensaje: 'Version generada correctamente'
            })
        } else {
            console.log("Fallo generación versión")
            res.status(203),
            res.json({
                mensaje: 'Fallo generación version'
            })
        }
    }

    //SIMULAMOS TIEMPO QUE TARDA EL GP GENERAR
    setTimeout(response, 5000)
}

const reconcileVersion = async (req, res) => {
    const job = req.body[0];
    const resultado = Math.round((Math.random()))

    if (resultado == 0 ){
        await database.query ('UPDATE got.jobs SET id_estado_job = $1 WHERE id_job = $2', [
            transformer('estadosJobs', 'Conciliado'),
            job.id_job,
        ])
    } else {
        await database.query ('UPDATE got.jobs SET id_estado_job = $1 WHERE id_job = $2', [
            transformer('estadosJobs', 'Error_fin para usuario'),
            job.id_job,
        ])
    }

    function response(resultado){
        if(resultado == 0){
            res.status(201),
            res.json({
                mensaje: 'Reconciliado correcto'
            })
        } else {
            res.status(203),
            res.json({
                mensaje: 'Fallo al reconciliar'
            })
        }
    }

    //SIMULAMOS TIEMPO QUE TARDA EL GP RECONCILE
    setTimeout(response, 5000)
}

//==========================================================================================//
module.exports = {
    createVersion,
    reconcileVersion,
}