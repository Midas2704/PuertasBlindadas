const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const {
  resolverEstadoReferenciaM12,validarCoherenciaContextualM12,estadoIdentidadContextualM12,
  filtroCotizacionesContextualesM12,presentarContactosContextualesM12,
  exigirConfirmacionHumanaObraDistintaM12,formalizarProyectoCotizacion,fuenteAutorizadaM12,
  alcanceIdentidadM12,presentarClientesContextualesM12,presentarServicioTerrenoContextualM12,
}=require('../dist/comercial/ServicioObraProyectoComercial');
const {M2Controller}=require('../dist/controladores/M2Controller');

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

test('CUT462 no usa CU20 como autorización para otros Proyectos o Clientes de una Obra',()=>{
  assert.deepEqual(alcanceIdentidadM12({idObra:'801'},{permisos:['CU20']}),{
    puedeVerProyectos:false,puedeVerClientes:false,puedeConsultarM2:false,
  });
  assert.deepEqual(alcanceIdentidadM12({idProyecto:'901'},{permisos:['CU20']}),{
    puedeVerProyectos:false,puedeVerClientes:false,puedeConsultarM2:false,
  });
  assert.deepEqual(alcanceIdentidadM12({idProyecto:'901'},{permisos:['CU20','CU199']}),{
    puedeVerProyectos:true,puedeVerClientes:false,puedeConsultarM2:true,
  });
});

test('CUT462 omite RUT y nombre cuando el alcance de identidad está restringido',()=>{
  const datos=presentarClientesContextualesM12([{id_cliente_financiero:1,rut_cliente:'11.111.111-1',nombre_razon_social_referencia:'Cliente reservado',estado_financiero:'activo'}],false);
  assert.deepEqual(datos,{cliente:null,clientes:[],acceso:'ACCESO_RESTRINGIDO'});
  assert.doesNotMatch(JSON.stringify(datos),/11\.111|Cliente reservado/);
});

test('CUT464 mantiene un servicio ligado sólo a Obra fuera de los antecedentes propios del Proyecto',()=>{
  const servicio=presentarServicioTerrenoContextualM12({servicio_terreno_servicio_terreno_id:55n,servicio_terreno_tipo_servicio:'VISITA',servicio_terreno_fecha_real:null,servicio_terreno_estado:'PENDIENTE'},801n);
  assert.equal(servicio.proyecto,null);assert.equal(servicio.obra,'801');
  assert.equal(servicio.atribucion,'CONTEXTO_OBRA');assert.equal(servicio.noAtribuibleProyecto,true);
});

test('CUT463 valida OT contra el Proyecto persistido de la Cotización y admite ausencia opcional',()=>{
  const incompatible=validarCoherenciaContextualM12({idProyecto:'901',proyectoEncontrado:true,idCotizacion:'77',idCotizacionOrigenProyecto:'78'});
  assert.equal(incompatible.compatible,false);assert.match(incompatible.motivo,/no pertenece a la Cotización/);
  const inexistente=validarCoherenciaContextualM12({idProyecto:'901',proyectoEncontrado:false,idCotizacion:'77'});
  assert.equal(inexistente.compatible,false);assert.equal(inexistente.estado,'REFERENCIA_NO_ENCONTRADA');
  assert.equal(validarCoherenciaContextualM12({requiereObra:false}).compatible,true);
});

test('C_Finanzas entrega el actor completo a las consultas contextuales M12',()=>{
  const fachada=readFileSync(resolve('src/controladores/C_Finanzas.ts'),'utf8');
  assert.match(fachada,/resolverIdentidades\(solicitud\.consulta \|\| \{\}, actor\)/);
  assert.match(fachada,/consultarAntecedentes\(solicitud\.consulta \|\| \{\}, actor\)/);
  assert.doesNotMatch(fachada,/consultarAntecedentes\(solicitud\.consulta \|\| \{\}, actor\.permisos\)/);
});

test('M2 bloquea Proyecto incompatible antes de crear una OT y conserva Proyecto opcional',async()=>{
  const modulo=new M2Controller();
  modulo.normalizarPlanificacionesOt=async()=>({unidades:[]});
  let ordenesCreadas=0;
  const tx={
    proyecto:{findUnique:async()=>({id_cotizacion_origen:78})},
    orden_trabajo:{create:async()=>{ordenesCreadas++;throw new Error('no debe crear');}},
  };
  await assert.rejects(()=>modulo.crearOrdenesTrabajoCotizacion(tx,77,{},1n,901n),/no pertenece a la Cotización/);
  assert.equal(ordenesCreadas,0);
  assert.deepEqual(await modulo.crearOrdenesTrabajoCotizacion(tx,77,{},1n,undefined),[]);
});
