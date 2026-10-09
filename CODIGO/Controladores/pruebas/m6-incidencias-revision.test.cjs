const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { validarRevisionIncidenciaM6 } = require('../dist/controladores/M6Controller');
const { resumirIncidenciasRevisionM7 } = require('../dist/controladores/M7Controller');
const { operacionesPermiso, permiteOperacion } = require('../dist/validaciones/permisos');
const { CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');

test('M6/M7 incidencias categorizadas y revisión gerencial', async t => {
  const schema = readFileSync(resolve('prisma/schema.prisma'), 'utf8');
  const migracion = readFileSync(resolve('prisma/migrations/052_incidencias_terreno_revision/migration.sql'), 'utf8');
  const m6 = readFileSync(resolve('src/controladores/M6Controller.ts'), 'utf8');
  const m7 = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const vistaOwner = readFileSync(resolve('../Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx'), 'utf8');
  const vistaM7 = readFileSync(resolve('../Vistas/src/views/DashboardM7/OperacionCostosM7.tsx'), 'utf8');

  await t.test('crear incidencia exige categoría owner y persiste su vínculo', () => { assert.match(m6, /La categoría es obligatoria/); assert.match(m6, /id_categoria_incidencia: categoria\.id_categoria_incidencia/); assert.match(schema, /model categoria_incidencia_terreno/); });
  await t.test('categorías se mantienen en un catálogo relacional único', () => { for (const codigo of ['ATRASO','POSTVENTA','PRODUCCION','INSTALACION','MEDICION','LOGISTICA','OTRO']) assert.match(migracion, new RegExp(`'${codigo}'`)); assert.equal((schema.match(/model categoria_incidencia_terreno/g) || []).length, 1); });
  await t.test('área reutiliza area_trabajo en vez de texto duplicado', () => { assert.match(schema, /area_responsable\s+area_trabajo\?/); assert.match(m6, /prisma\.area_trabajo|tx\.area_trabajo/); });
  await t.test('no permite aprobar sin evidencia', () => assert.throws(() => validarRevisionIncidenciaM6({ estadoRevision: 'pendiente_revision', idCreador: 1n, idRevisor: 2n, idCategoria: 1, cantidadEvidencias: 0, decision: 'aprobada' }), /requiere evidencia/i));
  await t.test('permite aprobar con categoría evidencia y revisor distinto', () => assert.doesNotThrow(() => validarRevisionIncidenciaM6({ estadoRevision: 'pendiente_revision', idCreador: 1n, idRevisor: 2n, idCategoria: 1, cantidadEvidencias: 1, decision: 'aprobada' })));
  await t.test('CU213 autoriza revisión y un usuario sin CU213 es rechazado', () => { assert.equal(operacionesPermiso.aprobarIncidenciaOperativa, 'CU213'); assert.equal(permiteOperacion('aprobarIncidenciaOperativa', ['CU213']), true); assert.equal(permiteOperacion('aprobarIncidenciaOperativa', ['CU212']), false); });
  await t.test('rechazo conserva transición y trazabilidad M9', () => { assert.doesNotThrow(() => validarRevisionIncidenciaM6({ estadoRevision: 'pendiente_revision', idCreador: 1n, idRevisor: 2n, idCategoria: 1, cantidadEvidencias: 0, decision: 'rechazada' })); assert.equal(CATALOGO_PRODUCTORES_M9.rechazarIncidenciaOperativa.operacion, 'INCIDENCIA_RECHAZADA'); });
  await t.test('M9 registra creación modificación y aprobación', () => { assert.equal(CATALOGO_PRODUCTORES_M9.registrarIncidenciaRetrabajo.operacion, 'INCIDENCIA_CREADA'); assert.equal(CATALOGO_PRODUCTORES_M9.actualizarIncidenciaOperativa.operacion, 'INCIDENCIA_MODIFICADA'); assert.equal(CATALOGO_PRODUCTORES_M9.aprobarIncidenciaOperativa.operacion, 'INCIDENCIA_APROBADA'); });
  await t.test('M7 separa aprobadas pendientes y rechazadas', () => { const resumen = resumirIncidenciasRevisionM7([{ estadoRevision: 'aprobada', categoria: { codigo: 'ATRASO', nombre: 'Atraso' } }, { estadoRevision: 'pendiente_revision', categoria: { codigo: 'ATRASO', nombre: 'Atraso' } }, { estadoRevision: 'rechazada', categoria: null }]); assert.deepEqual(resumen.estadosRevision.map(f => f.cantidad), [1,1,1]); assert.equal(resumen.aprobadas, 1); assert.equal(resumen.sinCategoriaEstructurada, 1); });
  await t.test('M7 no infiere categoría desde descripción libre', () => { const resumen = resumirIncidenciasRevisionM7([{ estadoRevision: 'aprobada', categoria: null }]); assert.deepEqual(resumen.categorias, []); assert.doesNotMatch(m7, /descripcion.*ATRASO|ATRASO.*descripcion/i); });
  await t.test('evita autoaprobación y autorechazo', () => assert.throws(() => validarRevisionIncidenciaM6({ estadoRevision: 'pendiente_revision', idCreador: 7n, idRevisor: 7n, idCategoria: 1, cantidadEvidencias: 1, decision: 'rechazada' }), /propia incidencia/i));
  await t.test('evidencia y navegación owner tienen acciones reales', () => { assert.match(schema, /id_incidencia_retrabajo\s+BigInt\?/); assert.match(vistaOwner, /verEvidencia/); assert.match(vistaOwner, /Aprobación requiere evidencia/); assert.match(vistaM7, /Ver detalle/); assert.match(m7, /\/terreno\/incidencias\?incidencia=/); });
});
