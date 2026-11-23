<?php
require_once __DIR__.'/../php/auth.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { json_out(['error'=>'POST required'],405); }
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$pass = $input['password'] ?? '';
if (!$name || !$email || !$pass) { json_out(['error'=>'Missing fields'],400); }
$hash = password_hash($pass, PASSWORD_DEFAULT);
$res = q('INSERT INTO users (name,email,phone,password_hash) VALUES (?,?,?,?)', [$name,$email,$phone,$hash]);
if ($res === false) { json_out(['error'=>'Email already exists'],409); }
$id = db()->insert_id;
$_SESSION['user_id'] = $id;
json_out(['success'=>true,'user'=>['id'=>$id,'name'=>$name,'email'=>$email,'role'=>'user']]);