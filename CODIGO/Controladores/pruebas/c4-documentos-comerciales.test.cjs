const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { crearPdfComercial } = require('../dist/comercial/documentos/MotorPdfComercial');
const { permiteOperacion } = require('../dist/validaciones/permisos');
const { MATRIZ_CAPACIDADES_COMERCIALES, AutorizadorCapacidadComercial } = require('../dist/comercial/SeguridadCapacidadesComerciales');

const raiz = path.resolve(__dirname, '..');
const leer = (...partes) => fs.readFileSync(path.join(raiz, ...partes), 'utf8');
const base = {
  titulo:'Documento comercial sintético', numero:null, fecha:'2026-10-16', vigencia:'2026-11-16', borrador:true,
  camposPendientes:[], moneda:'CLP', cliente:{nombre:'Cliente de prueba',rut:'11.111.111-1',correo:'prueba@example.test',telefono:'+56 9 0000 0000'},
  productos:[{codigo:'PB-01',nombre:'Puerta de seguridad',descripcion:'Descripción comercial autorizada',cantidad:2,unidad:'unidad(es)',dimensiones:'2100 x 900 mm',precioUnitario:850000,subtotal:1700000,caracteristicas:['Cierre multipunto'],opcionales:['Terminación especial']}],
  servicios:[], neto:1700000, impuesto:323000, total:2023000,
  condiciones:['Vigencia indicada en la portada.','Instalación sujeta a cobertura autorizada.'], observaciones:[],
  plantilla:{nombre:'Plantilla sintética C4',publicada:false},
};

test('C4 genera PDF B2B binario, íntegro y paginado sin información interna',()=>{
  const productos=Array.from({length:45},(_,i)=>({...base.productos[0],codigo:`PB-${String(i+1).padStart(2,'0')}`,nombre:`Puerta comercial ${i+1}`}));
  const resultado=crearPdfComercial({...base,tipo:'B2B',titulo:'Presupuesto comercial',productos,contactos:[{nombre:'Contacto Empresa',cargo:'Compras',principal:true}],proyecto:{nombre:'Proyecto sintético',ubicacion:'Región de prueba · Comuna de prueba',alcance:'SUMINISTRO_INSTALACION'}});
  assert.equal(resultado.pdf.subarray(0,8).toString('ascii'),'%PDF-1.4');
  assert.ok(resultado.paginas>1);
  assert.equal(resultado.sha256,createHash('sha256').update(resultado.pdf).digest('hex'));
  const texto=resultado.pdf.toString('latin1');
  assert.match(texto,/BORRADOR - NO EMITIDO/);
  assert.match(texto,/PARTIDAS DE PRODUCTOS/);
  assert.doesNotMatch(texto,/costo interno|margen confidencial|remuneraciones/i);
});

test('C4 presenta alternativas B2C separadas y la emisión no constituye aceptación',()=>{
  const alternativas=['A','B','C'].map((letra,i)=>({identificador:`alt-${letra}`,etiqueta:`ALTERNATIVA ${letra}`,producto:`Modelo ${letra}`,descripcion:'Configuración independiente',caracteristicas:['Protección autorizada'],opcionales:[],moneda:'CLP',neto:800000+i*100000,impuesto:152000+i*19000,total:952000+i*119000,fotografiaDisponible:false}));
  const resultado=crearPdfComercial({...base,tipo:'B2C',titulo:'Cotización personalizada',alternativas});
  const texto=resultado.pdf.toString('latin1');
  assert.match(texto,/ALTERNATIVA A/);assert.match(texto,/ALTERNATIVA B/);assert.match(texto,/ALTERNATIVA C/);
  assert.match(texto,/no se suman entre sí/i);
  assert.match(texto,/emisión no constituye/i);assert.match(texto,/aceptación/i);
  assert.match(texto,/Imagen comercial pendiente/i);
});

test('C4 genera carta general sin cliente y aclara que instalación depende de cobertura',()=>{
  const resultado=crearPdfComercial({...base,tipo:'CARTA_B2C',titulo:'Carta comercial general B2C',cliente:null,neto:null,impuesto:null,total:null});
  const texto=resultado.pdf.toString('latin1');
  assert.match(texto,/CARTA COMERCIAL/);
  assert.match(texto,/precios base no incluyen instalación/i);
  assert.doesNotMatch(texto,/Cliente:/);
});

test('C4.3 habilita rutas reales con CU separados y conserva CU377 bloqueado',()=>{
  const servicio=leer('src','comercial','documentos','ServicioDocumentosComerciales.ts');
  const rutas=leer('src','rutas','finanzas.ts');
  assert.equal(permiteOperacion('previsualizarCotizacionPdf',['CU375']),true);
  assert.equal(permiteOperacion('previsualizarCotizacionPdf',['CU360']),false);
  assert.equal(permiteOperacion('previsualizarCartaComercialB2C',['CU375']),true);
  assert.equal(permiteOperacion('crearPlantillaDocumentalComercial',['CU378']),true);
  assert.equal(permiteOperacion('publicarPlantillaDocumentalComercial',['CU378']),false);
  assert.equal(permiteOperacion('publicarPlantillaDocumentalComercial',['CU379']),true);
  assert.equal(permiteOperacion('publicarCartaComercialB2C',['CU381']),true);
  assert.equal(permiteOperacion('publicarCartaComercialB2C',['CU377']),false);
  assert.match(servicio,/almacenarPdf/);
  assert.match(servicio,/COTIZACION_PDF_CONFIRMADO/);
  assert.match(rutas,/plantillas\/:id\/publicar/);
  assert.match(rutas,/cartas-b2c\/:id\/publicar/);
});

test('C4.2 autoriza CU378-CU381 separando edición y publicación',async()=>{
  const aprobadas=Object.fromEntries(MATRIZ_CAPACIDADES_COMERCIALES.filter(x=>x.cuExistente).map(x=>[x.operacion,x]));
  assert.equal(aprobadas.EDITAR_PLANTILLA_DOCUMENTAL.cuExistente,'CU378');
  assert.equal(aprobadas.PUBLICAR_PLANTILLA_DOCUMENTAL.cuExistente,'CU379');
  assert.equal(aprobadas.EDITAR_CARTA_B2C.cuExistente,'CU380');
  assert.equal(aprobadas.PUBLICAR_CARTA_B2C.cuExistente,'CU381');
  const autorizador=new AutorizadorCapacidadComercial();
  await assert.rejects(()=>autorizador.exigir({id:1n,sesion:'local',permisos:['CU380'],administrador:true},'PUBLICAR_CARTA_B2C'),e=>e.codigo==='ACCESO_COMERCIAL_DENEGADO');
  await autorizador.exigir({id:1n,sesion:'local',permisos:['CU381'],administrador:false},'PUBLICAR_CARTA_B2C');
});
