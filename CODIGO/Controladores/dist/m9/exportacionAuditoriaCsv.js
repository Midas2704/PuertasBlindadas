"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.archivoAuditoriaM9Csv = void 0;
const csv_1 = require("../utilidades/csv");
const informeAuditoriaPdf_1 = require("./informeAuditoriaPdf");
// MIDAS: exportamos el conjunto ya autorizado; este helper no amplía el alcance de Auditoría.
const archivoAuditoriaM9Csv = (eventos) => (0, csv_1.archivoCsvAdministrativo)('auditoria-m9.csv', eventos, [
    { encabezado: 'Fecha y hora', valor: evento => (0, informeAuditoriaPdf_1.fechaInformeM9)(evento.ocurrencia) },
    { encabezado: 'Módulo', valor: evento => (0, informeAuditoriaPdf_1.humanizarM9)(evento.modulo) },
    { encabezado: 'Operación', valor: evento => (0, informeAuditoriaPdf_1.humanizarM9)(evento.operacion) },
    { encabezado: 'Resultado', valor: evento => (0, informeAuditoriaPdf_1.humanizarM9)(evento.resultado) },
    { encabezado: 'Integridad', valor: evento => (0, informeAuditoriaPdf_1.humanizarM9)(evento.integridad) },
    { encabezado: 'Referencia', valor: evento => (0, informeAuditoriaPdf_1.referenciaInformeM9)(evento) },
    { encabezado: 'Ejecutor', valor: evento => (0, informeAuditoriaPdf_1.ejecutorInformeM9)(evento) },
], ';');
exports.archivoAuditoriaM9Csv = archivoAuditoriaM9Csv;
//# sourceMappingURL=exportacionAuditoriaCsv.js.map