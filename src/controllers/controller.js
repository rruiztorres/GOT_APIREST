const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

//peticiones

//get
const getIncidencias = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_incidencias ORDER BY id')
    res.status(200).json(response.rows);
}


const getIncidenciaById = async (req, res) => {
    const id_inc = req.params.id;
    const response = await pool.query('SELECT * FROM sys_incidencias WHERE id_inc = $1', [id_inc]);
    console.log(response);
    res.json(response.rows);
}

const getAuth = async (req, res) => {
    const response = await pool.query('SELECT * FROM sys_usuarios ORDER BY id')
    res.status(200).json(response.rows);
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
    getAuth,
    createIncidencia, 
    deleteIncidenciaById
}