const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const check = {check: true};
const token = jwt.sign(check, `${process.env.JWTKEY}`, {expiresIn: 1440});

const database = new Pool( {
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
    port: `${process.env.DB_PORT}`
});

//Transformer
const transformer = require ("../dist/transformer");
const { use } = require('../routes/routes');

//====================================================================================================== //

const postAuth = async (req, res) => {
    const usuario = req.params.usuario;
    const password = req.params.password;
    const response = await database.query('SELECT * FROM got.v_usuarios_detalle WHERE usuario = $1 AND password = $2', [usuario, password]);

    let usrRoles = [];

    for(this.index in response.rows){
        usrRoles.push(response.rows[this.index].roles)
    }

    if(response.rowCount !== 0) {         
        res.status(201);
        res.json({
            token: token,
            usrname: response.rows[0].usuario,
            usuario: response.rows[0].nombre +' '+response.rows[0].apellidos,
            defaultRole: response.rows[0].rol_defecto,
            usrRoles,
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

const postUser = async (req, res) => {
    const user = req.body 
    //COMPROBAR QUE NO EXISTE NOMBRE DE USUARIO 
    const userExists = await database.query('SELECT * FROM got.v_usuarios_detalle WHERE usuario = $1', [user.userName]);
    if(userExists.rowCount === 0){

        //GRABAR USUARIO
        await database.query('INSERT INTO got.usuarios (usuario, password, nombre, apellidos, id_rol_defecto, activo) VALUES ($1, $2, $3, $4, $5, $6)',[
            user.userName,
            user.password,
            user.nombre,
            user.apellidos,
            transformer('roles', user.defaultRole),
            true,
        ])
        
        //OBTENER NUEVO ID USUARIO INTRODUCIDO
        const newIdUser = (await database.query('SELECT id_usuario FROM got.usuarios WHERE usuario = $1', [
            user.userName
        ])).rows;

        //CREAR RELACION ROLES   
        for(this.index in user.selectedRoles){
            await database.query('INSERT INTO got.usuario_rol (id_usuario, id_rol) VALUES ($1, $2)',[
                newIdUser[0].id_usuario,
                transformer('roles', user.selectedRoles[this.index]),
            ])
        } 

        //DEVOLVER RESPUESTA
        res.json({
            mensaje: 'Usuario dado de alta correctamente',
        })
        res.status(201)
                
    } else {
        res.status(203);
        res.json({
            mensaje: 'El usuario ya existe en la base de datos'
        })
    }
}

const putUser = async (req, res) => {
    const user = req.body;
    try{
        const response = await database.query ('UPDATE got.usuarios SET usuario = $1, nombre = $2, apellidos = $3, id_rol_defecto = $4, activo = $5 WHERE id_usuario = $6', [
            user.usuario,
            user.nombre,
            user.apellidos,
            transformer('roles', user.rol_defecto),
            user.activo,
            user.id_usuario
        ])
        
        if(response.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: 'Usuario actualizado correctamente'
            })
        } else {
            res.status(203);
            res.json({
                mensaje: 'Fallo al actualizar'
            })
        }
        
    } catch(error){
        console.log("putUser ", error)
    }

}

const getUsers = async (req, res) => {
    try {
        const usersBD = (await database.query('SELECT DISTINCT id_usuario, usuario, nombre, apellidos, rol_defecto, activo, f_creacion FROM got.v_usuarios_detalle')).rows
        
        if(usersBD.length > 0){
            //CREACION ARRAY ROLES USUARIO
            for (this.index in usersBD){
                usersBD[this.index].f_creacion = ((((usersBD[this.index].f_creacion).toString()).split(' GMT'))[0]).slice(4, 15); 
                usersBD[this.index].roles = [];
                const userRoles = (await database.query('SELECT roles FROM got.v_usuarios_detalle WHERE id_usuario = $1', [
                    usersBD[this.index].id_usuario
                ])).rows 
                for (this.roleIndex in userRoles){
                    usersBD[this.index].roles.push(userRoles[this.roleIndex].roles)
                }
            }      
            res.status(201);
            res.json({usuarios: usersBD});
        } else {
            res.status(203);
            res.json({usuarios: null});
        }
        

    } catch (error) {
        console.log("getUsers ", error)
    }
}

const getUserRoles = async(req, res) => {
    const user = req.params.user;
    const roles = [];

    try{
        const response = await database.query('SELECT roles FROM got.v_usuarios_detalle WHERE usuario = $1', [
            user
        ])

        if(response.rowCount > 0){
            for (this.index in response.rows){
                roles.push(response.rows[this.index].roles)
            }
            res.status(201);
            res.json({
                roles,
                mensaje: 'Consulta realizada con éxito'
            })
        } else {
            res.status(203);
            res.json({
                roles: null,
                mensaje: 'El usuario no tiene roles asignados'
            })
        }
    } catch(error){
        console.log("getUserRoles", error)
    }
}

const getRoles = async (req, res) => {
    try{
        const response = await database.query('SELECT rol FROM got.roles')
        if(response.rowCount > 0){
            const roles = response.rows;
            let arrayRole = [];
            for (this.index in roles){
                arrayRole.push(roles[this.index].rol)
            }
            res.status(201);
            res.json({
                roles: arrayRole
            })
        } else {
            res.status(203);
            res.json({
                roles: undefined
            })
        }
    } catch(error) {
        console.log("getRoles", error)
    }
}


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
    postUser,
    getUsers,
    getUserRoles,
    getRoles,
    putUser,
    compruebaConexion,
}