<?php
/**
 * Copiar este archivo a mailgun.local.php en el mismo directorio y rellenar.
 * mailgun.local.php no debe versionarse (está en .gitignore).
 */

declare(strict_types=1);

return [
    'apiKey' => 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'domain' => 'mg.ce4ly.cl',
    /** us o eu (debe coincidir con tu cuenta Mailgun) */
    'region' => 'us',
    'from' => 'Radio Club Lircay <noreply@mg.ce4ly.cl>',
    /** Opcional; por defecto el script usa contacto@ce4ly.cl */
    'to' => 'contacto@ce4ly.cl',
];
