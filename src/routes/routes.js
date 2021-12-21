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
        getExpedienteById,
        updateExpediente,
        } = require('../controllers/expedienteController');

//METODOS DE JOBS
const   {
        deleteJobs,
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

//METODOS LOGGER
const {
        getLog,
} = require('../controllers/loggerControllers');

        
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
        router.get('/jobExtent/:job', getJobExtent)                     
        router.get('/jobs', getJobs);                                   
        router.get('/conexion', compruebaConexion);                     
        router.get('/jobParameters', getJobParameters);                 
        router.get('/errorParameters', getErrorParameters);             
        router.get('/expedientes/', getExpedientes);                   
        router.get('/erroresEstado/:estado', getErrorByEstado)         
        router.get('/error/:idJob', getErrorByIdJob);                   
        router.get('/expediente/:expediente', getExpedienteById)       
        router.get('/getLog', getLog)

        //POST
        router.post('/postJobs', postJobs);                           
        router.post('/expediente', postExpediente);                  
        router.post('/auth/:usuario/:password', postAuth);            
        router.post('/postJobsErrores', postJobsErrores);              
        router.post('/cambioEstadosJob', postCambioEstadosJob);        
        router.post('/cambioEstadosError', postCambioEstadosErrores);   
        router.post('/postError', postError)                           

        //PUT
        router.put('/updateJob', updateJobs)                            
        router.put('/updateError', updateError)                        
        router.put('/updateExpediente', updateExpediente)              
        
        //DELTE
        router.delete('/deleteJobs', deleteJobs)                       
        router.delete('/deleteError', deleteError)                      

        
module.exports = router;