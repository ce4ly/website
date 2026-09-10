<?php
/**
 * Formulario de contacto → Mailgun (misma lógica que server/mailgun-contact.js).
 * Acepta application/x-www-form-urlencoded (envío nativo) y JSON.
 * Config: `npm run build` escribe mailgun.local.php en dist/api/ desde .env.
 *
 * PHP 8.1+ con ext-curl. Sale en dist/api/ tras `vite build`.
 */

declare(strict_types=1);

ob_start();

const CONTACT_TO_DEFAULT = 'contacto@ce4ly.cl';
const CONTACTO_API = '/api/contact.php';
const TIEMPO_MINIMO_MS = 3000;
const TASA_MAXIMA = 5;
const TASA_VENTANA_S = 3600;
const CAPTCHA_FALLBACK = 'ce4ly-captcha-v1';

function load_config(): array
{
    $path = __DIR__ . '/mailgun.local.php';
    if (!is_readable($path)) {
        return [];
    }
    $config = require $path;
    return is_array($config) ? $config : [];
}

function captcha_secret(array $config): string
{
    $s = trim((string) ($config['captchaSecret'] ?? ''));
    if ($s !== '') {
        return $s;
    }
    $k = trim((string) ($config['apiKey'] ?? ''));
    if ($k !== '') {
        return $k;
    }
    return CAPTCHA_FALLBACK;
}

function crear_captcha(string $secret): array
{
    $a = random_int(2, 10);
    $b = random_int(2, 10);
    $exp = (int) round(microtime(true) * 1000) + 30 * 60 * 1000;
    $payload = $exp . '.' . $a . '.' . $b;
    $suma = $a + $b;
    $sig = hash_hmac('sha256', $payload . '.' . $suma, $secret);
    return [
        'pregunta' => '¿Cuánto es ' . $a . ' + ' . $b . '?',
        'token' => $payload . '.' . $sig,
    ];
}

function verificar_captcha(string $secret, mixed $token, mixed $respuesta): bool
{
    $partes = explode('.', (string) $token);
    if (count($partes) !== 4) {
        return false;
    }
    [$expStr, $aStr, $bStr, $sig] = $partes;
    if (!preg_match('/^\d+$/', $expStr) || !preg_match('/^\d+$/', $aStr) || !preg_match('/^\d+$/', $bStr)) {
        return false;
    }
    $exp = (int) $expStr;
    $a = (int) $aStr;
    $b = (int) $bStr;
    $ahora = (int) round(microtime(true) * 1000);
    if ($exp < $ahora || $a < 1 || $b < 1) {
        return false;
    }
    $suma = $a + $b;
    if (trim((string) $respuesta) !== (string) $suma) {
        return false;
    }
    $esperado = hash_hmac('sha256', $expStr . '.' . $aStr . '.' . $bStr . '.' . $suma, $secret);
    return hash_equals($esperado, $sig);
}

function wants_json(): bool
{
    $mode = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_MODE'] ?? ''));
    if ($mode === 'cors' || $mode === 'same-origin') {
        return true;
    }
    $accept = (string) ($_SERVER['HTTP_ACCEPT'] ?? '');
    $ct = (string) ($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');
    $xhr = (string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '');
    return str_contains($accept, 'application/json')
        || str_contains($ct, 'application/json')
        || strcasecmp($xhr, 'fetch') === 0
        || strcasecmp($xhr, 'XMLHttpRequest') === 0;
}

function discard_output(): void
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
}

