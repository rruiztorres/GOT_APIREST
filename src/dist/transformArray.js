const { Pool } = require("pg");
require("dotenv").config();

const database = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

// =================================================================== //
// Llenamos variables globales que luego emplearemos para traducir los datos antes de la inserción en tablas.

module.exports = function getTransformArrays() {
    //JOBS
    const getArreglo = async () =>{
        const response = await database.query ('SELECT id_arreglo, arreglo FROM got.arreglo')
        global.perfil = response.rows
    }
    getArreglo();
    
    const getAsignacion = async () =>{
        const response = await database.query ('SELECT id_asignacion, asignacion FROM got.asignacion')
        global.asignacion = response.rows
    }
    getAsignacion(); 

    const getDeteccion = async () =>{
        const response = await database.query ('SELECT id_deteccion, deteccion FROM got.deteccion')
        global.deteccion = response.rows
    }
    getDeteccion();
    
    const getEstadosJob = async () =>{
        const response = await database.query ('SELECT id_estado_job, estado FROM got.estados_job')
        global.estadosJobs = response.rows
    }
    getEstadosJob();
    
    const getExpediente = async () =>{
        const response = await database.query ('SELECT id_expediente, expediente FROM got.expedientes')
        global.expediente = response.rows
    }
    getExpediente();

    const getGravedad = async () =>{
        const response = await database.query ('SELECT id_gravedad, gravedad FROM got.gravedad')
        global.gravedad = response.rows
    }
    getGravedad();

    const getOperador = async () =>{
        const response = await database.query ('SELECT id_operador, nombre_operador FROM got.operadores')
        global.operador = response.rows
    }
    getOperador();

    const getTipoBandeja = async () =>{
        const response = await database.query ('SELECT id_tipo_bandeja, tipo_bandeja FROM got.tipo_bandeja')
        global.tipoBandeja = response.rows
    }
    getTipoBandeja(); 

    const getErrores = async () =>{
        const response = await database.query ('SELECT id_error, error FROM got.errores')
        global.errores = response.rows
    }
    getErrores();
    
    //ERRORES
    const getEstadoErrores = async () => {
        const response = await database.query ('SELECT id_estado_error, estado FROM got.estados_error')
        global.estadosErrores = response.rows
    }
    getEstadoErrores();

    const getTiposError = async () => {
        const response = await database.query ('SELECT id_tipo_error, tipo_error FROM got.tipos_error')
        global.tiposError = response.rows
    }
    getTiposError();

    const getTemasError = async () => {
        const response = await database.query ('SELECT id_tema_error, tema_error FROM got.temas_error')
        global.temasError = response.rows
    }
    getTemasError();

    const getViaEntrada = async () => {
        const response = await database.query ('SELECT id_via_ent, via_ent FROM got.via_entrada')
        global.viaEntrada = response.rows
    }
    getViaEntrada();

    console.log("[params] Variables globales actualizadas")
}

