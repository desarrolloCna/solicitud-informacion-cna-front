//Dom Tabla
const contenedorTabla = document.getElementById("contenedor-tabla");
const tabla = document.createElement("table");
tabla.id = "myTable";
tabla.className = "display";

const obtenerSolicitudesURL = 'https://solicitar-informacion-cna.onrender.com/api/solicitudes';

/* Metodo para obtener todos Familiares */
const ObtenerSolicitudes = async () => {
    try {
      const data = await axios.get(obtenerSolicitudesURL);
      return data.data;
    } catch (error) {
      throw error;
    }
  };



  const CrearHeader = (data) => {
    try{
        const arrayKeys = Object.keys(data.solicitudes[0]);
        const header = document.createElement("thead");
        const rowHead = document.createElement("tr");
      
        arrayKeys.forEach((dato) => {
          if(dato !== "descripcionSolicitud"){
            const headCell = document.createElement("th");
            headCell.textContent = dato;
            rowHead.appendChild(headCell);
          }

        });
      
        header.appendChild(rowHead);
        tabla.appendChild(header);
        contenedorTabla.appendChild(tabla);

    }catch(error){

    }
}


const CrearFilas = (data) => {

    try{
        const cuerpoTabla = document.createElement("tbody");
        data.solicitudes.forEach((fila) => {

          const filasDatos = document.createElement("tr");
          console.log(fila.sexo)
          filasDatos.innerHTML = `
            <td>${fila.nombreCompleto}</td>
            <td>${fila.sexo}</td>
            <td>${fila.tipoDocumento}</td>
            <td> ${fila.numeroDocumento}</td>
            <td>${fila.telefono}</td>
            <td>${fila.correo}</td>
            <td>${fila.etnia}</td>
            <td>${fila.pertenenciaSocial}</td>
            <td>${fila.tipoNotificacion}</td>

          `;
          cuerpoTabla.appendChild(filasDatos);
        });
      
        tabla.appendChild(cuerpoTabla);
    }catch(error){

    }


  };


   //Mostrar datos en la tabla creada dinamicamente
   const DataTableInit = () => {    
    // Inicializar DataTables en la tabla
    let table = new DataTable('#myTable', {
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "No se encontraron registros",
        info: "Página _PAGE_ de _PAGES_",
        infoEmpty: "No hay registros disponibles",
        infoFiltered: "(filtrados de un total de _MAX_ registros)",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        }
      }
    });
 
  }



  ObtenerSolicitudes()
  .then(data => {
    // Hacer algo con los datos retornados
    CrearHeader(data);
    CrearFilas(data);
    DataTableInit();
  })
  .catch(error => {
    console.log(error);
  })