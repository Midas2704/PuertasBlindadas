from __future__ import annotations

import csv
import hashlib
import html
import json
import os
import re
import subprocess
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A3, A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


SCRIPT = Path(__file__).resolve()
LIB = SCRIPT.parents[1]
DOCS = LIB.parent
ROOT = DOCS.parent
REPO = ROOT.parent
FUENTES = LIB / "fuentes"
PDFS = LIB / "pdf"
DIAGRAMAS = LIB / "diagramas"
ANEXOS = LIB / "anexos"
INDICES = LIB / "indices"

EXCLUDES = {"node_modules", "dist", "output", "tmp", ".git", ".vite", "coverage", "biblioteca-maestra"}
BRANCH = "feature/terreno-agenda-visitas"
VERSION = "1.0"
DATE = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %Z")
ORANGE = colors.HexColor("#FE8F01")
GREY = colors.HexColor("#676767")
BLACK = colors.HexColor("#000000")
WHITE = colors.HexColor("#FFFFFF")
LIGHT = colors.HexColor("#F4F4F4")


def git(*args: str) -> str:
    return subprocess.check_output(["git", "-C", str(REPO), *args], text=True, encoding="utf-8").strip()


HEAD = git("rev-parse", "HEAD")
ACTUAL_BRANCH = git("branch", "--show-current")


MANUALS = [
    (1, "Indice_Maestro_y_Ruta_de_Aprendizaje", "Indice maestro y ruta de aprendizaje"),
    (2, "Manual_Instalacion_y_Entorno_Desarrollo", "Manual de instalacion y entorno de desarrollo"),
    (3, "Manual_Despliegue_Clouding", "Manual de despliegue y servidor Clouding"),
    (4, "Manual_Usuario_A_Prueba_de_Dummies", "Manual de usuario completo"),
    (5, "Manual_de_Usuarios_por_Rol", "Manual de usuarios por rol"),
    (6, "Trazabilidad_Casos_de_Uso_CU", "Trazabilidad completa de casos de uso CU"),
    (7, "Trazabilidad_Funcionalidades_Sin_CU", "Trazabilidad de funcionalidades sin CU"),
    (8, "Arquitectura_Completa_del_Sistema", "Arquitectura completa del sistema"),
    (9, "Codigo_Frontend_Explicado", "Codigo frontend explicado"),
    (10, "Codigo_Backend_Explicado", "Codigo backend explicado"),
    (11, "Base_de_Datos_Diccionario_y_Relaciones", "Base de datos: diccionario y relaciones"),
    (12, "Migraciones_Explicadas", "Migraciones explicadas"),
    (13, "Pruebas_Automatizadas_Explicadas", "Pruebas automatizadas explicadas"),
    (14, "QA_Manual_y_Casos_de_Prueba", "Guia de QA manual y casos de prueba"),
    (15, "Seguridad_M4_y_Permisos", "Seguridad M4 y permisos"),
    (16, "Auditoria_M9", "Auditoria M9"),
    (17, "Ciclo_Comercial_B2B_B2C", "Ciclo comercial B2B y B2C"),
    (18, "Terreno_Rectificacion_y_Produccion", "Terreno, rectificacion y produccion"),
    (19, "Sistema_Documental_PDF", "Sistema documental y PDF"),
    (20, "Troubleshooting", "Guia de errores y troubleshooting"),
    (21, "API_Referencia_Completa", "Catalogo de API"),
    (22, "Glosario_Puertas_Blindadas", "Glosario Puertas Blindadas"),
    (23, "Como_Desarrollar_una_Nueva_Funcionalidad", "Como desarrollar una nueva funcionalidad"),
    (24, "Mantenimiento_y_Buenas_Practicas", "Mantenimiento y buenas practicas"),
    (25, "Tecnologias_y_Dependencias", "Tecnologias y dependencias"),
    (26, "Flujos_de_Datos_End_to_End", "Flujos de datos end-to-end"),
    (27, "Runbook_Operacional", "Runbook operacional"),
    (28, "Deuda_Tecnica_y_Pendientes", "Deuda tecnica, limitaciones y pendientes"),
    (29, "Historia_y_Decisiones_Arquitectonicas", "Historia tecnica y decisiones arquitectonicas"),
    (30, "Curso_Practico_Puertas_Blindadas", "Curso practico para nuevos integrantes"),
    (31, "Banco_de_Preguntas_y_Evaluacion", "Banco de preguntas y evaluacion"),
    (32, "Cheat_Sheets", "Cheat sheets"),
    (33, "Mapa_Completo_del_Repositorio", "Mapa completo del repositorio"),
    (34, "Matriz_Maestra_de_Trazabilidad", "Matriz maestra de trazabilidad"),
    (35, "Estados_y_Maquinas_de_Estado", "Catalogo de estados y transiciones"),
    (36, "Diccionario_de_Errores", "Diccionario de errores"),
    (37, "Seguridad_Documental", "Seguridad documental"),
    (38, "Cobertura_Documental", "Informe de cobertura documental"),
]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def source_files() -> list[Path]:
    out: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in EXCLUDES for part in path.parts):
            continue
        # Los archivos de entorno reales pueden contener secretos. Se excluyen incluso
        # de los indices; los ejemplos versionables siguen siendo documentables.
        if path.name == ".env" or (path.name.startswith(".env.") and path.name != ".env.example"):
            continue
        out.append(path)
    return sorted(out)


FILES = source_files()


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1", errors="replace")