function send_json(int $status, array $payload): never
{
    discard_output();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function send_html(int $status, array $result): never
{
    discard_output();
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    if (!empty($result['ok'])) {
        echo '<!DOCTYPE html><html lang="es-CL"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Mensaje enviado — Radio Club Lircay CE4LY</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem">';
        echo '<h1>Mensaje enviado</h1><p>Gracias. Recibimos tu mensaje y te responderemos lo antes posible.</p>';
        echo '<p><a href="/contacto">Enviar otro mensaje</a> · <a href="/">Inicio</a></p></body></html>';
        exit;
    }
    $v = $result['values'] ?? [];
    $err = $result['fieldErrors'] ?? [];
    echo '<!DOCTYPE html><html lang="es-CL"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contacto — Radio Club Lircay CE4LY</title></head>';
    echo '<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem">';
    echo '<h1>Contacto</h1><p>Escríbenos a <a href="mailto:' . CONTACT_TO_DEFAULT . '">' . CONTACT_TO_DEFAULT . '</a>. Talca, Región del Maule.</p>';
    if (!empty($result['error'])) {
        echo '<p role="alert" style="background:#fef2f2;border:1px solid #fecaca;padding:0.75rem;border-radius:0.5rem">' . e((string) $result['error']) . '</p>';
    }
    if (empty($result['captcha']['token'])) {
        $result['captcha'] = crear_captcha(captcha_secret(load_config()));
    }
    echo '<form method="POST" action="' . CONTACTO_API . '">';
    echo '<div style="position:absolute;left:-9999px" aria-hidden="true"><label>Deja este campo vacío</label><input name="website_url" tabindex="-1" autocomplete="off"></div>';
    echo '<input type="hidden" name="captcha_token" value="' . e((string) $result['captcha']['token']) . '">';
    $campos = [
        ['nombre', 'Nombre', 'text', true],
        ['correo', 'Correo electrónico', 'email', true],
        ['indicativo', 'Indicativo (opcional)', 'text', false],
        ['asunto', 'Asunto', 'text', true],
    ];
    foreach ($campos as [$name, $label, $type, $req]) {
        $val = e((string) ($v[$name] ?? ''));
        $reqAttr = $req ? ' required' : '';
        echo '<p><label>' . e($label) . '<br><input name="' . $name . '" type="' . $type . '" value="' . $val . '"' . $reqAttr . ' style="width:100%"></label>';
        if (!empty($err[$name])) {
            echo '<br><small style="color:#b91c1c">' . e((string) $err[$name]) . '</small>';
        }
        echo '</p>';
    }
    echo '<p><label>Mensaje<br><textarea name="mensaje" required rows="6" style="width:100%">' . e((string) ($v['mensaje'] ?? '')) . '</textarea></label>';
    if (!empty($err['mensaje'])) {
        echo '<br><small style="color:#b91c1c">' . e((string) $err['mensaje']) . '</small>';
    }
    echo '</p>';
    echo '<p><label>' . e((string) ($result['captcha']['pregunta'] ?? 'Comprobación')) . '<br>';
    echo '<input name="captcha_respuesta" type="text" inputmode="numeric" autocomplete="off" required style="width:100%"></label>';
    if (!empty($err['captcha_respuesta'])) {
        echo '<br><small style="color:#b91c1c">' . e((string) $err['captcha_respuesta']) . '</small>';
    }
    echo '</p><p><button type="submit">Enviar mensaje</button></p></form></body></html>';
    exit;
}

function respond(array $result): never
{
    $status = !empty($result['ok']) ? 200 : (int) ($result['status'] ?? 400);
    if (wants_json()) {
        if (!empty($result['ok'])) {
            send_json(200, ['ok' => true]);
        }
        $payload = [
            'ok' => false,
            'error' => $result['error'] ?? 'Error',
            'fieldErrors' => $result['fieldErrors'] ?? [],
            'values' => $result['values'] ?? [],
        ];
        if (!empty($result['captcha'])) {
            $payload['captcha'] = $result['captcha'];
        }
        send_json($status, $payload);
    }
    send_html($status, $result);
}

function client_ip(): string
{
    $xf = (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
    if ($xf !== '') {
        return trim(explode(',', $xf)[0]);
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function permitir_envio(string $ip): bool
{
    $file = sys_get_temp_dir() . '/ce4ly-contact-rate.json';
    $ahora = time();
    $data = [];
    if (is_readable($file)) {
        $raw = file_get_contents($file);
        $data = is_string($raw) ? (json_decode($raw, true) ?: []) : [];
    }
    $previos = array_values(array_filter(
        $data[$ip] ?? [],
        static fn ($t) => $ahora - (int) $t < TASA_VENTANA_S
    ));
    if (count($previos) >= TASA_MAXIMA) {
        $data[$ip] = $previos;
        file_put_contents($file, json_encode($data), LOCK_EX);
        return false;
    }
    $previos[] = $ahora;
    $data[$ip] = $previos;
    file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}

function leer_cuerpo(): array
{
    $ct = (string) ($_SERVER['CONTENT_TYPE'] ?? '');
    if (str_contains($ct, 'application/json')) {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
    return $_POST;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $captcha = crear_captcha(captcha_secret(load_config()));
    if (wants_json()) {
        send_json(200, ['ok' => true, 'pregunta' => $captcha['pregunta'], 'token' => $captcha['token']]);
    }
    send_html(200, ['captcha' => $captcha]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'status' => 405, 'error' => 'Método no permitido']);
}

$data = leer_cuerpo();
$hp = trim((string) ($data['website_url'] ?? ''));
if ($hp !== '') {
    respond(['ok' => true]);
}

$t0 = trim((string) ($data['t0'] ?? ''));
if ($t0 !== '' && is_numeric($t0) && (int) (microtime(true) * 1000) - (int) $t0 < TIEMPO_MINIMO_MS) {
    respond(['ok' => true]);
}

$nombre = trim((string) ($data['nombre'] ?? $data['name'] ?? ''));
$correo = trim((string) ($data['correo'] ?? $data['email'] ?? ''));
$indicativo = trim((string) ($data['indicativo'] ?? $data['callsign'] ?? ''));
$asunto = trim((string) ($data['asunto'] ?? $data['subject'] ?? ''));
$mensaje = trim((string) ($data['mensaje'] ?? $data['message'] ?? ''));
$values = compact('nombre', 'correo', 'indicativo', 'asunto', 'mensaje');

$config = load_config();
$secret = captcha_secret($config);

if (!permitir_envio(client_ip())) {
    respond([
        'ok' => false,
        'status' => 429,
        'error' => 'Hay muchos envíos desde tu red. Espera un rato o escribe a contacto@ce4ly.cl.',
        'fieldErrors' => [],
        'values' => $values,
        'captcha' => crear_captcha($secret),
    ]);
}

$fieldErrors = [];
if (strlen($nombre) < 2 || strlen($nombre) > 120) {
    $fieldErrors['nombre'] = 'Indica un nombre (2–120 caracteres).';
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL) || strlen($correo) > 254) {
    $fieldErrors['correo'] = 'Indica un correo electrónico válido.';
}
if ($indicativo !== '' && (strlen($indicativo) > 15 || !preg_match('#^[A-Za-z0-9/]*$#', $indicativo))) {
    $fieldErrors['indicativo'] = 'El indicativo solo admite letras, números y /.';
}
if (strlen($asunto) < 2 || strlen($asunto) > 200) {
    $fieldErrors['asunto'] = 'Indica un asunto (2–200 caracteres).';
}
if (strlen($mensaje) < 10 || strlen($mensaje) > 8000) {
    $fieldErrors['mensaje'] = 'El mensaje debe tener entre 10 y 8.000 caracteres.';
}
if (!verificar_captcha($secret, $data['captcha_token'] ?? '', $data['captcha_respuesta'] ?? '')) {
    $fieldErrors['captcha_respuesta'] = 'Resuelve la suma para enviar el mensaje.';
}
if ($fieldErrors !== []) {
    respond([
        'ok' => false,
        'status' => 400,
        'error' => 'Revisa los campos marcados.',
        'fieldErrors' => $fieldErrors,
        'values' => $values,
        'captcha' => crear_captcha($secret),
    ]);
}

if ($config === []) {
    respond([
        'ok' => false,
        'status' => 503,
        'error' => 'El servicio de correo no está configurado. Escríbenos a contacto@ce4ly.cl.',
        'fieldErrors' => [],
        'values' => $values,
    ]);
}

$apiKey = trim((string) ($config['apiKey'] ?? ''));
$domain = trim((string) ($config['domain'] ?? ''));
$from = trim((string) ($config['from'] ?? ($domain !== '' ? 'Radio Club Lircay <noreply@' . $domain . '>' : '')));
$to = trim((string) ($config['to'] ?? CONTACT_TO_DEFAULT));
$apiBase = rtrim(trim((string) ($config['apiBase'] ?? '')), '/');
if ($apiBase === '') {
    $region = strtolower(trim((string) ($config['region'] ?? 'us')));
    $apiBase = $region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
}

if ($apiKey === '' || $domain === '' || $from === '') {
    respond([
        'ok' => false,
        'status' => 503,
        'error' => 'El servicio de correo no está configurado. Escríbenos a contacto@ce4ly.cl.',
        'fieldErrors' => [],
        'values' => $values,
    ]);
}

$endpoint = $apiBase . '/v3/' . rawurlencode($domain) . '/messages';
$subject = '[CE4LY] ' . $asunto;
$textBody = "Nombre: {$nombre}\nCorreo: {$correo}\n"
    . ($indicativo !== '' ? "Indicativo: {$indicativo}\n" : '')
    . "Asunto: {$asunto}\n\nMensaje:\n{$mensaje}";

$htmlBody =
    '<p><strong>Nombre:</strong> ' . e($nombre) . '</p>'
    . '<p><strong>Correo:</strong> ' . e($correo) . '</p>'
    . ($indicativo !== '' ? '<p><strong>Indicativo:</strong> ' . e($indicativo) . '</p>' : '')
    . '<p><strong>Asunto:</strong> ' . e($asunto) . '</p>'
    . '<p><strong>Mensaje:</strong></p><p>' . nl2br(e($mensaje), false) . '</p>';

$postBody = http_build_query(
    [
        'from' => $from,
        'to' => $to,
        'subject' => $subject,
        'text' => $textBody,
        'html' => $htmlBody,
        'h:Reply-To' => $correo,
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
        'Expect:',
    ],
    CURLOPT_USERPWD => 'api:' . $apiKey,
    CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 60,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    respond(['ok' => true]);
}

error_log('[contact.php] Mailgun HTTP ' . $httpCode . ' errno ' . $errno . ': ' . substr((string) $response, 0, 400));
respond([
    'ok' => false,
    'status' => 502,
    'error' => 'No se pudo enviar el mensaje. Intenta más tarde o escríbenos a contacto@ce4ly.cl.',
    'fieldErrors' => [],
    'values' => $values,
]);
