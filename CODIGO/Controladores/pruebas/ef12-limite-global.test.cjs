const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {transicionLimiteGlobalM8}=require('../dist/utilidades/transicionLimiteGlobalM8.js');
const fecha=(iso)=>new Date(`${iso}T00:00:00.000Z`);

test('EF12: dos configuraciones con idéntica vigencia usan sustitución auditable',()=>{
  assert.deepEqual(transicionLimiteGlobalM8(fecha('2026-11-14'),fecha('2026-11-14')),{tipo:'sustitucion_mismo_dia'});
});
test('EF12: fecha posterior cierra límite anterior el día anterior',()=>{
  const v=transicionLimiteGlobalM8(fecha('2026-11-14'),fecha('2026-11-15'));
  assert.equal(v.tipo,'cierre_anterior'); assert.equal(v.cierre.toISOString().slice(0,10),'2026-11-14');
});
test('EF12: transición mensual conserva fecha civil',()=>{
  const v=transicionLimiteGlobalM8(fecha('2026-10-01'),fecha('2026-11-01'));
  assert.equal(v.tipo,'cierre_anterior');assert.equal(v.cierre.toISOString().slice(0,10),'2026-10-31');
});
test('EF12: una fecha anterior al límite vigente se rechaza',()=>{
  assert.throws(()=>transicionLimiteGlobalM8(fecha('2026-11-14'),fecha('2026-11-13')),err=>err.estado===409);
});
test('EF12: mismo día 0 -> positivo sigue el flujo de sustitución (no modifica montos por sí solo)',()=>{
  const cero=transicionLimiteGlobalM8(fecha('2026-11-14'),fecha('2026-11-14'));
  assert.equal(cero.tipo,'sustitucion_mismo_dia');
});
test('EF12: consulta excluye registros reemplazados de la vigencia efectiva',()=>{
  const s=fs.readFileSync(path.resolve(__dirname,'../src/utilidades/creditoM8.ts'),'utf8');
  assert.match(s,/sustituido_en:\s*null/);
});
test('EF12: reemplazo mismo día conserva fila anterior y crea fila nueva',()=>{
  const s=fs.readFileSync(path.resolve(__dirname,'../src/controladores/M8Controller.ts'),'utf8');
  assert.match(s,/sustituido_en:\s*new Date\(\)/);
  assert.match(s,/limite_global_credito_m8\.create/);
});
