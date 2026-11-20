import { describe, expect, it } from 'vitest';
import { CAPAS, claseEstado } from './tipos';

describe('monitor de demostración técnica', () => {
  it('mantiene el orden pedagógico completo de las capas', () => {
    expect(CAPAS.map(c=>c.id)).toEqual([
      'INTERACCION','VISTA_REACT','CLIENTE_API','RUTA_BACKEND','SEGURIDAD_M4','CONTROLADOR',
      'REGLAS_NEGOCIO','PRISMA','POSTGRESQL','AUDITORIA_M9','RESPUESTA','ACTUALIZACION_VISTA',
    ]);
  });

  it('distingue visualmente activo, correcto, rechazado, error y rollback', () => {
    expect(claseEstado('EN_EJECUCION')).toContain('FE8F01');
    expect(claseEstado('CORRECTO')).toContain('emerald');
    for(const estado of ['RECHAZADO','ERROR','ROLLBACK'] as const) expect(claseEstado(estado)).toContain('red');
  });
});
