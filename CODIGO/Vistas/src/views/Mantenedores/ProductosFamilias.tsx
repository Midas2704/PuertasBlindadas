import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Boxes, ChevronRight, CircleDollarSign, CircleOff, History, Link2, PackagePlus, Plus, RefreshCw, Save, Send, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { confirmarAccion, solicitarTexto } from '../../components/DialogosSistema';
import ModalFormulario from '../../components/ModalFormulario';
import PanelDocumentosProductoConectado from '../../components/documental/PanelDocumentosProductoConectado';
import { usarSesion } from '../../seguridad/Sesion';
import PlantillaFabricacionFamilia from './PlantillaFabricacionFamilia';

type Historial = { evento:string; motivo:string|null; fecha_evento:string; valor_anterior:unknown; valor_nuevo:unknown; usuario?:{usuario_username:string|null} };
type Familia = { id_familia_producto_comercial:number; codigo:string; nombre:string; descripcion:string|null; estado:'ACTIVA'|'INACTIVA'; revision:number; _count?:{productos:number}; productos?:Array<{id_extension_producto_comercial:number;codigo_comercial:string;nombre_comercial:string;estado:string}>; historial?:Historial[] };
type Version = { id_producto_comercial_version:number; numero_version:number; nombre_comercial:string; codigo_familia:string; nombre_familia:string; vigencia_desde:string; motivo:string; creado_en:string };
type Producto = { id_extension_producto_comercial:number; codigo_comercial:string; nombre_comercial:string; id_familia_producto_comercial:number; subfamilia:string|null; tipo_producto:string|null; descripcion_general:string|null; descripcion_b2b:string|null; descripcion_b2c:string|null; observaciones:string|null; garantia_referencial:string|null; condiciones_particulares:string|null; caracteristicas_destacadas:string[]; caracteristicas_tecnicas:Record<string,string>; estado:'BORRADOR'|'VINCULADO'|'INACTIVO'; id_item_comercial:number|null; producto_terminado_id_producto:string|null; numero_version_vigente:number|null; revision:number; familia:Familia; item_comercial?:{id_item_comercial:number;nombre_item:string;estado_item:string}|null; producto_terminado?:{producto_terminado_id_producto:string;producto_terminado_codigo_producto:string|null;producto_terminado_nombre_producto:string|null;producto_terminado_activo:boolean|null}|null; versiones?:Version[]; historial?:Historial[] };
type Catalogos = { itemsTerreno:Array<{id_item_comercial:number;nombre_item:string;tipo_item:string|null;estado_item:string}>; productosInventario:Array<{producto_terminado_id_producto:string;producto_terminado_codigo_producto:string|null;producto_terminado_nombre_producto:string|null;producto_terminado_tipo_producto:string|null;producto_terminado_activo:boolean|null}> };
type Mensaje = {tipo:'ok'|'error';texto:string}|null;
type ModoProducto = 'crear'|'editar'|'consultar'|null;
type ModoFamilia = 'crear'|'editar'|'historial'|null;
type PestanaProducto = 'identificacion'|'caracteristicas'|'comercial'|'archivos'|'vinculos';

const tecnicos = [
  ['tipoEstructura','Tipo de estructura'], ['materialesPrincipales','Materiales principales'],
  ['revestimientos','Revestimientos'], ['terminaciones','Terminaciones'],
  ['cerradurasCompatibles','Cerraduras compatibles'], ['caracteristicasSeguridad','Características de seguridad'],
  ['dimensionesReferenciales','Dimensiones referenciales'], ['requisitosTecnicos','Requisitos técnicos'],
  ['opcionales','Opcionales'], ['observacionesTecnicas','Observaciones técnicas'],
] as const;

const crearProductoVacio = () => ({
  codigoComercial:'', nombreComercial:'', idFamilia:'', subfamilia:'', tipoProducto:'',
  descripcionGeneral:'', descripcionB2b:'', descripcionB2c:'', observaciones:'',
  garantiaReferencial:'', condicionesParticulares:'', caracteristicasDestacadas:'',
  caracteristicasTecnicas:Object.fromEntries(tecnicos.map(([clave])=>[clave,''])) as Record<string,string>,
});
type FormProducto = ReturnType<typeof crearProductoVacio>;

const input = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-[#FE8F01] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100';
const boton = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#FE8F01] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
const botonPrincipal = `${boton} bg-[#FE8F01] text-black hover:bg-orange-400`;
const botonSecundario = `${boton} border border-gray-300 bg-white text-black hover:bg-gray-50`;

async function api<T>(ruta:string, opciones?:RequestInit):Promise<T>{
  const respuesta=await solicitarFinanzas(ruta,opciones);
  const datos=await respuesta.json();
  if(!respuesta.ok)throw new Error(datos.error||'No fue posible completar la operación');
  return datos;
}
const cuerpo = (valor:unknown):RequestInit => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(valor)});
const fechaHoy = () => new Date().toISOString().slice(0,10);
const serializar = (valor:unknown) => JSON.stringify(valor);

