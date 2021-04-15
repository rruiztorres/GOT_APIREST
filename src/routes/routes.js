const{ Router }= require('express');
const router = Router();

//import elementos desde controller.js
const   { 
        getIncidencias, 
        getIncidenciaById ,
        createIncidencia,
        getAuth,
        deleteIncidenciaById
        } = require('../controllers/controller.js');


//definicion rutas

//get
router.get('/incidencias', getIncidencias);
router.get('/incidencias/:id', getIncidenciaById);
router.get('/auth', getAuth);

//delete
router.delete('/incidencias/:id', deleteIncidenciaById)

//post
router.post('/incidencias', createIncidencia);



module.exports = router;