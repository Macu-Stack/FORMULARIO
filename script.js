let datos = [];

function agregarDatos() {
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const fecha = document.getElementById("fecha").value;
  
  if (codigo && nombre && apellido && correo && fecha) {
  if (!validarCorreo(correo)) {
      alert("Por favor ingrese una dirección de correo válida.");
      return; 
    }
	
    datos.push({ Código: codigo, Nombre: nombre, Apellido: apellido, Correo: correo, Fecha: fecha });
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
	document.getElementById("correo").value = "";
	document.getElementById("fecha").value = "";
	alert("Se ha agregado un nuevo usuario.");
    mostrarDatos();
  } else {
	alert("Por favor llene todos los datos.");
}
}

function limpiar()
{
document.getElementById("codigo").value="";
document.getElementById("nombre").value="";
document.getElementById("apellido").value="";
document.getElementById("correo").value = "";
document.getElementById("fecha").value = "";
}

function mostrarDatos() {
  const tabla = document.getElementById("tablaDatos");
  tabla.innerHTML = "";

  if (datos.length > 0) {
    const table = document.createElement("table");
    const headerRow = table.insertRow(0);

    for (const key in datos[0]) {
      const th = document.createElement("th");
      th.innerHTML = key;
      headerRow.appendChild(th);
    }

    for (let i = 0; i < datos.length; i++) {
      const row = table.insertRow(i + 1);
      for (const key in datos[i]) {
        const cell = row.insertCell();
        cell.innerHTML = datos[i][key];
      }
    }

    tabla.appendChild(table);
    document.getElementById("exportButton").style.display = "block";
  } else {
    document.getElementById("exportButton").style.display = "none";
  }
}

function buscarCodigo() {
  const codigoBuscado = document.getElementById("buscarCodigo").value;
  const resultadoBusqueda = document.getElementById("resultadoBusqueda");
  resultadoBusqueda.innerHTML = "";

  if (codigoBuscado) {
    const resultados = datos.filter((item) => item["Código"] === codigoBuscado);

    if (resultados.length > 0) {
      const table = document.createElement("table");
      const headerRow = table.insertRow(0);

      for (const key in resultados[0]) {
        const th = document.createElement("th");
        th.innerHTML = key;
        headerRow.appendChild(th);
      }

      resultados.forEach((item, index) => {
        const row = table.insertRow(index + 1);
        for (const key in item) {
          const cell = row.insertCell();
          cell.innerHTML = item[key];
        }
      });

      resultadoBusqueda.appendChild(table);

      // Mostrar los datos encontrados en las cajas de texto del formulario
      document.getElementById("codigo").value = resultados[0]["Código"];
      document.getElementById("nombre").value = resultados[0]["Nombre"];
      document.getElementById("apellido").value = resultados[0]["Apellido"];
	  document.getElementById("correo").value = resultados[0]["Correo"];
	  document.getElementById("fecha").value = resultados[0]["Fecha"];
    } else {
      alert("Código no encontrado.");
    }
  }
}

function actualizarDatos() {
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const fecha = document.getElementById("fecha").value;

  if (!codigo || !nombre || !apellido || !correo || !fecha) {
	alert("Por favor llene todos los datos.");
    return;
  }
  if (!validarCorreo(correo)) {
      alert("Por favor ingrese una dirección de correo válida.");
      return; 
    }
    const indice = datos.findIndex((item) => item["Código"] === codigo);

    if (indice !== -1) {
      datos[indice] = { Código: codigo, Nombre: nombre, Apellido: apellido, Correo: correo, Fecha: fecha };
      mostrarDatos();			
      limpiarFormulario();
	} else {
      alert("No se puede modificar el código.");
	  return;
  }  
} 
function eliminarDatos() {
  const codigo = document.getElementById("codigo").value;
  if (codigo) {
    const indice = datos.findIndex((item) => item["Código"] === codigo);

    if (indice !== -1) {
      datos.splice(indice, 1);
      mostrarDatos();
      limpiarFormulario();
    }
  }
}

function limpiarFormulario() {
  document.getElementById("codigo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("fecha").value = "";
}

function cargarDatosDesdeExcel() {
  const fileInput = document.getElementById("cargarArchivo");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      datos = jsonData;
      mostrarDatos();
    };

    reader.readAsArrayBuffer(file);
  }
}

function exportToExcel() {
  if (datos.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, "datos.xlsx");
  }
}

function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}