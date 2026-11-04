from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader


SCRIPT = Path(__file__).resolve()
LIB = SCRIPT.parents[1]
PDFS = LIB / "pdf"
FUENTES = LIB / "fuentes"
INDICES = LIB / "indices"
HEAD = "d0735003f88a6b6a5d540049866bd74a680c2e04"


def main() -> None:
    pdfs = sorted(PDFS.glob("*.pdf"))
    markdowns = sorted(path for path in FUENTES.glob("*.md") if path.name[:2].isdigit())
    errors: list[str] = []
    warnings: list[str] = []
    records = []
    total_pages = 0
    if len(pdfs) != 38:
        errors.append(f"Se esperaban 38 PDF y existen {len(pdfs)}")
    if len(markdowns) != 38:
        errors.append(f"Se esperaban 38 Markdown y existen {len(markdowns)}")

    for pdf in pdfs:
        reader = PdfReader(str(pdf))
        pages = len(reader.pages)
        total_pages += pages
        if pages == 0:
            errors.append(f"{pdf.name}: sin paginas")
        first_text = "\n".join((page.extract_text() or "") for page in reader.pages[:3])
        if HEAD not in first_text:
            errors.append(f"{pdf.name}: SHA no visible en las primeras paginas")
        empty_pages = []
        out_of_bounds = 0
        with pdfplumber.open(pdf) as document:
            for index, page in enumerate(document.pages, 1):
                text = page.extract_text() or ""
                if len(text.strip()) < 8:
                    empty_pages.append(index)
                for char in page.chars:
                    if char.get("x0", 0) < -1 or char.get("x1", 0) > page.width + 1 or char.get("top", 0) < -1 or char.get("bottom", 0) > page.height + 1:
                        out_of_bounds += 1
        if empty_pages:
            warnings.append(f"{pdf.name}: paginas con texto minimo {empty_pages[:12]}")
        if out_of_bounds:
            errors.append(f"{pdf.name}: {out_of_bounds} caracteres fuera de pagina")
        md = FUENTES / f"{pdf.stem}.md"
        if not md.exists():
            errors.append(f"{pdf.name}: falta fuente Markdown")
        records.append({
            "pdf": pdf.name,
            "pages": pages,
            "bytes": pdf.stat().st_size,
            "sha256": hashlib.sha256(pdf.read_bytes()).hexdigest(),
            "emptyPages": empty_pages,
            "outOfBoundsCharacters": out_of_bounds,
        })

    index = (LIB / "index.html").read_text(encoding="utf-8")
    links = re.findall(r'href="([^"]+\.pdf)"', index)
    if len(links) != 38:
        errors.append(f"index.html contiene {len(links)} enlaces PDF")
    for link in links:
        if not (LIB / link).exists():
            errors.append(f"Enlace roto: {link}")

    result = {
        "status": "OK" if not errors else "ERROR",
        "pdfCount": len(pdfs),
        "markdownCount": len(markdowns),
        "totalPages": total_pages,
        "errors": errors,
        "warnings": warnings,
        "documents": records,
    }
    (INDICES / "validacion_pdf.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    summary = [
        "# Validacion de la biblioteca",
        "",
        f"- Estado: **{result['status']}**",
        f"- PDF: **{len(pdfs)}**",
        f"- Markdown: **{len(markdowns)}**",
        f"- Paginas: **{total_pages}**",
        f"- Errores: **{len(errors)}**",
        f"- Advertencias: **{len(warnings)}**",
        "",
        "## Errores",
        *(f"- {item}" for item in errors),
        "",
        "## Advertencias",
        *(f"- {item}" for item in warnings),
    ]
    (INDICES / "VALIDACION.md").write_text("\n".join(summary), encoding="utf-8")
    print(json.dumps({key: result[key] for key in ["status", "pdfCount", "markdownCount", "totalPages", "errors", "warnings"]}, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
