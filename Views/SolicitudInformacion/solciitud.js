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


const URL_saveSolicitud = "https://solicitar-informacion-cna.onrender.com/api/saveSolicitud";



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


// Obtener el texto de la opción seleccionada de un elemento select
function obtenerTextoSeleccionado(elementoSelect) {
    // Obtener el índice de la opción seleccionada
    let indiceSeleccionado = elementoSelect.selectedIndex;
    
    // Obtener el texto de la opción seleccionada
    let textoSeleccionado = elementoSelect.options[indiceSeleccionado].text;
    
    return textoSeleccionado;
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

        const res = await SaveSolicitudPost(prmNombreCompleto, prmSexo, prmTipoDocumento, prmNumeroDocumento, prmTelefono, prmCorreo,
                                      prmEtnia, prmPertenenciaSocial, prmDescripcionSolicitud, prmTipoNotificacion);

        if(res.affectedRows === 1){
            // Mostrar el modal de confirmación de datos guardados
            LimpiarInput();
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

    }


    

}



//Validar campos vacios
const ValidarInputSolicitudes = () => {
    if (!nombreCompletoInput.value || !tipoDocumentoSelect.value || !descripcionSolicitudTextarea.value || !tipoNotificacionSelect.value) {
        let campoVacio = !nombreCompletoInput.value ? '<strong>Nombre Completo</strong>' :
                         !tipoDocumentoSelect.value ? '<strong>Tipo de Documento</strong>' :
                         !descripcionSolicitudTextarea.value ? '<strong>Descripción de la Solicitud</strong>' :
                         !tipoNotificacionSelect.value ? '<strong>Tipo de Notificación</strong>' : 
                         (!telefonoInput.value && !correoInput.value) ? '<strong>Celular o Correo</strong>'  : '';

    if(tipoDocumentoSelect.value !== "menorEdad" ){
        campoVacio = !numeroDocumentoInput.value ? '<strong>Numero Documento</strong>': '';
                    
    }

    if(!telefonoInput.value && !correoInput.value){
        campoVacio = '<strong>Celular o Correo</strong>' 
    }

        $('#errorModal .modal-body').html(`Por favor, completa el campo obligatorio: ${campoVacio}`);
        $('#errorModal').modal('show');
        return true; // Indica que hay un error
    }
    return false; // Indica que todo está bien
}



//Validar tipo de documento
const ValidarTipoDocumento = () => {
    const numeroDocumentoDiv = document.getElementById("numeroDocumentoDiv");
    if (tipoDocumentoSelect.value == "menorEdad") {
        numeroDocumentoDiv.style.display = "none";
    } else {
        numeroDocumentoDiv.style.display = "block"; // Oculta el elemento si no es "menorEdad"
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



//Funcion para limpiar input
const LimpiarInput = () => {

    nombreCompletoInput.value = "";
    telefonoInput.value       = "";
    correoInput.value         = "";
    descripcionSolicitudTextarea.value = "";
    numeroDocumentoInput.value = ";"
}



ValidarTipoDocumento();