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
    res.json(response.rows);
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
    const id_inc = req.params.id;
    const response = await pool.query('SELECT * FROM sys_jobs WHERE id_inc = $1 ORDER BY id_inc, job_id', [id_inc]);
    res.json(response.rows);
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
    const year = req.params.year;
    const response = await pool.query('SELECT * FROM sys_serial WHERE serial_type = $1 AND serial_year = $2', [type, year] );
    res.json(response.rows);
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

//put


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

const createIncidencia = async (req, res) => {
    const {id_inc, via_ent, prioridad, seguimiento, procedencia, estado} = req.body;

        const response = await pool.query('INSERT INTO sys_incidencias (id_inc, via_ent, prioridad, seguimiento, procedencia, estado) VALUES ($1, $2, $3, $4, $5, $6)', [id_inc, via_ent, prioridad, seguimiento, procedencia, estado])
        console.log(response);
        res.json ( {
            message: 'Incidencia creada satisfactoriamente',
            body: {
                incidencia: {id_inc, via_ent, prioridad, seguimiento, procedencia, estado}
            }
        })
}

//exports
module.exports = {
    getIncidencias, 
    getIncidenciaById,
    getJobs,
    getJobById,
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



    compruebaConexion, 
    postAuth,
    createIncidencia, 
    deleteIncidenciaById
}