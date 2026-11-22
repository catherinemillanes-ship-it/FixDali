<?php
require_once __DIR__.'/../php/auth.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { json_out(['error'=>'POST required'],405); }
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$email = trim($input['email'] ?? '');
$pass = $input['password'] ?? '';
$res = q('SELECT id,name,email,phone,role,password_hash FROM users WHERE email=?', [$email]);
$u = $res ? $res->fetch_assoc() : null;
if (!$u || !password_verify($pass, $u['password_hash'])) { json_out(['error'=>'Invalid credentials'],401); }
$_SESSION['user_id'] = $u['id'];
unset($u['password_hash']);
json_out(['success'=>true,'user'=>$u]);