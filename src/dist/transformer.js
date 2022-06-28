// (arreglo, asignacion, etc.. se reciben de parametros globales creados en transformArray.js)

module.exports = function (nameObjeto, value) {
    //JOBS
    if (nameObjeto === 'perfil') {
        for (this.index in perfil) {
            if (perfil[this.index].arreglo == value){
                return perfil[this.index].id_arreglo
            }
        }
    }
    else if (nameObjeto === 'asignacion') {
        for (this.index in asignacion) {
            if (asignacion[this.index].asignacion == value){
                return asignacion[this.index].id_asignacion
            }
        }
    }
    else if (nameObjeto === 'deteccion') {
        for (this.index in deteccion) {
            if (deteccion[this.index].deteccion == value){
                return deteccion[this.index].id_deteccion
            }
        }
    }

    else if (nameObjeto === 'estadosJobs') {
        for (this.index in estadosJobs) {
            if (estadosJobs[this.index].estado == value){
                return estadosJobs[this.index].id_estado_job
            }
        }
    }

    else if (nameObjeto === 'expediente') {
        for (this.index in expediente) {
            if (expediente[this.index].expediente == value){
                return expediente[this.index].id_expediente
            }
        }
    }

    else if (nameObjeto === 'gravedad') {
        for (this.index in gravedad) {
            if (gravedad[this.index].gravedad == value){
                return gravedad[this.index].id_gravedad
            }
        }
    }

    else if (nameObjeto === 'operador') {
        for (this.index in operador) {
            if (operador[this.index].nombre_operador == value){
                return operador[this.index].id_operador
            }
        }
    }

    else if (nameObjeto === 'tipoBandeja') {
        for (this.index in tipoBandeja) {
            if (tipoBandeja[this.index].tipo_bandeja == value){
                return tipoBandeja[this.index].id_tipo_bandeja
            }
        }
    }

    else if (nameObjeto === 'errores') {
        for (this.index in errores) {
            if (errores[this.index].error == value){
                return errores[this.index].id_error
            }
        }
    }

    // ERRORES 
    else if (nameObjeto === 'estadosErrores') {
        for (this.index in estadosErrores) {
            if (estadosErrores[this.index].estado == value){
                return estadosErrores[this.index].id_estado_error
            }
        }
    }

    else if (nameObjeto === 'tiposError') {
        for (this.index in tiposError) {
            if (tiposError[this.index].tipo_error == value){
                return tiposError[this.index].id_tipo_error
            }
        }
    }

    else if (nameObjeto === 'temasError') {
        for (this.index in temasError) {
            if (temasError[this.index].tema_error == value){
                return temasError[this.index].id_tema_error
            }
        }
    }

    else if (nameObjeto === 'viaEntrada') {
        for (this.index in viaEntrada) {
            if (viaEntrada[this.index].via_ent == value){
                return viaEntrada[this.index].id_via_ent
            }
        }
    }

    //ROLES
    else if (nameObjeto === 'roles'){
        for (this.index in roles){
            if (roles[this.index].rol === value){
                return roles[this.index].id_rol
            }
        }
    }
};
