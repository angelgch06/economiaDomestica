let pagos=[];
function registrarPago(concepto){//concepto es la data que meto dentro del objeto
pagos.push({idconcepto:concepto.id,nombre:concepto.nombre,precio:concepto.precio});
}
function calcularTotal(){
    return pagos.reduce((acum,concepto)=>acum+concepto.precio,0);
}
function calcularNumPagos(){
    return pagos.length;
}
function gastoMedio(){
let total=calcularTotal();
let numPagos=calcularNumPagos();
if(numPagos==0){
    return 0;
}else{
    return total/numPagos;
}
}
function resumen(){
    let agrupado=pagos.reduce((acum,pago)=>{
        if(!acum[pago.idconcepto]){
            acum[pago.idconcepto]={
                nombre:pago.nombre,
                numPagos:0,
                totalConcepto:0
            };
        }
        acum[pago.idconcepto].numPagos++;
        acum[pago.idconcepto].totalConcepto+=pago.precio;
        return acum;
    },{});
return Object.values(agrupado).sort((a,b)=>{//cambiar o castear el objeto por el array (o crear el array con los valores del objeto que le pase)
    if(b.numPagos!=a.numPagos){
        return b.numPagos-a.numPagos;
    }else{
        return a.nombre.localeCompare(b.nombre);
    }
});
}
function reiniciarPagos(){
pagos=[];

}
function formatoPrecio(valor){
    return valor.toFixed(2)+"€";
}