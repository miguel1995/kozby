/** Imprime el PNG del recibo en un iframe oculto (sin ventana emergente). */
export const printReciboBlob = (blob) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', 'Imprimir recibo');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = win.document;
    let cleaned = false;

    const teardown = () => {
      if (cleaned) return;
      cleaned = true;
      URL.revokeObjectURL(objectUrl);
      iframe.remove();
    };

    const fail = (msg) => {
      teardown();
      reject(new Error(msg));
    };

    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recibo</title>' +
        '<style>@page{margin:10mm}body{margin:0;text-align:center;background:#fff}' +
        'img{max-width:100%;height:auto}</style></head><body>' +
        `<img id="recibo" src="${objectUrl}" alt="Recibo" /></body></html>`
    );
    doc.close();

    const img = doc.getElementById('recibo');
    const runPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
        fail('No se pudo abrir el diálogo de impresión.');
        return;
      }
      const onDone = () => {
        win.removeEventListener('afterprint', onDone);
        teardown();
      };
      win.addEventListener('afterprint', onDone);
      window.setTimeout(onDone, 60000);
      resolve();
    };

    if (img.complete && img.naturalWidth > 0) {
      runPrint();
    } else {
      img.onload = runPrint;
      img.onerror = () => fail('No se pudo cargar el recibo para imprimir.');
    }
  });
