import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

type TamanoModal = 'pequeno' | 'mediano' | 'grande';

type PropiedadesModalFormulario = {
  titulo: string;
  subtitulo?: string;
  tamano?: TamanoModal;
  cerrar: () => void;
  cierreBloqueado?: boolean;
  children: ReactNode;
  pie?: ReactNode;
};

const anchos: Record<TamanoModal, string> = {
  pequeno: 'max-w-md',
  mediano: 'max-w-2xl',
  grande: 'max-w-6xl',
};

const elementosEnfocables = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function ModalFormulario({
  titulo,
  subtitulo,
  tamano = 'mediano',
  cerrar,
  cierreBloqueado = false,
  children,
  pie,
}: PropiedadesModalFormulario) {
  const idTitulo = useId();
  const idSubtitulo = useId();
  const dialogoRef = useRef<HTMLDivElement>(null);
  const focoAnteriorRef = useRef<HTMLElement | null>(null);
  const cerrarRef = useRef(cerrar);
  const bloqueadoRef = useRef(cierreBloqueado);

  useEffect(() => { cerrarRef.current = cerrar; }, [cerrar]);
  useEffect(() => { bloqueadoRef.current = cierreBloqueado; }, [cierreBloqueado]);

  useEffect(() => {
    focoAnteriorRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialogo = dialogoRef.current;
    const enfocar = window.requestAnimationFrame(() => {
      const preferido = dialogo?.querySelector<HTMLElement>('[data-autofocus], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
      (preferido || dialogo)?.focus();
    });

    const manejarTeclado = (evento: KeyboardEvent) => {
      const actual = dialogoRef.current;
      if (!actual) return;
      const dialogoActivo = document.activeElement instanceof Element
        ? document.activeElement.closest('[role="dialog"][aria-modal="true"]')
        : null;
      if (dialogoActivo && dialogoActivo !== actual) return;
      if (evento.key === 'Escape') {
        evento.preventDefault();
        if (!bloqueadoRef.current) cerrarRef.current();
        return;
      }
      if (evento.key !== 'Tab') return;
      const enfocables = Array.from(actual.querySelectorAll<HTMLElement>(elementosEnfocables))
        .filter(elemento => elemento.offsetParent !== null);
      if (!enfocables.length) {
        evento.preventDefault();
        actual.focus();
        return;
      }
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', manejarTeclado);
    return () => {
      window.cancelAnimationFrame(enfocar);
      document.removeEventListener('keydown', manejarTeclado);
      document.body.style.overflow = overflowAnterior;
      focoAnteriorRef.current?.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/50 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={evento => {
        if (evento.target === evento.currentTarget && !cierreBloqueado) cerrar();
      }}
    >
      <div
        ref={dialogoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={subtitulo ? idSubtitulo : undefined}
        tabIndex={-1}
        className={`flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:max-h-[90vh] ${anchos[tamano]}`}
        onMouseDown={evento => evento.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={idTitulo} className="text-xl font-black text-black">{titulo}</h2>
            {subtitulo && <p id={idSubtitulo} className="mt-1 text-sm leading-5 text-[#676767]">{subtitulo}</p>}
          </div>
          <button
            type="button"
            aria-label={`Cerrar ${titulo}`}
            onClick={cerrar}
            disabled={cierreBloqueado}
            className="shrink-0 rounded-lg p-2 text-[#676767] transition hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FE8F01] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
        {pie && <footer className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">{pie}</footer>}
      </div>
    </div>
  );
}
