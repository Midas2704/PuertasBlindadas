import { ArrowLeft, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InventarioPendiente() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5"><section className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12"><span className="mx-auto inline-flex rounded-2xl bg-gray-100 p-4 text-[#676767]"><Boxes className="h-10 w-10"/></span><h1 className="mt-6 text-2xl font-black">Inventario</h1><p className="mt-3 text-[#676767]">Acceso a Inventario pendiente de configuración.</p><Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-bold text-white"><ArrowLeft className="h-4 w-4"/>Volver al portal</Link></section></main>;
}