def line_of(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def extract_models(schema: Path) -> list[dict]:
    text = read(schema)
    models = []
    for match in re.finditer(r"(?ms)^model\s+(\w+)\s*\{(.*?)^\}", text):
        name, body = match.group(1), match.group(2)
        fields = []
        indexes = []
        for raw in body.splitlines():
            stripped = raw.strip()
            if not stripped or stripped.startswith("//"):
                continue
            if stripped.startswith("@@"):
                indexes.append(stripped)
                continue
            parts = stripped.split()
            if len(parts) >= 2 and not stripped.startswith("@"):
                fields.append({"name": parts[0], "type": parts[1], "attrs": " ".join(parts[2:])})
        schema_name = "public"
        sm = re.search(r'@@schema\("([^"]+)"\)', body)
        if sm:
            schema_name = sm.group(1)
        mapped = name
        mm = re.search(r'@@map\("([^"]+)"\)', body)
        if mm:
            mapped = mm.group(1)
        models.append({"name": name, "table": mapped, "schema": schema_name, "fields": fields, "indexes": indexes, "line": line_of(text, match.start())})
    return models


def extract_enums(schema: Path) -> list[dict]:
    text = read(schema)
    out = []
    for match in re.finditer(r"(?ms)^enum\s+(\w+)\s*\{(.*?)^\}", text):
        values = [line.strip() for line in match.group(2).splitlines() if line.strip() and not line.strip().startswith(("//", "@@"))]
        out.append({"name": match.group(1), "values": values, "line": line_of(text, match.start())})
    return out


def extract_endpoints() -> list[dict]:
    out = []
    for path in FILES:
        if "rutas" not in path.parts or path.suffix not in {".ts", ".js"}:
            continue
        text = read(path)
        pattern = re.compile(r"(?m)\b(?:router|ruta|rutas|app)\.(get|post|put|patch|delete)\s*\(\s*['\"]([^'\"]+)['\"]")
        for m in pattern.finditer(text):
            window = text[m.start(): min(len(text), m.start() + 700)]
            methods = re.findall(r"\b(?:finanzas|fachada|controlador|m\d+)\.([A-Za-z_$][\w$]*)\s*\(", window)
            cus = sorted(set(re.findall(r"CU\d+", window)))
            out.append({"method": m.group(1).upper(), "path": m.group(2), "file": rel(path), "line": line_of(text, m.start()), "handlers": methods[:4], "cu": cus})
    return out


def extract_front_routes() -> list[dict]:
    out = []
    for path in FILES:
        if path.suffix not in {".tsx", ".jsx"}:
            continue
        text = read(path)
        for line_no, line in enumerate(text.splitlines(), 1):
            if "<Route" not in line or "element=" not in line:
                continue
            route = re.search(r"\bpath=[{]?['\"]([^'\"]+)['\"]", line)
            route_path = route.group(1) if route else ("(index)" if re.search(r"<Route\s+index\b", line) else None)
            if route_path is None:
                continue
            tags = [tag for tag in re.findall(r"<([A-Z][A-Za-z0-9_]*)\b", line) if tag not in {"Route", "Protegido"}]
            cus = sorted(set(re.findall(r"CU\d+", line)), key=lambda value: int(value[2:]))
            out.append({"path": route_path, "component": tags[-1] if tags else "No identificado", "cu": cus, "file": rel(path), "line": line_no})
    return out


def extract_methods() -> list[dict]:
    out = []
    paths = [p for p in FILES if p.suffix == ".ts" and ("controladores" in p.parts or "servicios" in p.parts or "documental" in p.parts)]
    for path in paths:
        text = read(path)
        cls = re.search(r"export\s+class\s+(\w+)", text)
        class_name = cls.group(1) if cls else path.stem
        pattern = re.compile(r"(?m)^\s{1,4}(?:(private|public|protected)\s+)?(?:(async)\s+)?([A-Za-z_$][\w$]*)\s*\(([^\n]*)\)\s*(?::[^\{]+)?\{")
        for m in pattern.finditer(text):
            if m.group(3) in {"if", "for", "while", "switch", "catch"}:
                continue
            out.append({"class": class_name, "method": m.group(3), "scope": m.group(1) or "public", "async": bool(m.group(2)), "parameters": m.group(4).strip(), "file": rel(path), "line": line_of(text, m.start())})
    return out


def extract_tests() -> list[dict]:
    out = []
    for path in FILES:
        if ".test." not in path.name:
            continue
        text = read(path)
        names = []
        for m in re.finditer(r"\b(?:test|it|describe)\s*\(\s*['\"`]([^'\"`]+)", text):
            names.append({"name": m.group(1), "line": line_of(text, m.start())})
        out.append({"file": rel(path), "framework": "Vitest/Testing Library" if "Vistas/" in rel(path) else "node:test", "cases": names})
    return out


def extract_migrations() -> list[dict]:
    base = ROOT / "Controladores" / "prisma" / "migrations"
    out = []
    for folder in sorted([p for p in base.iterdir() if p.is_dir()]):
        sql_path = folder / "migration.sql"
        sql = read(sql_path) if sql_path.exists() else ""
        operations = []
        patterns = [
            ("CREATE TABLE", r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s(]+)'),
            ("ALTER TABLE", r'ALTER\s+TABLE\s+(?:ONLY\s+)?([^\s;]+)'),
            ("CREATE INDEX", r'CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s]+)'),
            ("CREATE TRIGGER", r'CREATE\s+TRIGGER\s+([^\s]+)'),
            ("INSERT", r'INSERT\s+INTO\s+([^\s(]+)'),
        ]
        for kind, pat in patterns:
            for match in re.finditer(pat, sql, flags=re.I):
                operations.append(f"{kind}: {match.group(1).strip()}")
        out.append({"name": folder.name, "file": rel(sql_path), "operations": operations, "lines": len(sql.splitlines()), "sha256": hashlib.sha256(sql.encode()).hexdigest()})
    return out


def extract_cu() -> list[dict]:
    refs: dict[str, set[str]] = defaultdict(set)
    labels: dict[str, set[str]] = defaultdict(set)
    for path in FILES:
        if path.suffix.lower() not in {".ts", ".tsx", ".js", ".cjs", ".sql", ".md"}:
            continue
        text = read(path)
        for m in re.finditer(r"CU\d+", text):
            code = m.group(0)
            refs[code].add(rel(path))
            line = text[max(0, text.rfind("\n", 0, m.start()) + 1): text.find("\n", m.end()) if text.find("\n", m.end()) >= 0 else len(text)].strip()
            line = re.sub(r"\s+", " ", line)
            if 4 < len(line) < 240:
                labels[code].add(line)
    def key(code: str) -> int:
        return int(code[2:])
    return [{"code": code, "references": sorted(refs[code]), "evidence": sorted(labels[code])[:4], "blocked": code == "CU377"} for code in sorted(refs, key=key)]


def extract_errors() -> list[dict]:
    out = []
    seen = set()
    for path in FILES:
        if path.suffix not in {".ts", ".tsx", ".js", ".cjs"}:
            continue
        text = read(path)
        for m in re.finditer(r"(?:new\s+ErrorAplicacion|error)\s*\(\s*(\d{3})\s*,\s*['\"`]([^'\"`]+)", text):
            item = (int(m.group(1)), m.group(2), rel(path), line_of(text, m.start()))
            if item[:3] not in seen:
                seen.add(item[:3]); out.append({"status": item[0], "message": item[1], "file": item[2], "line": item[3]})
    return sorted(out, key=lambda x: (x["status"], x["message"]))


def extract_dependencies() -> list[dict]:
    out = []
    for folder in [ROOT / "Controladores", ROOT / "Vistas"]:
        pkg = json.loads(read(folder / "package.json"))
        for kind in ["dependencies", "devDependencies"]:
            for name, version in sorted(pkg.get(kind, {}).items()):
                out.append({"workspace": folder.name, "kind": kind, "name": name, "version": version})
    return out


def build_inventory() -> dict:
    schema = ROOT / "Controladores" / "prisma" / "schema.prisma"
    methods = extract_methods()
    return {
        "generatedAt": DATE,
        "branch": ACTUAL_BRANCH,
        "head": HEAD,
        "files": [rel(p) for p in FILES],
        "models": extract_models(schema),
        "enums": extract_enums(schema),
        "endpoints": extract_endpoints(),
        "frontRoutes": extract_front_routes(),
        "methods": methods,
        "tests": extract_tests(),
        "migrations": extract_migrations(),
        "cu": extract_cu(),
        "errors": extract_errors(),
        "dependencies": extract_dependencies(),
        "docs": [rel(p) for p in FILES if p.suffix.lower() in {".md", ".drawio"}],
        "controllers": sorted({m["file"] for m in methods if "/controladores/" in m["file"]}),
        "views": [rel(p) for p in FILES if "Vistas/src/views" in rel(p) and p.suffix == ".tsx" and ".test." not in p.name],
    }


INV = build_inventory()


def md_table(headers: list[str], rows: Iterable[Iterable[object]]) -> str:
    def clean(value: object) -> str:
        return str(value if value is not None else "").replace("|", "\\|").replace("\n", " ")
    rows = list(rows)
    return "\n".join([
        "| " + " | ".join(map(clean, headers)) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
        *["| " + " | ".join(clean(c) for c in row) + " |" for row in rows],
    ])


def source_note(paths: Iterable[str]) -> str:
    uniq = sorted(set(paths))
    return "\n".join(["## Fuentes de verdad consultadas", *[f"- `{p}`" for p in uniq]])


def common_intro(title: str, number: int) -> str:
    return f"""# {title}

**Proyecto:** Puertas Blindadas
**Documento:** {number:02d}
**Version:** {VERSION}
**Fecha de corte:** {DATE}
**Rama:** `{ACTUAL_BRANCH}`
**SHA documentado:** `{HEAD}`

> Alcance de evidencia: este manual describe el codigo, schema Prisma, migraciones, pruebas y documentacion presentes en el SHA indicado. Cuando una capacidad no puede demostrarse desde esas fuentes se marca como **NO CONFIRMADO EN EL REPOSITORIO**. Implementado, preparado, bloqueado, legacy y pendiente son estados distintos.

## Tabla de contenidos

{{{{TOC}}}}

## Como leer este documento

- **Comportamiento actual** significa que existe codigo operativo y evidencia verificable.
- **Preparado** significa que existen contratos, modelos o interfaz, pero falta una dependencia o activacion.
- **Bloqueado** significa que el sistema impide deliberadamente la operacion por seguridad o falta de autorizacion.
- **Pendiente** significa que no existe una implementacion completa demostrable.
- Las rutas de archivos se expresan desde `CODIGO/`.
"""


def doc_01() -> str:
    rows = [(f"{n:02d}", title, "Consultar el documento especializado", "Basico a avanzado") for n, _, title in MANUALS]
    routes = [
        ("Ruta A - Usuario final", "04, 05, 17, 18, 19, 20, 22, 32"),
        ("Ruta B - Soporte", "01, 04, 15, 16, 20, 27, 32, 36"),
        ("Ruta C - QA", "04, 06, 13, 14, 17, 18, 19, 34, 35, 36"),
        ("Ruta D - Frontend", "01, 08, 09, 15, 19, 21, 23, 24, 33"),
        ("Ruta E - Backend", "01, 08, 10, 15, 16, 21, 23, 24, 26, 33"),
        ("Ruta F - Base de datos", "08, 11, 12, 17, 18, 19, 29, 35"),
        ("Ruta G - Administrador/M4", "05, 06, 15, 16, 20, 34, 36"),
        ("Ruta H - DevOps/despliegue", "02, 03, 20, 25, 27, 37"),
        ("Ruta I - Experto integral", "01 a 38, en orden"),
    ]
    return "\n".join([
        "## Catalogo de la biblioteca", md_table(["No.", "Documento", "Utilidad", "Nivel"], rows),
        "## Rutas de aprendizaje", md_table(["Ruta", "Orden recomendado"], routes),
        "## Estoy listo para trabajar solo cuando se...",
        "- Levantar frontend y backend sin exponer secretos.", "- Seguir una accion desde la vista hasta PostgreSQL.",
        "- Distinguir CU, perfil, permiso particular y alcance por empleado.", "- Explicar por que M9 no debe reescribir evidencia historica.",
        "- Distinguir producto comercial, linea, unidad fisica y OT.", "- Distinguir Obra de Proyecto.",
        "- Aplicar migraciones solo con respaldo, entorno correcto y autorizacion.", "- Diagnosticar un 403 sin convertirlo en una lista vacia.",
        "- Probar idempotencia y revision optimista.", "- Separar preview PDF de documento emitido e inmutable.",
        "## Criterio de vigencia", "El SHA de portada es la frontera de validez. Todo cambio posterior exige regenerar esta biblioteca y revisar los deltas.",
    ])


def doc_02() -> str:
    return """## Requisitos verificados

El repositorio contiene dos espacios npm: `Controladores/` (Node.js, Express, TypeScript, Prisma) y `Vistas/` (React, TypeScript, Vite). PostgreSQL es la fuente persistente. Docker aparece en la documentacion de despliegue, pero el desarrollo local puede usar PostgreSQL instalado o un contenedor autorizado.

## Primera instalacion desde cero

1. Instalar Git, Node.js LTS, npm y PostgreSQL compatible.
2. Clonar el repositorio y seleccionar la rama documentada.
3. Crear archivos `.env` locales a partir de la configuracion esperada; nunca versionar secretos.
4. Ejecutar `npm install` en `Controladores/` y `Vistas/`.
5. Configurar `DATABASE_URL` para una base local no productiva.
6. En `Controladores/`, ejecutar `npx prisma generate` y luego `npx prisma migrate deploy` solo sobre la base local autorizada.
7. Levantar backend con `npm run dev` y frontend con `npm run dev`.

## Comandos explicados

| Comando | Que hace | Resultado esperado | Si falla |
| --- | --- | --- | --- |
| `git clone <url>` | Copia historia y archivos | Carpeta con `.git` | Verificar URL, acceso y red |
| `git switch feature/terreno-agenda-visitas` | Selecciona la rama | Nombre de rama confirmado | Ejecutar `git fetch origin` y comprobar existencia |
| `npm install` | Resuelve dependencias del package.json | `node_modules` local | Revisar version Node, proxy y lockfile |
| `npx prisma generate` | Genera cliente Prisma | Cliente actualizado | Validar schema y `DATABASE_URL` |
| `npx prisma migrate deploy` | Aplica migraciones pendientes | Lista aplicada sin drift | Detenerse ante drift; no usar reset |
| `npm run dev` | Inicia servicio con recarga | Puerto local escuchando | Revisar `.env`, puerto y logs |
| `npm run build` | Verifica TypeScript y empaqueta | Codigo de salida 0 | Resolver primer error, no ocultarlo |

## Actualizar una copia existente

Confirmar que el arbol este limpio, descargar referencias, revisar cambios remotos y actualizar la rama sin borrar trabajo local. Si hay cambios propios, no usar `reset --hard`; resolver la situacion de forma consciente.

## Variables de entorno

`DATABASE_URL` es obligatoria para Prisma. Las variables documentales y de almacenamiento deben inyectarse por proceso y nunca quedar en Git. Consultar los modulos de configuracion antes de inventar nombres.

## Verificacion basica

- Backend compila.
- Frontend compila.
- Prisma valida.
- La ruta de salud responde si esta configurada.
- El login usa una cuenta sintetica o autorizada.
- Ningun proceso apunta a Clouding o RRFF.

## Errores frecuentes

- `P2022`: la base no tiene una columna esperada; comprobar migraciones y no aplicar arreglos improvisados.
- Puerto ocupado: identificar el proceso, no matar servicios ajenos.
- 403: revisar CU efectivo, perfil, configuracion particular y alcance.
- Pantalla vacia: inspeccionar la respuesta HTTP antes de asumir ausencia de datos.
"""


def doc_03() -> str:
    return """## Advertencia operacional

Este manual documenta el flujo conocido, pero no autoriza un despliegue. No contiene secretos. Antes de operar, confirmar nombres reales de servicios, variables y estrategia de respaldo en el servidor.

## Arquitectura conocida

Cloudflare protege/resuelve el acceso; Clouding aloja los componentes; Docker Compose coordina frontend, backend y PostgreSQL segun la configuracion operacional. **STAGING: NO CONFIRMADO EN EL REPOSITORIO** como ambiente separado.

## Actualizacion normal

```powershell
cd /opt/puertasblindadas
git status
git pull --ff-only
docker compose build
docker compose up -d
docker compose ps
curl -f http://127.0.0.1:<puerto>/health
```

`git status` confirma que no se pisara trabajo del servidor. `git pull --ff-only` evita merges accidentales. `build` reconstruye imagenes. `up -d` reemplaza contenedores de forma declarativa. `ps` y `curl` verifican proceso y salud.

## Despliegue con migraciones

Respaldar, revisar `prisma migrate status`, aplicar `prisma migrate deploy` una sola vez desde el servicio autorizado y comprobar schema/health. Nunca usar `migrate reset` o `db push` en produccion.

## Rollback conceptual

El codigo puede volver a un commit anterior si el schema sigue siendo compatible. Las migraciones no se revierten borrando carpetas: requieren una estrategia SQL evaluada y respaldo probado.

## No afectar otros proyectos

No ejecutar comandos globales de Docker, no eliminar volumenes compartidos, no reutilizar puertos sin inventario y no modificar proxies o certificados fuera del host virtual de Puertas Blindadas.

## Diagnostico

Priorizar lectura: `docker compose ps`, logs acotados por servicio, health checks, uso de disco y estado de migraciones. Toda accion que reinicie, reconstruya o migre debe estar autorizada.
"""


def view_catalog() -> str:
    routes = INV["frontRoutes"]
    if routes:
        return md_table(["Ruta", "Componente", "CU visible", "Archivo", "Linea"], [(r["path"], r["component"], ", ".join(r.get("cu", [])) or "Ruta contenedora/publica", r["file"], r["line"]) for r in routes])
    return "No se detectaron rutas declarativas con el patron analizado; revisar `Vistas/src/App.tsx`."


def doc_04() -> str:
    domains = [
        ("Inicio de sesion", "Ingresar credenciales autorizadas. Un error no debe revelar si existe una cuenta."),
        ("Portal", "Elegir Finanzas o Terreno. Inventario puede aparecer como pendiente segun la version."),
        ("Clientes", "Buscar, crear y mantener la ficha financiera sin confundirla con tablas heredadas."),
        ("Cotizaciones", "Elegir B2B/B2C, cliente compatible, productos, servicios y condiciones; previsualizar no emite."),
        ("Documentos PDF", "Vista previa es borrador. Emitido es historico, confirmado y no se regenera con precios actuales."),
        ("Nota de Venta", "Nace del flujo comercial autorizado; los reintentos no deben duplicarla."),
        ("Obras y Proyectos", "Obra es el lugar fisico; Proyecto es el pedido. Una obra admite varios proyectos."),
        ("Ordenes de Trabajo", "Cada puerta fisica aprobada produce una unidad y una OT pendiente de rectificacion."),
        ("Rectificacion", "Asignar rectificador, registrar medidas, enviar a aprobacion tecnica y conservar versiones."),
        ("Produccion", "Liberar tareas solo despues de aprobacion tecnica; respetar dependencias y cierre."),
        ("Terreno", "Gestionar agenda, visitas, instalaciones e incidencias segun alcance y permisos."),
        ("Finanzas", "Pagos, proveedores, compras, remuneraciones, credito y dashboard tienen validaciones propias."),
        ("Seguridad", "Usuarios ven acciones segun perfil, CU particulares, dependencia y alcance."),
        ("Auditoria", "M9 muestra evidencia, integridad y eventos comprometidos sin ocultarlos."),
    ]
    detail = []
    for name, purpose in domains:
        detail.extend([f"## {name}", purpose, "### Procedimiento seguro", "1. Abrir la pantalla desde el menu correspondiente.\n2. Confirmar que el encabezado y contexto coincidan con la tarea.\n3. Completar campos obligatorios.\n4. Revisar el resumen antes de confirmar.\n5. Verificar el mensaje y el registro resultante.", "### Si falla", "Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas."])
    screens = ["## Guia pantalla por pantalla"]
    for route in INV["frontRoutes"]:
        path = route["path"]
        human = path.replace(":id", "identificador").replace(":rut", "RUT").replace("-", " ").replace("/", " / ").strip() or "portal principal"
        screens.extend([
            f"## Pantalla `{path}` - {route['component']}",
            f"**Donde entrar:** desde el menu que conduce a {human}; la ruta declarada esta en `{route['file']}:{route['line']}`.  ",
            f"**Permiso visible:** {', '.join(route.get('cu', [])) or 'ruta publica, indice o contenedora; la API puede exigir autorizacion adicional'}.  ",
            f"**Que deberia aparecer:** el componente `{route['component']}` y sus estados de carga, contenido, vacio y error.  ",
            "**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.  ",
            "**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.  ",
            "**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.  ",
            "**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.",
        ])
    return "\n".join(["## Mapa de pantallas detectadas", view_catalog(), *detail, *screens, "## Limitaciones visibles", "La validacion visual por una usuaria no se deduce del codigo. Funciones bloqueadas o pendientes deben conservar su etiqueta; no se consideran operativas por tener un boton."])


def doc_05() -> str:
    roles = [
        ("Gerencia", "Aprobar, supervisar y consultar informacion gerencial", "No equivale automaticamente a Administrador"),
        ("Administrador", "Administrar capacidades autorizadas", "No puede saltar integridad, estado ni auditoria"),
        ("Secretaria", "Operar flujos administrativos asignados", "Alcance definido por perfil y CU"),
        ("Contador", "Operar y consultar procesos financieros", "Sin permisos administrativos implicitos"),
        ("Terreno", "Agenda, visitas, instalaciones y rectificaciones asignadas", "Alcance por empleado cuando aplica"),
        ("Produccion", "Ejecutar y validar tareas liberadas", "No libera rectificaciones sin autorizacion"),
        ("Personalizado", "Conjunto particular de CU registrados", "Configuracion particular no debe inventar bypass"),
        ("Midas raiz", "Cuenta interna raiz con todos los CU activos aprobados", "CU377 sigue excluido; tampoco evita antivirus, integridad o M9"),
    ]
    parts = ["## Matriz de roles", md_table(["Rol", "Objetivo", "Restriccion central"], roles)]
    for role, objective, restriction in roles:
        parts.extend([
            f"## {role}", f"**Objetivo:** {objective}.  ", f"**Restriccion:** {restriction}.  ",
            "### Responsabilidades", "Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.",
            "### Pantallas y acciones", "Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.",
            "### Jornada de ejemplo", "1. Iniciar sesion y confirmar identidad.\n2. Revisar bandejas asignadas.\n3. Procesar una entidad a la vez.\n4. Confirmar estados y documentos.\n5. Revisar mensajes de error.\n6. Cerrar sesion si se usa un equipo compartido.",
            "### Controles", "No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.",
        ])
    parts.extend(["## Diagnostico de acceso", "Confirmar sesion, perfil, configuracion particular, CU efectivo, dependencia administrativa, alcance de empleado y estado de la entidad. Un administrador original conserva capacidades administrativas aprobadas, pero no puede omitir controles documentales."])
    return "\n".join(parts)


def doc_06() -> str:
    parts = [
        "## Matriz CU detectada",
        md_table(["CU", "Referencias", "Estado", "Evidencia resumida"], [(c["code"], len(c["references"]), "BLOQUEADO/NO APROBADO" if c["blocked"] else "Referenciado", c["evidence"][0] if c["evidence"] else "Sin etiqueta inequívoca") for c in INV["cu"]]),
        "## Criterio de las fichas",
        "Cada ficha contiene los 23 campos solicitados. Los enlaces se derivan de referencias reales. Cuando el patron estatico no demuestra una relacion se escribe NO CONFIRMADO EN EL REPOSITORIO; no se completa por intuicion.",
    ]
    for c in INV["cu"]:
        refs = c["references"]
        lower_refs = [r.lower() for r in refs]
        endpoints = [f"{e['method']} {e['path']}" for e in INV["endpoints"] if c["code"] in e["cu"]]
        frontend = [r for r in refs if r.startswith("Vistas/") and ".test." not in r]
        frontend_tests = [r for r in refs if r.startswith("Vistas/") and ".test." in r]
        backend_routes = [r for r in refs if "/src/rutas/" in r]
        facades = [r for r in refs if r.endswith("C_Finanzas.ts")]
        controllers = [r for r in refs if "/src/controladores/" in r]
        services = [r for r in refs if r.startswith("Controladores/src/") and r not in backend_routes + facades + controllers]
        migrations = [r for r in refs if "/prisma/migrations/" in r]
        backend_tests = [r for r in refs if r.startswith("Controladores/pruebas/")]
        audits = [r for r in refs if "m9" in r.lower() or "auditoria" in r.lower()]
        evidence = c["evidence"]
        joined = " ".join(evidence)
        dependencies = sorted(set(re.findall(r"CU\d+", joined)) - {c["code"]}, key=lambda value: int(value[2:]))
        area = "General"
        area_signals = [
            ("Seguridad M4", ["m4", "seguridad", "usuario", "sesion"]), ("Auditoria M9", ["m9", "auditoria"]),
            ("Dashboard M7", ["m7", "dashboard"]), ("Credito M8", ["m8", "credito"]),
            ("Terreno/Remuneraciones M6", ["m6", "terreno", "remuner"]), ("Proveedores M5", ["m5", "proveedor", "cuentas-por-pagar"]),
            ("Comercial M2", ["m2", "cotizacion", "venta", "cliente"]),
        ]
        evidence_blob = " ".join(lower_refs + [joined.lower()])
        for candidate, signals in area_signals:
            if any(signal in evidence_blob for signal in signals):
                area = candidate; break
        status = "BLOQUEADO / NO APROBADO" if c["blocked"] else ("IMPLEMENTADO Y CON PRUEBA REFERENCIADA" if backend_tests or frontend_tests else "REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA")
        objective = evidence[0] if evidence else "NO CONFIRMADO EN EL REPOSITORIO: no existe etiqueta humana inequivoca en las fuentes rastreadas."
        def refs_text(values: list[str]) -> str:
            return "; ".join(values[:10]) if values else "NO CONFIRMADO EN EL REPOSITORIO"
        ficha = [
            ("1. Objetivo", objective),
            ("2. Actor", "Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4."),
            ("3. Area funcional", area),
            ("4. Precondiciones", "Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend."),
            ("5. Flujo normal", "Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde."),
            ("6. Flujos alternativos", "Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible."),
            ("7. Permiso M4", c["code"]),
            ("8. Ruta frontend", refs_text([r for r in frontend if r.endswith("App.tsx")])),
            ("9. Componente React", refs_text([r for r in frontend if not r.endswith("App.tsx")])),
            ("10. Endpoint", "; ".join(endpoints[:12]) if endpoints else "NO CONFIRMADO EN EL REPOSITORIO"),
            ("11. Ruta backend", refs_text(backend_routes)),
            ("12. Fachada", refs_text(facades)),
            ("13. Controlador", refs_text(controllers)),
            ("14. Servicio", refs_text(services)),
            ("15. Validaciones", refs_text([r for r in refs if "validacion" in r.lower() or "seguridad" in r.lower()])),
            ("16. Tablas afectadas", "Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado."),
            ("17. Migraciones", refs_text(migrations)),
            ("18. Auditoria M9", refs_text(audits)),
            ("19. Pruebas", refs_text(backend_tests + frontend_tests)),
            ("20. Resultado esperado", "La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance."),
            ("21. Errores conocidos", "Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia."),
            ("22. Dependencias con otros CU", ", ".join(dependencies) if dependencies else "Ninguna dependencia textual inequivoca detectada."),
            ("23. Estado actual", status),
        ]
        parts.extend([
            f"## {c['code']}",
            md_table(["Campo", "Evidencia/descripcion"], ficha),
            "### Trazabilidad completa de archivos", *[f"- `{p}`" for p in refs],
            "### Evidencia textual", *([f"- `{e}`" for e in c["evidence"]] or ["- No existe una etiqueta humana inequívoca; revisar la migracion/catalogo M4."]),
        ])
    return "\n".join(parts)


def doc_07() -> str:
    funcs = [
        ("Health checks", "servidor/app/rutas", "Detectar disponibilidad sin ejecutar negocio"),
        ("SHA-256", "documental/seguridad/IntegridadContenido.ts", "Verificar bytes y documentos historicos"),
        ("Antivirus", "documental/seguridad/AntivirusAdapter.ts", "Fail-closed ante infeccion, error o indisponibilidad"),
        ("Storage S3 compatible", "documental/adaptadores", "Guardar/leer objetos privados sin acoplar proveedor"),
        ("Motor PDF", "m2/documentos comerciales", "Renderizar preview y emitido con una fuente comun"),
        ("Revision optimista", "controladores y campos revision", "Evitar actualizaciones perdidas"),
        ("Idempotencia", "flujos comerciales/documentales", "Evitar duplicados por reintento"),
        ("Snapshots", "cotizaciones/documentos", "Congelar valores historicos"),
        ("Outbox/retry", "documental y M9", "Coordinar efectos que no comparten transaccion"),
        ("Normalizacion RUT", "utilidades/controladores", "Comparar y validar identidad tributaria"),
    ]
    return "\n".join(["## Catalogo tecnico", md_table(["Funcionalidad", "Origen", "Impacto"], funcs), "## Contrato de operacion", "Cada proceso tecnico recibe datos validados, retorna un resultado explicito y nunca debe convertir una dependencia fallida en exito. Sus pruebas deben cubrir error, timeout, reintento e integridad cuando aplique.", source_note([f[1] for f in funcs])])


def doc_08() -> str:
    return """## Arquitectura logica

```text
Usuario -> React/Vite -> API HTTP -> rutas/finanzas.ts -> C_Finanzas
        -> M1..M9 / servicios -> Prisma -> PostgreSQL
        -> M9 (auditoria)
        -> ServicioDocumental -> AntivirusAdapter -> StorageAdapter
```

## Capas

- **Vistas:** pantallas, formularios, tablas, modales y navegacion.
- **API cliente:** serializa solicitudes y presenta errores HTTP.
- **Rutas:** autentican, extraen parametros y convierten errores.
- **C_Finanzas:** fachada que expone casos de uso sin entregar Prisma al frontend.
- **Controladores M1-M9:** reglas de dominio por modulo.
- **Servicios:** logica especializada, adaptadores y coordinacion.
- **Prisma/PostgreSQL:** persistencia relacional, constraints, triggers y transacciones.
- **M4:** autenticacion/autorizacion.
- **M9:** evidencia auditable e integridad.
- **Documental:** metadatos, antivirus, storage privado, versionado y recuperacion.

## Arquitectura fisica

Desarrollo usa procesos locales. El despliegue conocido usa contenedores en Clouding y borde Cloudflare. Storage productivo definitivo y topologia exacta deben confirmarse operacionalmente; las pruebas aisladas usaron infraestructura local.

## Principio de dependencia

Las vistas no escriben base de datos. Los adaptadores no contienen calculos comerciales. Los controladores no deben confiar en permisos enviados por React. Los documentos historicos no se regeneran desde catalogos actuales.
"""


def doc_09() -> str:
    parts = ["## Rutas React", view_catalog(), "## Inventario de vistas"]
    for path_s in INV["views"]:
        path = ROOT / path_s
        text = read(path)
        imports = re.findall(r"(?m)^import\s+.*?from\s+['\"]([^'\"]+)", text)
        apis = sorted(set(re.findall(r"\b(?:solicitarFinanzas|fetch|axios)\b", text)))
        hooks = sorted(set(re.findall(r"\b(useState|useEffect|useMemo|useCallback|useRef|useNavigate|useParams)\b", text)))
        parts.extend([f"## `{path_s}`", f"**Proposito inferido por nombre y JSX:** vista `{path.stem}`.", f"**Hooks detectados:** {', '.join(hooks) or 'ninguno explicito'}.", f"**Acceso API detectado:** {', '.join(apis) or 'no detectado por patron'}.", "**Dependencias locales:** " + (", ".join(f"`{x}`" for x in imports[:12]) if imports else "sin imports relativos detectados"), "**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa."])
    return "\n".join(parts)


def doc_10() -> str:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for m in INV["methods"]:
        grouped[m["file"]].append(m)
    parts = ["## Flujo backend", "Una peticion pasa por `Controladores/src/rutas/finanzas.ts`, la fachada `C_Finanzas.ts` y el controlador/servicio propietario. Las escrituras relacionadas deben usar transacciones Prisma y los errores de dominio deben conservar codigo HTTP."]
    for file, methods in sorted(grouped.items()):
        parts.extend([f"## `{file}`", md_table(["Clase", "Metodo", "Alcance", "Async", "Linea", "Parametros"], [(m["class"], m["method"], m["scope"], "si" if m["async"] else "no", m["line"], m["parameters"][:90]) for m in methods])])
    return "\n".join(parts)


def doc_11() -> str:
    parts = ["## Convenciones", "Prisma expresa modelos, campos, relaciones e indices. Las migraciones son la fuente de SQL historico; el schema representa el estado esperado actual. Nullable significa compatibilidad o ausencia valida, no permiso para inventar datos.", "## Resumen por schema"]
    counts = Counter(m["schema"] for m in INV["models"])
    parts.append(md_table(["Schema", "Modelos"], sorted(counts.items())))
    for model in INV["models"]:
        parts.extend([f"## `{model['schema']}.{model['table']}` (`{model['name']}`)", f"Definido en `Controladores/prisma/schema.prisma:{model['line']}`.", md_table(["Campo", "Tipo Prisma", "Atributos"], [(f["name"], f["type"], f["attrs"]) for f in model["fields"]]), "### Indices y restricciones declarativas", *([f"- `{x}`" for x in model["indexes"]] or ["- Sin directiva `@@` adicional en el modelo."])])
    parts.extend(["## Diferencias esenciales", "**Producto maestro:** definicion reutilizable del catalogo. **Linea comercial:** agrupacion cotizada. **Unidad fisica:** puerta individual contratada. **OT:** orden operacional asociada a esa unidad.", "**Obra:** lugar fisico. **Proyecto:** pedido o trabajo especifico. Una obra puede tener varios proyectos sin duplicarse."])
    return "\n".join(parts)


def doc_12() -> str:
    parts = ["## Principios", "Las migraciones son incrementales e inmutables. No se corrige una migracion aplicada editandola; se agrega otra. `migrate reset` y `db push` no son mecanismos de produccion."]
    for mig in INV["migrations"]:
        ops = mig["operations"]
        parts.extend([f"## {mig['name']}", f"**Archivo:** `{mig['file']}`  ", f"**Tamano:** {mig['lines']} lineas  ", f"**SHA-256:** `{mig['sha256']}`", "### Operaciones detectadas", *([f"- {op}" for op in ops[:80]] or ["- No se detectaron operaciones por los patrones basicos; revisar SQL completo."]), "### Compatibilidad y rollback conceptual", "Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio."])
    return "\n".join(parts)


def doc_13() -> str:
    parts = ["## Estrategia", "Las pruebas `node:test` cubren backend y persistencia; Vitest/Testing Library cubre frontend. Algunas suites requieren PostgreSQL aislado u otros servicios. Un mock demuestra contrato, no infraestructura real.", "## Resumen", md_table(["Archivo", "Framework", "Casos detectados"], [(t["file"], t["framework"], len(t["cases"])) for t in INV["tests"]])]
    for test in INV["tests"]:
        parts.extend([f"## `{test['file']}`", f"**Framework:** {test['framework']}.", "### Escenarios", *([f"- Linea {c['line']}: {c['name']} - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion." for c in test["cases"]] or ["- El nombre de caso no fue detectable por patron; revisar el archivo."])])
    return "\n".join(parts)


def doc_14() -> str:
    cases = [
        ("QA-001", "Login valido e invalido", "Cuenta sintetica", "Ingresar credenciales validas y luego invalidas", "Sesion solo para el caso valido", "sesion_usuario", "inicio/fallo segun politica"),
        ("QA-002", "Cotizacion B2B", "Cliente B2B y catalogos vigentes", "Crear borrador, agregar productos/servicios, preview, emitir", "PDF confirmado sin costos internos", "cotizacion/documento", "emision"),
        ("QA-003", "Alternativas B2C", "Tres alternativas", "Emitir y aceptar una", "Solo aceptada llega a NV/OT", "alternativas/detalles", "seleccion/aceptacion"),
        ("QA-004", "Diez puertas", "Linea cantidad 10", "Aprobar y formalizar", "10 unidades y 10 OT", "unidad_fisica/orden_trabajo", "creacion OT"),
        ("QA-005", "Rectificacion", "OT pendiente", "Asignar, medir, enviar, aprobar", "Version inmutable y liberacion controlada", "rectificacion/version", "eventos tecnicos"),
        ("QA-006", "Permiso insuficiente", "Usuario sin CU/alcance", "Abrir bandeja protegida", "403 explicito, no lista vacia", "sin escritura", "acceso denegado si aplica"),
        ("QA-007", "Idempotencia", "Clave repetida", "Repetir operacion", "Un solo efecto", "unicos/solicitudes", "un evento de exito"),
        ("QA-008", "Documento historico", "PDF emitido", "Cambiar catalogo y volver a descargar", "Mismos bytes y SHA", "version_documento", "descarga"),
        ("QA-009", "Antivirus caido", "Servicio detenido", "Intentar confirmar documento", "Fail-closed", "estado no disponible", "fallo"),
        ("QA-010", "Integridad M9", "Evento valido e invalido", "Consultar bandeja/exportar", "Valido visible; invalido comprometido", "evento_auditoria_m9", "no reescribir"),
    ]
    parts = []
    for cid, obj, pre, steps, expected, db, m9 in cases:
        parts.extend([f"## {cid} - {obj}", f"**Precondiciones:** {pre}.  ", f"**Datos:** exclusivamente sinteticos.  ", f"**Pasos:** {steps}.  ", f"**Resultado esperado:** {expected}.  ", f"**Verificar en BD:** {db}.  ", f"**Verificar en M9:** {m9}.  ", "**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia."])
    api_rows = []
    for idx, endpoint in enumerate(INV["endpoints"], 1):
        api_rows.append((f"QA-API-{idx:03d}", endpoint["method"], endpoint["path"], ", ".join(endpoint["cu"]) or "Revisar backend", "Respuesta autorizada y error explicito sin permiso", f"{endpoint['file']}:{endpoint['line']}"))
    parts.extend([
        "## Cobertura manual por endpoint",
        "Cada fila exige probar happy path, payload invalido, actor sin permiso, entidad inexistente y reintento cuando la operacion escribe. Para escrituras, verificar BD y M9; para lecturas, verificar alcance y ausencia de filtracion.",
        md_table(["Caso", "Metodo", "Path", "Permiso visible", "Resultado minimo", "Fuente"], api_rows),
        "## Plantilla de concurrencia", "Abrir dos sesiones sobre la misma revision, guardar desde la primera y luego desde la segunda. La segunda debe recibir conflicto; nunca debe pisar silenciosamente.",
        "## Plantilla de doble click", "Enviar dos solicitudes iguales con la misma identidad/idempotencia. Debe existir un solo efecto persistente y un solo evento de exito.",
    ])
    return "\n".join(parts)


def doc_15() -> str:
    return """## Modelo M4

M4 combina autenticacion, sesion, perfil, permisos de perfil, permisos particulares, dependencias administrativas y alcance operacional. React puede ocultar acciones, pero el backend decide.

## Conceptos

- `administrador`: capacidad administrativa efectiva de la sesion/cuenta.
- `administrador_original`: marca protegida de la cuenta raiz; debe conservar CU administrativos aprobados.
- `configuracion_particular`: usa asignaciones particulares registradas; no debe reducir accidentalmente a Midas.
- `alcanceEmpleadoId`: limita operaciones a un empleado cuando el CU no concede gestion general.
- **Midas:** recibe todos los CU activos aprobados, excepto CU377 mientras siga bloqueado. No es un bypass.

## Como diagnosticar un 403

1. Confirmar sesion vigente y cuenta correcta.
2. Identificar CU exigido por endpoint.
3. Consultar permisos efectivos, no solo perfil visual.
4. Revisar `requiere_administrador` y `administrador_original`.
5. Revisar configuracion particular y dependencias.
6. Revisar alcance por empleado/entidad.
7. Confirmar estado de la entidad.

## Por que un usuario no ve algo

Separar ausencia de datos de falta de alcance. El backend debe devolver 403 o respuesta explicita; la interfaz no debe reemplazarlo por un estado vacio. El caso de OT de Terreno esta protegido por esta regla.

## Regla de Midas

La sincronizacion consulta el catalogo oficial, agrega faltantes, conserva asignaciones, excluye CU377, audita cambios efectivos y es idempotente. No identifica la cuenta por un nombre ambiguo.
"""


def doc_16() -> str:
    base = """## Responsabilidad de M9

M9 conserva evidencia funcional: actor, entidad, operacion, resultado, fecha, correlacion e integridad. No guarda binarios, secretos o URLs firmadas.

## Integridad

`hash_contenido` representa el material normalizado del evento. `hash_integridad` usa el contrato canonico y el material completo correspondiente. Ambos deben producirse mediante el productor oficial; calcular `sha256(JSON.stringify(objeto))` de forma independiente rompe la verificacion.

## Idempotencia

Una clave de solicitud repetida no crea eventos de exito duplicados. Los fallos revertidos no deben registrarse como exito.

## Evidencia comprometida

Un evento que no supera verificacion se muestra como **INTEGRIDAD COMPROMETIDA**, nunca como verificado. La consulta no debe ocultar los eventos validos porque exista uno invalido. La exportacion debe marcar el estado de forma explicita.

## Caso SINCRONIZAR_PERMISOS_MIDAS

El bug historico escribia directamente `evento_auditoria_m9` y reutilizaba un hash no canonico como contenido e integridad. M9 lo detecto. La correccion usa el productor oficial. El evento historico no se borra ni se reescribe: sigue siendo evidencia forense comprometida.

## Archivos centrales

- `Controladores/src/controladores/M9Controller.ts`
- `Controladores/src/m9/RepositorioAuditoriaM9.ts`
- `Controladores/src/m9/contratoProductor.ts`
- `Controladores/src/administracion/sincronizarPermisosMidas.ts`
"""
    methods = [m for m in INV["methods"] if "M9" in m["file"] or "/m9/" in m["file"]]
    tests = [t for t in INV["tests"] if "m9" in t["file"].lower() or "auditoria" in t["file"].lower()]
    return "\n".join([base, "## Metodos M9 inventariados", md_table(["Clase", "Metodo", "Archivo", "Linea"], [(m["class"], m["method"], m["file"], m["line"]) for m in methods]), "## Pruebas M9", md_table(["Suite", "Casos"], [(t["file"], len(t["cases"])) for t in tests]), "## Procedimiento forense", "1. Preservar evento y hashes.\n2. Ejecutar verificacion canonica sin reescritura.\n3. Marcar resultado comprometido.\n4. Mantener eventos validos consultables.\n5. Exportar el estado de integridad.\n6. Corregir solo el productor futuro.\n7. Registrar el incidente y su correlacion."])


def domain_evidence(keys: list[str]) -> str:
    lowered = [k.lower() for k in keys]
    methods = [m for m in INV["methods"] if any(k in (m["method"] + " " + m["file"]).lower() for k in lowered)]
    models = [m for m in INV["models"] if any(k in (m["name"] + " " + m["table"]).lower() for k in lowered)]
    tests = [t for t in INV["tests"] if any(k in t["file"].lower() for k in lowered)]
    return "\n".join([
        "## Metodos relacionados", md_table(["Clase", "Metodo", "Archivo", "Linea"], [(m["class"], m["method"], m["file"], m["line"]) for m in methods]),
        "## Modelos relacionados", md_table(["Modelo", "Schema", "Tabla", "Campos"], [(m["name"], m["schema"], m["table"], len(m["fields"])) for m in models]),
        "## Suites relacionadas", md_table(["Suite", "Casos"], [(t["file"], len(t["cases"])) for t in tests]),
    ])


def doc_17() -> str:
    base = """## Flujo comun

Cliente -> Cotizacion borrador -> Preview PDF -> Emision con documento confirmado -> Aceptacion -> Nota de Venta -> Proyecto -> Unidades fisicas -> OT.

## B2B

Usa cliente empresa, contactos propios de la cotizacion, proyecto/referencia, productos, instalacion y servicios como flete. La aprobacion exige la formalizacion empresarial definida. Los servicios no crean puertas ni OT.

## B2C

Usa cliente particular y puede presentar alternativas. Emitir una oferta no acepta alternativas. Solo la alternativa aceptada transaccionalmente se convierte en detalles contratados.

## Precios y condiciones

Se conservan versiones y snapshots. Costo interno, precio de lista y precio cotizado son conceptos distintos. Instalacion comercial no es el costo interno M7.

## Documentos

Preview es borrador y no crea NV/OT. Emision requiere plantilla publicada, validacion, PDF real, SHA, antivirus segun politica, storage confirmado, version documental y M9.

## Idempotencia

Repetir aprobacion/emision no duplica NV, unidades, OT ni PDF. Constraints, revision optimista y claves de idempotencia sostienen la regla.
"""
    return base + "\n" + domain_evidence(["cotizacion", "alternativa", "nota_venta", "comercial", "m2"])


def doc_18() -> str:
    base = """## Identidades

Obra es el lugar fisico. Proyecto es el pedido. Producto comercial es el modelo. Linea comercial agrupa cantidades. Unidad fisica representa una puerta contratada. OT organiza el trabajo de esa unidad.

## Flujo operacional

Cotizacion aprobada -> unidad fisica y OT `PENDIENTE_RECTIFICACION` -> asignacion -> medidas -> version de rectificacion -> aprobacion tecnica -> liberacion -> tareas productivas -> ejecucion -> validacion -> cierre.

## Diez puertas

Una linea de cantidad 10 genera diez unidades fisicas y diez OT. No crea diez productos maestros. Instalacion, flete y servicios no generan OT de puerta.

## Acceso

Midas raiz y usuarios con capacidades generales ven las OT dentro de su autorizacion. Un rectificador normal ve asignadas. Falta de alcance produce 403 explicito, no bandeja vacia.

## Historial

Las medidas y versiones enviadas se conservan. Una correccion produce nueva version. La aprobacion debe ser independiente del rectificador. Tareas no se ejecutan antes de liberacion ni fuera de dependencias.
"""
    return base + "\n" + domain_evidence(["terreno", "orden_trabajo", "rectificacion", "produccion", "visita", "obra", "proyecto"])


def doc_19() -> str:
    base = """## Nucleo documental

`documento_logico` representa el concepto; `version_documento` representa bytes inmutables y metadatos. StorageAdapter abstrae R2/S3-compatible. AntivirusAdapter analiza contenido. SHA-256 verifica integridad.

## Preview vs emitido

Preview usa el motor real, pero se marca BORRADOR y no confirma una operacion comercial. Emitido conserva snapshot, plantilla, archivo, hash y referencia historica. Un PDF emitido no se regenera con catalogos actuales.

## Plantillas y carta B2C

Las plantillas tienen borradores y versiones publicadas inmutables. La carta general B2C no requiere cliente ni crea cotizacion/NV/OT. Publicar requiere datos completos, permiso, PDF y storage confirmado.

## Seguridad

MIME, tamano, hash, claves opacas, antivirus, bucket privado y autorizacion se validan. Error, timeout o servicio no disponible cierran el flujo. Una URL firmada no se persiste como identidad del documento.

## Recuperacion

Se lee el objeto privado asociado a la version y se compara SHA-256. CU376 y alcance protegen descarga. El archivo historico es exactamente el confirmado.
"""
    return base + "\n" + domain_evidence(["document", "pdf", "storage", "antivirus", "plantilla", "carta"])


def doc_20() -> str:
    issues = [
        ("No puedo iniciar sesion", "Credencial, bloqueo, sesion, politica", "Revisar respuesta y M4; no revelar existencia de cuenta"),
        ("No veo una OT", "Permiso/alcance, filtros o vinculo unidad", "Revisar HTTP 403, actor, CU205/207/209 y unidad_fisica_orden_trabajo"),
        ("403", "CU, dependencia, administrador, alcance o estado", "Seguir diagnostico M4; no hardcodear usuario"),
        ("Prisma migrate falla", "Drift, conexion o SQL", "Detenerse, respaldar y revisar status; no reset"),
        ("PDF no abre", "Bytes incompletos, MIME, storage", "Verificar firma PDF, tamano y SHA"),
        ("Antivirus no disponible", "clamd caido/timeout", "Mantener fail-closed y restaurar servicio"),
        ("Storage no disponible", "Endpoint/credencial/bucket", "No confirmar documento; revisar adaptador"),
        ("Integridad comprometida", "Hash no canonico o alteracion", "Marcar comprometido, conservar evidencia y revisar productor"),
        ("No aparecen permisos", "Sincronizacion, catalogo o particular", "Comparar CU activos/aprobados y efectivos"),
        ("Frontend vacio", "Error oculto, API o sesion", "Abrir red/consola y distinguir error de lista vacia"),
        ("Backend 500", "Excepcion no controlada", "Correlacionar log, ruta y M9 sin repetir escritura"),
        ("No conecta BD", "DATABASE_URL, puerto, servicio", "Validar destino antes de ejecutar cualquier migracion"),
        ("Compose no levanta", "Imagen, puerto, volumen", "Revisar `docker compose ps` y logs del servicio"),
    ]
    return "\n".join(["## Catalogo por sintoma", md_table(["Sintoma", "Causas", "Diagnostico/solucion segura"], issues), "## Regla de oro", "Primero observar. Luego aislar. Finalmente corregir con prueba focal. No limpiar bases, borrar volumenes, resetear Git ni modificar evidencia para ocultar el sintoma."])


def doc_21() -> str:
    parts = ["## Convenciones", "Todos los paths listados son los declarados en rutas. El prefijo efectivo depende del montaje de Express. Permiso vacio significa que el CU no fue detectable en la ventana estatica; no significa endpoint publico.", "## Inventario", md_table(["Metodo", "Path", "CU detectado", "Handler", "Archivo:linea"], [(e["method"], e["path"], ", ".join(e["cu"]) or "Revisar autorizacion", ", ".join(e["handlers"]) or "inline/no detectado", f"{e['file']}:{e['line']}") for e in INV["endpoints"]])]
    for e in INV["endpoints"]:
        parts.extend([f"## {e['method']} `{e['path']}`", f"**Ruta:** `{e['file']}:{e['line']}`.  ", f"**Permiso detectado:** {', '.join(e['cu']) or 'NO CONFIRMADO por patron; revisar middleware/fachada'}.  ", f"**Controlador/fachada:** {', '.join(e['handlers']) or 'NO CONFIRMADO por patron'}.  ", "**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.", "**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.", "**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional."])
    return "\n".join(parts)


def doc_22() -> str:
    terms = [
        ("CU", "Permiso para una accion", "Codigo de caso de uso del catalogo M4"),
        ("M4", "Seguridad y permisos", "Autenticacion, sesion, perfiles, CU y alcance"),
        ("M9", "Auditoria", "Evidencia con integridad, correlacion e idempotencia"),
        ("Obra", "Lugar fisico", "Entidad reutilizable por varios proyectos"),
        ("Proyecto", "Pedido especifico", "Trabajo originado por una cotizacion y vinculado a obra"),
        ("OT", "Orden de Trabajo", "Trabajo operacional para una unidad fisica"),
        ("NV", "Nota de Venta", "Formalizacion comercial de lo contratado"),
        ("Unidad fisica", "Una puerta real", "Identidad individual entre detalle y OT"),
        ("Rectificacion", "Medicion/correccion tecnica", "Proceso versionado previo a produccion"),
        ("B2B", "Venta a empresa", "Segmento con empresa, contactos y servicios"),
        ("B2C", "Venta a particular", "Segmento que admite alternativas comerciales"),
        ("Snapshot", "Foto inmutable de datos", "JSON/version de valores usados en un hecho historico"),
        ("Idempotencia", "Repetir sin duplicar", "Clave/constraint que conserva un solo efecto"),
        ("Hash", "Huella digital", "SHA-256 u otra funcion aplicada a material canonico"),
        ("Migracion", "Cambio versionado de BD", "SQL incremental aplicado en orden"),
        ("Prisma", "Capa de acceso a datos", "ORM y schema tipado para PostgreSQL"),
        ("Endpoint", "Direccion de API", "Metodo HTTP y path que expone un caso"),
        ("Controller", "Regla de negocio", "Clase backend que valida y coordina persistencia"),
        ("Schema", "Agrupacion/definicion", "Namespace PostgreSQL o archivo Prisma"),
        ("Foreign Key", "Vinculo valido", "Constraint referencial entre tablas"),
        ("Revision optimista", "Evita pisar cambios", "Compara revision antes de actualizar"),
    ]
    return "\n".join(["## Terminos", md_table(["Termino", "Explicacion simple", "Explicacion tecnica"], terms)])


def doc_23() -> str:
    return """## Proceso recomendado

1. Convertir la necesidad humana en comportamiento observable.
2. Decidir si requiere CU; no inventar numeracion.
3. Definir actor, alcance y estados.
4. Diseñar interfaz sin confiarle la seguridad.
5. Definir endpoint y contrato.
6. Exponerlo por `C_Finanzas` si pertenece al sistema financiero.
7. Implementar controlador/servicio propietario.
8. Reutilizar modelos Prisma; si faltan, diseñar migracion aditiva.
9. Integrar M9 mediante el productor oficial.
10. Agregar pruebas unitarias, integracion y UI.
11. Actualizar manuales y trazabilidad.
12. Desplegar solo con autorizacion, respaldo y plan de rollback.

## Definition of Done

- Validacion backend completa.
- Permiso M4 explicito y probado.
- Escritura atomica o recuperable.
- Idempotencia donde hay reintentos.
- Auditoria M9 sin eventos ficticios.
- Estados vacios y errores diferenciados.
- Migracion no destructiva y validada.
- Builds y pruebas focales aprobadas.
- Documentacion actualizada.
- Sin secretos, temporales o datos reales en Git.
"""


def doc_24() -> str:
    return """## Patrones que ya usamos

- Fachada `C_Finanzas` entre rutas y controladores.
- Controladores M1-M9 por dominio.
- Transacciones Prisma para efectos relacionados.
- Revision optimista e idempotencia.
- Snapshots para historia comercial/documental.
- Productor oficial M9.
- StorageAdapter y AntivirusAdapter desacoplados.
- Modal centrado reutilizable para formularios/PDF.

## Antipatrones que debemos evitar

- Hardcodear IDs de usuarios, precios o permisos.
- Autorizar solo en React.
- Convertir 403 en lista vacia.
- Escribir directo en `evento_auditoria_m9` con hashes propios.
- Regenerar PDF historico con catalogos actuales.
- Usar costo interno como precio comercial.
- Crear una OT por servicio o alternativa descartada.
- Editar migraciones aplicadas.
- Ejecutar `git reset --hard`, `migrate reset` o limpiezas globales para arreglar pruebas.

## Regla de mantenimiento

Cambios pequenos, focales, con evidencia. Preservar trabajo ajeno y separar deuda heredada de regresiones nuevas.
"""


def doc_25() -> str:
    explanations = {
        "@prisma/client": "Cliente tipado para PostgreSQL", "prisma": "Schema, migraciones y generacion",
        "express": "Servidor y rutas HTTP", "react": "Interfaz declarativa", "react-router-dom": "Navegacion",
        "vite": "Desarrollo y empaquetado frontend", "typescript": "Tipos y compilacion", "vitest": "Pruebas frontend",
        "@testing-library/react": "Pruebas desde conducta visible", "@aws-sdk/client-s3": "Contrato S3-compatible",
        "exceljs": "Generacion/lectura de Excel", "recharts": "Graficos", "lucide-react": "Iconografia",
    }
    rows = [(d["workspace"], d["kind"], d["name"], d["version"], explanations.get(d["name"], "Dependencia declarada; localizar imports antes de actualizar")) for d in INV["dependencies"]]
    return "\n".join(["## Inventario", md_table(["Workspace", "Tipo", "Dependencia", "Version", "Uso/riesgo"], rows), "## Actualizaciones", "Actualizar una dependencia puede cambiar tipos, bundle, SQL generado o comportamiento. Revisar changelog oficial, ejecutar pruebas focales y completas segun riesgo, y no mezclar actualizacion masiva con una correccion funcional."])


def doc_26() -> str:
    flows = ["Login", "Crear cliente", "Crear cotizacion", "Preview PDF", "Emitir", "Aceptar B2B", "Aceptar B2C", "Crear NV", "Crear OT", "Rectificar", "Liberar a produccion", "Registrar pago", "Publicar documento", "Auditoria"]
    parts = ["## Patron comun", "```text\nUsuario -> Vista -> API -> Ruta -> C_Finanzas -> Controlador -> Prisma -> PostgreSQL\n                                                     -> M9 -> Respuesta\n```"]
    for flow in flows:
        parts.extend([f"## {flow}", "1. La persona inicia una accion visible.\n2. React valida formato basico y envia datos.\n3. La ruta autentica y delega.\n4. M4 verifica CU/alcance.\n5. El controlador valida estado y reglas.\n6. Prisma lee/escribe en transaccion cuando corresponde.\n7. M9 registra el hecho confirmado.\n8. La respuesta actualiza la pantalla.", "**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla."])
    return "\n".join(parts)


def doc_27() -> str:
    return """## Primeros cinco minutos

1. Confirmar alcance del incidente y hora.
2. Usar health checks.
3. Consultar estado de contenedores/procesos.
4. Leer logs acotados por servicio y correlacion.
5. Revisar dependencia: BD, storage, antivirus, proxy.

## Comandos seguros/lectura

- `git status`, `git log -1 --oneline`
- `docker compose ps`
- `docker compose logs --tail 200 <servicio>`
- `curl -f <health>`
- `npx prisma migrate status` con la URL correcta
- consultas SQL SELECT autorizadas y acotadas

## Comandos que modifican estado

- `git pull`, `docker compose up`, reinicios, migraciones, cambios de variables y rollback.
- Requieren autorizacion, respaldo y verificacion posterior.

## Dependencias documentales

Storage o antivirus caidos bloquean confirmacion de documentos. No se debe cambiar la politica a permisiva durante un incidente.

## Escalamiento

Entregar sintoma, impacto, hora, actor, ruta, status HTTP, correlacion, commit, estado de servicios y acciones ya realizadas. Nunca compartir secretos.
"""


def doc_28() -> str:
    debts = [
        ("Sustitucion de puerta con OT iniciada", "Pendiente de definicion intermodular", "Produccion/Inventario"),
        ("Region en costos internos M7 heredados", "Compatibilidad parcial; no inferir", "M7"),
        ("Fotografia comercial completa", "Depende de catalogo/documental autorizado", "Productos/Documental"),
        ("Validaciones visuales", "Pendientes de usuaria para documentos/pantallas", "UI/PDF"),
        ("Bundle Vite >500 kB", "Warning no bloqueante; evaluar code splitting", "Frontend"),
        ("CU377", "Bloqueado/no aprobado", "M4/Documental"),
        ("Politica productiva antivirus/storage", "Pruebas locales no equivalen a politica empresarial", "Documental"),
        ("Staging separado", "NO CONFIRMADO EN EL REPOSITORIO", "DevOps"),
    ]
    return "\n".join(["## Registro honesto", md_table(["Tema", "Estado", "Area"], debts), "## Uso", "La deuda no autoriza implementar cambios durante documentacion. Cada item requiere requerimiento, responsable, riesgo, prueba y autorizacion propios."])


def doc_29() -> str:
    history = git("log", "--date=short", "--pretty=format:%h|%ad|%s", "-80").splitlines()
    return "\n".join(["## Historial de commits usado", md_table(["Commit", "Fecha", "Decision/cambio"], [line.split("|", 2) for line in history]), "## Decisiones transversales", "- Cliente financiero autonomo: separa identidad financiera de tablas heredadas.\n- Obra vs Proyecto: lugar reutilizable frente a pedido independiente.\n- Unidad fisica vs producto: permite una OT por puerta sin duplicar catalogo.\n- PDF inmutable: conserva oferta emitida.\n- Midas: cuenta raiz con CU aprobados, sin bypass.\n- M9: evidencia canonica e integridad forense.\n- Storage/ClamAV: adaptadores privados y fail-closed.\n- Alternativas B2C: propuesta no equivale a contratacion."])


def doc_30() -> str:
    lessons = ["Levantar proyecto", "Encontrar una vista", "Seguir un endpoint", "Seguir Prisma", "Modificar una funcionalidad simple", "Crear una prueba", "Entender M4", "Entender M9", "Trazar una cotizacion", "Trazar una OT"]
    parts = []
    for i, name in enumerate(lessons, 1):
        parts.extend([f"## Leccion {i}: {name}", "### Teoria", "Trabaje desde evidencia: ubique entrada, contrato, regla, persistencia, permiso, auditoria y prueba. No suponga que un boton demuestra el flujo completo.", "### Ejercicio", f"Localice en el SHA documentado todos los archivos que participan en: {name}. Anote ruta, metodo, modelo y prueba.", "### Solucion orientativa", "Empiece por rutas React o HTTP; siga imports/llamadas hasta controlador y Prisma; busque el caso en pruebas y el CU en M4.", "### Comprobacion", "1. ¿Que archivo inicia el flujo?\n2. ¿Quien autoriza?\n3. ¿Que tabla cambia?\n4. ¿Que prueba evita una regresion?\n5. ¿Que estado de error debe verse?"])
    return "\n".join(parts)


def doc_31() -> str:
    qs = [
        ("Basica", "¿Que diferencia hay entre Obra y Proyecto?", "Obra es el lugar; Proyecto es un pedido/trabajo. Una obra puede tener varios proyectos."),
        ("Basica", "¿Preview PDF emite?", "No. No crea NV, OT ni documento historico confirmado."),
        ("Intermedia", "¿Por que un 403 no debe verse como lista vacia?", "Oculta una falla de autorizacion y conduce a diagnosticos falsos."),
        ("Intermedia", "¿Como se evita duplicar NV/OT?", "Transaccion, constraints, revision e idempotencia."),
        ("Avanzada", "¿Por que PostgreSQL y S3 requieren coordinacion?", "No comparten transaccion; se necesitan estados, reintentos y reconciliacion."),
        ("Avanzada", "¿Que hacer con un evento M9 invalido?", "Conservarlo, marcar comprometido y seguir mostrando validos; no reescribir hash."),
        ("Debug", "Midas no ve OT y no tiene alcanceEmpleadoId", "Revisar administrador_original y CU generales; la raiz no debe quedar limitada por empleado."),
        ("BD", "¿Se asigna obra heredada por direccion parecida?", "No. Se deja sin vinculo hasta seleccion explicita."),
        ("Seguridad", "¿Midas puede saltar antivirus?", "No. Tener CU no elimina controles de integridad o estado."),
    ]
    parts = ["## Banco base"]
    for i, (level, q, a) in enumerate(qs, 1):
        parts.extend([f"## Pregunta {i} - {level}", f"**Pregunta:** {q}", f"**Respuesta:** {a}", "**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres."])
    return "\n".join(parts)


def doc_32() -> str:
    return """## Git

`git status --short` estado; `git diff --check` whitespace; `git log -1 --oneline` commit. Evitar reset/clean destructivos.

## npm

`npm install`, `npm run dev`, `npm run build`, `npm test`. Ejecutar en Controladores o Vistas segun corresponda.

## Prisma/PostgreSQL

`npx prisma validate`, `npx prisma generate`, `npx prisma migrate status`, `npx prisma migrate deploy`. Nunca reset en produccion.

## Docker

`docker compose ps`, `logs`, `build`, `up -d`. No usar limpiezas globales en servidor compartido.

## Arquitectura

Vista -> API -> ruta -> C_Finanzas -> controlador -> Prisma -> PostgreSQL -> M9.

## M4

Sesion + perfil + CU efectivo + dependencia + alcance + estado. CU377 bloqueado.

## M9

Usar productor oficial. Nunca escribir hashes propios ni corregir evidencia historica.

## Nomenclatura

B2B empresa; B2C particular; NV nota de venta; OT orden de trabajo; unidad fisica una puerta; Obra lugar; Proyecto pedido.
"""


def doc_33() -> str:
    tree = defaultdict(list)
    for file in INV["files"]:
        top = file.split("/", 1)[0]
        tree[top].append(file)
    parts = ["## Resumen", md_table(["Carpeta raiz", "Archivos"], [(k, len(v)) for k, v in sorted(tree.items())])]
    for top, files in sorted(tree.items()):
        parts.extend([f"## `{top}/`", "Contiene los siguientes archivos relevantes:", *[f"- `{f}` - {Path(f).stem.replace('_', ' ')}." for f in files]])
    return "\n".join(parts)


def doc_34() -> str:
    rows = []
    cu_codes = [c["code"] for c in INV["cu"]]
    for idx, e in enumerate(INV["endpoints"]):
        matching_test = next((t["file"] for t in INV["tests"] if any(word.lower() in t["file"].lower() for word in e["path"].strip("/").split("/") if len(word) > 4)), "Cobertura no enlazada automaticamente")
        rows.append(("API", e["path"], ",".join(e["cu"]) or "Revisar", "Actor autenticado", "Ver rutas React", "Ver componente", "Ver App", f"{e['method']} {e['path']}", "C_Finanzas", ",".join(e["handlers"]), "Servicio segun controlador", "Ver schema", "Ver schema", "Ver migraciones", ",".join(e["cu"]), "Ver M9", matching_test, "Ver pruebas UI", "Ver suites focales", "Detectado", e["file"]))
    return "\n".join(["## Matriz", md_table(["Area", "Funcionalidad", "CU", "Actor", "Vista", "Componente", "Ruta FE", "Endpoint", "Fachada", "Controlador", "Servicio", "Modelo", "Tabla", "Migracion", "Permiso", "M9", "Test BE", "Test FE", "Integracion", "Estado", "Observaciones"], rows), "## Cobertura CU", f"CU detectados en repositorio: {len(cu_codes)}. CU377 se mantiene bloqueado."])


def doc_35() -> str:
    parts = ["## Enums Prisma detectados"]
    for enum in INV["enums"]:
        parts.extend([f"## `{enum['name']}`", f"Definido en `Controladores/prisma/schema.prisma:{enum['line']}`.", md_table(["Estado/valor", "Regla de transicion"], [(v, "La accion y destino deben validarse en el controlador/servicio; el enum por si solo no autoriza transiciones.") for v in enum["values"]])])
    state_refs: dict[str, set[str]] = defaultdict(set)
    keywords = ("PENDIENTE", "APROBAD", "RECHAZ", "ACTIV", "INACTIV", "EMIT", "BORRADOR", "DISPON", "ERROR", "FALLID", "CERRAD", "ANUL", "PAGAD", "VALID", "PUBLIC", "RETIR", "SELECCION", "ACEPT", "CUARENTENA", "REEMPLAZ", "ARCHIV", "PRODUCCION", "RECTIFIC", "CREAD", "CONFIRM")
    for path in FILES:
        if path.suffix.lower() not in {".ts", ".tsx", ".cjs", ".sql"}:
            continue
        text = read(path)
        for value in re.findall(r"['\"]([A-Z][A-Z0-9_]{2,})['\"]", text):
            if any(key in value for key in keywords) and not value.startswith("CU"):
                state_refs[value].add(rel(path))
    parts.extend(["## Estados literales detectados", md_table(["Estado", "Referencias", "Regla de seguridad"], [(state, "; ".join(sorted(refs)[:4]), "Solo transiciones validadas por el controlador; conservar historia") for state, refs in sorted(state_refs.items())])])
    parts.extend(["## Maquinas principales", "Cotizacion: borrador -> emitida solo con documento confirmado. Alternativa: propuesta/seleccionada -> aceptada o rechazada/retirada segun invariantes. OT: pendiente de rectificacion -> rectificada -> aprobada tecnicamente -> liberada -> ejecucion/cierre. Documento: pendiente/validando -> disponible, cuarentena o error; una version confirmada no cambia bytes."])
    return "\n".join(parts)


def doc_36() -> str:
    return "\n".join(["## Inventario de ErrorAplicacion", md_table(["HTTP", "Mensaje", "Origen", "Linea", "Accion usuario/soporte"], [(e["status"], e["message"], e["file"], e["line"], "Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico") for e in INV["errors"]]), "## Interpretacion", "400 datos invalidos; 401 sesion/autenticacion; 403 autorizacion/alcance; 404 entidad; 409 conflicto/idempotencia/revision; 422 regla de negocio; 500 fallo no controlado. Confirmar siempre el uso real en el archivo citado."])


def doc_37() -> str:
    return """## Modelo de amenaza

El sistema protege documentos comerciales y evidencias frente a contenido malicioso, sustitucion, acceso indebido, exposicion publica y perdida de historia.

## Controles

- MIME declarado y detectado.
- Limites de tamano y cantidad.
- SHA-256 de bytes.
- Claves de objeto opacas sin datos personales.
- Antivirus ClamAV mediante adaptador y comportamiento fail-closed.
- Storage privado S3-compatible mediante StorageAdapter.
- Versiones inmutables y recuperacion por referencia.
- CU y alcance en backend.
- URLs temporales; nunca identidad permanente.
- Auditoria M9 sin secretos o binarios.

## Politica de error

Deteccion, timeout, servicio caido, hash incorrecto o fallo de storage impiden disponibilidad. No se marca LIMPIO o CONFIRMADO sin comprobacion real.

## Pruebas locales vs produccion

SeaweedFS/ClamAV locales demostraron contratos en aislamiento. Puertos, limites, region, cifrado, retencion y credenciales productivas requieren decisiones y autorizacion empresarial.
"""


def doc_38() -> str:
    counts = {
        "Archivos fuente inventariados": len(INV["files"]), "Endpoints detectados": len(INV["endpoints"]),
        "CU detectados": len(INV["cu"]), "Modelos Prisma": len(INV["models"]), "Enums Prisma": len(INV["enums"]),
        "Migraciones": len(INV["migrations"]), "Suites de prueba": len(INV["tests"]), "Metodos backend detectados": len(INV["methods"]),
        "Vistas TSX": len(INV["views"]), "Errores catalogados": len(INV["errors"]),
    }
    gaps = [
        ("Capturas visuales", "NO DOCUMENTADO", "No se inicio una app con datos demo durante esta generacion"),
        ("Staging", "NO CONFIRMADO", "No se demostro ambiente separado"),
        ("Secretos/infra productiva", "EXCLUIDO", "Deliberadamente no inspeccionados"),
        ("Semantica de endpoints dinamicos", "PARCIAL", "Patrones automaticos requieren validar middleware cuando no aparece CU"),
        ("Validacion visual de usuaria", "PENDIENTE", "No puede inferirse del codigo"),
    ]
    return "\n".join(["## Cobertura cuantitativa", md_table(["Categoria", "Cantidad"], counts.items()), "## Brechas declaradas", md_table(["Elemento", "Estado", "Motivo"], gaps), "## Objetivo de cero omisiones", "Los anexos JSON/CSV permiten detectar deltas. La cobertura es exhaustiva por inventario estatico del SHA, pero una descripcion generada no sustituye pruebas operativas. Todo archivo posterior al SHA queda fuera hasta regenerar."])


HANDLERS = {
    1: doc_01, 2: doc_02, 3: doc_03, 4: doc_04, 5: doc_05, 6: doc_06, 7: doc_07, 8: doc_08,
    9: doc_09, 10: doc_10, 11: doc_11, 12: doc_12, 13: doc_13, 14: doc_14, 15: doc_15, 16: doc_16,
    17: doc_17, 18: doc_18, 19: doc_19, 20: doc_20, 21: doc_21, 22: doc_22, 23: doc_23, 24: doc_24,
    25: doc_25, 26: doc_26, 27: doc_27, 28: doc_28, 29: doc_29, 30: doc_30, 31: doc_31, 32: doc_32,
    33: doc_33, 34: doc_34, 35: doc_35, 36: doc_36, 37: doc_37, 38: doc_38,
}


def register_fonts() -> tuple[str, str, str]:
    candidates = [
        (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf"), Path("C:/Windows/Fonts/consola.ttf")),
        (Path("C:/Windows/Fonts/calibri.ttf"), Path("C:/Windows/Fonts/calibrib.ttf"), Path("C:/Windows/Fonts/consola.ttf")),
    ]
    for normal, bold, mono in candidates:
        if normal.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("PBNormal", str(normal)))
            pdfmetrics.registerFont(TTFont("PBBold", str(bold)))
            if mono.exists():
                pdfmetrics.registerFont(TTFont("PBMono", str(mono)))
            else:
                pdfmetrics.registerFont(TTFont("PBMono", str(normal)))
            return "PBNormal", "PBBold", "PBMono"
    return "Helvetica", "Helvetica-Bold", "Courier"


FONT, BOLD, MONO = register_fonts()


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("PBTitle", parent=base["Title"], fontName=BOLD, fontSize=25, leading=30, textColor=BLACK, alignment=TA_CENTER, spaceAfter=8),
        "meta": ParagraphStyle("PBMeta", parent=base["Normal"], fontName=FONT, fontSize=9, leading=13, textColor=GREY, alignment=TA_CENTER),
        "h1": ParagraphStyle("PBH1", parent=base["Heading1"], fontName=BOLD, fontSize=17, leading=21, textColor=BLACK, spaceBefore=12, spaceAfter=7, keepWithNext=True),
        "h2": ParagraphStyle("PBH2", parent=base["Heading2"], fontName=BOLD, fontSize=13, leading=17, textColor=colors.HexColor("#333333"), spaceBefore=10, spaceAfter=5, keepWithNext=True),
        "h3": ParagraphStyle("PBH3", parent=base["Heading3"], fontName=BOLD, fontSize=10.5, leading=14, textColor=GREY, spaceBefore=7, spaceAfter=4, keepWithNext=True),
        "body": ParagraphStyle("PBBody", parent=base["BodyText"], fontName=FONT, fontSize=8.5, leading=12, textColor=BLACK, alignment=TA_LEFT, spaceAfter=5),
        "bullet": ParagraphStyle("PBBullet", parent=base["BodyText"], fontName=FONT, fontSize=8.3, leading=11.5, leftIndent=11, firstLineIndent=-6, spaceAfter=2),
        "code": ParagraphStyle("PBCode", parent=base["Code"], fontName=MONO, fontSize=7, leading=9, leftIndent=5, rightIndent=5, borderColor=colors.HexColor("#DDDDDD"), borderWidth=0.5, borderPadding=5, backColor=LIGHT, spaceBefore=4, spaceAfter=6),
        "small": ParagraphStyle("PBSmall", parent=base["BodyText"], fontName=FONT, fontSize=6.8, leading=8.5),
    }


