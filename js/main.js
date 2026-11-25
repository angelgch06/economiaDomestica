let contenedorConceptos=document.getElementById("conceptos");
let listaTextoResumen=document.getElementById("listaResumen");
let botonFinalizar = document.getElementById("btnFinalizar");
let panelHistorial = document.getElementById("historialDePagos");
let infoTramite = document.getElementById("InfoTramite");
let gestor=new Gestoreconomia();
resumenMostrado=false;
temporizadorLimpieza=null;

async function cargarConceptos(){
    try{
        let respuesta=await fetch(`${APIURL}/conceptos`);
        if(!respuesta.ok){
            throw new Error("Error al cargar los conceptos");
        }
        conceptos=await respuesta.json();
        mostrarConceptos();
    }catch(e){
        contenedorConceptos.innerHTML="<p style='color:red'>no se pudieron cargar los conceptos</p>";
        console.error(e);
    }
}

function mostrarConceptos(){
    contenedorConceptos.innerHTML="";
    conceptos.forEach(c=>{
        let div=document.createElement("div");
        div.className="concepto";
        div.dataset.id=c.id;
        div.innerHTML=`<img src="${c.imagen}">
                       <div class="nombre">${c.nombre}</div> 
                       <input type="number" min="0.01" step="0.01" id="imp-${c.id}">`;
        div.querySelector("img").addEventListener("click",()=>{
        manejarClickConcepto(c);
        
        });
        contenedorConceptos.appendChild(div);
    });

}
async function manejarClickConcepto(concepto) {
 if(resumenMostrado){
    if(temporizadorLimpieza){
        clearTimeout(temporizadorLimpieza);
        temporizadorLimpieza=null;
    }
    limpiarTodo();
    resumenMostrado=false;
    pedirMesAnio();

 }  
 let input=document.getElementById(`imp-${concepto.id}`);
 let importe=input.value;
 if(!gestor.registrarPago(concepto,importe)){
    alert("no se puede registrar un pago sin importe");
    return;
 } 
 input.value="";
 actualizarHistorial();
}

function actualizarHistorial(){
    panelHistorial.innerHTML="";
    gestor.historial().forEach(linea=>{
        let div=document.createElement("div");
        div.className="linea-historial"+(linea.resaltado ? " resaltado":'');
        div.textContent=`${linea.nombre} ${formatoPrecio(linea.importe)}`;
        panelHistorial.appendChild(div);
    });
}

function limpiarTodo(){
    gestor.reiniciar();
    listaTextoResumen.innerHTML="";
    panelHistorial.innerHTML="";
    if(infoTramite!=null){
        infoTramite.textContent="";
    }
    document.querySelectorAll(".concepto input").forEach(i=>(i.value=""));
    if(temporizadorLimpieza){
        clearTimeout(temporizadorLimpieza);
        temporizadorLimpieza=null;
    }

}

function pedirMesAnio(){
    let mes;
    let anio;
    do{
        mes=prompt("introduce el mes del tramite (1-12):");
        if(mes==null){
            return;
        }
    }while(parseInt(mes)<1 || parseInt(mes)>12);
     
    do{
        anio=prompt("introduce el año del tramite (ej:2025) :");
        if(anio==null){
            return;
        }
    }while(parseInt(anio)<1980 || parseInt(anio)>2026);
    gestor.iniciarTramite(mes,anio);
    infoTramite.textContent=`tramite:${mes}/${anio}`;
}

async function manejarFinalizar(){
    if(gestor.numPagos()==0){
        listaTextoResumen.innerHTML="<p class='linea-resumen'>No se ha registrado ningun pago</p>";
        return;
    }
    let resumenData=gestor.resumen();
    listaTextoResumen.innerHTML="";
    let parrafoFecha=document.createElement("p");
    parrafoFecha.className="linea-resumen";
    parrafoFecha.textContent=`fecha:${formatearFecha(new Date())}`;
    listaTextoResumen.appendChild(parrafoFecha);

    resumenData.forEach(elemento=>{
        let parrafo=document.createElement("p");
        parrafo.className="linea-resumen";
        let medio=elemento.totalConcepto/elemento.numPagos;
        parrafo.textContent=`${elemento.nombre}----${elemento.numPagos}pagos----${formatoPrecio(medio)}----${formatoPrecio(elemento.totalConcepto)}`;
        listaTextoResumen.appendChild(parrafo);
    });


    let total=gestor.total();
    let parrafoTotal=document.createElement("p");
    parrafoTotal.className="linea-resumen gasto-final";
    parrafoTotal.textContent=`gasto final:${total}`;
    listaTextoResumen.appendChild(parrafoTotal);

    
    let medioConcepto=gestor.gastoMedioPorConcepto();
    let parrafoMedio=document.createElement("p");
    parrafoMedio.className="linea-resumen gasto-final";

    parrafoMedio.textContent=`gasto medio:${medioConcepto}`;
    listaTextoResumen.appendChild(parrafoMedio);

    resumenMostrado=true;

    mostrarVentanaEmergente(resumenData);
    programarLimpieza(resumenData);
}

function mostrarVentanaEmergente(resumenData){
    let lineas=resumenData.map(elemento=>{
        let info=conceptos.find(c=>c.nombre==elemento.nombre);
        if(!info){
            return `${elemento.nombre}`;
        }
        let tipo=info.imprescindible ? "imprescindible":"prescindible";
        return `la ${info.nombre} es un gasto ${tipo} de categoria ${nombreCategoria(info.categoria)}`;
    });
    alert("detalle de conceptos pagados:\n"+lineas.join("\n"));
}

async function persistirTramite(resumenData){
    let registro={
        fecha:`${gestor.tramite.mes}/${gestor.tramite.anio}`,
        pagos:resumenData.map(elemento=>({
        idConcepto: conceptos.find(c=>c.nombre==elemento.nombre)?.id ?? null,
        importeTotal: elemento.totalConcepto,
        numPagos: elemento.numPagos
        }))
    };
    try{
        await fetch(`${APIURL}/registros`,{
            method:'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(registro)
        });
    }catch(e){
        console.error("no se pudo guardar el tramite",e);
    }
}

function programarLimpieza(resumenData){
    if(temporizadorLimpieza){
        clearTimeout(temporizadorLimpieza);
    }
    temporizadorLimpieza=setTimeout(()=>{
        if(!resumenMostrado){
            return;
        }
        persistirTramite(resumenData);
        limpiarTodo();
        resumenMostrado=false;
    },10000)

}

function iniciar(){
    botonFinalizar.addEventListener("click",manejarFinalizar);
    cargarConceptos();

}
iniciar();