<?php
/**
 * Proxy de índices solares (hamqsl.com) con caché de 30 minutos.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=1800');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

const FUENTE = 'https://www.hamqsl.com/solarxml.php';
const TTL = 1800;
$cache = sys_get_temp_dir() . '/ce4ly-solar.json';

$cached = null;
if (is_readable($cache)) {
    $cached = json_decode((string) file_get_contents($cache), true);
}

$fresh = is_array($cached) && isset($cached['at'], $cached['data']) && (time() - (int) $cached['at']) < TTL;

if ($fresh) {
    echo json_encode($cached['data'] + ['fetchedAt' => ((int) $cached['at']) * 1000, 'stale' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

$xml = false;
if (function_exists('curl_init')) {
    $ch = curl_init(FUENTE);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT => 'CE4LY/1.0',
    ]);
    $xml = curl_exec($ch);
    curl_close($ch);
} else {
    $xml = @file_get_contents(FUENTE);
}

$parse = static function (string $xml, string $tag): mixed {
    if (!preg_match('/<' . preg_quote($tag, '/') . '>([^<]*)<\/' . preg_quote($tag, '/') . '>/i', $xml, $m)) {
        return null;
    }
    $v = trim($m[1]);
    return is_numeric($v) ? 0 + $v : $v;
};

if (is_string($xml) && str_contains($xml, '<solar')) {
    $data = [
        'sfi' => $parse($xml, 'solarflux'),
        'sunspots' => $parse($xml, 'sunspots'),
        'aIndex' => $parse($xml, 'aindex'),
        'kIndex' => $parse($xml, 'kindex'),
        'source' => FUENTE,
    ];
    @file_put_contents($cache, json_encode(['at' => time(), 'data' => $data]));
    echo json_encode($data + ['fetchedAt' => time() * 1000, 'stale' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

if (is_array($cached) && isset($cached['data'])) {
    echo json_encode($cached['data'] + ['fetchedAt' => ((int) $cached['at']) * 1000, 'stale' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => false, 'stale' => false], JSON_UNESCAPED_UNICODE);
