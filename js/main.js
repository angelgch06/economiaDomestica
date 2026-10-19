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

contenedorConceptos.appendChild(div);
});

}
function manejarFinalizar(){


}

function iniciar(){
mostrarConceptos();
botonFinalizar.addEventListener("click",manejarFinalizar);
}
iniciar();
