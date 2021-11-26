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
const { parse } = require("pg-protocol");

//=============================================METODOS==================================================//

const getErrorParameters = async (req, res) =>{
    try{
        const temaError = await database.query('SELECT * FROM got.temas_error ORDER BY id_tema_error');
        const tipoError = await database.query('SELECT * FROM got.tipos_error ORDER BY id_tipo_error' );

        res.status(201);
        res.json({
            tema: temaError.rows,
            tipo: tipoError.rows,
        })
    } catch(error){
        console.log("getErrorParameters -> ", error)
    }

}

const getErrorByEstado = async (req, res) => {
    try {
        const estado = req.params.estado;
        const errores = await database.query('SELECT * FROM got.v_errores WHERE estado = $1', [ estado ])

        if (errores.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: `Errores correspondientes a estado ${estado}`
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se encontraron errores con estado ${estado}`
            })
        }
    } catch (error){
        console.log("getErrorByEstado -> ", error)
    }

}

const getErrorByIdJob = async (req, res) =>{
    try{
        const idJob = req.params.idJob;
        const errores = await database.query('SELECT * FROM got.v_errores WHERE job = $1', [ idJob ]);

        if (errores.rowCount > 0) {
            res.status(201);
            res.json({
                errores: errores.rows,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se encuentran errores asociados al job ${idJob}`,
            })
        }
    } catch(error){
        console.log("getErrorByIdJob -> ", error)
    }
}

const updateError = async (req, res) => {
    try{
        const error = req.body;
        //Actualización en BD
        const response = await database.query('UPDATE got.errores SET id_job = $1, id_tema_error = $2, id_tipo_error = $3, descripcion = $4, id_estado_error = $5, geometria = ST_GeomFromText($6 \,\'3857\'), id_via_ent = $7, geometria_json = $8 WHERE error = $9;',[
            error.job,                                      //id_job
            transformer('temasError', error.tema_error),    //id_tema_error
            transformer('tiposError', error.tipo_error),    //id_tipo_error
            error.descripcion,                              //descripcion
            transformer('estadosErrores', error.estado),    //id_estado
            error.geometria,                                //geometria
            transformer('viaEntrada', error.via_ent),       //id_via_ent
            error.geometria_json,                           //geometria_json
            error.error                                     //error
        ])
        //Respuestas a cliente
        if (response.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: `job ${error.error} actualizado correctamente`,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se ha encontrado ningún job con el id ${error.error}`,
            })
        }
    } catch (error){
        console.log("updateError -> ", error)
    }
}

const deleteError = async (req, res) => {
    try {
        const error = req.body.error;
        const borrarError = await database.query ('DELETE FROM got.errores WHERE error = $1', [error.error]);

        if (borrarError.rowCount > 0) {
            res.status(201);
            res.json({
                mensaje: 'Error borrado con éxito'
            })
        } else {
            res.status(203);
            res.json({
                mensaje: 'El error no pudo ser borrado'
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const postError = async (req, res) => {
    try{
        let ejecucionCode = 0;
        const error = req.body
        
        //obtener numero job
        const job = (await database.query('SELECT job FROM got.jobs WHERE id_job = $1',[error.job])).rows[0].job;

        //obtener ultimo numero de error grabado 
        let lastError = (await database.query('SELECT error FROM got.v_errores WHERE job = $1', [job]).rows)
        if (lastError == undefined){
            newIdError = job + '_E' + 1;
            console.log(newIdError)
        } else {
            lastError = parseInt(lastError.substr(13,1))+1;
            newIdError = job + '_E' + lastError;
            console.log(newIdError)
        }
        
        //Asignamos idError al objeto error actual
        error.error = newIdError
        
        //Insertamos en base de datos
        const insertErrorBD = await database.query('INSERT INTO got.errores (id_job, error, id_tema_error, id_tipo_error, descripcion, id_estado_error, geometria, id_via_ent, geometria_json) VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 \,\'3857\'), $8, $9)', [
            error.job,                                    //id_job
            error.error,                                  //error
            transformer('temasError', error.tema_error),  //id_tema_error
            transformer('tiposError', error.tipo_error),  //id_tipo_error
            error.descripcion,                            //descripcion
            transformer('estadosErrores', error.estado),  //id_estado_error
            error.geometria,                              //geometria
            transformer('viaEntrada', error.via_ent),     //id_via_ent
            error.geometria_json,                         //geometria_json
        ])

        //Comprueba insercion correcta
        if (insertErrorBD.rowCount == 0){
            ejecucionCode = 1;
            this.errorIncorrecto[this.index] = newIdError;
        } 

        //respuesta al cliente
        if (ejecucionCode == 0){
            //todas las inserciones correctas
            res.status(201);
            res.json({
                mensaje: 'Errores almacenados correctamente',
                error: error,
            })
        } else {
            //error en alguna insercion
            res.status(203);
            res.json({
                mensaje: 'Existen errores en la inserción',
                errores: this.errorIncorrecto,
            })
        }
    } catch(error){
        console.log("metodo postErrores -> ", error)
    }
}


//======================================================================================================//
module.exports = {
    getErrorParameters,
    getErrorByEstado,
    getErrorByIdJob,
    updateError,
    deleteError,
    postError,
};
