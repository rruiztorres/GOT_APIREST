const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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


//====================================== peticiones =============================================//

//get
const getIncidencias = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_incidencias ORDER BY id')
    if(response.rowCount !== 0) {
        console.log(response);
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
        console.log(response);
        respuesta = response.rows;
        usrname = respuesta[0].nombre_usuario +' '+respuesta[0].apellidos_usuario;

        res.json({
            status: 200,
            error_msg: '',
            mensaje: "Login correcto",
            token, 
            response: respuesta,
            usuario: usrname,
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
    postAuth,
    createIncidencia, 
    deleteIncidenciaById
}