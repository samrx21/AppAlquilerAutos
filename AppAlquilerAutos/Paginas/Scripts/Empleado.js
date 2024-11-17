var oTabla = $("#tblSucursal").DataTable();
jQuery(function () {

    $("#tblSucursal tbody").on("click", 'tr', function () {
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
    LlenarTablaEmpleados();
    LlenarComboSucursal();
});

async function EjecutarComandos(Comando) {
    let cedula = $("#txtCedula").val();
    let nombre = $("#txtNombre").val();
    let apellido = $("#txtApellido").val();
    let puesto = $("#txtPuesto").val();
    let salario = $("#txtSalario").val();
    let fechaContratacion = new Date();
    let sucursal = $("#cboSucursal").val();




    let DatosEmpleado = {
        EmpleadoID: cedula,
        Nombre: nombre,
        Apellido: apellido,
        Puesto: puesto,
        Salario: salario,
        FechaContratacion: fechaContratacion,
        SucursalID: sucursal
    };
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Empleado",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosEmpleado)
            });

        const Rpta = await Respuesta.json();
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(Rpta);
        LlenarTablaEmpleados();
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}
function EditarFila(DatosFila) {
    $("#txtCedula").val(DatosFila.find('td:eq(0)').text());
    $("#txtNombre").val(DatosFila.find('td:eq(1)').text());
    $("#txtApellido").val(DatosFila.find('td:eq(2)').text());
    $("#txtPuesto").val(DatosFila.find('td:eq(3)').text());
    $("#txtSalario").val(DatosFila.find('td:eq(4)').text());
    $("#cboSucursal").val(DatosFila.find('td:eq(6)').text());
}
async function LlenarTablaEmpleados() {
    LlenarTablaXServicios("http://localhost:51954/api/Empleado", "#tblSucursal");
}
async function LlenarComboSucursal() {
    LlenarComboSucursales("http://localhost:51954/api/Sucursal", "#cboSucursal");
}