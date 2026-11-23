ALTER TABLE bookings
  ADD COLUMN payment_method VARCHAR(40) NOT NULL DEFAULT 'Cash' AFTER price;
