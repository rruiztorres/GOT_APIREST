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



//=============================================METODOS==================================================//

const postCambioEstadosJob = async (req, res) => {
    try{
        const nuevoEstado = transformer('estadosJobs', req.body.nuevoEstado);
        const job = (req.body.job);
        const operador = transformer('operador', (req.body.nombre_operador));

        const response = await database.query('UPDATE got.jobs SET id_estado_job = $1, id_operador = $2 WHERE job = $3;',[
                nuevoEstado,
                operador,
                job
            ])

            if (response.rowCount != 0) {
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



const postCambioEstadosErrores = async (req, res) => {
    try{
        const nuevoEstado = transformer('estadosErrores', req.body.nuevoEstado);
        const error = (req.body.error);
        
        const response = await database.query('UPDATE got.errores SET id_estado_error = $1 WHERE error = $2;',[
                nuevoEstado,
                error
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
    postCambioEstadosErrores
};
