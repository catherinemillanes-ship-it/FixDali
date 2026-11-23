# FixDali - Home Repair Booking Mobile App (Prototype)

A clickable mobile-app prototype for **FixDali**, a home-repair booking service.
Built as a web-based mobile prototype (HTML/CSS/JS) so it runs in any browser
and can be demoed on a phone or via XAMPP.

## How to run

### Option A - XAMPP (recommended)
1. Start Apache in XAMPP.
2. Open http://localhost/FixDali/

### Option B - Open directly
Double-click `index.html` (images load relative to the file).

## Demo accounts
- User: ashley@fixdali.test / Password123!
- Admin: admin / Admin@2026!

## Features
- Splash, onboarding, login/register/forgot password
- Home with search, categories, featured technicians, recent bookings
- Service browsing & technician profiles with reviews
- Booking flow (service, date/time, address, payment, confirmation)
- My bookings with status filters & detail timeline
- In-app chat with technician
- Notifications, profile, addresses & payment methods
- Admin dashboard with stats & booking management
- **Fix by photo** triage: upload or capture a home issue photo, add notes, get a recommended service, and jump to matching technicians
- Mobile-first refreshed UI with clearer hierarchy, touch targets, and service-matching CTA
- Worker dashboard with assigned service requests, profile editing, customer chat, and service confirmation
- Complete worker directory across services with availability and service hours
- AI scanning plan: 3 free scans per user, then AI Scan Plus at ₱49/month
- Cash payment option alongside GCash and Card

## Project layout
```
FixDali/
  index.html
  css/style.css
  js/data.js       sample data
  js/app.js        app logic
  assets/images/   sample images
  README.md
```

## Enable live photo recognition

The photo flow works immediately in demo mode. For real image understanding in XAMPP, copy `config.example.php` to `config.php`, put your server-side vision key in `FIXDALI_OPENAI_API_KEY`, and keep `config.php` out of version control. The browser never receives the key. If the PHP endpoint or key is unavailable, the app automatically falls back to the user’s note and filename keywords and still returns a technician match.

Sample images are placeholders provided by the client. Replace with real assets for production.

For an existing database, run `database/migrations/001_add_payment_method.sql` once before using the booking payment field.
