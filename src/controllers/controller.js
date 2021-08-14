const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { response } = require('express');

const pool = new Pool( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

//tokens 
const check = {check: true};
const token = jwt.sign(check, process.env.JWTKEY, {expiresIn: 1440});

//TODO: validacion de tokens en peticiones
//TODO: separamos get, post, update...??


//====================================== peticiones =============================================//

//get
const getIncidencias = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_incidencias ORDER BY id')
    if(response.rowCount !== 0) {
        //console.log(response);
        respuesta = response.rows;
        res.json({
            status: 200,
            error: false,
            error_msg:'',
            mensaje: "API InciGEO -> Incidencias recuperadas correctamente",
            response: respuesta,
            number: response.rowCount,
        })
    } else {
        res.json({
            status: 403,
            error: true,
            error_msg: "ERROR: no se han podido recuperar las incidencias",
            mensaje: "Fallo en conexión con API InciGEO",
        })
    }

}

const getIncidenciaById = async (req, res) => {
    const id_inc = req.params.id;
    const response = await pool.query('SELECT * FROM sys_incidencias WHERE id_inc = $1', [id_inc]);
    res.json({
        status: 200,
        mensaje: response.rows,
    });
}

const getJobs = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_jobs ORDER BY id')
    if(response.rowCount !== 0) {
        //console.log(response);
        respuesta = response.rows;
        res.json({
            status: 200,
            error: false,
            error_msg:'',
            mensaje: "API InciGEO -> Jobs recuperados correctamente",
            response: respuesta,
            number: response.rowCount,
        })
    } else {
        res.json({
            status: 403,
            error: true,
            error_msg: "ERROR: no se han podido recuperar los Jobs",
            mensaje: "Fallo en conexión con API InciGEO",
        })
    }

}

const getJobById = async (req, res) => {
    const id_job = req.params.id;
    const response = await pool.query('SELECT * FROM sys_jobs WHERE job_id = $1', [id_job]);
    res.json({
        status: 200,
        mensaje: response.rows,
    });
}

const getErrorById = async (req, res) => {
    const id_error = req.params.id;
    const response = await pool.query('SELECT * FROM sys_errores WHERE error_id = $1', [id_error]);
    res.json({
        status: 200,
        mensaje: response.rows,
    });
}

const compruebaConexion = async (req, res) => {
    if (pool){
        const response = 'conexion con Base de datos establecida correctamente'
        console.log(response);
        res.json({
            status:200,
            error: false,
            msg: response,
        })
    } else {
        const response = 'no se puede establecer conexion con base de datos'
        console.log(response);
        res.json({
            status:503,
            error: false,
            msg: response,
        })
    }
}

const getSerial = async (req, res) => {
    const type = req.params.type
    const response = await pool.query('SELECT * FROM sys_serial WHERE serial_type = $1', [type] );
    res.json({
        status:200,
        mensaje: response.rows,
    });
}

const getViaEnt = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_viaentrada' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getProced = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_procedencia' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getTipoError = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_tipos_error' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getTemasError = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_temas_error' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getDeteccionJob = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_deteccion_job ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getArregloJob = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_arreglo_job ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getGravedadJob = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_gravedad_job ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getAsignacionJob = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_asignacion_job ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getTipoBandejaJob = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_tipo_bandeja ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getOperadores = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_operadores ORDER BY id' );
    res.json({
        status:200,
        response: response.rows,
        }
    );
}

const getPrioridad = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_prioridad ORDER BY id')
    res.json({
        status:200,
        response: response.rows,
    })
}

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
    await pool.query('UPDATE sys_errores SET error_incidencia = $1 error_id = $2 error_job = $3 error_tema = $4 error_tipo = $5 error_descripcion = $6 error_estado = $7 error_geometría = ST_GeomFromText($8 \,\'3857\') error_geometria_json = $9 WHERE error_id = $2;',[
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
    const response = await pool.query('DELETE FROM sys_incidencias WHERE id_inc = $1', [id_inc]);
    console.log(response);
    res.send ("Incidencia " + req.params.id + ' eliminada satisfactoriamente');
}

//post
const postAuth = async (req, res) => {
    const usuario = req.params.usuario;
    const password = req.params.password;

    const response = await pool.query('SELECT * FROM sys_usuarios WHERE usuario = $1 AND password = $2', [usuario, password]);
    
    if(response.rowCount !== 0) {
        respuesta = response.rows;
        usrname = respuesta[0].nombre_usuario +' '+respuesta[0].apellidos_usuario;
        defaultRole = respuesta[0].default_role;
        roles = respuesta[0].roles;

        res.json({
            status: 200,
            error_msg: '',
            mensaje: "Login correcto",
            token, 
            response: respuesta,
            usuario: usrname,
            rolDefecto: defaultRole,
            roles: roles,
        })
    } else {
        res.json({
            status: 403,
            error: true,
            error_msg: "usuario o constraseña incorrectos",
            mensaje: "error al introducir usuario o contraseña",
        })
    }
}

const postIncidencia = async (req, res, error) => {
    const incidencia = req.body;
    await pool.query ('INSERT INTO sys_incidencias (id_inc, inc_via_ent, inc_prioridad, inc_seguimiento, inc_procedencia, inc_estado, inc_descripcion, inc_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [
        incidencia.id_inc,
        incidencia.via_ent,
        incidencia.prioridad,
        incidencia.seguimiento,
        incidencia.procedencia,
        incidencia.estado,
        incidencia.descripcion,
        incidencia.eMail,
    ])

    res.json({
        status: 200,
        mensaje: 'incidencia insertada correctamente',
    })
}

const postJobs = async (req, res, error) => {
    const job = req.body;
    console.log(job.stringGeometry);
    await pool.query('INSERT INTO public.sys_jobs (id_inc, job_desc, job_gravedad, job_detectado, job_arreglar, job_estado, job_id, job_geometria, job_asignacion, job_bandeja, job_operador, job_geometria_json) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8 \,\'3857\'), $9, $10, $11, $12 )',[
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
    ]);
   
    res.json ({
        status: 200,
        mensaje: 'Jobs grabados correctamente'
    })
}

const postErrores = async (req, res) => {
    const error = req.body;

    console.log(error.stringGeometry);
    await pool.query('INSERT INTO public.sys_errores (error_incidencia, error_id, error_job, error_tema, error_tipo, error_descripcion, error_estado, error_geometria, error_geometria_json) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8 \,\'3857\'), $9)',[
        error.id_inc,
        error.idError,
        error.job,
        error.tema,
        error.tipoError,
        error.descripcion,
        error.estado, 
        error.stringGeometry,
        error.geometry,
    ]);

    res.json ({
        status: 200,
        mensaje: 'Errores grabados correctamente'
    })
}

//exports
module.exports = {
    getIncidencias, 
    getIncidenciaById,
    getJobs,
    getJobById,
    getErrorById,
    getSerial,
    getViaEnt,
    getProced,
    getAsignacionJob,
    getTipoError,
    getTemasError,
    getDeteccionJob,
    getArregloJob,
    getGravedadJob,
    getTipoBandejaJob,
    getOperadores,
    getPrioridad,

    updateIncidencia,
    updateErrores,
    updateJobs,
    updateSerial,

    compruebaConexion, 
    postAuth,
    postIncidencia,
    postJobs,
    postErrores, 


    deleteIncidenciaById
}