const test=require('node:test');
const assert=require('node:assert/strict');
const {resolverEstadoReferenciaM12,validarCoherenciaContextualM12}=require('../dist/comercial/ServicioObraProyectoComercial');

test('CUT462 diferencia ausencia, confirmación y ambigüedad sin fusionar candidatas',()=>{
  assert.equal(resolverEstadoReferenciaM12(0,0),'REFERENCIA_NO_ENCONTRADA');
  assert.equal(resolverEstadoReferenciaM12(1,1),'REFERENCIA_CONFIRMADA');
  assert.equal(resolverEstadoReferenciaM12(1,0),'IDENTIDAD_AMBIGUA');
  assert.equal(resolverEstadoReferenciaM12(2,1),'IDENTIDAD_AMBIGUA');
});

test('CUT463 permite procesos sin Obra cuando su contrato no la exige',()=>{
  assert.deepEqual(validarCoherenciaContextualM12({requiereObra:false,idObra:null}),{
    estado:'REFERENCIA_CONFIRMADA',compatible:true,motivo:'El proceso no exige una Obra',requiereRevisionHumana:false,
  });
});

test('CUT463 rechaza Proyecto/Obra incompatible y OT de otro Proyecto',()=>{
  const obra=validarCoherenciaContextualM12({requiereObra:true,idObra:'1',idObraProyecto:'2',idProyecto:'10'});
  assert.equal(obra.estado,'IDENTIDAD_AMBIGUA');assert.equal(obra.compatible,false);assert.equal(obra.requiereRevisionHumana,true);
  const ot=validarCoherenciaContextualM12({idProyecto:'10',idProyectoOrdenTrabajo:'11'});
  assert.equal(ot.estado,'IDENTIDAD_AMBIGUA');assert.match(ot.motivo,/Orden de Trabajo/);
});

test('CUT463 diferencia fuente indisponible de referencia inexistente',()=>{
  assert.equal(validarCoherenciaContextualM12({fuenteDisponible:false}).estado,'FUENTE_NO_DISPONIBLE');
  assert.equal(validarCoherenciaContextualM12({requiereObra:true}).estado,'REFERENCIA_NO_ENCONTRADA');
});
