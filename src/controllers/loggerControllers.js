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


//Transformer
const transformer = require ("../dist/transformer");
const { response } = require("express");

//=============================================METODOS==================================================//

const getLog = async(req,res) => {
    //
}


//======================================================================================================//
module.exports = {
    getLog,
};
