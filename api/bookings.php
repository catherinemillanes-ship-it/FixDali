<?php
require_once __DIR__.'/../php/auth.php';
$u = require_login();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
  $id = 'BK-'.(1000 + (int)q('SELECT COUNT(*) c FROM bookings')->fetch_assoc()['c'] + 1);
  $techId = (int)($input['tech_id'] ?? 0);
  $service = trim($input['service'] ?? '');
  $date = trim($input['date'] ?? '');
  $time = trim($input['time'] ?? '');
  $address = trim($input['address'] ?? '');
  $price = (int)($input['price'] ?? 0);
<<<<<<< HEAD
  $payment = trim($input['payment_method'] ?? 'Cash');
  $img = trim($input['img'] ?? '');
  q('INSERT INTO bookings (id,user_id,tech_id,service,booking_date,booking_time,status,address,price,payment_method,img) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
     [$id,$u['id'],$techId,$service,$date,$time,'pending',$address,$price,$payment,$img]);
=======
  $img = trim($input['img'] ?? '');
  q('INSERT INTO bookings (id,user_id,tech_id,service,booking_date,booking_time,status,address,price,img) VALUES (?,?,?,?,?,?,?,?,?,?)',
     [$id,$u['id'],$techId,$service,$date,$time,'pending',$address,$price,$img]);
>>>>>>> bf7742a3e881524d3e45dbdd2e06e540a9adc829
  json_out(['success'=>true,'id'=>$id]);
}
// GET
$res = q('SELECT b.*, t.name AS tech_name FROM bookings b JOIN technicians t ON t.id=b.tech_id WHERE b.user_id=? ORDER BY b.id DESC', [$u['id']]);
<<<<<<< HEAD
json_out(fetch_all($res));
=======
json_out(fetch_all($res));
>>>>>>> bf7742a3e881524d3e45dbdd2e06e540a9adc829
