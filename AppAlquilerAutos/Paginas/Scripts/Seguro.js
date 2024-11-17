jQuery(function () {
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
    $("#btnConsultar").on("click", function () {
        Consultar();
    });
});

async function EjecutarComandos(Comando) {
    let Id = $("#txtSeguroID").val();
    let nombre = $("#txtNombre").val();
    let cobertura = $("#txtCobertura").val();
    let precio = $("#txtPrecio").val();

    let DatosSeguros = {
        SeguroID: Id,
        NombreSeguro: nombre,
        Cobertura: cobertura,
        PrecioAdicional: precio
    };
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Seguro",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosSeguros)
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

async function Consultar() {
    let SeguroId = $("#txtSeguroID").val();

    try {
        const Respuesta = await fetch("http://localhost:51954/api/Seguro?id=" + SeguroId,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        try {

            const Rpta = await Respuesta.json();
        }
        catch (error){
            $("#dvMensaje").html("error del respuesta: "+ error);
        }
        //Se presenta la respuesta en el div mensaje
        if (Rpta == null) {
            $("#dvMensaje").html("El seguro no se encuentra en la base de datos");
        } else {

            $("#txtSeguroID").val(Rpta.SeguroID);
            $("#txtNombre").val(Rpta.NombreSeguro);
            $("#txtCobertura").val(Rpta.Cobertura);
            $("#txtPrecio").val(Rpta.PrecioAdicional);
        }
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html("Despues" + error);
    }
}
