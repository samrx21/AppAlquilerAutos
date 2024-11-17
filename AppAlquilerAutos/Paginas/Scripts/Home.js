var oTabla = $("#tblReserva").DataTable();
jQuery(function () {
    $("#tblReserva tbody").on("click", 'tr', function () {
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
    $("#btnMostrarAutos").on("click", function () {
        LlenarTablaAutos();
    });
    $("#btnInsertar").on("click", function () {
        EjecutarComandos("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComandos("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComandos("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        $("#cboUbicaciones").val(1);    
        $("#dthFechaHoraRec input").val("");       
        $("#dthFechaHoraDev input").val("");       
        $("#txtFechaReserva").val("");      
        $("#txtCodReserva").val("");      
        $("#txtFechaReserva").val("");      
        $("#txtAutoEscogido").val(""); 
        $("#cboSeguro").val(1); 
        $("#txtCedula").val(""); 
        $("#txtNombre").val("");
        $("#txtApellido").val("");
        $("#txtDireccion").val("");
        $("#txtTelefono").val("");
        $("#txtEmail").val("");
    });
    //Selects
    //$('#cboUbicaciones').select2();
    $('#cboCategoriaAutos').select2();

    $('#dthFechaHoraRec').datetimepicker({ icons: { time: 'far fa-clock' } });
    $('[data-mask]').inputmask();
    $('#dthFechaHoraDev').datetimepicker({ icons: { time: 'far fa-clock' } });
    $('[data-mask]').inputmask();
    LlenarTablaReserva();
    LlenarComboCategoria();
    LlenarComboSeguro();
    LlenarComboUbicacion();
});

async function EjecutarComandos(Comando) {
    //Captura de datos de la reserva
    let ReservaID = $("#txtCodReserva").val();
    let Placa = $("#txtAutoEscogido").val();
    let Ubicacion = $("#cboUbicaciones").val();
    let Seguro = $("#cboSeguro").val();
    let FechaReserva = new Date();
    let FechaHoraRec = $("#dthFechaHoraRec input").val();
    let FechaHoraDev = $("#dthFechaHoraDev input").val();    
    let CostoTotal = 0;

    //Captura de datos del cliente
    let Cedula = $("#txtCedula").val();
    let Nombre = $("#txtNombre").val();
    let Apellido = $("#txtApellido").val();
    let Direccion = $("#txtDireccion").val();
    let Telefono = $("#txtTelefono").val();
    let CorreoElectronico = $("#txtEmail").val();

    let DatosReserva = {
        ReservaID: ReservaID,
        ClienteID: Cedula,
        PlacaVeh: Placa,
        LugarEntrega_Devolucion: Ubicacion,
        SeguroID: Seguro,
        FechaReserva: FechaReserva,
        FechaInicio: FechaHoraRec,
        FechaFinalizacion: FechaHoraDev,
        CostoTotal: CostoTotal
    };
    if (Comando != "DELETE") {
        // Crear el JSON de cliente
        let DatosCliente = {
            Cedula: Cedula,
            Nombre: Nombre,
            Apellido: Apellido,
            Direccion: Direccion,
            Telefono: Telefono,
            CorreoElectronico: CorreoElectronico
        };
        //Cliente
        //Invocamos el servicio a través del fetch, usando el método fetch de javascript
        try {
            const Respuesta = await fetch("http://localhost:51954/api/Cliente",
                {
                    method: Comando,
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(DatosCliente)
                });
            const Rpta = await Respuesta.json();
            //Se presenta la respuesta en el div mensaje
            $("#dvMensaje").html(Rpta);
        }
        catch (error) {
            //Se presenta la respuesta en el div mensaje
            $("#dvMensaje").html(error);
        }
    }
   
    //Invocamos el servicio a través del fetch, usando el método fetch de javascript
    //Reserva
    try {
        const RespuestaReser = await fetch("http://localhost:51954/api/Reserva",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosReserva)
            });
        const Rptareser = await RespuestaReser.json();
        //Se presenta la respuesta en el div mensaje

        if (Comando == "POST") {
            $("#txtAlquiler").val(Rptareser);
        } else {
            $("#dvMensaje").html(Rptareser);
        }
        
        LlenarTablaReserva();
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html( error);
    }
}
async function ConsultarCliente() {

    let Cedula = $("#txtCedula").val();
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Cliente?Documento="+ Cedula,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        const Rpta = await Respuesta.json();

        $("#txtCedula").val(Rpta.Cedula);
        $("#txtNombre").val(Rpta.Nombre);
        $("#txtApellido").val(Rpta.Apellido);
        $("#txtDireccion").val(Rpta.Direccion);
        $("#txtTelefono").val(Rpta.Telefono);
        $("#txtEmail").val(Rpta.CorreoElectronico);
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}
function EditarFila(DatosFila) {
    $("#txtCodReserva").val(DatosFila.find('td:eq(0)').text());
    $("#txtCedula").val(DatosFila.find('td:eq(1)').text());
    $("#txtAutoEscogido").val(DatosFila.find('td:eq(2)').text());
    $("#cboUbicaciones").val(DatosFila.find('td:eq(3)').text());
    $("#cboSeguro").val(DatosFila.find('td:eq(4)').text());
    $("#txtFechaReserva").val(DatosFila.find('td:eq(5)').text());
    $("#dthFechaHoraRec input").val(DatosFila.find('td:eq(6)').text());
    $("#dthFechaHoraDev input").val(DatosFila.find('td:eq(7)').text());
    $("#txtAlquiler").val(DatosFila.find('td:eq(8)').text());
    ConsultarCliente();
}
async function LlenarComboCategoria() {
    LlenarComboCategoriaServicios("http://localhost:51954/api/CategoriaVehiculos", "#cboCategoriaAuto");
}
async function LlenarComboSeguro() {
    LlenarComboSeguroServicios("http://localhost:51954/api/Seguro", "#cboSeguro");
}
async function LlenarComboUbicacion() {
    LlenarComboUbicacionServicios("http://localhost:51954/api/Ubicacion", "#cboUbicaciones");
}
async function LlenarTablaAutos() {
    var cat = document.getElementById("cboCategoriaAuto").value;
    LlenarTablaXServicios("http://localhost:51954/api/Vehiculo?categoria=" + cat + "&op=1", "#tblAutos");
}
async function LlenarTablaReserva() {
    LlenarTablaXServicios("http://localhost:51954/api/Reserva", "#tblReserva");
}


