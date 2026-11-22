<?php
require_once __DIR__.'/../php/auth.php';
$cat = $_GET['cat'] ?? '';
if ($cat && $cat !== 'all') {
  $res = q('SELECT * FROM technicians WHERE cat=?', [$cat]);
} else {
  $res = q('SELECT * FROM technicians');
}
json_out(fetch_all($res));