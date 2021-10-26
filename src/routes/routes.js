const{ Router } = require('express');
const router = Router();


//METODOS DE USUARIO
const   {
        postAuth,
        compruebaConexion,
        } = require('../controllers/userControllers');

//METODOS DE EXPEDIENTES
const   {
        postExpediente,
        getExpedientes,
        } = require('../controllers/expedienteController');

//METODOS DE JOBS
const   {
        getJobParameters,
        postJobs,
        getJobs,
        } = require('../controllers/jobControllers');

//METODOS DE ERROR 
const   {
        getErrorParameters,
        postErrores, 
        } = require('../controllers/errorControllers');
        
//CARGA COMBINADA JOBS / ERRORES 
const   {
        postJobsErrores
        } = require('../controllers/cargaJobsErrores');   


// Metodos antiguos, eliminar
const   { 
        getJobByIdInc,
        updateIncidencia,
        updateErrores,
        updateJobs,
        updateSerial,
        deleteIncidenciaById,
        getErrorByIdInc,
        } = require('../controllers/controller.js');


//definicion rutas
        //GET
        router.get('/jobs', getJobs);                           //MIGRADO
        router.get('/jobs/:id', getJobByIdInc);
        router.get('/errores/:id', getErrorByIdInc);
        router.get('/conexion', compruebaConexion);             //MIGRADO
        router.get('/jobParameters', getJobParameters);         //MIGRADO
        router.get('/errorParameters', getErrorParameters);     //MIGRADO
        router.get('/expedientes/', getExpedientes)             //MIGRADO

        //POST
        router.post('/postJobs', postJobs);                     //MIGRADO
        router.post('/postErrores', postErrores);               //MIGRADO
        router.post('/expediente', postExpediente);             //MIGRADO
        router.post('/auth/:usuario/:password', postAuth);      //MIGRADO
        router.post('/postJobsErrores', postJobsErrores);       //MIGRADO

        //PUT
        router.put('/updateIncidencia', updateIncidencia);
        router.put('/updateErrores', updateErrores);
        router.put('/updateJobs', updateJobs);
        router.put('/updateSerial', updateSerial);

        //DELTE
        router.delete('/incidencias/:id', deleteIncidenciaById)

        
        
        
         



module.exports = router;