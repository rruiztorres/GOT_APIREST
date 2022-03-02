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

const getLogByJob = async(req,res) => {
    const job = req.params.job;
    try {
        const response = await database.query('SELECT codigo, job, evento, id_evento, descripcion, fecha FROM got.v_logs WHERE job = $1 ORDER BY fecha DESC;', [
            job
        ])
        for (this.index in response.rows){
            response.rows[this.index].fecha = response.rows[this.index].fecha.toString();
        }

        if (response.rowCount > 0){
            res.status(201);
            res.json({
                log: response.rows,
            })
        } else {
            res.status(203);
        }
    } catch (error) {
        console.log(error)
    }
}


//======================================================================================================//
module.exports = {
    getLogByJob,
};
