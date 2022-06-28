const{ Router } = require('express');
const router = Router();


//METODOS DE USUARIO
const   {
        postAuth,
        postUser,
        putUser,
        getUsers,
        getUserRoles,
        getRoles,
        compruebaConexion,
        } = require('../controllers/userControllers');

//METODOS DE EXPEDIENTES
const   {
        postExpediente,
        getExpedientes,
        getExpedienteById,
        updateExpediente,
        deleteExpediente,
        } = require('../controllers/expedienteController');

//METODOS DE JOBS
const   {
        deleteJobs,
        getJobExtent,
        getJobParameters,
        getJobById,
        getJobsByExpediente,
        postJobs,
        getJobs,
        updateJobs,
        updateAsignJob,
        } = require('../controllers/jobControllers');

//METODOS DE ERROR 
const   {
        getErrorParameters,
        getErrors,
        getErrorByEstado,
        getErrorByIdJob,
        updateError,
        deleteError,
        postError,
        } = require('../controllers/errorControllers');

//METODOS LOGGER
const   {
        getLogByJob,
        } = require('../controllers/loggerControllers');

        
//CARGA COMBINADA JOBS / ERRORES 
const   {
        postJobsErrores
        } = require('../controllers/cargaJobsErrores');   

//CAMBIO ESTADOS JOBS / ERRORES
const   {
        postCambioEstadosJob,
        putCambioEstadosErrores
        } = require('../controllers/cambioEstados');


//DUMMY GEOPROCCESSING
const   {
        createVersion, 
        reconcileVersion,
        } = require('../controllers/geoproccessings');



//definicion rutas
        //GET
        router.get('/jobExtent/:job', getJobExtent)                     
        router.get('/jobs', getJobs);  
        router.get('/getJobsByExp/:expediente', getJobsByExpediente);                                 
        router.get('/conexion', compruebaConexion);                     
        router.get('/jobParameters', getJobParameters);    
        router.get('/getJobById/:job', getJobById)             
        router.get('/errorParameters', getErrorParameters);             
        router.get('/expedientes/', getExpedientes); 
        router.get('/errores', getErrors)                  
        router.get('/erroresEstado/:estado', getErrorByEstado)         
        router.get('/error/:idJob', getErrorByIdJob);                   
        router.get('/expediente/:expediente', getExpedienteById)       
        router.get('/getLogByJob/:job', getLogByJob)
        router.get('/getUsers', getUsers)
        router.get('/getUserRoles/:user', getUserRoles)
        router.get('/getRoles', getRoles)

        //POST
        router.post('/postJobs', postJobs);                           
        router.post('/expediente', postExpediente);                  
        router.post('/auth/:usuario/:password', postAuth); 
        router.post('/newUser', postUser)           
        router.post('/postJobsErrores', postJobsErrores);              
        router.post('/cambioEstadosJob', postCambioEstadosJob);        
        router.post('/postError', postError)
        router.post('/createVersion', createVersion)                    //DUMMY    
        router.post('/reconcileVersion', reconcileVersion)              //DUMMY

        //PUT
        router.put('/updateJob', updateJobs)
        router.put('/updateAsignJob', updateAsignJob)                         
        router.put('/updateError', updateError)                        
        router.put('/updateExpediente', updateExpediente)
        router.put('/cambioEstadosError', putCambioEstadosErrores);  
        router.put('/updateUser', putUser)
              
        
        //DELETE
        router.delete('/deleteJobs', deleteJobs)                       
        router.delete('/deleteError', deleteError)    
        router.delete('/deleteExpediente', deleteExpediente)                  

        
module.exports = router;