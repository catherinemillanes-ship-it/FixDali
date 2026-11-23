<?php
require_once __DIR__.'/../php/auth.php';
$_SESSION = [];
session_destroy();
json_out(['success'=>true]);