import { ErrorDocumental } from '../tipos';

export type AccionDocumental =
  | 'CONSULTAR_METADATA' | 'CONSULTAR_VERSIONES' | 'CONSULTAR_HISTORIAL'
  | 'SOLICITAR_VISTA_PREVIA' | 'CREAR_INTENCION' | 'CONFIRMAR_CARGA' | 'DESCARGAR' | 'REEMPLAZAR'
  | 'ASOCIAR_PRODUCTO' | 'DEFINIR_IMAGEN_PRINCIPAL' | 'ORDENAR_GALERIA'
  | 'DEFINIR_USO_B2B_B2C' | 'ARCHIVAR_DOCUMENTO' | 'ARCHIVAR'
  | 'GESTIONAR_CUARENTENA' | 'ADMINISTRAR_CONSERVACION';

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
  CONSULTAR_VERSIONES: 'CU367',
  CONSULTAR_HISTORIAL: 'CU367',
  CREAR_INTENCION: 'CU373', CONFIRMAR_CARGA: 'CU373', REEMPLAZAR: 'CU373',
  ASOCIAR_PRODUCTO: 'CU374', DEFINIR_IMAGEN_PRINCIPAL: 'CU374', ORDENAR_GALERIA: 'CU374', DEFINIR_USO_B2B_B2C: 'CU374',
  SOLICITAR_VISTA_PREVIA: 'CU375', DESCARGAR: 'CU376',
};

/** CU377 y cualquier acción sin permiso aprobado permanecen cerrados por defecto. */
export class AutorizadorDocumental {
  constructor(private readonly verificarAlcance: VerificadorAlcanceDocumental) {}

  async puede(actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDocumental): Promise<boolean> {
    try {
      await this.exigir(actor, accion, contexto);
      return true;
    } catch (error) {
      if (error instanceof ErrorDocumental && [401, 403].includes(error.estadoHttp)) return false;
      throw error;
    }
  }

  async exigir(actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDocumental): Promise<void> {
    if (!actor.id || !actor.sesion) throw new ErrorDocumental('ACTOR_NO_AUTENTICADO', 'Se requiere una sesión backend autenticada', 401);
    const permiso = PERMISOS_APROBADOS_POR_ACCION[accion];
    if (!permiso) throw new ErrorDocumental('PERMISO_DOCUMENTAL_NO_DEFINIDO', `La acción ${accion} permanece cerrada hasta que M4 apruebe su CU`, 403);
    if (!actor.permisos.includes(permiso)) throw new ErrorDocumental('ACCESO_DOCUMENTAL_DENEGADO', 'El actor no posee el permiso documental requerido', 403);
    if (!(await this.verificarAlcance(actor, contexto))) throw new ErrorDocumental('ALCANCE_DOCUMENTAL_DENEGADO', 'La entidad solicitada queda fuera del alcance autorizado', 403);
  }
}
