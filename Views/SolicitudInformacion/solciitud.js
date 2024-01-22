//DOM
// Obtener elementos por su ID
const nombreCompletoInput          = document.getElementById('nombreCompleto');
const sexoSelect                   = document.getElementById('sexo');
const tipoDocumentoSelect          = document.getElementById('tipoDocumento');
const numeroDocumentoInput         = document.getElementById('numeroDocumento');
const telefonoInput                = document.getElementById('telefono');
const correoInput                  = document.getElementById('correo');
const etniaSelect                  = document.getElementById('etnia');
const pertenenciaSocialSelect      = document.getElementById('pertenenciaSocial');
const descripcionSolicitudTextarea = document.getElementById('descripcionSolicitud');
const tipoNotificacionSelect       = document.getElementById('tipoNotificacion');


 const URL_saveSolicitud = "https://solicitar-informacion-cna.onrender.com/api/saveSolicitud"; //Produccion
//const URL_saveSolicitud = "http://localhost:3000/api/saveSolicitud";                         //Desarrollo



// ----------------------- solicitudes al backend - INICIO  -------------------------------------------
const SaveSolicitudPost = async (nombreCompleto, sexo, tipoDocumento, numeroDocumento, telefono, correo, etnia, pertenenciaSocial, descripcionSolicitud, tipoNotificacion) => {
    try{
        const data = {
            nombreCompleto,
            sexo, 
            tipoDocumento,
            numeroDocumento, 
            telefono,
            correo,
            etnia,
            pertenenciaSocial,
            descripcionSolicitud,
            tipoNotificacion
        }
        const response = await axios.post(URL_saveSolicitud, data);
        return response.data;
    }catch(error){
        throw JSON.parse(error.request.response);
    }
}


const GuardarSolicitud = async () => {

    if(ValidarInputSolicitudes()){
        return;
    }

    if(ValidarTipoNotificacion()){
        return;
    }

    const prmNombreCompleto       = nombreCompletoInput.value;
    const prmSexo                 = obtenerTextoSeleccionado(sexoSelect);
    const prmTipoDocumento        = obtenerTextoSeleccionado(tipoDocumentoSelect);
    const prmNumeroDocumento      = numeroDocumentoInput.value;
    const prmTelefono             = telefonoInput.value;
    const prmCorreo               = correoInput.value;
    const prmEtnia                = obtenerTextoSeleccionado(etniaSelect);
    const prmPertenenciaSocial    = obtenerTextoSeleccionado(pertenenciaSocialSelect);
    const prmDescripcionSolicitud = descripcionSolicitudTextarea.value;
    const prmTipoNotificacion     = obtenerTextoSeleccionado(tipoNotificacionSelect);
    try{

        MostrarLoadingYOculatarScroll();

        const res = await SaveSolicitudPost(prmNombreCompleto, prmSexo, prmTipoDocumento, prmNumeroDocumento, prmTelefono, prmCorreo,
                                      prmEtnia, prmPertenenciaSocial, prmDescripcionSolicitud, prmTipoNotificacion);

        if(res.affectedRows === 1){

            LimpiarInput();
            // Mostrar el modal de confirmación de datos guardados
            $('#confirmacionGuardadoModal').modal('show');
        }

    }catch(error){
    
        let campoVacio = error.statusCode
         if(campoVacio !== undefined ){
         $('#errorModal .modal-body').html(`Server Error <strong> ${campoVacio} </strong>: ${error.data} `);
             $('#errorModal').modal('show');
     }else{
             $('#errorModal .modal-body').html(`Server Error <strong> 500 </strong>:¡Intentar de nuevo! `);
            $('#errorModal').modal('show');
         }

    }finally{
       
        OculatarLoadingYMostrarScroll();
    }

}

// ----------------------- solicitudes al backend - FIN  -------------------------------------------


// ----------------------- MANIPULACION DEL DOM - INICIO ---------------------------------------------

// Obtener el texto de la opción seleccionada de un elemento select
function obtenerTextoSeleccionado(elementoSelect) {
    // Obtener el índice de la opción seleccionada
    let indiceSeleccionado = elementoSelect.selectedIndex;
    
    // Obtener el texto de la opción seleccionada
    let textoSeleccionado = elementoSelect.options[indiceSeleccionado].text;
    
    return textoSeleccionado;
}

//Eliminar Scroll
const MostrarLoadingYOculatarScroll = () => {

    // Guarda el estado actual del desplazamiento vertical
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Aplica el estilo para ocultar el scroll
    document.body.style.overflow = 'hidden';

    // Guarda el desplazamiento vertical para restaurarlo más tarde
    document.body.dataset.scrollY = scrollY;

    //Mostrar loading.
    document.getElementById('loadingIndicator').style.display = 'block';
}


// Restaura el desplazamiento vertical al cerrar o completar la acción que requiere ocultar el scroll
const  OculatarLoadingYMostrarScroll = () => {
    const scrollY = parseInt(document.body.dataset.scrollY || 0, 10);
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);

    document.getElementById('loadingIndicator').style.display = 'none';
  }


