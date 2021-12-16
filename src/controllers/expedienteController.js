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
        expediente.fecha,
        expediente.observaciones,
        expediente.finalizado,
    ])
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

//======================================================================================================//
module.exports = {
    postExpediente,
    getExpedientes,
    getExpedienteById,
};