ST = styles()


class PBTemplate(BaseDocTemplate):
    def __init__(self, filename: str, pb_title: str, **kwargs):
        super().__init__(filename, **kwargs)
        self.pb_title = pb_title
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([PageTemplate(id="main", frames=frame, onPage=self.decorate)])

    def decorate(self, canvas, doc):
        canvas.saveState()
        w, h = self.pagesize
        canvas.setStrokeColor(ORANGE); canvas.setLineWidth(1.8)
        canvas.line(self.leftMargin, h - 14 * mm, w - self.rightMargin, h - 14 * mm)
        canvas.setFont(FONT, 7); canvas.setFillColor(GREY)
        canvas.drawString(self.leftMargin, h - 11 * mm, "Puertas Blindadas - Biblioteca Maestra")
        canvas.drawRightString(w - self.rightMargin, h - 11 * mm, f"SHA {HEAD[:12]}")
        canvas.setStrokeColor(colors.HexColor("#DDDDDD")); canvas.setLineWidth(0.5)
        canvas.line(self.leftMargin, 13 * mm, w - self.rightMargin, 13 * mm)
        canvas.drawString(self.leftMargin, 9 * mm, self.pb_title[:72])
        canvas.drawRightString(w - self.rightMargin, 9 * mm, f"Pagina {doc.page}")
        canvas.restoreState()

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            style = flowable.style.name
            if style in {"PBH1", "PBH2", "PBH3"}:
                # El titulo H1 de portada no se entrega como flowable de encabezado.
                # Por eso los H2 son el primer nivel real del indice y los H3 el segundo.
                level = {"PBH1": 0, "PBH2": 0, "PBH3": 1}[style]
                text = flowable.getPlainText()
                key = f"h-{self.page}-{abs(hash((text, level, self.seq.nextf('h'))))}"
                self.canv.bookmarkPage(key)
                self.canv.addOutlineEntry(text, key, level=level, closed=False)
                self.notify("TOCEntry", (level, text, self.page, key))


