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
        getJobExtent,
        getJobParameters,
        postJobs,
        getJobs,
        updateJobs,
        } = require('../controllers/jobControllers');

//METODOS DE ERROR 
const   {
        getErrorParameters,
        getErrorByEstado,
        getErrorByIdJob,
        updateError,
        deleteError,
        postError,
        } = require('../controllers/errorControllers');
        
//CARGA COMBINADA JOBS / ERRORES 
const   {
        postJobsErrores
        } = require('../controllers/cargaJobsErrores');   

//CAMBIO ESTADOS JOBS / ERRORES
const   {
        postCambioEstadosJob,
        postCambioEstadosErrores
        } = require('../controllers/cambioEstados');

//definicion rutas
        //GET
        router.get('/jobExtent/:job', getJobExtent)                     //MIGRADO
        router.get('/jobs', getJobs);                                   //MIGRADO
        router.get('/conexion', compruebaConexion);                     //MIGRADO
        router.get('/jobParameters', getJobParameters);                 //MIGRADO
        router.get('/errorParameters', getErrorParameters);             //MIGRADO
        router.get('/expedientes/', getExpedientes);                    //MIGRADO
        router.get('/erroresEstado/:estado', getErrorByEstado)          //MIGRADO
        router.get('/error/:idJob', getErrorByIdJob);                   //MIGRADO 

        //POST
        router.post('/postJobs', postJobs);                             //MIGRADO
        router.post('/expediente', postExpediente);                     //MIGRADO
        router.post('/auth/:usuario/:password', postAuth);              //MIGRADO
        router.post('/postJobsErrores', postJobsErrores);               //MIGRADO
        router.post('/cambioEstadosJob', postCambioEstadosJob);         //MIGRADO
        router.post('/cambioEstadosError', postCambioEstadosErrores);   //MIGRADO
        router.post('/postError', postError)                        //MIGRADO

        //PUT
        router.put('/updateJob', updateJobs)                            //MIGRADO
        router.put('/updateError', updateError)                         //MIGRADO
        
        //DELTE
        router.delete('/deleteError', deleteError)                      //MIGRADO

        
module.exports = router;