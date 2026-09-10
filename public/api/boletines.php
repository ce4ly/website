<?php
/**
 * Reexpone el RSS de SoundCloud en /boletines.xml.
 * Caché de 60 minutos; si la fuente falla, última copia buena; si no hay, 503.
 */

declare(strict_types=1);

const TTL = 3600;

function user_id(): string
{
    $env = trim((string) getenv('SOUNDCLOUD_USER_ID'));
    if ($env !== '') {
        return $env;
    }
    $local = __DIR__ . '/boletines.local.php';
    if (is_readable($local)) {
        $cfg = require $local;
        if (is_array($cfg) && !empty($cfg['userId'])) {
            return trim((string) $cfg['userId']);
        }
    }
    return '';
}

header('Cache-Control: public, max-age=300');

$userId = user_id();
if ($userId === '') {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Feed no configurado.';
    exit;
}

$cacheFile = sys_get_temp_dir() . '/ce4ly-boletines.json';
$ahora = time();
$cache = ['xml' => null, 'fetchedAt' => 0];
if (is_readable($cacheFile)) {
    $raw = file_get_contents($cacheFile);
    $parsed = is_string($raw) ? json_decode($raw, true) : null;
    if (is_array($parsed)) {
        $cache = $parsed;
    }
}

$fresco = is_string($cache['xml'] ?? null)
    && $cache['xml'] !== ''
    && $ahora - (int) ($cache['fetchedAt'] ?? 0) < TTL;

if ($fresco) {
    header('Content-Type: application/rss+xml; charset=utf-8');
    echo $cache['xml'];
    exit;
}

$url = 'https://feeds.soundcloud.com/users/soundcloud:users:' . rawurlencode($userId) . '/sounds.rss';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => 'CE4LY/1.0 (+https://www.ce4ly.cl/)',
]);
$xml = curl_exec($ch);
$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$ok = is_string($xml) && $code >= 200 && $code < 300 && (str_contains($xml, '<rss') || str_contains($xml, '<feed'));

if ($ok) {
    file_put_contents(
        $cacheFile,
        json_encode(['xml' => $xml, 'fetchedAt' => $ahora], JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
    header('Content-Type: application/rss+xml; charset=utf-8');
    echo $xml;
    exit;
}

if (is_string($cache['xml'] ?? null) && $cache['xml'] !== '') {
    header('Content-Type: application/rss+xml; charset=utf-8');
    echo $cache['xml'];
    exit;
}

http_response_code(503);
header('Content-Type: text/plain; charset=utf-8');
echo 'Feed no disponible.';
