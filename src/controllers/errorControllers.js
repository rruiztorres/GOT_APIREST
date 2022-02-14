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

//Logger
const newEntryLog = require("../dist/newEntryLog");

//Formateo geometrias GEOJSON to String
const stringifyErrorGeometry = require("../dist/stringifyErrorGeometry")

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

const getErrors = async (req, res) => {
    try{
        const response = await database.query('SELECT * FROM got.v_errores');
        const errores = response.rows
        
        if(response.rowCount > 0){
            res.status(201);
            res.json({
                errores,
            })
        } else {
            res.status(203);
            res.json({
                errores: null,
            })
        }

    } catch(error) {
        console.log("getErrors -> ", error);
    }
}

const getErrorByEstado = async (req, res) =>{
    try{
        const estado = req.params.estado;
        const errores = await database.query('SELECT id_error, job, error, via_ent, tema_error, tipo_error, descripcion, estado, ST_AsGeoJSON(geometria) as geometria FROM got.v_errores WHERE estado = $1', [ estado ]);

        //FORMATEO GEOMETRIA STRING TO JSON
        for (this.index in errores.rows){
            errores.rows[this.index].geometria = JSON.parse(errores.rows[this.index].geometria)
        }

        if (errores.rowCount > 0) {
            res.status(201);
            res.json({
                errores: errores.rows,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se encuentran errores asociados al estado ${estado}`,
            })
        }
    } catch(error){
        console.log("getErrorByIdJob -> ", error)
    }
}

const getErrorByIdJob = async (req, res) =>{
    try{
        const idJob = req.params.idJob;
        const errores = await database.query('SELECT id_error, job, error, via_ent, tema_error, tipo_error, descripcion, estado, ST_AsGeoJSON(geometria) as geometria FROM got.v_errores WHERE job = $1', [ idJob ]);

        //FORMATEO GEOJSON STRING TO JSON
        for (this.index in errores.rows){
            errores.rows[this.index].geometria = JSON.parse(errores.rows[this.index].geometria)
        }

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
    let ejecucionCode = 0;
    let errores = req.body;
    try{
        for (this.index in errores){
            let error = errores[this.index];
            //Actualización en BD
            const response = await database.query('UPDATE got.errores SET id_job = $1, id_tema_error = $2, id_tipo_error = $3, descripcion = $4, id_estado_error = $5, geometria = ST_GeomFromText($6 \,\'3857\'), id_via_ent = $7 WHERE error = $8;',[
                error.job,                                      //id_job
                transformer('temasError', error.tema_error),    //id_tema_error
                transformer('tiposError', error.tipo_error),    //id_tipo_error
                error.descripcion,                              //descripcion
                transformer('estadosErrores', error.estado),    //id_estado
                stringifyErrorGeometry(error.geometria),        //geometria
                transformer('viaEntrada', error.via_ent),       //id_via_ent
                error.error                                     //error
            ])
            //Respuestas a cliente
            if (response.rowCount == 0){
                ejecucionCode = 1;
            } 
        }
        //Respuesta a cliente
        if (ejecucionCode == 0){
            res.status(201);
            res.json({
                mensaje: `jobs actualizados correctamente`,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `Ha ocurrido un error inesperado`,
            })
        }
    } catch (error){
        console.log("updateError -> ", error)
    }
}

const deleteError = async (req, res) => {
    try {
        const error = req.body.error;
        
        const dataLogger = req.body.log;
        const id_job = error.job;

        //Borrar antes en tabla de tiempos_error
        await database.query('DELETE FROM got.t_errores WHERE id_error = $1', [error.id_error])
        const borrarError = await database.query ('DELETE FROM got.errores WHERE error = $1', [error.error]);

        //Entrada Log
        newEntryLog(id_job, dataLogger.procesoJob, dataLogger.idEventoLogger, dataLogger.usuario, dataLogger.observaciones, dataLogger.departamento,dataLogger.resultadoCC)

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
        let errores = req.body 
        
        for (this.index in errores){
            let error = errores[this.index];

            //obtener numero job
            const job = (await database.query('SELECT job FROM got.jobs WHERE id_job = $1',[error.job])).rows[0].job;

            //obtener ultimo numero de error grabado 
            let lastError = (await database.query('SELECT error FROM got.v_errores WHERE job = $1 ORDER BY error DESC', [job]))

            if (lastError.rowCount == 0){
                //No existen errores previos almacenados
                newIdError = job + '_E' + 1;
            } else {
                idError = lastError.rows[0].error;
                lastError = parseInt(idError.substr(13,1));
                newIdError = job + '_E' + (lastError + 1);
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
                stringifyErrorGeometry(error.geometria),      //geometria
                transformer('viaEntrada', error.via_ent),     //id_via_ent
                error.geometria_json,                         //geometria_json
            ])

            //Comprueba insercion correcta
            if (insertErrorBD.rowCount == 0){
                ejecucionCode = 1;
                this.errorIncorrecto[this.index] = newIdError;
            } 
        }

        //respuesta al cliente
        if (ejecucionCode == 0){
            //todas las inserciones correctas
            res.status(201);
            res.json({
                mensaje: 'Errores almacenados correctamente',
                errores: errores,
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
    getErrors,
    getErrorByEstado,
    getErrorByIdJob,
    updateError,
    deleteError,
    postError,
};
