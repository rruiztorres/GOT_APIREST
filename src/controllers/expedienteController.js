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

//=============================================METODOS==================================================//

const postExpediente = async (req, res) => {
    const expediente = req.body;
    await database.query('INSERT INTO got.expedientes (expediente, fecha, observaciones, finalizado) VALUES ($1, $2, $3, $4)', [
        expediente.numExp,
        expediente.fechaInicio,
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
    const response = await database.query ('SELECT * FROM got.expedientes')
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
        const response = await database.query("UPDATE got.expedientes SET finalizado =$1 WHERE expediente = $2 ",[
            expediente.finalizado,
            expediente.expediente,
        ])
        if (response.rowCount > 0){
            res.status(201);
        } else {
            res.status(203);
        }
    } catch(error){
        console.log(error)
    }

}
//======================================================================================================//
module.exports = {
    postExpediente,
    getExpedientes,
    getExpedienteById,
    updateExpediente,
};