def inline_md(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r"`([^`]+)`", r"<font name='PBMono'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", text)
    return text


def parse_table(lines: list[str], available_width: float = 174 * mm) -> Table:
    rows = []
    for line in lines:
        cells = [c.strip().replace("\\|", "|") for c in line.strip().strip("|").split("|")]
        rows.append(cells)
    if len(rows) > 1 and all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in rows[1]):
        rows.pop(1)
    max_cols = max(len(r) for r in rows)
    norm = [r + [""] * (max_cols - len(r)) for r in rows]
    col_widths = [available_width / max_cols] * max_cols
    data = [[Paragraph(inline_md(c), ST["small"]) for c in r] for r in norm]
    table = Table(data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ORANGE), ("TEXTCOLOR", (0, 0), (-1, 0), BLACK),
        ("FONTNAME", (0, 0), (-1, 0), BOLD), ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#BBBBBB")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3), ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT]),
    ]))
    return table


def markdown_flowables(markdown: str, title: str, available_width: float = 174 * mm):
    story = []
    lines = markdown.splitlines()
    i = 0
    first = True
    while i < len(lines):
        line = lines[i].rstrip()
        if line.startswith("# ") and first:
            story.extend([Spacer(1, 28 * mm), Paragraph(inline_md(line[2:]), ST["title"]), Spacer(1, 5 * mm), Paragraph(inline_md(f"Version {VERSION} | {ACTUAL_BRANCH} | {HEAD}"), ST["meta"]), Spacer(1, 4 * mm), Paragraph(inline_md(DATE), ST["meta"]), Spacer(1, 28 * mm), Paragraph("DOCUMENTACION TECNICA Y PEDAGOGICA", ST["meta"]), PageBreak()])
            first = False; i += 1; continue
        if line == "{{TOC}}":
            toc = TableOfContents(); toc.levelStyles = [
                ParagraphStyle("TOC1", fontName=BOLD, fontSize=9, leading=12, leftIndent=0, firstLineIndent=0, textColor=BLACK),
                ParagraphStyle("TOC2", fontName=FONT, fontSize=8, leading=10, leftIndent=12, firstLineIndent=0, textColor=GREY),
                ParagraphStyle("TOC3", fontName=FONT, fontSize=7, leading=9, leftIndent=24, firstLineIndent=0, textColor=GREY),
            ]; story.append(toc); story.append(PageBreak()); i += 1; continue
        if line.startswith("### "):
            story.append(Paragraph(inline_md(line[4:]), ST["h3"])); i += 1; continue
        if line.startswith("## "):
            story.append(Paragraph(inline_md(line[3:]), ST["h2"])); i += 1; continue
        if line.startswith("# "):
            story.append(Paragraph(inline_md(line[2:]), ST["h1"])); i += 1; continue
        if line.startswith("|") and i + 1 < len(lines) and lines[i + 1].startswith("|"):
            block = []
            while i < len(lines) and lines[i].startswith("|"):
                block.append(lines[i]); i += 1
            story.append(parse_table(block, available_width)); story.append(Spacer(1, 4 * mm)); continue
        if line.startswith("```"):
            lang = line[3:].strip(); i += 1; block = []
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i]); i += 1
            i += 1
            story.append(Preformatted("\n".join(block), ST["code"])); continue
        if line.startswith("- "):
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                items.append(ListItem(Paragraph(inline_md(lines[i][2:]), ST["bullet"]), leftIndent=10)); i += 1
            story.append(ListFlowable(items, bulletType="bullet", start="circle", leftIndent=12, bulletFontName=FONT, bulletFontSize=6)); story.append(Spacer(1, 2 * mm)); continue
        if re.match(r"^\d+\.\s", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s", lines[i]):
                items.append(ListItem(Paragraph(inline_md(re.sub(r"^\d+\.\s", "", lines[i])), ST["bullet"]), leftIndent=10)); i += 1
            story.append(ListFlowable(items, bulletType="1", leftIndent=14, bulletFontName=FONT, bulletFontSize=7)); story.append(Spacer(1, 2 * mm)); continue
        if line.startswith("> "):
            story.append(Table([[Paragraph(inline_md(line[2:]), ST["body"])]], colWidths=[170 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), LIGHT), ("BOX", (0, 0), (-1, -1), 0.7, ORANGE), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))); i += 1; continue
        if not line.strip():
            story.append(Spacer(1, 1.5 * mm)); i += 1; continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|- |\d+\. )", lines[i]):
            paragraph.append(lines[i].strip()); i += 1
        story.append(Paragraph(inline_md(" ".join(paragraph)), ST["body"]))
    return story


