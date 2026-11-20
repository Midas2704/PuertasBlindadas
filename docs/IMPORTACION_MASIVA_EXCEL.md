# Importación masiva desde Excel

La carga masiva está disponible en los catálogos de clientes, empleados, proveedores, áreas de trabajo, tareas de fabricación y categorías de egreso.

## Flujo de usuario

1. Abrir el catálogo y seleccionar **Importar Excel**.
2. Descargar la plantilla oficial. Las columnas obligatorias están marcadas con `*`; las obligaciones condicionales se explican en la cabecera y en la hoja `Instrucciones`.
3. Completar hasta 1.000 filas y cargar un archivo `.xlsx` de hasta 5 MB.
4. Validar el archivo. No se escribe en la base de datos durante esta etapa.
5. Confirmar la importación. El resultado informa filas importadas y errores por número de fila.

Las plantillas de proveedores y tareas incluyen hojas de referencia con los identificadores vigentes de países, tipos de identificación y áreas de trabajo.

## Recorrido técnico

- La interfaz reutilizable está en `CODIGO/Vistas/src/components/ImportacionMasivaExcel.tsx`.
- Las rutas HTTP están declaradas en `CODIGO/Controladores/src/rutas/finanzas.ts` bajo `/api/finanzas/importaciones/:tipo`.
- `C_Finanzas` autoriza la operación con el mismo permiso CU usado por la creación manual.
- `ServicioImportacionExcel` genera la plantilla, interpreta Excel y valida cabeceras, tipos, duplicados y límites.
- Al confirmar, cada fila válida pasa por el controlador normal del módulo; no se insertan datos directamente desde la capa Excel.
- M9 registra un evento de lote al confirmar. La validación previa no se registra como importación.

## Criterio de alcance

La importación se aplica a datos maestros repetitivos. Pagos, cotizaciones, aprobaciones, cierres, movimientos de inventario y otros flujos transaccionales quedan fuera: requieren confirmaciones, estados, saldos o respaldos que no deben omitirse mediante una planilla.

Para agregar otro catálogo se debe declarar su definición en `ServicioImportacionExcel`, añadir sus operaciones y rutas con el permiso CU de creación, procesar sus filas mediante el controlador existente e incorporar el componente en la vista correspondiente.
