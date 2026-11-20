const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const fuente=fs.readFileSync(path.resolve(__dirname,'../src/controladores/M2Controller.ts'),'utf8');
const start=fuente.indexOf('  async consolidarB2C(');
const end=fuente.indexOf('  async aprobarCotizacionB2B(',start);
assert.ok(start>0&&end>start,'Métodos M2 presentes');
const b2c=fuente.slice(start,end),b2b=fuente.slice(end,fuente.indexOf('  async consultarTrazabilidadComercialM11(',end));

test('EF15: B2C consolida cotización, nota y primer pago',()=>{
  assert.match(b2c,/tx\.nota_venta\.create/);
  assert.match(b2c,/tx\.pago_cliente\.create/);
  assert.match(b2c,/estado_cotizacion:'aprobada'/);
});
test('EF15: B2C no crea OT y mantiene respuesta compatible',()=>{
  assert.doesNotMatch(b2c,/crearOrdenesTrabajoCotizacion\(/);
  assert.match(b2c,/const ordenesTrabajo: \[\] = \[\]/);
});
test('EF18: aceptación B2B conserva validaciones, Nota de Venta y OT sin exigir OC', () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs');
  const path = require('node:path');
  const fuente = fs.readFileSync(path.join(__dirname, '../src/controladores/M2Controller.ts'), 'utf8');
  const i = fuente.indexOf('async aprobarCotizacionB2B(');
  const j = fuente.indexOf('async consultarTrazabilidadComercialM11(', i);
  assert.ok(i >= 0 && j > i, 'No se encontró el método completo de aceptación B2B');
  const bloque = fuente.slice(i, j);
  const validarVersion = bloque.indexOf('Debes seleccionar la versión emitida de la oferta aceptada');
  const validarEconomia = bloque.indexOf("if (economia.estado !== 'COINCIDE')");
  const crearNV = bloque.indexOf('tx.nota_venta.create');
  const crearOT = bloque.indexOf('this.crearOrdenesTrabajoCotizacion(');
  assert.ok(validarVersion >= 0 && validarEconomia > validarVersion);
  assert.ok(crearNV > validarEconomia && crearOT > validarEconomia);
  assert.match(bloque, /clienteAceptableB2B\(/);
  assert.match(bloque, /cot\.fecha_vigencia/);
  assert.match(bloque, /cot\.nota_venta/);
  assert.match(bloque, /validarCondicionesEconomicasOfertaM11\(/);
  assert.match(bloque, /modalidadAceptacion:'B2B_SIN_OC'/);
  assert.match(bloque, /this\.enTransaccion/);
  assert.doesNotMatch(bloque, /tx\.orden_compra_b2b\.create|exigirCotejoAcreditadoM11\(/);
});

test('EF15: el backend mantiene rechazo de segmento equivocado',()=>{
  assert.match(b2c,/cotizacion\.segmento_comercial.*!==.B2C/);
  assert.match(b2b,/cot\.segmento_comercial\s*&&\s*cot\.segmento_comercial\s*!==\s*['"]B2B['"]/);
});