//Validar campos vacios
const ValidarInputSolicitudes = () => {
    let campoVacio = "";

    if (!nombreCompletoInput.value) {
        campoVacio = "<strong>Nombre Completo</strong>";
    } else if (tipoDocumentoSelect.value !== "menorEdad" && !numeroDocumentoInput.value) {
        campoVacio = "<strong>Numero Documento</strong>";
    }else if (!telefonoInput.value) {
            campoVacio = '<strong>Celular</strong>';
    } else if (!correoInput.value) {
        campoVacio = '<strong>Correo</strong>';
    } else if (!descripcionSolicitudTextarea.value) {
        campoVacio = "<strong>Descripción de la Solicitud</strong>";
    }else if (obtenerTextoSeleccionado(tipoDocumentoSelect) == "DPI" && numeroDocumentoInput.value.length != 13){
        campoVacio = "<strong>CUI debe ser de 13 digitos</strong>";
        $("#errorModal .modal-body").html(
            `${campoVacio}`
        );
        $("#errorModal").modal("show");
        return true;
    }else if (!validarFormatoCorreo(correoInput.value)){
        campoVacio = "<strong>Formato de correo incorrecto</strong>";
        $("#errorModal .modal-body").html(
            `${campoVacio}`
        );
        $("#errorModal").modal("show");
        return true; // Indica que hay un error
    }else if (telefonoInput.value.length != 8){
        campoVacio = "<strong>Numero de telefono debe ser de 8 digitos";
        $("#errorModal .modal-body").html(
            `${campoVacio}`
        );
        $("#errorModal").modal("show");
        return true; // Indica que hay un error
    }else if (tipoDocumento == "DPI" && documentoCUI.length != 13){
        campoVacio = "<strong>Numero de documento debe ser de 13 digitos";
        $("#errorModal .modal-body").html(
            `${campoVacio}`
        );
        $("#errorModal").modal("show");
        return true; // Indica que hay un error
    }


    if (campoVacio) {
        $("#errorModal .modal-body").html(
            `Por favor, completa el campo obligatorio: ${campoVacio}`
        );
        $("#errorModal").modal("show");
        return true; // Indica que hay un error
    }

    return false; // Indica que todo está bien
};


//Validar tipo de documento
const ValidarTipoDocumento = () => {
    const numeroDocumentoDiv = document.getElementById("numeroDocumentoDiv");
    const formatoCuiSpan = document.getElementById("formatoCui"); 

    if (tipoDocumentoSelect.value == "menorEdad") {
        numeroDocumentoDiv.style.display = "none";
        
    } else {
        numeroDocumentoDiv.style.display = "block"; // Oculta el elemento si no es "menorEdad"
    }

    if(tipoDocumentoSelect.value != "DPI"){
        formatoCuiSpan.style.display = "none";
    }
}

//Validar tipo de notificacion
const ValidarTipoNotificacion = () => {
    let campoVacio = '<strong>Correo</strong>'
    if(tipoNotificacionSelect.value === "correoElectronico" && correoInput.value === ""){
        $('#errorModal .modal-body').html(`${campoVacio} obligatorio para este tipo de notificion`);
        $('#errorModal').modal('show');
        return true; // Indica que hay un error
    }else{
        return false;
    }
}


const validarFormatoCorreo = (correo) => {
    // Expresión regular para validar el formato del correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
};



// Asignar el evento input al campo de correo
correoInput.addEventListener('input', () => {
    // Obtener el valor del campo de correo
    const formatoCorreoSpan = document.getElementById("formatoCorreo"); 
    const correo = correoInput.value;

    // Validar el formato del correo
    if (!validarFormatoCorreo(correo)) {
        formatoCorreoSpan.style.display = "block";
    } else {
        formatoCorreoSpan.style.display = "none";
    }
});


// Validacion Numero de CUI
numeroDocumentoInput.addEventListener('input', () => {
    const formatoCuiSpan = document.getElementById("formatoCui"); 
    const documentoCUI = numeroDocumentoInput.value;
    const tipoDocumento = obtenerTextoSeleccionado(tipoDocumentoSelect);

    // Validar el formato del cui
    if (tipoDocumento == "DPI" && documentoCUI.length != 13) {
        formatoCuiSpan.style.display = "block";
    } else {
        formatoCuiSpan.style.display = "none";
    }
});


// Validacion Numero de telefono
telefonoInput.addEventListener('input', () => {
    const formatoTelefonoSpan = document.getElementById("formatoTelefono"); 
    const telefono = telefonoInput.value;

    // Validar el formato del cui
    if (telefono.length != 8) {
        formatoTelefonoSpan.style.display = "block";
    } else {
        formatoTelefonoSpan.style.display = "none";
    }
});


//Funcion para limpiar input
const LimpiarInput = () => {

    nombreCompletoInput.value = "";
    telefonoInput.value       = "";
    correoInput.value         = "";
    descripcionSolicitudTextarea.value = "";
    numeroDocumentoInput.value = "";
}



ValidarTipoDocumento();


// ----------------------- MANIPULACION DEL DOM - FIN ---------------------------------------------