<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['photo'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Please upload a photo.']);
  exit;
}

$file = $_FILES['photo'];
if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
  http_response_code(400);
  echo json_encode(['error' => 'The photo could not be uploaded.']);
  exit;
}

$mime = mime_content_type($file['tmp_name']);
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
if (!in_array($mime, $allowed, true) || $file['size'] > 8 * 1024 * 1024) {
  http_response_code(400);
  echo json_encode(['error' => 'Use a JPG, PNG, WEBP, or HEIC image under 8 MB.']);
  exit;
}

$notes = trim($_POST['notes'] ?? '');
$localConfig = __DIR__ . '/../config.php';
if (is_file($localConfig)) require_once $localConfig;
$key = defined('FIXDALI_OPENAI_API_KEY') ? FIXDALI_OPENAI_API_KEY : getenv('OPENAI_API_KEY');
if ($key) {
  $payload = [
    'model' => getenv('OPENAI_VISION_MODEL') ?: 'gpt-4o-mini',
    'temperature' => 0.1,
    'max_tokens' => 220,
    'messages' => [[
      'role' => 'user',
      'content' => [
        ['type' => 'text', 'text' => "Identify the most likely home service needed from this photo. Return only JSON with keys category, title, detail, confidence. category must be one of plumbing, electrical, carpentry, painting, ac, cleaning, appliance, pest. User notes: {$notes}"],
        ['type' => 'image_url', 'image_url' => ['url' => 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($file['tmp_name']))]]
      ]
    ]]
  ];
  $ch = curl_init('https://api.openai.com/v1/chat/completions');
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $key],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 25
  ]);
  $raw = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($status >= 200 && $status < 300 && $raw) {
    $outer = json_decode($raw, true);
    $content = $outer['choices'][0]['message']['content'] ?? '';
    $content = preg_replace('/^```(?:json)?|```$/m', '', trim($content));
    $result = json_decode(trim($content), true);
    if (is_array($result) && !empty($result['category'])) {
      echo json_encode($result);
      exit;
    }
  }
}

// Offline/demo fallback. The frontend applies the same friendly heuristic and will
// still show a useful result when this endpoint is run without an AI key.
$haystack = strtolower($notes . ' ' . ($file['name'] ?? ''));
$category = 'plumbing';
$title = 'Home repair inspection';
$detail = 'A trusted technician can inspect the photo in person and confirm the safest repair before work begins.';
$map = [
  'electrical' => ['wire','socket','outlet','switch','light','power'],
  'painting' => ['paint','wall','ceiling','color','stain'],
  'ac' => ['aircon','cooling','split'],
  'appliance' => ['wash','fridge','refrigerator','oven'],
  'cleaning' => ['clean','dust','mess','sanitize'],
  'plumbing' => ['leak','water','pipe','faucet','sink','drain','toilet']
];
foreach ($map as $name => $words) {
  foreach ($words as $word) {
    if (strpos($haystack, $word) !== false) {
      $category = $name;
      $title = ucfirst($name) . ' service';
      $detail = 'This looks like a ' . $name . ' issue. A FixDali technician can inspect the source and recommend the right repair.';
      break 2;
    }
  }
}
echo json_encode(['category' => $category, 'title' => $title, 'detail' => $detail, 'confidence' => 'Demo match']);
