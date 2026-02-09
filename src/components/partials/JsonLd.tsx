/**
 * Datos estructurados (schema.org). No es JavaScript ejecutable, así que la CSP no lo bloquea.
 * Se escapa `<` para que ningún texto pueda cerrar el `<script>` antes de tiempo.
 */
const JsonLd = ({ data }: { data: object }) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll('<', '\\u003c') }}
  />
)

export default JsonLd
