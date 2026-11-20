import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistorialCredito, { formatearCambioCredito } from './HistorialCredito';

describe('EF-02: historial crediticio legible', () => {
  it('traduce cadenas booleanas a castellano', () => {
    expect(formatearCambioCredito('True')).toEqual([{ etiqueta: '', valor: 'Sí' }]);
    expect(formatearCambioCredito('False')).toEqual([{ etiqueta: '', valor: 'No' }]);
    expect(formatearCambioCredito(false)).toEqual([{ etiqueta: '', valor: 'No' }]);
  });

  it('descompone el JSON histórico sin mostrar llaves ni código', () => {
    const resultado = formatearCambioCredito('{"cupo":"3875000","desde":"2026-10-01","hasta":"2027-04-19"}');
    expect(resultado).toEqual([
      { etiqueta: 'Cupo', valor: '$3.875.000' },
      { etiqueta: 'Desde', valor: '01-10-2026' },
      { etiqueta: 'Hasta', valor: '19-04-2027' },
    ]);
  });

  it('muestra eventos y solicitudes como tarjetas adaptables', () => {
    render(<HistorialCredito valor={{
      eventos: [{ tipo: 'CUPO_MODIFICADO', anterior: 'True', nuevo: '{"cupo":"4000000"}', fecha: '2026-11-14T16:30:00.000Z', responsable: 'prueba' }],
      solicitudes: [{ id: 18, tipo: 'EXCEPCION', estado: 'APROBADA', decision: 'APROBADA' }],
    }}/>);
    expect(screen.getByText('Eventos (1)')).toBeTruthy();
    expect(screen.getByText('Solicitudes (1)')).toBeTruthy();
    expect(screen.getByText('Sí')).toBeTruthy();
    expect(screen.getByText('$4.000.000')).toBeTruthy();
    expect(screen.getByText('Solicitud #18')).toBeTruthy();
  });
});
