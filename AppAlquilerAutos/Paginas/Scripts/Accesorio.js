var oTabla = $("#tblAccesorio").DataTable();
jQuery(function () {

    $("#tblAccesorio tbody").on("click", 'tr', function () {
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
    LlenarTablaAccesorios();
});

async function EjecutarComandos(Comando) {
    let id = $("#txtId").val();
    let nombre = $("#txtNombre").val();
    let precio = $("#txtCosto").val();
    let DatosAccesorio = {
       AccesorioID: id,
       NombreAccesorio: nombre,
       PrecioAdicional: precio
       };
    

    try {
        const Respuesta = await fetch("http://localhost:51954/api/Accesorio",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosAccesorio)
            });

        const Rpta = await Respuesta.json();
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(Rpta);
        LlenarTablaAccesorios();
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}

function EditarFila(DatosFila) {
    $("#txtId").val(DatosFila.find('td:eq(0)').text());
    $("#txtNombre").val(DatosFila.find('td:eq(1)').text());
    $("#txtCosto").val(DatosFila.find('td:eq(2)').text());
}
async function LlenarTablaAccesorios (){
    LlenarTablaXServicios("http://localhost:51954/api/Accesorio", "#tblAccesorio");
}