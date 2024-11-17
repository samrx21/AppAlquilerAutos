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
    let Id = $("#txtUbiID").val();
    let nombre = $("#txtNombre").val();
    let Direccion = $("#txtDireccion").val();

    let DatosUbicacion = {
        Ubicaciones: Id,
        NombreUbicacion: nombre,
        Direccion: Direccion
    };
    try {
        const Respuesta = await fetch("http://localhost:51954/api/Ubicacion",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DatosUbicacion)
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
    let Id = $("#txtUbiID").val();

    try {
        const Respuesta = await fetch("http://localhost:51954/api/Ubicacion?id=" + Id,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        const Rpta = await Respuesta.json();
        //Se presenta la respuesta en el div 
        $("#txtUbiID").val(Rpta.Ubicaciones);
        $("#txtNombre").val(Rpta.NombreUbicacion);
        $("#txtDireccion").val(Rpta.Direccion);
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}