var oTabla = $("#tblAutos").DataTable(); 
jQuery(function () {

    $("#tblAutos tbody").on("click", 'tr', function(){
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
    LlenarTablaAutos();
    LlenarComboCategoria()
});

async function EjecutarComandos(Comando) {
    let Placa = $("#txtPlaca").val();
    let Marca = $("#txtMarca").val();
    let Modelo = $("#txtModelo").val();
    let Anio = $("#txtAnio").val();
    let Tarifa = $("#txtTarifa").val();
    let Categoria = $("#cboCategoriaAuto").val();

    let DatosVehiculo = {
        Placa: Placa,
        Marca: Marca,
        Modelo: Modelo,
        Anio: Anio,
        TarifaPorDia: Tarifa,
        CategoriaID: Categoria
    };
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Vehiculo",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosVehiculo)
            });

        const Rpta = await Respuesta.json();
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(Rpta);
        LlenarTablaAutos();
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}
function EditarFila(DatosFila) {
    $("#txtPlaca").val(DatosFila.find('td:eq(0)').text());
    $("#txtMarca").val(DatosFila.find('td:eq(1)').text());
    $("#txtModelo").val(DatosFila.find('td:eq(2)').text());
    $("#txtAnio").val(DatosFila.find('td:eq(3)').text());
    $("#txtTarifa").val(DatosFila.find('td:eq(4)').text());
    $("#cboCategoriaAuto").val(DatosFila.find('td:eq(5)').text());
}
async function LlenarTablaAutos() {
    LlenarTablaXServicios("http://localhost:51954/api/Vehiculo", "#tblAutos");
}
async function LlenarComboCategoria() {
    LlenarComboCategoriaServicios("http://localhost:51954/api/CategoriaVehiculos", "#cboCategoriaAuto");
}