var oTabla = $("#tblMantenimiento").DataTable();
jQuery(function () {

    $("#tblMantenimiento tbody").on("click", 'tr', function () {
        //Levanta el evento del click sobre la tabla
        if ($(this).hasClass('selected')) {
            //event.preventDefault();
            $(this).removeClass('selected');
        } else {
            oTabla.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            EditarFila($(this).closest('tr'));
        }
    });
    //Registrar los botones para responder al evento click
    $("#dvMenu").load("../Paginas/Menu.html")
    //Registrar los botones para responder al evento click
    $("#btnInsertar").on("click", function () {
        EjecutarComandos("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComandos("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComandos("DELETE");
    });
    $('#cboVehiculo').select2();
    LlenarTablaMantenimiento();
    LlenarComboVehiculo();
});

async function EjecutarComandos(Comando) {
    let id = $("#txtId").val();
    let placa = $("#cboVehiculo").val();
    let fecha = new Date();
    let descripcion = $("#txtDescripcion").val();
    let costo = $("#txtCosto").val();
    let DatosMantenimiento;
    if (Comando == "PUT" || Comando == "DELETE") {

         DatosMantenimiento = {
            MantenimientoID: id,
            Placa: placa,
            FechaMantenimiento: fecha,
            Descripcion: descripcion,
            Costo: costo
        };
    } else {
        DatosMantenimiento = {
            Placa: placa,
            FechaMantenimiento: fecha,
            Descripcion: descripcion,
            Costo: costo
        };
    }
    
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Mantenimiento",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosMantenimiento)
            });

        const Rpta = await Respuesta.json();
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(Rpta);
        LlenarTablaMantenimiento();
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}

function EditarFila(DatosFila) {
    $("#txtId").val(DatosFila.find('td:eq(0)').text());
    $("#cboVehiculo").val(DatosFila.find('td:eq(1)').text());
    $("#txtDescripcion").val(DatosFila.find('td:eq(3)').text());
    $("#txtCosto").val(DatosFila.find('td:eq(4)').text());
}
async function LlenarTablaMantenimiento() {
    LlenarTablaXServicios("http://localhost:51954/api/Mantenimiento", "#tblMantenimiento");
}
async function LlenarComboVehiculo() {
    LlenarComboVehiculos("http://localhost:51954/api/Vehiculo", "#cboVehiculo");
}