export default function ProductosFamilias(){
  const {sesion}=usarSesion();
  const puede=(codigo:string)=>Boolean(sesion?.permisos.includes(codigo));
  const [seccion,setSeccion]=useState<'productos'|'familias'>('productos');
  const [familias,setFamilias]=useState<Familia[]>([]);
  const [productos,setProductos]=useState<Producto[]>([]);
  const [busqueda,setBusqueda]=useState('');
  const [busquedaFamilia,setBusquedaFamilia]=useState('');
  const [filtroEstado,setFiltroEstado]=useState('TODOS');
  const [filtroFamilia,setFiltroFamilia]=useState('');
  const [cargando,setCargando]=useState(true);
  const [ocupado,setOcupado]=useState(false);
  const [mensaje,setMensaje]=useState<Mensaje>(null);
  const [errorCarga,setErrorCarga]=useState<string|null>(null);
  const [mensajeModal,setMensajeModal]=useState<Mensaje>(null);
  const [modoProducto,setModoProducto]=useState<ModoProducto>(null);
  const [producto,setProducto]=useState<Producto|null>(null);
  const [formProducto,setFormProducto]=useState<FormProducto>(()=>crearProductoVacio());
  const [productoInicial,setProductoInicial]=useState('');
  const [pestanaProducto,setPestanaProducto]=useState<PestanaProducto>('identificacion');
  const [modoFamilia,setModoFamilia]=useState<ModoFamilia>(null);
  const [familiaSeleccionada,setFamiliaSeleccionada]=useState<Familia|null>(null);
  const [formFamilia,setFormFamilia]=useState({codigo:'',nombre:'',descripcion:''});
  const [familiaInicial,setFamiliaInicial]=useState('');
  const [familiaPlantilla,setFamiliaPlantilla]=useState<Familia|null>(null);
  const [catalogos,setCatalogos]=useState<Catalogos|null>(null);
  const [vinculo,setVinculo]=useState({idItemComercial:'',idProductoTerminado:''});
  const [vinculoInicial,setVinculoInicial]=useState('');
  const [publicacion,setPublicacion]=useState({vigenciaDesde:fechaHoy(),motivo:''});

  const cargar=useCallback(async(limpiarMensaje=true)=>{
    setCargando(true);
    if(limpiarMensaje)setMensaje(null);
    setErrorCarga(null);
    try {
      const [familiasRespuesta,productosRespuesta]=await Promise.all([
        api<Familia[]>('/mantenedores/familias-producto?estado=TODAS'),
        api<Producto[]>('/mantenedores/productos?estado=TODOS'),
      ]);
      setFamilias(familiasRespuesta);
      setProductos(productosRespuesta);
      return true;
    } catch(error) {
      setErrorCarga((error as Error).message);
      return false;
    } finally { setCargando(false); }
  },[]);

  useEffect(()=>{const temporizador=window.setTimeout(()=>void cargar(),0);return()=>window.clearTimeout(temporizador);},[cargar]);

  const cargarDetalle=async(id:number, historial=false)=>{
    const detalle=await api<Producto>(`/mantenedores/productos/${id}${historial?'/historial':''}`);
    const nuevosVinculos={idItemComercial:detalle.id_item_comercial?.toString()||'',idProductoTerminado:detalle.producto_terminado_id_producto||''};
    setProducto(detalle);setVinculo(nuevosVinculos);setVinculoInicial(serializar(nuevosVinculos));
    return detalle;
  };

  const ejecutar=async(accion:()=>Promise<unknown>,exito:string,opciones:{mensajeEnModal?:boolean;recargarDetalle?:boolean}={})=>{
    if(ocupado)return false;
    setOcupado(true);setMensajeModal(null);if(!opciones.mensajeEnModal)setMensaje(null);
    try{
      await accion();
      if(!await cargar(false))throw new Error('La operación fue confirmada, pero no fue posible actualizar el listado. Intenta recargar.');
      if(opciones.recargarDetalle&&producto)await cargarDetalle(producto.id_extension_producto_comercial,puede('CU367'));
      const confirmacion={tipo:'ok' as const,texto:exito};
      if(opciones.mensajeEnModal)setMensajeModal(confirmacion);else setMensaje(confirmacion);
      return true;
    }catch(error){
      const fallo={tipo:'error' as const,texto:(error as Error).message};
      if(opciones.mensajeEnModal)setMensajeModal(fallo);else setMensaje(fallo);
      return false;
    }finally{setOcupado(false);}
  };

  const abrirProducto=(actual?:Producto)=>{
    const formulario=actual?{
      codigoComercial:actual.codigo_comercial,nombreComercial:actual.nombre_comercial,idFamilia:String(actual.id_familia_producto_comercial),subfamilia:actual.subfamilia||'',tipoProducto:actual.tipo_producto||'',descripcionGeneral:actual.descripcion_general||'',descripcionB2b:actual.descripcion_b2b||'',descripcionB2c:actual.descripcion_b2c||'',observaciones:actual.observaciones||'',garantiaReferencial:actual.garantia_referencial||'',condicionesParticulares:actual.condiciones_particulares||'',caracteristicasDestacadas:(actual.caracteristicas_destacadas||[]).join('\n'),caracteristicasTecnicas:Object.fromEntries(tecnicos.map(([clave])=>[clave,actual.caracteristicas_tecnicas?.[clave]||''])),
    }:crearProductoVacio();
    setProducto(actual||null);setFormProducto(formulario);setProductoInicial(serializar(formulario));setPestanaProducto('identificacion');setMensajeModal(null);setModoProducto(actual?'editar':'crear');
  };

  const productoSucio=(modoProducto==='crear'||modoProducto==='editar')&&serializar(formProducto)!==productoInicial;
  const detalleSucio=modoProducto==='consultar'&&(serializar(vinculo)!==vinculoInicial||Boolean(publicacion.motivo.trim()));
  const cerrarProducto=async(forzar=false)=>{
    if(ocupado&&!forzar)return;
    if(!forzar&&(productoSucio||detalleSucio)&&!await confirmarAccion('Hay cambios sin guardar. ¿Quieres descartarlos?'))return;
    setModoProducto(null);setProducto(null);setMensajeModal(null);
  };

  const guardarProducto=async(evento:React.FormEvent)=>{
    evento.preventDefault();
    if(!formProducto.codigoComercial.trim()||!formProducto.nombreComercial.trim()||!formProducto.idFamilia){setPestanaProducto('identificacion');setMensajeModal({tipo:'error',texto:'Completa el código, nombre y familia en la sección Identificación.'});return;}
    const actual=producto;
    const payload={...formProducto,idFamilia:Number(formProducto.idFamilia),caracteristicasDestacadas:formProducto.caracteristicasDestacadas.split('\n').map(valor=>valor.trim()).filter(Boolean),caracteristicasTecnicas:formProducto.caracteristicasTecnicas,...(actual?{revision:actual.revision}:{})};
    const texto=actual?'Producto actualizado correctamente.':'Ficha comercial guardada.';
    const guardado=await ejecutar(()=>api(actual?`/mantenedores/productos/${actual.id_extension_producto_comercial}`:'/mantenedores/productos',{method:actual?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),texto,{mensajeEnModal:true});
    if(guardado){await cerrarProducto(true);setMensaje({tipo:'ok',texto});}
  };

  const abrirFamilia=(actual?:Familia)=>{
    const formulario=actual?{codigo:actual.codigo,nombre:actual.nombre,descripcion:actual.descripcion||''}:{codigo:'',nombre:'',descripcion:''};
    setFamiliaSeleccionada(actual||null);setFormFamilia(formulario);setFamiliaInicial(serializar(formulario));setMensajeModal(null);setModoFamilia(actual?'editar':'crear');
  };
  const familiaSucia=(modoFamilia==='crear'||modoFamilia==='editar')&&serializar(formFamilia)!==familiaInicial;
  const cerrarFamilia=async(forzar=false)=>{
    if(ocupado&&!forzar)return;
    if(!forzar&&familiaSucia&&!await confirmarAccion('Hay cambios sin guardar. ¿Quieres descartarlos?'))return;
    setModoFamilia(null);setFamiliaSeleccionada(null);setMensajeModal(null);
  };
  const guardarFamilia=async(evento:React.FormEvent)=>{
    evento.preventDefault();
    const actual=modoFamilia==='editar'?familiaSeleccionada:null;
    const texto=actual?'Familia actualizada correctamente.':'Familia creada correctamente.';
    const guardada=await ejecutar(()=>api(actual?`/mantenedores/familias-producto/${actual.id_familia_producto_comercial}`:'/mantenedores/familias-producto',{method:actual?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...formFamilia,...(actual?{revision:actual.revision}:{})})}),texto,{mensajeEnModal:true});
    if(guardada){await cerrarFamilia(true);setMensaje({tipo:'ok',texto});}
  };

  const abrirHistorialFamilia=async(familia:Familia)=>{try{setMensaje(null);const detalle=await api<Familia>(`/mantenedores/familias-producto/${familia.id_familia_producto_comercial}/historial`);setFamiliaSeleccionada(detalle);setModoFamilia('historial');}catch(error){setMensaje({tipo:'error',texto:(error as Error).message});}};
  const cambiarEstado=async(tipo:'producto'|'familia',actual:Producto|Familia,activar:boolean)=>{
    const motivo=await solicitarTexto(`Motivo para ${activar?'reactivar':'desactivar'} ${tipo==='producto'?'el producto':'la familia'}`);if(!motivo)return;
    if(!await confirmarAccion(`¿Confirmas ${activar?'reactivar':'desactivar'} este registro?`))return;
    const base=tipo==='producto'?'/mantenedores/productos':'/mantenedores/familias-producto';
    const id=tipo==='producto'?(actual as Producto).id_extension_producto_comercial:(actual as Familia).id_familia_producto_comercial;
    await ejecutar(()=>api(`${base}/${id}/${activar?'reactivar':'desactivar'}`,cuerpo({revision:actual.revision,motivo})),`Registro ${activar?'reactivado':'desactivado'} correctamente.`,{mensajeEnModal:tipo==='producto'&&modoProducto==='consultar',recargarDetalle:tipo==='producto'&&modoProducto==='consultar'});
  };
  const seleccionarProducto=async(id:number)=>{try{setMensaje(null);const detalle=await cargarDetalle(id,puede('CU367'));setProducto(detalle);setPublicacion({vigenciaDesde:fechaHoy(),motivo:''});setPestanaProducto('identificacion');setMensajeModal(null);setModoProducto('consultar');}catch(error){setMensaje({tipo:'error',texto:(error as Error).message});}};
  const prepararVinculos=async()=>{try{if(!catalogos)setCatalogos(await api<Catalogos>('/mantenedores/productos/catalogos-vinculacion'));}catch(error){setMensajeModal({tipo:'error',texto:(error as Error).message});}};
  const guardarVinculos=async()=>{
    if(!producto)return;const motivo=await solicitarTexto('Motivo del cambio de vinculaciones');if(!motivo)return;if(!await confirmarAccion('¿Confirmas la vinculación explícita por identificador?'))return;
    await ejecutar(()=>api(`/mantenedores/productos/${producto.id_extension_producto_comercial}/vinculaciones`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:producto.revision,idItemComercial:vinculo.idItemComercial||null,idProductoTerminado:vinculo.idProductoTerminado||null,motivo})}),'Vinculaciones actualizadas correctamente.',{mensajeEnModal:true,recargarDetalle:true});
  };
  const publicar=async()=>{
    if(!producto||!publicacion.motivo.trim()){setMensajeModal({tipo:'error',texto:'Indica el motivo de publicación.'});return;}
    if(!publicacion.vigenciaDesde){setMensajeModal({tipo:'error',texto:'Indica la fecha de vigencia.'});return;}
    if(!await confirmarAccion('¿Publicar una versión inmutable de esta ficha comercial?'))return;
    const correcto=await ejecutar(()=>api(`/mantenedores/productos/${producto.id_extension_producto_comercial}/versiones`,cuerpo({revision:producto.revision,...publicacion})),'Versión comercial publicada correctamente.',{mensajeEnModal:true,recargarDetalle:true});
    if(correcto)setPublicacion({vigenciaDesde:fechaHoy(),motivo:''});
  };

  const filtrados=useMemo(()=>productos.filter(actual=>(!busqueda||`${actual.codigo_comercial} ${actual.nombre_comercial}`.toLowerCase().includes(busqueda.toLowerCase()))&&(!filtroFamilia||String(actual.id_familia_producto_comercial)===filtroFamilia)&&(filtroEstado==='TODOS'||actual.estado===filtroEstado)),[productos,busqueda,filtroFamilia,filtroEstado]);
  const familiasFiltradas=useMemo(()=>familias.filter(actual=>!busquedaFamilia||`${actual.codigo} ${actual.nombre} ${actual.descripcion||''}`.toLowerCase().includes(busquedaFamilia.toLowerCase())),[familias,busquedaFamilia]);
  const familiasActivas=familias.filter(actual=>actual.estado==='ACTIVA');
  const filtrosProductoActivos=Boolean(busqueda||filtroFamilia||filtroEstado!=='TODOS');
  const abrirPrimeraFamilia=()=>{setSeccion('familias');abrirFamilia();};

  return <div className="min-h-full bg-gray-50 text-black"><div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
    <header className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link to="/mantenedores" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#676767] hover:text-black"><ArrowLeft className="h-4 w-4"/>Volver a Mantenedores</Link><h1 className="text-2xl font-black sm:text-3xl">Productos y familias</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#676767]">Administra fichas de presentación sin alterar los catálogos propietarios de Terreno e Inventario.</p></div><button className={`${botonSecundario} text-[#676767] hover:border-[#FE8F01]`} onClick={()=>void cargar()} disabled={cargando}><RefreshCw className={`h-4 w-4 ${cargando?'animate-spin':''}`}/>Recargar</button></div></header>
    {mensaje&&<MensajeEstado mensaje={mensaje}/>}
    {errorCarga&&<div role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-sm font-semibold text-red-900"><p>No fue posible cargar la información.</p><p className="mt-1 font-normal">{errorCarga}</p></div>}
    <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm" aria-label="Secciones del mantenedor"><button onClick={()=>setSeccion('productos')} className={`${boton} ${seccion==='productos'?'bg-[#FE8F01] text-black':'text-[#676767] hover:bg-gray-100'}`}><Boxes className="h-4 w-4"/>Productos</button><button onClick={()=>setSeccion('familias')} className={`${boton} ${seccion==='familias'?'bg-[#FE8F01] text-black':'text-[#676767] hover:bg-gray-100'}`}><Tags className="h-4 w-4"/>Familias</button></nav>

    {seccion==='productos'?<section className="space-y-4"><div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px_auto]"><input className={input} placeholder="Buscar por código o nombre" aria-label="Buscar productos" value={busqueda} onChange={evento=>setBusqueda(evento.target.value)}/><select className={input} aria-label="Filtrar por familia" value={filtroFamilia} onChange={evento=>setFiltroFamilia(evento.target.value)}><option value="">Todas las familias</option>{familias.map(familia=><option key={familia.id_familia_producto_comercial} value={familia.id_familia_producto_comercial}>{familia.nombre}</option>)}</select><select className={input} aria-label="Filtrar por estado" value={filtroEstado} onChange={evento=>setFiltroEstado(evento.target.value)}><option>TODOS</option><option>BORRADOR</option><option>VINCULADO</option><option>INACTIVO</option></select>{puede('CU361')&&<button className={botonPrincipal} onClick={()=>abrirProducto()} disabled={!familiasActivas.length}><PackagePlus className="h-4 w-4"/>Nueva ficha</button>}</div>
      {!cargando&&!errorCarga&&!familiasActivas.length&&<EstadoVacio titulo="Necesitas una familia activa antes de crear productos" descripcion="Crea o reactiva una familia comercial para poder registrar una nueva ficha." accion={puede('CU361')?<button className={botonPrincipal} onClick={abrirPrimeraFamilia}><Plus className="h-4 w-4"/>Crear familia</button>:undefined}/>}
      {cargando&&<EstadoVacio titulo="Cargando fichas comerciales…" descripcion="Estamos consultando el catálogo disponible."/>}
      {!cargando&&!errorCarga&&filtrados.length>0&&<div className="overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-[#676767] text-white"><tr>{['Código','Producto','Familia','Estado','Vínculo operativo','Versión',''].map(titulo=><th key={titulo} className="px-4 py-3 font-bold">{titulo}</th>)}</tr></thead><tbody>{filtrados.map(actual=><tr key={actual.id_extension_producto_comercial} className="border-t border-gray-200 hover:bg-orange-50/40"><td className="px-4 py-3 font-mono font-bold">{actual.codigo_comercial}</td><td className="px-4 py-3"><p className="font-bold text-black">{actual.nombre_comercial}</p><p className="text-xs text-[#676767]">{actual.tipo_producto||'Sin tipo'}</p></td><td className="px-4 py-3">{actual.familia.nombre}</td><td className="px-4 py-3"><Estado valor={actual.estado}/></td><td className="px-4 py-3">{actual.item_comercial?<span className="font-semibold">#{actual.id_item_comercial} · {actual.item_comercial.nombre_item}</span>:<span className="text-[#676767]">Sin vínculo · no cotizable</span>}</td><td className="px-4 py-3">{actual.numero_version_vigente?`v${actual.numero_version_vigente}`:'Sin publicar'}</td><td className="px-4 py-3"><button className="inline-flex items-center gap-1 font-bold text-[#b85e00]" onClick={()=>void seleccionarProducto(actual.id_extension_producto_comercial)}>Ver ficha<ChevronRight className="h-4 w-4"/></button></td></tr>)}</tbody></table></div>}
      {!cargando&&!errorCarga&&!filtrados.length&&familiasActivas.length>0&&<EstadoVacio titulo={productos.length&&filtrosProductoActivos?'No hay productos que coincidan con los filtros seleccionados.':'Aún no hay fichas comerciales registradas.'} descripcion={productos.length&&filtrosProductoActivos?'Ajusta la búsqueda, familia o estado para ampliar los resultados.':'Crea la primera ficha comercial para comenzar a administrar tu catálogo.'} accion={!productos.length&&puede('CU361')?<button className={botonPrincipal} onClick={()=>abrirProducto()}><PackagePlus className="h-4 w-4"/>Crear primera ficha</button>:undefined}/>}
    </section>:<section className="space-y-4"><div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><input className={`${input} sm:max-w-md`} aria-label="Buscar familias" placeholder="Buscar familias por código o nombre" value={busquedaFamilia} onChange={evento=>setBusquedaFamilia(evento.target.value)}/>{puede('CU361')&&<button className={botonPrincipal} onClick={()=>abrirFamilia()}><Plus className="h-4 w-4"/>Nueva familia</button>}</div>
      {cargando&&<EstadoVacio titulo="Cargando familias comerciales…" descripcion="Estamos consultando las familias disponibles."/>}
      {!cargando&&!errorCarga&&familiasFiltradas.length>0&&<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{familiasFiltradas.map(familia=><article key={familia.id_familia_producto_comercial} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-[#676767]">{familia.codigo}</p><h2 className="mt-1 text-lg font-black text-black">{familia.nombre}</h2></div><Estado valor={familia.estado}/></div><p className="mt-3 min-h-10 text-sm text-[#676767]">{familia.descripcion||'Sin descripción'}</p><p className="mt-4 text-xs font-bold text-[#676767]">{familia._count?.productos||0} productos asociados</p><div className="mt-5 flex flex-wrap gap-2"><button className={`${boton} border border-[#FE8F01] text-black`} onClick={()=>setFamiliaPlantilla(familia)}>Plantilla de fabricación</button>{puede('CU362')&&<button className={botonSecundario} onClick={()=>abrirFamilia(familia)}>Editar</button>}{familia.estado==='ACTIVA'&&puede('CU363')&&<button className={`${botonSecundario} text-[#676767]`} onClick={()=>void cambiarEstado('familia',familia,false)}>Desactivar</button>}{familia.estado==='INACTIVA'&&puede('CU364')&&<button className={`${boton} border border-[#FE8F01] text-black`} onClick={()=>void cambiarEstado('familia',familia,true)}>Reactivar</button>}{puede('CU367')&&<button className={`${boton} text-[#b85e00]`} onClick={()=>void abrirHistorialFamilia(familia)}><History className="h-4 w-4"/>Historial</button>}</div></article>)}</div>}
      {!cargando&&!errorCarga&&!familiasFiltradas.length&&<EstadoVacio titulo={familias.length?'No hay familias que coincidan con la búsqueda.':'Aún no hay familias comerciales registradas'} descripcion={familias.length?'Prueba con otro código, nombre o descripción.':'Crea la primera familia para comenzar a organizar tus productos.'} accion={!familias.length&&puede('CU361')?<button className={botonPrincipal} onClick={()=>abrirFamilia()}><Plus className="h-4 w-4"/>Crear primera familia</button>:undefined} nota={!familias.length&&!puede('CU361')?'No tienes permiso para crear familias. Solicita acceso a un administrador.':undefined}/>}
    </section>}
  </div>

  {(modoProducto==='crear'||modoProducto==='editar')&&<ModalFormulario titulo={modoProducto==='crear'?'Nueva ficha comercial':'Editar ficha comercial'} subtitulo={modoProducto==='crear'?'La ficha se guardará inicialmente como borrador no cotizable.':producto?.nombre_comercial} tamano="grande" cerrar={()=>void cerrarProducto()} cierreBloqueado={ocupado} pie={<div className="flex flex-wrap justify-end gap-3"><button type="button" className={botonSecundario} onClick={()=>void cerrarProducto()} disabled={ocupado}>Cancelar</button><button type="submit" form="formulario-producto" disabled={ocupado} className={botonPrincipal}><Save className="h-4 w-4"/>{ocupado?'Guardando…':modoProducto==='crear'?'Guardar borrador':'Guardar cambios'}</button></div>}>
    <form id="formulario-producto" onSubmit={guardarProducto} className="space-y-5">{mensajeModal&&<MensajeEstado mensaje={mensajeModal}/>}<PestanasProducto activa={pestanaProducto} cambiar={setPestanaProducto} incluirVinculos={false}/>
      {pestanaProducto==='identificacion'&&<Seccion titulo="Identificación"><div className="grid gap-4 sm:grid-cols-2"><Campo etiqueta="Código comercial *"><input data-autofocus required className={input} value={formProducto.codigoComercial} onChange={evento=>setFormProducto({...formProducto,codigoComercial:evento.target.value.toUpperCase()})}/></Campo><Campo etiqueta="Nombre comercial *"><input required className={input} value={formProducto.nombreComercial} onChange={evento=>setFormProducto({...formProducto,nombreComercial:evento.target.value})}/></Campo><Campo etiqueta="Familia *"><select required className={input} value={formProducto.idFamilia} onChange={evento=>setFormProducto({...formProducto,idFamilia:evento.target.value})}><option value="">Selecciona</option>{familiasActivas.map(familia=><option key={familia.id_familia_producto_comercial} value={familia.id_familia_producto_comercial}>{familia.nombre}</option>)}</select></Campo><Campo etiqueta="Subfamilia"><input className={input} value={formProducto.subfamilia} onChange={evento=>setFormProducto({...formProducto,subfamilia:evento.target.value})}/></Campo><Campo etiqueta="Tipo de producto"><input className={input} value={formProducto.tipoProducto} onChange={evento=>setFormProducto({...formProducto,tipoProducto:evento.target.value})}/></Campo></div></Seccion>}
      {pestanaProducto==='caracteristicas'&&<Seccion titulo="Características del modelo"><p className="mb-4 text-xs text-[#676767]">Las medidas particulares de una unidad se definen en cada Cotización y no modifican esta ficha maestra.</p><div className="grid gap-4 sm:grid-cols-2">{tecnicos.map(([clave,etiqueta])=><Campo key={clave} etiqueta={etiqueta}><textarea rows={2} className={input} value={formProducto.caracteristicasTecnicas[clave]} onChange={evento=>setFormProducto({...formProducto,caracteristicasTecnicas:{...formProducto.caracteristicasTecnicas,[clave]:evento.target.value}})}/></Campo>)}</div></Seccion>}
      {pestanaProducto==='comercial'&&<Seccion titulo="Información comercial"><div className="grid gap-4"><Campo etiqueta="Descripción general"><textarea rows={3} className={input} value={formProducto.descripcionGeneral} onChange={evento=>setFormProducto({...formProducto,descripcionGeneral:evento.target.value})}/></Campo><div className="grid gap-4 sm:grid-cols-2"><Campo etiqueta="Descripción B2B"><textarea rows={4} className={input} value={formProducto.descripcionB2b} onChange={evento=>setFormProducto({...formProducto,descripcionB2b:evento.target.value})}/></Campo><Campo etiqueta="Descripción B2C"><textarea rows={4} className={input} value={formProducto.descripcionB2c} onChange={evento=>setFormProducto({...formProducto,descripcionB2c:evento.target.value})}/></Campo></div><Campo etiqueta="Características destacadas (una por línea)"><textarea rows={4} className={input} value={formProducto.caracteristicasDestacadas} onChange={evento=>setFormProducto({...formProducto,caracteristicasDestacadas:evento.target.value})}/></Campo><div className="grid gap-4 sm:grid-cols-2"><Campo etiqueta="Garantía referencial"><textarea rows={3} className={input} value={formProducto.garantiaReferencial} onChange={evento=>setFormProducto({...formProducto,garantiaReferencial:evento.target.value})}/></Campo><Campo etiqueta="Condiciones particulares"><textarea rows={3} className={input} value={formProducto.condicionesParticulares} onChange={evento=>setFormProducto({...formProducto,condicionesParticulares:evento.target.value})}/></Campo></div><Campo etiqueta="Observaciones"><textarea rows={3} className={input} value={formProducto.observaciones} onChange={evento=>setFormProducto({...formProducto,observaciones:evento.target.value})}/></Campo></div></Seccion>}
      {pestanaProducto==='archivos'&&<Seccion titulo="Imágenes y documentos"><PanelDocumentosProductoConectado modo={modoProducto} productoId={producto?.id_extension_producto_comercial}/></Seccion>}
    </form>
  </ModalFormulario>}

  {modoProducto==='consultar'&&producto&&<ModalFormulario titulo="Ficha comercial" subtitulo={`${producto.codigo_comercial} · ${producto.nombre_comercial}`} tamano="grande" cerrar={()=>void cerrarProducto()} cierreBloqueado={ocupado} pie={<div className="flex flex-wrap items-center justify-end gap-3"><button className={botonSecundario} onClick={()=>void cerrarProducto()} disabled={ocupado}>Cerrar</button>{puede('CU362')&&producto.estado!=='INACTIVO'&&<button className={botonPrincipal} onClick={()=>abrirProducto(producto)}><Save className="h-4 w-4"/>Editar ficha</button>}{producto.estado!=='INACTIVO'&&puede('CU363')&&<button className={`${botonSecundario} text-[#676767]`} onClick={()=>void cambiarEstado('producto',producto,false)}><CircleOff className="h-4 w-4"/>Desactivar</button>}{producto.estado==='INACTIVO'&&puede('CU364')&&<button className={`${boton} border border-[#FE8F01] text-black`} onClick={()=>void cambiarEstado('producto',producto,true)}>Reactivar</button>}</div>}>
    <div className="space-y-5">{mensajeModal&&<MensajeEstado mensaje={mensajeModal}/>}<div className="flex flex-wrap items-center gap-3"><Estado valor={producto.estado}/><span className="font-mono text-sm font-bold">{producto.codigo_comercial}</span><span className="text-sm text-[#676767]">{producto.familia.nombre}</span></div><PestanasProducto activa={pestanaProducto} cambiar={setPestanaProducto} incluirVinculos/>
      {pestanaProducto==='identificacion'&&<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Dato titulo="Nombre" valor={producto.nombre_comercial}/><Dato titulo="Familia" valor={producto.familia.nombre}/><Dato titulo="Tipo" valor={producto.tipo_producto}/><Dato titulo="Subfamilia" valor={producto.subfamilia}/><Dato titulo="Estado" valor={producto.estado}/><Dato titulo="Versión vigente" valor={producto.numero_version_vigente?`v${producto.numero_version_vigente}`:'Sin publicar'}/></div>}
      {pestanaProducto==='caracteristicas'&&<Seccion titulo="Características del modelo"><div className="grid gap-3 sm:grid-cols-2">{tecnicos.map(([clave,etiqueta])=><Dato key={clave} titulo={etiqueta} valor={producto.caracteristicas_tecnicas?.[clave]}/>)}</div></Seccion>}
      {pestanaProducto==='comercial'&&<div className="space-y-6"><Seccion titulo="Descripciones"><div className="grid gap-4 lg:grid-cols-3"><Texto titulo="General" valor={producto.descripcion_general}/><Texto titulo="B2B" valor={producto.descripcion_b2b}/><Texto titulo="B2C" valor={producto.descripcion_b2c}/></div></Seccion><div className="grid gap-4 sm:grid-cols-2"><Dato titulo="Garantía referencial" valor={producto.garantia_referencial}/><Dato titulo="Condiciones particulares" valor={producto.condiciones_particulares}/><Dato titulo="Características destacadas" valor={producto.caracteristicas_destacadas?.join('\n')}/><Dato titulo="Observaciones" valor={producto.observaciones}/></div><div className="rounded-xl border border-orange-200 bg-orange-50 p-4"><h4 className="font-black text-black">Catálogo comercial vinculado</h4><p className="mt-1 text-sm text-[#676767]">Consulta precios de lista, opcionales compatibles y sus versiones mediante el identificador estable de esta ficha.</p><Link to={`/mantenedores/comercial?seccion=precios&producto=${producto.id_extension_producto_comercial}`} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#FE8F01] bg-white px-4 py-2 text-sm font-bold text-black hover:bg-orange-100"><CircleDollarSign className="h-4 w-4"/>Ver precios y opcionales</Link></div></div>}
      {pestanaProducto==='archivos'&&<Seccion titulo="Imágenes y documentos"><PanelDocumentosProductoConectado modo="consultar" productoId={producto.id_extension_producto_comercial}/></Seccion>}
      {pestanaProducto==='vinculos'&&<div className="space-y-7"><Seccion titulo="Vinculaciones"><div className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-[#676767]">La ficha sólo se considera vinculada para futura integración comercial cuando posee un ítem activo de Terreno. Este bloque no modifica el flujo actual de cotizaciones.</div>{puede('CU366')?<div className="grid gap-4 md:grid-cols-2"><Campo etiqueta="Ítem comercial de Terreno"><select className={input} value={vinculo.idItemComercial} onFocus={()=>void prepararVinculos()} onChange={evento=>setVinculo({...vinculo,idItemComercial:evento.target.value})}><option value="">Sin vínculo operativo</option>{catalogos?.itemsTerreno.map(item=><option key={item.id_item_comercial} value={item.id_item_comercial} disabled={item.estado_item!=='activo'}>#{item.id_item_comercial} · {item.nombre_item} ({item.estado_item})</option>)}</select></Campo><Campo etiqueta="Producto terminado de Inventario (opcional)"><select className={input} value={vinculo.idProductoTerminado} onFocus={()=>void prepararVinculos()} onChange={evento=>setVinculo({...vinculo,idProductoTerminado:evento.target.value})}><option value="">Sin vínculo técnico</option>{catalogos?.productosInventario.map(item=><option key={item.producto_terminado_id_producto} value={item.producto_terminado_id_producto} disabled={item.producto_terminado_activo===false}>{item.producto_terminado_codigo_producto||`#${item.producto_terminado_id_producto}`} · {item.producto_terminado_nombre_producto||'Sin nombre'}</option>)}</select></Campo><div className="md:col-span-2"><button disabled={ocupado||serializar(vinculo)===vinculoInicial} className={botonPrincipal} onClick={()=>void guardarVinculos()}><Link2 className="h-4 w-4"/>Guardar vínculos</button></div></div>:<p className="text-sm text-[#676767]">No tienes permiso para administrar vinculaciones.</p>}</Seccion>
        <Seccion titulo="Versiones e historial"><div className="grid gap-5 lg:grid-cols-2"><div><h4 className="mb-3 font-black">Versiones publicadas</h4><div className="space-y-2">{producto.versiones?.map(version=><div key={version.id_producto_comercial_version} className="rounded-lg border border-gray-200 p-3 text-sm"><p className="font-bold">Versión {version.numero_version} · {new Date(version.vigencia_desde).toLocaleDateString('es-CL')}</p><p className="mt-1 text-[#676767]">{version.motivo}</p></div>)}{!producto.versiones?.length&&<p className="text-sm text-[#676767]">Aún no existen versiones publicadas.</p>}</div></div>{puede('CU365')&&<div className="rounded-lg border border-gray-200 p-4"><h4 className="font-black">Publicar nueva versión</h4><p className="mt-1 text-xs text-[#676767]">La versión será inmutable y conservará una copia completa de la ficha.</p><div className="mt-4 space-y-3"><Campo etiqueta="Vigencia desde"><input type="date" className={input} value={publicacion.vigenciaDesde} onChange={evento=>setPublicacion({...publicacion,vigenciaDesde:evento.target.value})}/></Campo><Campo etiqueta="Motivo"><textarea className={input} rows={3} value={publicacion.motivo} onChange={evento=>setPublicacion({...publicacion,motivo:evento.target.value})}/></Campo><button disabled={ocupado||producto.estado!=='VINCULADO'} className={botonPrincipal} onClick={()=>void publicar()}><Send className="h-4 w-4"/>Publicar versión</button></div></div>}</div>{puede('CU367')&&<div className="mt-5"><h4 className="mb-3 font-black">Historial de modificaciones</h4><div className="max-h-64 space-y-2 overflow-y-auto">{producto.historial?.map((evento,indice)=><div key={`${evento.fecha_evento}-${indice}`} className="border-l-2 border-[#FE8F01] pl-3 text-sm"><p className="font-bold">{evento.evento.replaceAll('_',' ')}</p><p className="text-xs text-[#676767]">{new Date(evento.fecha_evento).toLocaleString('es-CL')} · {evento.usuario?.usuario_username||'Usuario registrado'}</p>{evento.motivo&&<p className="mt-1">{evento.motivo}</p>}</div>)}</div></div>}</Seccion>
      </div>}
    </div>
  </ModalFormulario>}

  {modoFamilia&&<ModalFormulario titulo={modoFamilia==='crear'?'Nueva familia':modoFamilia==='editar'?'Editar familia':'Historial de familia'} subtitulo={modoFamilia==='historial'&&familiaSeleccionada?`${familiaSeleccionada.codigo} · ${familiaSeleccionada.nombre}`:modoFamilia==='crear'?'Crea una categoría para organizar las fichas comerciales.':'Actualiza los datos administrativos de la familia.'} tamano={modoFamilia==='historial'?'grande':'mediano'} cerrar={()=>void cerrarFamilia()} cierreBloqueado={ocupado} pie={modoFamilia==='historial'?<div className="flex justify-end"><button className={botonSecundario} onClick={()=>void cerrarFamilia()}>Cerrar</button></div>:<div className="flex flex-wrap justify-end gap-3"><button type="button" className={botonSecundario} onClick={()=>void cerrarFamilia()} disabled={ocupado}>Cancelar</button><button type="submit" form="formulario-familia" disabled={ocupado} className={botonPrincipal}><Save className="h-4 w-4"/>{ocupado?'Guardando…':modoFamilia==='crear'?'Guardar familia':'Guardar cambios'}</button></div>}>
    {mensajeModal&&<MensajeEstado mensaje={mensajeModal}/>}
    {modoFamilia==='historial'&&familiaSeleccionada?<div className="space-y-6"><Seccion titulo="Productos asociados"><div className="space-y-2">{familiaSeleccionada.productos?.map(asociado=><div key={asociado.id_extension_producto_comercial} className="flex flex-wrap justify-between gap-2 border-b py-2 text-sm"><span>{asociado.codigo_comercial} · {asociado.nombre_comercial}</span><Estado valor={asociado.estado}/></div>)}{!familiaSeleccionada.productos?.length&&<p className="text-sm text-[#676767]">Sin productos asociados.</p>}</div></Seccion><Seccion titulo="Modificaciones"><div className="space-y-3">{familiaSeleccionada.historial?.map((evento,indice)=><div key={`${evento.fecha_evento}-${indice}`} className="border-l-2 border-[#FE8F01] pl-3"><p className="font-bold">{evento.evento}</p><p className="text-xs text-[#676767]">{new Date(evento.fecha_evento).toLocaleString('es-CL')}</p><p className="text-sm">{evento.motivo||'Sin motivo adicional'}</p></div>)}</div></Seccion></div>:<form id="formulario-familia" onSubmit={guardarFamilia} className="space-y-4"><Campo etiqueta="Código único *"><input data-autofocus required className={input} value={formFamilia.codigo} onChange={evento=>setFormFamilia({...formFamilia,codigo:evento.target.value.toUpperCase()})}/></Campo><Campo etiqueta="Nombre *"><input required className={input} value={formFamilia.nombre} onChange={evento=>setFormFamilia({...formFamilia,nombre:evento.target.value})}/></Campo><Campo etiqueta="Descripción"><textarea rows={4} className={input} value={formFamilia.descripcion} onChange={evento=>setFormFamilia({...formFamilia,descripcion:evento.target.value})}/></Campo></form>}
  </ModalFormulario>}
  {familiaPlantilla&&<PlantillaFabricacionFamilia familia={familiaPlantilla} cerrar={()=>setFamiliaPlantilla(null)} puedeEditar={puede('CU362')} puedePublicar={puede('CU365')} puedeHistorial={puede('CU367')}/>}
  </div>;
}

function PestanasProducto({activa,cambiar,incluirVinculos}:{activa:PestanaProducto;cambiar:(pestana:PestanaProducto)=>void;incluirVinculos:boolean}){const pestanas:Array<[PestanaProducto,string]>=[['identificacion','Identificación'],['caracteristicas','Características'],['comercial','Información comercial'],['archivos','Imágenes y documentos']];if(incluirVinculos)pestanas.push(['vinculos','Vinculaciones e historial']);return <div className="flex gap-1 overflow-x-auto border-b border-gray-200" role="tablist" aria-label="Secciones de la ficha comercial">{pestanas.map(([clave,etiqueta])=><button key={clave} type="button" role="tab" aria-selected={activa===clave} onClick={()=>cambiar(clave)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold ${activa===clave?'border-[#FE8F01] text-black':'border-transparent text-[#676767] hover:text-black'}`}>{etiqueta}</button>)}</div>}
function MensajeEstado({mensaje}:{mensaje:NonNullable<Mensaje>}){return <div role={mensaje.tipo==='error'?'alert':'status'} className={`border-l-4 p-4 text-sm font-semibold ${mensaje.tipo==='ok'?'border-emerald-500 bg-emerald-50 text-emerald-900':'border-red-500 bg-red-50 text-red-900'}`}>{mensaje.texto}</div>}
function EstadoVacio({titulo,descripcion,accion,nota}:{titulo:string;descripcion:string;accion?:React.ReactNode;nota?:string}){return <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center shadow-sm"><Boxes className="mx-auto h-9 w-9 text-[#FE8F01]"/><h2 className="mt-4 text-lg font-black text-black">{titulo}</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#676767]">{descripcion}</p>{accion&&<div className="mt-5 flex justify-center">{accion}</div>}{nota&&<p className="mt-4 text-sm font-semibold text-[#676767]">{nota}</p>}</div>}
function Estado({valor}:{valor:string}){const estilo=valor==='VINCULADO'||valor==='ACTIVA'?'border-emerald-200 bg-emerald-50 text-emerald-800':valor==='INACTIVO'||valor==='INACTIVA'?'border-gray-200 bg-gray-100 text-[#676767]':'border-orange-200 bg-orange-50 text-[#8a4700]';return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${estilo}`}>{valor}</span>}
function Seccion({titulo,children}:{titulo:string;children:React.ReactNode}){return <section><h3 className="mb-3 border-b border-gray-200 pb-2 text-base font-black text-black">{titulo}</h3>{children}</section>}
function Campo({etiqueta,children}:{etiqueta:string;children:React.ReactNode}){return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#676767]">{etiqueta}</span>{children}</label>}
function Dato({titulo,valor}:{titulo:string;valor:unknown}){return <div className="rounded-lg border border-gray-200 p-3"><p className="text-xs font-bold uppercase text-[#676767]">{titulo}</p><p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-black">{String(valor||'Sin información')}</p></div>}
function Texto({titulo,valor}:{titulo:string;valor:string|null}){return <div><p className="text-xs font-bold uppercase text-[#676767]">{titulo}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black">{valor||'Sin descripción configurada.'}</p></div>}
