import { describe, expect, it } from 'vitest';
import { resumirOrdenesTerreno } from './resumenPanelTerreno';

describe('resumen real de órdenes de Terreno',()=>{
  it('clasifica los estados existentes sin duplicarlos ni inventar totales',()=>{
    const estados=['PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','RECTIFICACION_DEVUELTA','PENDIENTE_APROBACION_TECNICA','RECTIFICACION_APROBADA','LIBERADA','EN_PRODUCCION','FINALIZADA'];
    const resumen=resumirOrdenesTerreno(estados.map(estado=>({estado})));
    expect(resumen).toEqual({rectificacion:4,aprobacion:1,liberadas:1,produccion:1,finalizadas:1});
  });
  it('devuelve ceros con una consulta válida sin resultados',()=>expect(resumirOrdenesTerreno([])).toEqual({rectificacion:0,aprobacion:0,liberadas:0,produccion:0,finalizadas:0}));
});
