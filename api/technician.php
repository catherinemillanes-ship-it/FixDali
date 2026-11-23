<?php
require_once __DIR__.'/../php/auth.php';
$id = (int)($_GET['id'] ?? 0);
$res = q('SELECT * FROM technicians WHERE id=?', [$id]);
$row = $res ? $res->fetch_assoc() : null;
if (!$row) { json_out(['error'=>'Not found'],404); }
json_out($row);