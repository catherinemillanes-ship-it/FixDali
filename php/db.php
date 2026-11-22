<?php
// Database connection
function db(): mysqli {
  static $conn;
  if ($conn instanceof mysqli) return $conn;
  $conn = new mysqli('127.0.0.1','root','','fixdali');
  if ($conn->connect_error) { http_response_code(500); echo json_encode(['error'=>'DB connection failed']); exit; }
  $conn->set_charset('utf8mb4');
  return $conn;
}
function q(string $sql, array $params=[]): mysqli_result|bool {
  $stmt = db()->prepare($sql);
  if (!$stmt) return false;
  if ($params) {
    $types = '';
    foreach ($params as $p) {
      $types .= is_int($p)?'i':(is_float($p)?'d':'s');
    }
    $stmt->bind_param($types, ...$params);
  }
  $stmt->execute();
  $res = $stmt->get_result();
  $stmt->close();
  return $res === false ? true : $res;
}
function fetch_all(mysqli_result $res): array {
  $rows=[]; while($r=$res->fetch_assoc()) $rows[]=$r; return $rows;
}