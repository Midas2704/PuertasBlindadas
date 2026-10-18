const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { crearAntivirusAdapterDesdeEntorno } = require('../dist/documental/seguridad/configuracionSeguridadDocumental');
const { escanearConIntegridad, exigirResultadoLimpio } = require('../dist/documental/seguridad/AntivirusAdapter');

const habilitada = process.env.C41_REAL_CLAMAV === '1';
const ejemplos = [
  'cotizacion-b2b-borrador.pdf',
  'cotizacion-b2c-alternativas-borrador.pdf',
  'carta-general-b2c-borrador.pdf',
];

test('C4.1 integra ClamAV real con PDF comerciales y rechazo EICAR', { skip: !habilitada }, async () => {
  const antivirus = crearAntivirusAdapterDesdeEntorno(process.env);
  const disponibilidad = await antivirus.comprobarDisponibilidad();
  assert.deepEqual(disponibilidad, { disponible:true, motor:'CLAMAV_DAEMON' });
  for (const nombre of ejemplos) {
    const ruta = path.resolve(__dirname, '..', '..', 'output', 'pdf', 'c4-ejemplos', nombre);
    const contenido = fs.readFileSync(ruta);
    const resultado = await escanearConIntegridad(antivirus, Readable.from(contenido));
    assert.equal(resultado.resultado.estado, 'LIMPIO', nombre);
    assert.equal(resultado.completo, true, nombre);
    assert.equal(resultado.tamanoBytes, BigInt(contenido.length), nombre);
    assert.match(resultado.sha256, /^[a-f0-9]{64}$/);
    assert.doesNotThrow(() => exigirResultadoLimpio(resultado.resultado));
  }
  const eicar = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
  const rechazado = await escanearConIntegridad(antivirus, Readable.from(eicar));
  assert.equal(rechazado.resultado.estado, 'INFECTADO');
  assert.equal(rechazado.resultado.firma, 'Eicar-Test-Signature');
  assert.throws(() => exigirResultadoLimpio(rechazado.resultado), /no fue aprobado/);
});
