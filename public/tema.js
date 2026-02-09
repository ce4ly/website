// Aplica el tema guardado antes de pintar la página (sin esto, el tema oscuro parpadea en claro).
// Va en un archivo aparte y no en línea para que la CSP no tenga que permitir scripts en línea.
try {
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark')
} catch {
  // Sin almacenamiento disponible: tema claro.
}
