const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const check = {check: true};
const token = jwt.sign(check, process.env.JWTKEY, {expiresIn: 1440});

const database = new Pool( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

//====================================================================================================== //

const postAuth = async (req, res) => {
    const usuario = req.params.usuario;
    const password = req.params.password;
    const response = await database.query('SELECT * FROM got.v_usuarios WHERE usuario = $1 AND password = $2', [usuario, password]);

    if(response.rowCount !== 0) {     
        res.status(201);
        res.json({
            token: token,
            usrname: response.rows[0].usuario,
            usuario: response.rows[0].nombre +' '+response.rows[0].apellidos,
            defaultRole: response.rows[0].rol_defecto,
            usrRoles: response.rows[0].roles,
        });
    } else {
        res.status(404);
        res.json({
            error: true,
            error_msg: "usuario o constraseña incorrectos",
            mensaje: "error al introducir usuario o contraseña",
        });
    }
};


const compruebaConexion = async (req, res) => {
    if (database){
        const response = 'Base de datos online y lista';
        res.json({
            status:201,
            error: false,
            msg: response,
        })
    } else {
        const response = 'Base de datos no disponible, compruebe conexión';
        res.json({
            status:503,
            error: false,
            msg: response,
        })
    }
}





//====================================================================================================== //
module.exports = {
    postAuth,
    compruebaConexion,
}