const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');

//Base de datos antigua
const pool = new Pool( {
    host: 'localhost',
    user: 'postgres',
    password: 'Bl@nc@ni3v3s',
    database: 'incigeo2',
    port: 5432
});

//tokens 
const check = {check: true};
const token = jwt.sign(check, process.env.JWTKEY, {expiresIn: 1440});

//TODO: validacion de tokens en peticiones
//TODO: separamos get, post, update...??

//Transformer
const transformer = require ("../dist/transformer")
transformer()


//====================================== peticiones =============================================//


//put
const updateIncidencia = async (req, res) => {
    const incidencia = req.body
    await pool.query('UPDATE sys_incidencias SET inc_via_ent = $1, inc_prioridad = $2, inc_seguimiento = $3, inc_procedencia = $4, inc_estado = $5, inc_descripcion = $6, inc_email = $7 WHERE id_inc = $8;',[
        incidencia.via_ent,
        incidencia.prioridad,
        incidencia.seguimiento,
        incidencia.procedencia,
        incidencia.estado,
        incidencia.descripcion,
        incidencia.eMail,
        incidencia.id_inc,
    ])
    res.json({
        status: 200,
        mensaje: 'Incidencia ' + incidencia.id_inc + ' Actualizada correctamente',
    })
}

const updateErrores = async (req, res) => {
    const error = req.body
    await pool.query('UPDATE sys_errores SET id_inc = $1 error_id = $2 error_job = $3 error_tema = $4 error_tipo = $5 error_descripcion = $6 error_estado = $7 error_geometría = ST_GeomFromText($8 \,\'3857\') error_geometria_json = $9 WHERE error_id = $2;',[
        error.id_inc,
        error.idError,
        error.job,
        error.tema,
        error.tipoError,
        error.descripcion,
        error.estado, 
        error.stringGeometry,
        error.geometry,
    ])
    res.json({
        status: 200,
        mensaje: 'Errores actualizados correctamente',
    })
}

const updateJobs = async (req, res) => {
    const job = req.body
    await pool.query('UPDATE sys_jobs SET id_inc = $1 job_desc = $2 job_gravedad = $3 job_detectado = $4 job_arreglar = $5 job_estado = $6 job_id = $7 job_geometria = ST_GeomFromText($8 \,\'3857\') job_asignacion = $9 job_bandeja = $10 job_operador = $11 job_geometria_json = $12)  WHERE job_id = $7;',[
        job.id_inc,
        job.descripcion,
        job.gravedad,
        job.deteccion,
        job.arreglo,
        job.estado,
        job.idJob,
        job.stringGeometry,
        job.asignacion,
        job.bandeja,
        job.nombreOperador,
        job.geometry, 
    ])
    res.json({
        status: 200,
        mensaje: 'Errores actualizados correctamente',
    })
}

const updateSerial = async (req, res) => {
    const serial = req.body
    await pool.query('UPDATE sys_serial SET serial_id = $1 WHERE serial_type = $2', [
        serial.id,
        serial.type,
    ]);
    res.json({
        status:200,
        mensaje: 'Actualizado serial',
    });
}



//delete
const deleteIncidenciaById = async (req, res) => {
    const id_inc = req.params.id;
    
    await pool.query('DELETE FROM sys_incidencias WHERE id_inc = $1', [id_inc]);
    await pool.query('DELETE FROM sys_jobs WHERE id_inc = $1', [id_inc]);
    await pool.query('DELETE FROM sys_errores WHERE id_inc = $1', [id_inc]);
    res.json ({
        status:200,
        mensaje: "Borrado ejecutado satisfactoriamente",
    });
}

//post


//exports
module.exports = {
    updateIncidencia,
    updateErrores,
    updateJobs,
    updateSerial,


    deleteIncidenciaById
}