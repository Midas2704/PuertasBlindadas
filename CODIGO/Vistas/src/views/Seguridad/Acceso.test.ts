import { describe, expect, it } from 'vitest';
import { destinoPosteriorSeguro } from './Acceso';

describe('destino posterior al ingreso',()=>{
  it('conserva rutas internas completas',()=>expect(destinoPosteriorSeguro('/terreno/ordenes-trabajo?estado=EN_PRODUCCION')).toBe('/terreno/ordenes-trabajo?estado=EN_PRODUCCION'));
  it.each(['https://sitio.example','//sitio.example','/\\sitio.example','/login','/recuperar#token',null])('rechaza destinos inseguros o recursivos: %s',(destino)=>expect(destinoPosteriorSeguro(destino)).toBe('/'));
});
