// EF18 — guarda contractual sin OC; no inicia transacciones ni se conecta a la BD.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const source=fs.readFileSync(path.join(__dirname,'../src/controladores/M2Controller.ts'),'utf8');
const method=source.split('  async aprobarCotizacionB2B(')[1]?.split('\n  async ')[0]||'';
test('EF18 conserva aprobacion B2B transaccional y auditoria M9',()=>{
 assert.match(method,/this\.enTransaccion/);
 assert.match(method,/registrarCompromisoCredito/);
 assert.match(method,/crearOrdenesTrabajoCotizacion/);
 assert.match(method,/auditableM9/);
 assert.match(method,/validarCondicionesEconomicasOfertaM11/);
});
test('EF18 no exige ni crea orden de compra B2B',()=>{
 for(const token of ['folioOrdenCompra','respaldoOrdenCompra','lineasOrdenCompra','orden_compra_b2b.create','correspondencia_linea_oc_item_tecnico.createMany'])
  assert.doesNotMatch(method,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 assert.match(method,/modalidadAceptacion:'B2B_SIN_OC'/);
});
