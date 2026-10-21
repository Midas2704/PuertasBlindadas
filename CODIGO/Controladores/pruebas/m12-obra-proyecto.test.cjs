const test=require('node:test');
const assert=require('node:assert/strict');
const {
  resolverEstadoReferenciaM12,validarCoherenciaContextualM12,estadoIdentidadContextualM12,
  filtroCotizacionesContextualesM12,presentarContactosContextualesM12,
  exigirConfirmacionHumanaObraDistintaM12,formalizarProyectoCotizacion,fuenteAutorizadaM12,
}=require('../dist/comercial/ServicioObraProyectoComercial');

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

test('CUT462 confirma una Obra compartida por varios Proyectos sin confundir pluralidad con ambigüedad',()=>{
  assert.equal(estadoIdentidadContextualM12({obraEncontrada:true,proyectosEncontrados:2,clientesEncontrados:2}),'REFERENCIA_CONFIRMADA');
  assert.equal(estadoIdentidadContextualM12({obraEncontrada:true,proyectosEncontrados:2,vinculoAmbiguo:true}),'IDENTIDAD_AMBIGUA');
});

test('CUT464 aísla la consulta de Proyecto y no amplía el filtro por su Obra compartida',()=>{
  assert.deepEqual(filtroCotizacionesContextualesM12({idObra:801n,idProyecto:901n}),{proyecto_originado:{is:{proyecto_proyecto_id:901n}}});
  assert.deepEqual(filtroCotizacionesContextualesM12({idObra:801n}),{id_obra_contexto:801n});
});

test('contacto contextual conserva función y fuente sin inventar vigencia',()=>{
  const [contacto]=presentarContactosContextualesM12([{id_contacto_cotizacion_b2b:1n,nombre:'Ana',apellido:null,cargo:'Jefa de obra',correo:'ana@example.test',telefono:null,tipo_contacto:'OBRA',es_principal:true,estado:'ACTIVO'}]);
  assert.equal(contacto.funcion,'OBRA');assert.equal(contacto.procedencia,'finanzas.contacto_cotizacion_b2b');
  assert.equal(contacto.vigencia,null);assert.equal(contacto.vigenciaEstado,'NO_ACREDITADA');
});

test('CUT464 aplica permiso M4 por fuente y no expone contactos M2 sin CU20',()=>{
  assert.equal(fuenteAutorizadaM12('M2',[]),false);
  assert.equal(fuenteAutorizadaM12('M2',['CU20']),true);
  assert.equal(fuenteAutorizadaM12('M3',['CU20']),false);
  assert.equal(fuenteAutorizadaM12('M3',['CU55']),true);
});

test('CU465 exige declaración humana cuando existen candidatas y admite confirmación explícita',()=>{
  assert.throws(()=>exigirConfirmacionHumanaObraDistintaM12(1,undefined),/Confirma expresamente/);
  assert.doesNotThrow(()=>exigirConfirmacionHumanaObraDistintaM12(1,'IDENTIDAD_DISTINTA_REVISADA'));
  assert.doesNotThrow(()=>exigirConfirmacionHumanaObraDistintaM12(0,undefined));
});

test('formalización de Proyecto invoca CUT463 y rechaza una Obra incompatible',async()=>{
  const tx={
    cotizacion:{findUnique:async()=>({id_cotizacion:77,id_obra_contexto:801n,ficha_cliente:{cliente_financiero:{rut_cliente:null}}})},
    proyecto:{findUnique:async()=>({proyecto_proyecto_id:901n,obras:[{id_obra:802n,es_principal:true}]})},
  };
  await assert.rejects(()=>formalizarProyectoCotizacion(tx,77),/Proyecto ya está vinculado a otra Obra/);
});
