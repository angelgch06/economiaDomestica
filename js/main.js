let contenedorConceptos=document.getElementById("conceptos");
let listaTextoResumen=document.getElementById("listaResumen");
let botonFinalizar=document.getElementById("btnFinalizar");
let resumenMostrado=false;
function mostrarConceptos(){
contenedorConceptos.innerHTML="";//limpia y luego agrega la data nueva
conceptos.forEach(c=>{
let div=document.createElement("div");
div.className="concepto";
div.dataset.id=c.id;
//comillas que nos ayudan a que cuando extraemos la data, no hay que preocuparse de concatenar con el + 
div.innerHTML=` 
<img src="${c.imagen}">
<div class="nombre">${c.nombre}</div>
<div class="precio">${formatoPrecio(c.precio)}</div> `;
div.addEventListener("click",()=>manejarClickConcepto(c));

contenedorConceptos.appendChild(div);
});

}
function manejarClickConcepto(concepto){
    if(resumenMostrado){
        reiniciarPagos();
        listaTextoResumen.innerHTML="";//todo el contenido que esté dentro del div se borra y deja de ver el s
        resumenMostrado=false;
    }
    registrarPago(concepto);
}
function manejarFinalizar(){
if(pagos.length==0){
    listaTextoResumen.innerHTML='<p class="linea-resumen">todavía no hay pagos</p>';
    return;//no devuelve nada pero termina con la funcion y si no hay pagos quiero que se detenga ahi
}
let resumenData=resumen();
listaTextoResumen.innerHTML="";
resumenData.forEach(elemento=>{
    let p=document.createElement("p");
    p.className="linea-resumen";
    p.textContent= `${elemento.nombre} --- ${elemento.numPagos} pagos`;
    listaTextoResumen.appendChild(p);//al estar dentro del for each esto lo hace para cada pago un parrafo con esa información
});
let total=calcularTotal();
let parrafoTotal=document.createElement("p");
parrafoTotal.className="linea-resumen gasto-final";
parrafoTotal.textContent=`gasto final: ${formatoPrecio(total)}`;
listaTextoResumen.appendChild(parrafoTotal);
let medio=gastoMedio();
let parrafoMedio=document.createElement("p");
parrafoMedio.className="linea-resumen gasto-final";
parrafoMedio.textContent=`gastoMedio: ${formatoPrecio(medio)}/pago`;
listaTextoResumen.appendChild(parrafoMedio);
resumenMostrado=true;
reiniciarPagos();
}

function iniciar(){
mostrarConceptos();
botonFinalizar.addEventListener("click",manejarFinalizar);
}
iniciar();
