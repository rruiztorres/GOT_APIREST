const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { reset } = require("nodemon");

const check = { check: true };
const token = jwt.sign(check, `${process.env.JWTKEY}`, {expiresIn: 1440});

const database = new Pool( {
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
    port: `${process.env.DB_PORT}`
});

//=============================================METODOS==================================================//

const postExpediente = async (req, res) => {
    const expediente = req.body;
    await database.query('INSERT INTO got.expedientes (expediente, fecha, observaciones, finalizado) VALUES ($1, $2, $3, $4)', [
        expediente.expediente,
        expediente.fecha,
        expediente.observaciones,
        expediente.finalizado,
    ])

    //RECARGAR VARIABLES GLOBALES
    const getTransformArrays = require("../dist/transformArray");
    global.params = getTransformArrays();  

    res.status(201)
    res.json({
        mesaje: 'insercion realizada correctamente',
    });

}

const getExpedientes = async (req,res) =>{
    const response = await database.query ('SELECT * FROM got.expedientes ORDER BY expediente')
    let expedientes = response.rows;
    for(this.index in expedientes){
        expedientes[this.index].fechaCadena = (expedientes[this.index].fecha).toString()
    }
    
    res.status(201);
    res.json({
        respuesta: response.rows,
    })
}

const getExpedienteById = async (req,res) =>{
    const expediente = req.params.expediente
    const response = await database.query ('SELECT * FROM got.expedientes WHERE expediente = $1', [expediente])
    res.status(201);
    res.json({
        respuesta: response.rows,
    })
}

const updateExpediente = async (req,res) => {
    const expediente = req.body;
    try{
        const response = await database.query("UPDATE got.expedientes SET fecha=$1, observaciones=$2, finalizado =$3 WHERE expediente = $4",[
            expediente.fecha,
            expediente.observaciones,
            expediente.finalizado,
            expediente.expediente,
        ])
        if (response.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: 'operación realizada correctamente'
            })
        } else {
            res.status(203);
        }
    } catch(error){
        console.log(error)
    }
}

const deleteExpediente = async (req, res) => {
    const expediente = req.body;
    let proceso = 0;
    let expedientesBorrados = [];
    try {
        for (this.index in expediente){
            const nExp = expediente[this.index].expediente;
            const response = await database.query("DELETE FROM got.expedientes WHERE expediente = $1", [
                nExp,
            ])
            if(response.rowCount === 0) {
                proceso = 1;
            } else {
                expedientesBorrados.push(nExp);
            }

        }
        //RESPUESTAS
        if(proceso === 0){
            console.log("proceso ok")
            res.status(201);
            res.json({
                mensaje: 'Expedientes eliminados correctamente',
                expedientes: expedientesBorrados,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: 'El expediente aun tiene jobs pendientes',
                expedientes: null,
            })
        }

    } catch (error) {
        console.log("deleteExpediente -> ", error);
    } 
}

//======================================================================================================//
module.exports = {
    postExpediente,
    getExpedientes,
    getExpedienteById,
    updateExpediente,
    deleteExpediente,
};