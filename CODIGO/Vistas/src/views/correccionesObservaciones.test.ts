import { describe, expect, it } from 'vitest';
import { esCajaChicaCompleta } from './CajaChica/CajaChica';
import { combinarConfiguracionHaber } from './EsquemasRemuneracionales/EsquemasRemuneracionales';

describe('correcciones de observaciones operacionales',()=>{
  it('distingue la respuesta completa de Caja Chica de la respuesta de un gasto',()=>{
    expect(esCajaChicaCompleta({periodo:'2026-10',fondo:100000,reservado:0,aprobado:0,disponibleProyectado:100000,fondoConfigurado:true,gastos:[]})).toBe(true);
    expect(esCajaChicaCompleta({id:17,monto:25000,descripcion:'Materiales'})).toBe(false);
  });

  it('rechaza respuestas incompletas para evitar reemplazar el estado renderizable',()=>{
    expect(esCajaChicaCompleta(null)).toBe(false);
    expect(esCajaChicaCompleta({fondo:100000,gastos:'no es una lista'})).toBe(false);
  });

  it('mantiene valores independientes al editar configuraciones de haberes distintos',()=>{
    const primera=combinarConfiguracionHaber({},11,{valor:'150000'});
    const segunda=combinarConfiguracionHaber(primera,22,{valor:'275000',esExcepcion:true});
    expect(segunda[11]).toMatchObject({valor:'150000',esExcepcion:false});
    expect(segunda[22]).toMatchObject({valor:'275000',esExcepcion:true});
  });
});
