<?php
/**
 * Copiar este archivo a mailgun.local.php en el mismo directorio y rellenar.
 * mailgun.local.php no debe versionarse (está en .gitignore).
 */

declare(strict_types=1);

return [
    'apiKey' => 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'domain' => 'mg.ce4ly.cl',
    /** https://api.mailgun.net (US) o https://api.eu.mailgun.net (EU) */
    'apiBase' => 'https://api.eu.mailgun.net',
    'from' => 'Radio Club Lircay <noreply@mg.ce4ly.cl>',
    /** Opcional; por defecto contacto@ce4ly.cl */
    'to' => 'contacto@ce4ly.cl',
];
