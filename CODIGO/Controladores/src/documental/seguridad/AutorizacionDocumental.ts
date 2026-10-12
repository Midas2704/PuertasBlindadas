import { ErrorDocumental } from '../tipos';

export type AccionDocumental = 'CONSULTAR_METADATA' | 'CONSULTAR_HISTORIAL' | 'ASOCIAR_PRODUCTO' | 'CREAR_INTENCION' | 'CONFIRMAR_CARGA' | 'DESCARGAR' | 'REEMPLAZAR' | 'ARCHIVAR' | 'GESTIONAR_CUARENTENA' | 'ADMINISTRAR_CONSERVACION';

export interface ActorBackendDocumental {
  id: bigint;
  sesion: string;
  permisos: readonly string[];
  administrador: boolean;
  alcanceEmpleadoId?: number | null;
}

export interface ContextoAutorizacionDocumental {
  idDocumento?: bigint;
  idProducto?: number;
  usuarioSolicitante?: bigint;
}

export type VerificadorAlcanceDocumental = (actor: ActorBackendDocumental, contexto: ContextoAutorizacionDocumental) => Promise<boolean>;

const PERMISOS_APROBADOS_POR_ACCION: Partial<Record<AccionDocumental, string>> = {
  CONSULTAR_METADATA: 'CU360',
  CONSULTAR_HISTORIAL: 'CU367',
  ASOCIAR_PRODUCTO: 'CU366',
};

/** Usa exclusivamente CU ya existentes. Las acciones sin CU aprobada se cierran por defecto. */
export class AutorizadorDocumental {
  constructor(private readonly verificarAlcance: VerificadorAlcanceDocumental) {}

  async exigir(actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDocumental): Promise<void> {
    if (!actor.id || !actor.sesion) throw new ErrorDocumental('ACTOR_NO_AUTENTICADO', 'Se requiere una sesión backend autenticada', 401);
    const permiso = PERMISOS_APROBADOS_POR_ACCION[accion];
    if (!permiso) throw new ErrorDocumental('PERMISO_DOCUMENTAL_NO_DEFINIDO', `La acción ${accion} permanece cerrada hasta que M4 apruebe su CU`, 403);
    if (!actor.administrador && !actor.permisos.includes(permiso)) throw new ErrorDocumental('ACCESO_DOCUMENTAL_DENEGADO', 'El actor no posee el permiso documental requerido', 403);
    if (!(await this.verificarAlcance(actor, contexto))) throw new ErrorDocumental('ALCANCE_DOCUMENTAL_DENEGADO', 'La entidad solicitada queda fuera del alcance autorizado', 403);
  }
}
