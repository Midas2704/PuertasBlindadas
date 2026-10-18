const fs = require('node:fs');
const path = require('node:path');
const { crearPdfComercial } = require('../dist/comercial/documentos/MotorPdfComercial');

const salida = path.resolve(__dirname, '..', '..', 'output', 'pdf', 'c4-ejemplos');
fs.mkdirSync(salida, { recursive: true });
const producto = (indice) => ({ codigo:`PB-${String(indice).padStart(2,'0')}`, nombre:`Puerta de seguridad modelo ${indice}`, descripcion:'Descripción comercial sintética para validar saltos de línea, paginación y caracteres: instalación, garantía y ubicación.', cantidad:indice%3+1, unidad:'unidad(es)', dimensiones:'2100 × 900 × 70 mm', precioUnitario:850000+indice*25000, subtotal:(850000+indice*25000)*(indice%3+1), caracteristicas:['Cierre multipunto','Terminación autorizada'], opcionales:['Marco reforzado'] });
const base = { numero:null,version:null,fecha:'2026-10-16',vigencia:'2026-11-16',borrador:true,camposPendientes:['confirmación documental'],moneda:'CLP',cliente:{nombre:'Cliente sintético de revisión',rut:'11.111.111-1',correo:'revision@example.test',telefono:'+56 9 0000 0000'},productos:Array.from({length:18},(_,i)=>producto(i+1)),servicios:[{codigo:'FLT',nombre:'Flete autorizado',descripcion:'Servicio comercial sintético',cantidad:1,unidad:'global',precioUnitario:95000,subtotal:95000}],neto:16800000,impuesto:3192000,total:19992000,condiciones:['Vigencia indicada en portada.','Plazo sujeto a confirmación comercial.','Instalación según cobertura autorizada.'],observaciones:['Ejemplo sintético sin datos empresariales reales.'],plantilla:{nombre:'Plantilla segura C4',publicada:false}};
const documentos = [
  ['cotizacion-b2b-borrador.pdf',{...base,tipo:'B2B',titulo:'Presupuesto comercial B2B',contactos:[{nombre:'Contacto principal',cargo:'Compras',correo:'contacto@example.test',telefono:'+56 9 0000 0001',principal:true}],proyecto:{nombre:'Proyecto sintético',referencia:'REV-C4',ubicacion:'Región de prueba · Comuna de prueba',alcance:'SUMINISTRO_INSTALACION'}}],
  ['cotizacion-b2c-alternativas-borrador.pdf',{...base,tipo:'B2C',titulo:'Cotización personalizada B2C',productos:[producto(1)],alternativas:['A','B','C'].map((letra,i)=>({identificador:`ALT-${letra}`,etiqueta:`ALTERNATIVA ${letra}`,producto:`Modelo ${letra}`,descripcion:'Alternativa comercial independiente',caracteristicas:['Característica autorizada'],opcionales:i?['Opcional compatible']:[],moneda:'CLP',neto:850000+i*120000,impuesto:161500+i*22800,total:1011500+i*142800,fotografiaDisponible:false}))}],
  ['carta-general-b2c-borrador.pdf',{...base,tipo:'CARTA_B2C',titulo:'Carta comercial general B2C',cliente:null,productos:[producto(1),producto(2),producto(3),producto(4)],servicios:[],neto:null,impuesto:null,total:null}],
];
for (const [nombre,snapshot] of documentos) {
  const resultado = crearPdfComercial(snapshot);
  fs.writeFileSync(path.join(salida,nombre),resultado.pdf);
  process.stdout.write(`${nombre}\t${resultado.paginas} página(s)\t${resultado.sha256}\n`);
}
