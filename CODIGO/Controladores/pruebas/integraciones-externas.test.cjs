const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { C_BancoCentral } = require('../dist/utilidades/C_BancoCentral');

test('Banco Central usa el REST oficial, token BDE y serie diaria del dólar observado', async () => {
  let consultada = '';
  const banco = new C_BancoCentral(async url => {
    consultada = url;
    return {ok:true,status:200,text:async()=>JSON.stringify({Codigo:0,Descripcion:'Success',Series:{Obs:[{indexDateString:'20-11-2026',value:'912.45',statusCode:'OK'}]}})};
  }, {token:'TOKEN-PRUEBA',endpoint:'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx',serie:'F073.TCO.PRE.Z.D'});
  assert.equal(await banco.obtenerTipoCambio('USD','2026-11-20'),912.45);
  const url = new URL(consultada);
  assert.equal(url.searchParams.get('function'),'GetSeries');
  assert.equal(url.searchParams.get('timeseries'),'F073.TCO.PRE.Z.D');
  assert.equal(url.searchParams.get('firstdate'),'2026-11-10');
  assert.equal(url.searchParams.get('lastdate'),'2026-11-20');
  assert.equal(url.searchParams.get('token'),'TOKEN-PRUEBA');
});

test('administración solicita credenciales sin devolver secretos guardados', () => {
  const servicio = readFileSync('src/utilidades/integracionesExternas.ts','utf8');
  const vista = readFileSync('../Vistas/src/views/Seguridad/Integraciones.tsx','utf8');
  assert.match(servicio,/tokenConfigurado: Boolean\(banco\.token\)/);
  assert.match(servicio,/passwordConfigurada: Boolean\(correo\.password\)/);
  assert.doesNotMatch(servicio,/bancoCentral: \{ token:/);
  assert.match(vista,/Token API/);
  assert.match(vista,/Servidor de correo \(SMTP\)/);
  assert.match(vista,/Probar conexión/);
});

test('mantenedores muestran nombres comprensibles y no códigos de módulos', () => {
  const vista = readFileSync('../Vistas/src/views/Mantenedores/Mantenedores.tsx','utf8');
  assert.match(vista,/Opciones del sistema/);
  assert.match(vista,/Precios de venta/);
  assert.match(vista,/Formas de pago/);
  assert.doesNotMatch(vista,/\{tarjeta\.modulo\}/);
  assert.doesNotMatch(vista,/PENDIENTE DE DEFINICIÓN|RESTRINGIDO/);
});
