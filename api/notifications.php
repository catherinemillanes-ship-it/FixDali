<?php
require_once __DIR__.'/../php/auth.php';
require_login();
json_out([
  ['ico'=>'✅','title'=>'Booking confirmed','body'=>'BK-1001 confirmed.','time'=>'10 min ago'],
  ['ico'=>'💬','title'=>'New message','body'=>'Juan sent you a message.','time'=>'15 min ago'],
  ['ico'=>'⭐','title'=>'Rate your service','body'=>'How was your experience?','time'=>'1 day ago'],
  ['ico'=>'🎉','title'=>'Promo','body'=>'20% off first AC cleaning. Use code COOL20.','time'=>'2 days ago'],
]);