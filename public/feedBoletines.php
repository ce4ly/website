<?php
/**
 * Feed RSS público. Apache en producción no aplica las reglas del .htaccess,
 * así que esta URL tiene que ser un archivo .php real (no un rewrite a .xml).
 */
declare(strict_types=1);

require __DIR__ . '/api/boletines.php';
