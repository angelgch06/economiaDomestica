class Gestoreconomia{
    constructor(){
        this.pagos=[];
        this.tramite={
            mes:null,
            anio:null
        };
    }
    iniciarTramite(mes,anio){
        this.tramite={mes:Number(mes),anio:Number(anio)};
    }
    registrarPago(concepto,importe){
        let cantidad=parseFloat(importe);
        if(isNaN(cantidad) || cantidad<=0){
            return false;
        }
        this.pagos.push({
            idconcepto:concepto.id,
            nombre:concepto.nombre,
            importe:cantidad,
            fecha:new Date()
        });
        return true;
    }
    total(){
        return this.pagos.reduce((acum,p)=>acum+p.importe,0);
    }
    numPagos(){
        return this.pagos.length;
    }
    gastoMedioPorPago(){
        if(this.numPagos()==0){
            return 0;
        }
        return this.total()/this.numPagos();
    }
    resumen(){
        let agrupado=this.pagos.reduce((acum,pago)=>{
            if(!acum[pago.idconcepto]){
                acum[pago.idconcepto]={nombre:pago.nombre,numPagos:0,totalConcepto:0};
            }
            acum[pago.idconcepto].numPagos++;
            acum[pago.idconcepto].totalConcepto+=pago.importe;
            return acum;
        },{}
    );
    return Object.values(agrupado).sort((a,b)=>{
        if(b.numPagos!=a.numPagos){
            return b.numPagos-a.numPagos;
        }
        return a.nombre.localeCompare(b.nombre);
    });
   
    }
     gastoMedioPorConcepto(){
        let conceptosIncluidos=this.resumen().length;
        if(conceptosIncluidos==0){
            return 0;
        }
        return this.total()/conceptosIncluidos;
    }
    historial(){
        let conteoPorConcepto=this.pagos.reduce((acum,p)=>{
            acum[p.idconcepto]=(acum[p.idconcepto] || 0)+1;
            return acum;
        },{});
        let ultimoId=this.pagos.length>0 ? this.pagos[this.pagos.length-1].idconcepto:null;
        return this.pagos.map((p,index) =>({
            nombre:p.nombre, 
            importe:p.importe,
            resaltado:p.idconcepto==ultimoId || conteoPorConcepto[p.idconcepto] > 1,
            indice: index
        }));
    }
    reiniciar(){
        this.pagos=[];
        this.tramite={mes:null,anio:null};
    }
}
function formatoPrecio(valor){
    return valor.toFixed(2)+"€";
}
function formatearFecha(fecha){
    let dia=fecha.getDate().toString().padStart(2,"0");
    let mes=(fecha.getMonth()+1).toString().padStart(2,"0");
    let anio=fecha.getFullYear();
    let horas=fecha.getHours().toString().padStart(2,"0");
    let minutos=fecha.getMinutes().toString().padStart(2,"0");
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;

}

function nombreCategoria(categoria){
    let mapa={
        s_bas:"servicios basicos",
        oc:"ocio",
        ali:"alimentacion",
        cult:"cultura",
        dep:"deporte"
    };
    return mapa[categoria] || categoria;
}