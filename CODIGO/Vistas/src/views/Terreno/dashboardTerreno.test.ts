import { describe, expect, it } from 'vitest';
import { consultaPanel } from './dashboardTerreno';

describe('filtros del dashboard de Terreno',()=>{
 it('combina sólo los filtros informados',()=>{const consulta=new URLSearchParams(consultaPanel({desde:'2026-10-01',hasta:'2026-10-15',estado:'LIBERADA',area:'3',responsable:'',tipoActividad:'instalación'}));expect(Object.fromEntries(consulta)).toEqual({desde:'2026-10-01',hasta:'2026-10-15',estado:'LIBERADA',area:'3',tipoActividad:'instalación'});});
 it('preserva fechas ISO para consulta y exportación',()=>expect(consultaPanel({desde:'2026-01-01',hasta:'2026-12-31',estado:'',area:'',responsable:'',tipoActividad:''})).toBe('desde=2026-01-01&hasta=2026-12-31'));
});