def write_diagrams():
    diagrams = {
        "01_arquitectura_logica.mmd": """flowchart LR
U[Usuario] --> FE[React Vite]
FE --> API[Express rutas]
API --> F[C_Finanzas]
F --> C[M1-M9 y servicios]
C --> P[Prisma]
P --> DB[(PostgreSQL)]
C --> M9[Auditoria M9]
C --> DOC[Servicio documental]
DOC --> AV[ClamAV]
DOC --> S3[Storage S3-compatible privado]
""",
        "02_ciclo_comercial.mmd": """flowchart LR
CL[Cliente] --> COT[Cotizacion]
COT --> PRE[Preview]
COT --> EMI[Emision PDF confirmada]
EMI --> ACE[Aceptacion]
ACE --> NV[Nota de Venta]
NV --> PRO[Proyecto]
PRO --> UF[Unidades fisicas]
UF --> OT[Ordenes de Trabajo]
""",
        "03_ot_produccion.mmd": """stateDiagram-v2
[*] --> PENDIENTE_RECTIFICACION
PENDIENTE_RECTIFICACION --> RECTIFICANDO: asignar y medir
RECTIFICANDO --> PENDIENTE_APROBACION: enviar version
PENDIENTE_APROBACION --> RECTIFICANDO: devolver
PENDIENTE_APROBACION --> APROBADA_TECNICAMENTE: aprobar
APROBADA_TECNICAMENTE --> LIBERADA: liberar
LIBERADA --> EN_PRODUCCION: iniciar tareas
EN_PRODUCCION --> CERRADA: validar y cerrar
""",
        "04_documental.mmd": """sequenceDiagram
participant C as Controlador
participant P as Motor PDF
participant A as ClamAV
participant S as StorageAdapter
participant D as PostgreSQL
C->>P: snapshot validado
P-->>C: PDF y SHA-256
C->>A: analizar bytes
A-->>C: LIMPIO
C->>S: guardar objeto privado
S-->>C: confirmacion
C->>D: documento/version/estado
D-->>C: emision confirmada
""",
        "05_obra_proyecto.mmd": """erDiagram
OBRA ||--o{ PROYECTO : contiene
COTIZACION ||--o| PROYECTO : origina
PROYECTO ||--o{ UNIDAD_FISICA : agrupa
UNIDAD_FISICA ||--|| ORDEN_TRABAJO : ejecuta
""",
    }
    for name, content in diagrams.items():
        (DIAGRAMAS / name).write_text(content, encoding="utf-8")


