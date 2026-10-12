const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const modal = readFileSync(resolve('../Vistas/src/components/ModalFormulario.tsx'), 'utf8');
const vista = readFileSync(resolve('../Vistas/src/views/Mantenedores/ProductosFamilias.tsx'), 'utf8');
const dialogos = readFileSync(resolve('../Vistas/src/components/DialogosSistema.tsx'), 'utf8');

test('Bloque 3.1 — fichas flotantes y UX del mantenedor', async t => {
  await t.test('el componente compartido es una ficha centrada y no un drawer lateral', () => {
    assert.match(modal, /grid place-items-center/);
    assert.doesNotMatch(modal, /flex justify-end bg-black/);
    assert.match(modal, /rounded-2xl[\s\S]*shadow-2xl/);
  });
  await t.test('ofrece tamaños pequeño, mediano y grande', () => {
    for (const tamano of ['pequeno', 'mediano', 'grande']) assert.match(modal, new RegExp(tamano));
  });
  await t.test('es responsive y limita su altura al viewport', () => {
    assert.match(modal, /max-h-\[calc\(100dvh-1\.5rem\)\]/);
    assert.match(modal, /sm:max-h-\[90vh\]/);
    assert.match(modal, /w-full/);
  });
  await t.test('mantiene cuerpo desplazable y pie accesible', () => {
    assert.match(modal, /min-h-0 flex-1 overflow-y-auto/);
    assert.match(modal, /<footer className="shrink-0/);
  });
  await t.test('declara semántica y título accesibles', () => {
    assert.match(modal, /role="dialog"/);
    assert.match(modal, /aria-modal="true"/);
    assert.match(modal, /aria-labelledby=\{idTitulo\}/);
  });
  await t.test('administra Escape y encierra Tab dentro de la ficha', () => {
    assert.match(modal, /evento\.key === 'Escape'/);
    assert.match(modal, /evento\.key !== 'Tab'/);
    assert.match(modal, /ultimo\.focus\(\)/);
    assert.match(modal, /primero\.focus\(\)/);
  });
  await t.test('restaura el foco y bloquea el scroll de fondo', () => {
    assert.match(modal, /focoAnteriorRef\.current\?\.focus\(\)/);
    assert.match(modal, /document\.body\.style\.overflow = 'hidden'/);
    assert.match(modal, /document\.body\.style\.overflow = overflowAnterior/);
  });
  await t.test('el overlay permite cierre controlado sin propagar desde el contenido', () => {
    assert.match(modal, /evento\.target === evento\.currentTarget/);
    assert.match(modal, /evento\.stopPropagation\(\)/);
    assert.match(modal, /cierreBloqueado/);
  });
  await t.test('las confirmaciones secundarias reciben foco sobre el formulario', () => {
    assert.match(dialogos, /autoFocus=\{solicitud\.tipo !== 'texto'\}/);
    assert.match(modal, /dialogoActivo && dialogoActivo !== actual/);
    assert.match(dialogos, /evento\.key === 'Escape'/);
    assert.match(dialogos, /evento\.key !== 'Tab'/);
    assert.match(dialogos, /focoRetornoRef\.current\?\.focus\(\)/);
  });
  await t.test('Productos y familias reutiliza el componente y elimina Panel lateral', () => {
    assert.match(vista, /import ModalFormulario/);
    assert.doesNotMatch(vista, /function Panel\(/);
    assert.doesNotMatch(vista, /fixed inset-0 z-40 flex justify-end/);
  });
  await t.test('familias distingue explícitamente crear editar e historial', () => {
    assert.match(vista, /type ModoFamilia = 'crear'\|'editar'\|'historial'\|null/);
    assert.match(vista, /modoFamilia==='crear'\?'Nueva familia':modoFamilia==='editar'\?'Editar familia':'Historial de familia'/);
  });
  await t.test('familias presenta estados vacíos y acción según permiso', () => {
    assert.match(vista, /Aún no hay familias comerciales registradas/);
    assert.match(vista, /Crea la primera familia para comenzar a organizar tus productos/);
    assert.match(vista, /Crear primera familia/);
    assert.match(vista, /No tienes permiso para crear familias/);
  });
  await t.test('productos distingue catálogo vacío filtros y falta de familia activa', () => {
    assert.match(vista, /Aún no hay fichas comerciales registradas/);
    assert.match(vista, /No hay productos que coincidan con los filtros seleccionados/);
    assert.match(vista, /Necesitas una familia activa antes de crear productos/);
  });
  await t.test('carga y error no se presentan como listados vacíos', () => {
    assert.match(vista, /Cargando fichas comerciales/);
    assert.match(vista, /Cargando familias comerciales/);
    assert.match(vista, /No fue posible cargar la información/);
  });
  await t.test('el formulario conserva sus datos en estado al navegar por pestañas', () => {
    assert.match(vista, /type PestanaProducto/);
    assert.match(vista, /setPestanaProducto/);
    assert.match(vista, /setFormProducto/);
    assert.doesNotMatch(vista, /setFormProducto\([^)]*setPestanaProducto/);
  });
  await t.test('las secciones requeridas están disponibles sin carga de archivos', () => {
    for (const titulo of ['Identificación', 'Características', 'Información comercial', 'Imágenes y documentos', 'Vinculaciones e historial']) assert.match(vista, new RegExp(titulo));
    assert.doesNotMatch(vista, /type="file"/);
  });
  await t.test('los errores de identificación llevan a la pestaña correspondiente', () => {
    assert.match(vista, /setPestanaProducto\('identificacion'\)/);
    assert.match(vista, /Completa el código, nombre y familia en la sección Identificación/);
  });
  await t.test('los botones reflejan crear editar y consultar', () => {
    for (const texto of ['Guardar familia', 'Guardar cambios', 'Guardar borrador', 'Editar ficha', 'Cerrar']) assert.match(vista, new RegExp(texto));
  });
  await t.test('la protección de cambios aplica a X Cancelar Escape y overlay', () => {
    assert.match(vista, /Hay cambios sin guardar\. ¿Quieres descartarlos\?/);
    assert.match(vista, /productoSucio\|\|detalleSucio/);
    assert.match(vista, /familiaSucia/);
    assert.match(vista, /cerrar=\{\(\)=>void cerrarProducto\(\)\}/);
  });
  await t.test('el guardado deshabilita doble envío y mantiene el formulario ante error', () => {
    assert.match(vista, /if\(ocupado\)return false/);
    assert.match(vista, /disabled=\{ocupado\}/);
    assert.match(vista, /setMensajeModal\(fallo\)/);
  });
  await t.test('el éxito se informa después de recargar y cerrar', () => {
    assert.match(vista, /if\(!await cargar\(false\)\)throw/);
    assert.match(vista, /Familia creada correctamente/);
    assert.match(vista, /Ficha comercial guardada/);
    assert.match(vista, /Producto actualizado correctamente/);
  });
  await t.test('vinculaciones y versiones mantienen confirmación y permisos', () => {
    assert.match(vista, /CU366/);
    assert.match(vista, /CU365/);
    assert.match(vista, /confirmarAccion\('¿Confirmas la vinculación explícita/);
    assert.match(vista, /confirmarAccion\('¿Publicar una versión inmutable/);
  });
  await t.test('no agrega contratos backend permisos ni rutas nuevas', () => {
    assert.match(vista, /\/mantenedores\/productos/);
    assert.match(vista, /\/mantenedores\/familias-producto/);
    assert.doesNotMatch(vista, /CU3(?:6[8-9]|[7-9][0-9])/);
  });
});
