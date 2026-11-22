<?php
require_once __DIR__.'/../php/auth.php';
$u = require_login();
$id = $_GET['id'] ?? '';
q('UPDATE bookings SET status=? WHERE id=? AND user_id=?', ['cancelled',$id,$u['id']]);
json_out(['success'=>true]);