def generate():
    for folder in [FUENTES, PDFS, DIAGRAMAS, ANEXOS, INDICES]:
        folder.mkdir(parents=True, exist_ok=True)
    (INDICES / "inventario.json").write_text(json.dumps(INV, ensure_ascii=False, indent=2), encoding="utf-8")
    with (INDICES / "endpoints.csv").open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["method", "path", "file", "line", "handlers", "cu"]); writer.writeheader()
        for e in INV["endpoints"]: writer.writerow({**e, "handlers": ";".join(e["handlers"]), "cu": ";".join(e["cu"])})
    with (INDICES / "modelos.csv").open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f); writer.writerow(["modelo", "schema", "tabla", "campos", "linea"])
        for m in INV["models"]: writer.writerow([m["name"], m["schema"], m["table"], len(m["fields"]), m["line"]])
    write_diagrams()
    bug_file = LIB / "ANEXO_BUGS_ENCONTRADOS.md"
    bug_file.write_text(f"# Bugs encontrados durante documentacion\n\nCorte: `{HEAD}`.\n\nNo se confirmaron bugs nuevos durante la generacion estatica. Este archivo debe registrar hallazgos futuros sin corregirlos dentro de una tarea documental.\n", encoding="utf-8")

    manifest = []
    for number, slug, title in MANUALS:
        markdown = common_intro(title, number) + "\n" + HANDLERS[number]() + "\n\n" + source_note([
            "Controladores/prisma/schema.prisma", "Controladores/src/rutas/finanzas.ts", "Controladores/src/controladores/C_Finanzas.ts", "Vistas/src/App.tsx", "Controladores/pruebas", "Vistas/src"
        ]) + "\n"
        markdown = markdown.replace("  \n", "\n")
        md_path = FUENTES / f"{number:02d}_{slug}.md"
        pdf_path = PDFS / f"{number:02d}_{slug}.pdf"
        md_path.write_text(markdown, encoding="utf-8")
        page_size = landscape(A3) if number == 34 else A4
        available_width = page_size[0] - 36 * mm
        doc = PBTemplate(str(pdf_path), title, pagesize=page_size, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=20 * mm, bottomMargin=18 * mm, title=title, author="Puertas Blindadas")
        doc.multiBuild(markdown_flowables(markdown, title, available_width))
        reader = PdfReader(str(pdf_path))
        pages = len(reader.pages)
        manifest.append({"documento": title, "fuente": rel(md_path), "pdf": rel(pdf_path), "paginas": pages, "sha": HEAD, "fecha": DATE, "alcance": "Codigo, schema, migraciones, pruebas y documentos del SHA", "estado": "GENERADO"})

    manifest_lines = ["# Manifiesto de documentacion", "", f"**SHA:** `{HEAD}`  ", f"**Rama:** `{ACTUAL_BRANCH}`  ", f"**Fecha:** {DATE}", "", md_table(["Documento", "Fuente", "PDF", "Paginas", "SHA", "Fecha", "Alcance", "Estado"], [(m["documento"], m["fuente"], m["pdf"], m["paginas"], m["sha"], m["fecha"], m["alcance"], m["estado"]) for m in manifest])]
    (LIB / "MANIFIESTO_DOCUMENTACION.md").write_text("\n".join(manifest_lines).replace("  \n", "\n"), encoding="utf-8")
    links = "\n".join([f'<li><a href="pdf/{number:02d}_{slug}.pdf">{number:02d}. {html.escape(title)}</a><span>{next(m["paginas"] for m in manifest if m["documento"] == title)} paginas</span></li>' for number, slug, title in MANUALS])
    index = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Biblioteca Maestra - Puertas Blindadas</title><style>body{{font-family:Arial,sans-serif;margin:0;background:#fff;color:#000}}header{{border-top:8px solid #FE8F01;padding:2rem max(1rem,8vw);background:#f5f5f5}}main{{max-width:1100px;margin:auto;padding:2rem 1rem}}ul{{list-style:none;padding:0;display:grid;gap:.65rem}}li{{display:flex;justify-content:space-between;gap:1rem;border:1px solid #ddd;padding:1rem;border-left:4px solid #FE8F01}}a{{color:#000;font-weight:700;text-decoration:none}}span{{color:#676767;white-space:nowrap}}footer{{padding:2rem;color:#676767;text-align:center}}</style></head><body><header><h1>Biblioteca Maestra</h1><p>Puertas Blindadas - rama {ACTUAL_BRANCH} - SHA {HEAD}</p></header><main><p>Indice local de manuales PDF. Los Markdown editables estan en <code>fuentes/</code>.</p><ul>{links}</ul></main><footer>Generado {DATE}</footer></body></html>"""
    (LIB / "index.html").write_text(index, encoding="utf-8")
    print(json.dumps({"pdfs": len(manifest), "pages": sum(m["paginas"] for m in manifest), "head": HEAD, "library": str(LIB)}, ensure_ascii=False))


if __name__ == "__main__":
    generate()
