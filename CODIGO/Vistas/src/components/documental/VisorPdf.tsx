import {useEffect,useRef,useState} from 'react';
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist';
import WorkerPdf from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

GlobalWorkerOptions.workerPort=new WorkerPdf();

function decodificarPdf(contenido:string){
 const [,base64='']=contenido.split(',');
 if(!base64)throw new Error('El contenido PDF no es válido.');
 const binario=atob(base64),bytes=new Uint8Array(binario.length);
 for(let i=0;i<binario.length;i+=1)bytes[i]=binario.charCodeAt(i);
 return bytes;
}

function PaginaPdf({documento,numero}:{documento:PDFDocumentProxy;numero:number}){
 const lienzo=useRef<HTMLCanvasElement>(null),[error,setError]=useState('');
 useEffect(()=>{
  let activa=true,tarea:{cancel:()=>void}|undefined;
  const renderizar=async()=>{
   try{
    const pagina:PDFPageProxy=await documento.getPage(numero),canvas=lienzo.current;
    if(!activa||!canvas)return;
    const viewport=pagina.getViewport({scale:1.6}),contexto=canvas.getContext('2d');
    if(!contexto)throw new Error('El navegador no permite dibujar el PDF.');
    canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    tarea=pagina.render({canvas,canvasContext:contexto,viewport});
    await (tarea as ReturnType<PDFPageProxy['render']>).promise;
   }catch(e){if(activa&&!(e instanceof Error&&e.name==='RenderingCancelledException'))setError(e instanceof Error?e.message:'No fue posible renderizar la página.');}
  };
  void renderizar();
  return()=>{activa=false;tarea?.cancel()};
 },[documento,numero]);
 return <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow" aria-label={`Página ${numero}`}>
  {error?<p className="p-6 text-center text-sm text-red-700">{error}</p>:<canvas ref={lienzo} className="block h-auto w-full"/>}
 </article>;
}

export default function VisorPdf({contenido}:{contenido:string}){
 const [documento,setDocumento]=useState<PDFDocumentProxy|null>(null),[error,setError]=useState('');
 useEffect(()=>{
  let activa=true;
  const tarea=getDocument({data:decodificarPdf(contenido)});
  tarea.promise.then(resultado=>{if(activa)setDocumento(resultado);else void resultado.destroy()}).catch(e=>{if(activa)setError(e instanceof Error?e.message:'No fue posible abrir el PDF.')});
  return()=>{activa=false;void tarea.destroy()};
 },[contenido]);
 return <section data-testid="visor-pdf-renderizado" className="h-[65vh] min-h-[28rem] overflow-auto rounded-lg border bg-gray-100 p-3" aria-label="Vista previa PDF">
  {error?<div className="flex min-h-full items-center justify-center p-6 text-center text-sm text-red-700">No fue posible mostrar el PDF: {error}</div>:documento?<div className="space-y-4">{Array.from({length:documento.numPages},(_,i)=><PaginaPdf key={i+1} documento={documento} numero={i+1}/>)}</div>:<div className="flex min-h-full items-center justify-center text-sm font-semibold text-[#676767]">Cargando vista previa…</div>}
 </section>;
}
