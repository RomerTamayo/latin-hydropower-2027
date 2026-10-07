# Guía de Conexión a Google Sheets (Cero Mantenimiento)
## VII Latin American Hydropower and Systems Meeting (LAHS 2027)

Esta guía te permite recibir tanto las **Preinscripciones de Participantes** como los **Resúmenes Científicos (Call for Papers)** directamente en una Hoja de Cálculo de Google Drive (`florestromer768@gmail.com`), sin necesidad de base de datos en los servidores de la UMSA.

---

### Paso 1: Crear la Hoja de Cálculo en Google Drive
1. Ingresa a [Google Sheets](https://sheets.new) con tu cuenta de correo (`florestromer768@gmail.com`).
2. Nombra el documento: **`Registros y Resumenes - LAHS 2027`**.
3. En la parte inferior, crea **2 pestañas (hojas)**:
   - Pestaña 1: **`Inscripciones`**
   - Pestaña 2: **`Resumenes`**

4. En la pestaña **`Inscripciones`**, coloca en la Fila 1:
   - **A1:** `Fecha Registro` | **B1:** `Nombre Completo` | **C1:** `Correo` | **D1:** `Teléfono` | **E1:** `País` | **F1:** `Institución` | **G1:** `Categoría` | **H1:** `Comentarios`

5. En la pestaña **`Resumenes`**, coloca en la Fila 1:
   - **A1:** `Fecha Envío` | **B1:** `Título del Trabajo` | **C1:** `Autores` | **D1:** `Email Contacto` | **E1:** `Eje Temático` | **F1:** `Resumen (Abstract)`

---

### Paso 2: Crear el Script en Google Apps Script
1. En el menú superior de la hoja, haz clic en **Extensiones** > **Apps Script**.
2. Borra el código existente y pega el siguiente script unificado:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var p = e.parameter;
    var tipo = p.tipo || 'inscripcion';
    var ahora = new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' });

    if (tipo === 'resumen') {
      var sheetResumenes = ss.getSheetByName('Resumenes');
      sheetResumenes.appendRow([
        ahora,
        p.titulo || '',
        p.autores || '',
        p.email || '',
        p.ejeTematico || '',
        p.resumen || ''
      ]);

      // Notificación por correo
      MailApp.sendEmail(
        "florestromer768@gmail.com",
        "📄 Nuevo Resumen Científico LAHS 2027: " + p.titulo,
        "Se ha recibido un nuevo resumen para el congreso LAHS 2027:\n\n" +
        "Título: " + p.titulo + "\n" +
        "Autores: " + p.autores + "\n" +
        "Email: " + p.email + "\n" +
        "Eje Temático: " + p.ejeTematico + "\n\n" +
        "Texto:\n" + p.resumen
      );
    } else {
      var sheetInscripciones = ss.getSheetByName('Inscripciones');
      sheetInscripciones.appendRow([
        ahora,
        p.nombre || '',
        p.email || '',
        p.telefono || '',
        p.pais || '',
        p.institucion || '',
        p.categoria || '',
        p.comentarios || ''
      ]);

      // Notificación por correo
      MailApp.sendEmail(
        "florestromer768@gmail.com",
        "⚡ Nueva Preinscripción LAHS 2027: " + p.nombre,
        "Nuevo participante registrado para LAHS 2027 (La Paz, Bolivia):\n\n" +
        "Nombre: " + p.nombre + "\n" +
        "Email: " + p.email + "\n" +
        "Institución: " + p.institucion + "\n" +
        "País: " + p.pais + "\n" +
        "Categoría: " + p.categoria
      );
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Guarda con Ctrl + S.
4. Haz clic en **Implementar (Deploy)** > **Nueva implementación**.
5. Selecciona tipo **Aplicación web**.
   - Acceso: **Cualquier usuario (Anyone)**.
6. Copia la URL terminada en `/exec`.

---

### Paso 3: Conectar la URL con la Web
En tu archivo `index.html` o en `src/main.ts`, defines:
```html
<script>
  window.GOOGLE_SHEETS_ENDPOINT = "TU_URL_DE_APPS_SCRIPT_AQUI";
</script>
```

¡Todo funcionará de forma automática y transparente!
