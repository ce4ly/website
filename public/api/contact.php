<?php
/**
 * Formulario de contacto → Mailgun (misma lógica que server/mailgun-contact.js).
 * Config: copiar mailgun.local.example.php a mailgun.local.php y editar.
 *
 * PHP 8.1+ con ext-curl. El archivo sale en dist/api/ tras `vite build`.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido'], flags: JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Cuerpo JSON inválido'], flags: JSON_UNESCAPED_UNICODE);
    exit;
}

$configPath = __DIR__ . '/mailgun.local.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(
        [
            'ok' => false,
            'error' =>
                'Correo no configurado: crea public/api/mailgun.local.php a partir del ejemplo.',
        ],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

/** @var array{apiKey:string,domain:string,from:string,to?:string,region?:string} $config */
$config = require $configPath;

$hp = trim((string) ($data['website_url'] ?? ''));
if ($hp !== '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Solicitud no válida'], flags: JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if (strlen($name) < 2 || strlen($name) > 120) {
    http_response_code(400);
    echo json_encode(
        ['ok' => false, 'error' => 'Indica un nombre válido (2–120 caracteres).'],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

if (
    !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email) ||
    strlen($email) > 254
) {
    http_response_code(400);
    echo json_encode(
        ['ok' => false, 'error' => 'Indica un correo electrónico válido.'],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

if (strlen($message) < 10 || strlen($message) > 8000) {
    http_response_code(400);
    echo json_encode(
        [
            'ok' => false,
            'error' => 'El mensaje debe tener entre 10 y 8.000 caracteres.',
        ],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

$apiKey = trim((string) ($config['apiKey'] ?? ''));
$domain = trim((string) ($config['domain'] ?? ''));
$from = trim((string) ($config['from'] ?? ''));
$to = trim((string) ($config['to'] ?? 'contacto@ce4ly.cl'));
$region = strtolower(trim((string) ($config['region'] ?? 'us')));

if ($apiKey === '' || $domain === '' || $from === '') {
    http_response_code(503);
    echo json_encode(
        ['ok' => false, 'error' => 'Faltan apiKey, domain o from en mailgun.local.php.'],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

$base =
    $region === 'eu'
        ? 'https://api.eu.mailgun.net/v3'
        : 'https://api.mailgun.net/v3';
$endpoint = $base . '/' . rawurlencode($domain) . '/messages';

$subject = 'Contacto web CE4LY — ' . $name;
$textBody = "Nombre: {$name}\nCorreo: {$email}\n\nMensaje:\n{$message}";

$esc = static function (string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
};

$htmlBody =
    '<p><strong>Nombre:</strong> ' .
    $esc($name) .
    '</p><p><strong>Correo:</strong> ' .
    $esc($email) .
    '</p><p><strong>Mensaje:</strong></p><p>' .
    nl2br($esc($message), false) .
    '</p>';

$postBody = http_build_query(
    [
        'from' => $from,
        'to' => $to,
        'subject' => $subject,
        'text' => $textBody,
        'html' => $htmlBody,
        'h:Reply-To' => $email,
    ],
    '',
    '&',
    PHP_QUERY_RFC3986
);

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postBody,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_USERPWD => 'api:' . $apiKey,
    CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno !== 0) {
    error_log('[contact.php] cURL error: ' . $errno);
    http_response_code(502);
    echo json_encode(
        [
            'ok' => false,
            'error' =>
                'No se pudo enviar el mensaje. Intenta más tarde o escríbenos directamente.',
        ],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
    error_log(
        '[contact.php] Mailgun HTTP ' .
            $httpCode .
            ': ' .
            substr((string) $response, 0, 400)
    );
    http_response_code(502);
    echo json_encode(
        [
            'ok' => false,
            'error' =>
                'No se pudo enviar el mensaje. Intenta más tarde o escríbenos directamente.',
        ],
        flags: JSON_UNESCAPED_UNICODE
    );
    exit;
}

echo json_encode(['ok' => true], flags: JSON_UNESCAPED_UNICODE);
