<?php
require_once __DIR__.'/db.php';
session_start();

function current_user(): ?array {
  if (empty($_SESSION['user_id'])) return null;
  $res = q('SELECT id,name,email,phone,role FROM users WHERE id=?', [(int)$_SESSION['user_id']]);
  $row = $res ? $res->fetch_assoc() : null;
  return $row ?: null;
}
function require_login(): array {
  $u = current_user();
  if (!$u) { http_response_code(401); echo json_encode(['error'=>'Not logged in']); exit; }
  return $u;
}
function json_out($data, int $code=200): void {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}