const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
const { response } = require("express");


//Logger
const newEntryLog = require("../dist/newEntryLog");


//=============================================METODOS==================================================//

const postCambioEstadosJob = async (req, res) => {
    try{
        const nuevoEstado = transformer('estadosJobs', req.body[0].nuevoEstado);
        const job = (req.body[0].job);
        const id_job = (req.body[0].id_job);
        const operador = transformer('operador', (req.body[0].nombre_operador));

        
        const response = await database.query('UPDATE got.jobs SET id_estado_job = $1, id_operador = $2 WHERE job = $3;',[
                nuevoEstado,
                operador,
                job
            ])

            if (response.rowCount != 0) {
                //Añade entrada a logger al cambiar el estado el job
                if(req.body[1] != undefined){
                    const idEventoLogger = req.body[1].idEventoLogger;
                    const dataLogger = req.body[1];
                    const logger = newEntryLog(id_job, dataLogger.procesoJob, idEventoLogger, dataLogger.usuario, dataLogger.observaciones, dataLogger.departamento,dataLogger.resultadoCC)
                }

                res.status(201);
                res.json({
                    respuesta: response.rows,
                    jobActualizado: job,
                    mensaje: 'Estado Job Actualizado con éxito'
                })
            }
            else if (response.rowCount == 0) {
                res.status(203);
                res.json({
                    respuesta: response.rows,
                    mensaje: 'No se ha podido actualizar el estado del job'
                })
            }
    } catch(error){
        console.error(error);
    }
};



const putCambioEstadosErrores = async (req, res) => {
    try{
        const id_error = (req.body.id_error);
        const nuevoEstado = transformer('estadosErrores', req.body.nuevoEstado);
        const response = await database.query('UPDATE got.errores SET id_estado_error = $1 WHERE id_error = $2;',[
                nuevoEstado,
                id_error
            ])
        
            if (response.rowCount != 0) {
                res.status(201);
                res.json({
                    respuesta: response.rows,
                    mensaje: 'Estado Error Actualizado con éxito'
                })
            }
            else if (response.rowCount == 0) {
                res.status(203);
                res.json({
                    respuesta: response.rows,
                    mensaje: 'No se ha podido actualizar el estado del error'
                })
            }
    } catch(error){
        console.error(error)
    }
}


// =================================================================================================== //

module.exports = {
    postCambioEstadosJob,
    putCambioEstadosErrores
};
