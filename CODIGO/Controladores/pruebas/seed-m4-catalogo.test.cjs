const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  codigosImplementados,
  codigosTodosLosCU,
  codigosGerencia,
  codigosSecretaria,
  codigosContador,
  dependenciasPermiso,
} = require('../dist/validaciones/permisos.js');
const {
  construirCatalogoSemillaM4,
  exigirIdPermisoSemillaM4,
} = require('../dist/validaciones/semillaM4.js');

const configurar = () => ({
  iniciales: [...codigosImplementados, ...codigosTodosLosCU],
  dependencias: dependenciasPermiso,
  perfiles: [codigosGerencia, codigosSecretaria, codigosContador],
});

test('seed M4 incluye cada extremo de dependencia sin habilitar CU377', () => {
  const iniciales = new Set([...codigosImplementados, ...codigosTodosLosCU]);
  assert.equal(iniciales.has('CU449'), false, 'la regresión requiere que CU449 provenga de sus dependencias');
  assert.equal(iniciales.has('CU451'), true);
  const catalogo = construirCatalogoSemillaM4(configurar());
  const codigos = new Set(catalogo);
  assert.ok(codigos.has('CU238'));
  assert.ok(codigos.has('CU449'));
  assert.ok(codigos.has('CU451'));
  assert.equal(codigos.has('CU377'), false);
  for (const [codigo, requeridos] of Object.entries(dependenciasPermiso)) {
    if (requeridos.length === 0) continue;
    assert.ok(codigos.has(codigo), `falta permiso dependiente ${codigo}`);
    for (const requerido of requeridos) assert.ok(codigos.has(requerido), `falta requisito ${requerido} de ${codigo}`);
  }
});

test('seed M4 incluye todos los permisos de perfiles y su plan es idempotente', () => {
  const primero = construirCatalogoSemillaM4(configurar());
  const segundo = construirCatalogoSemillaM4(configurar());
  assert.deepEqual(segundo, primero);
  const codigos = new Set(primero);
  for (const perfil of [codigosGerencia, codigosSecretaria, codigosContador]) {
    for (const codigo of perfil) assert.ok(codigos.has(codigo), `falta ${codigo} usado por un perfil`);
  }
  assert.equal(codigos.size, primero.length, 'el catálogo contiene duplicados');
});

test('seed M4 falla antes de Prisma ante exclusiones o identificadores ausentes', () => {
  assert.throws(
    () => construirCatalogoSemillaM4({ iniciales: ['CU01'], dependencias: { CU01: ['CU377'] }, perfiles: [] }),
    /M4_SEED_PERMISO_EXCLUIDO_REQUERIDO/,
  );
  assert.throws(
    () => exigirIdPermisoSemillaM4(new Map([['CU449', 449n]]), 'CU451', 'prueba'),
    /M4_SEED_PERMISO_NO_CREADO: CU451/,
  );
});
