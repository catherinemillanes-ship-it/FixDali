# FixDali UI refresh + photo triage

## Implementation

Preserve the existing PHP/HTML/CSS/JS prototype and its API endpoints. Improve the mobile-first shell, home dashboard hierarchy, cards, spacing, color, and touch targets without changing the existing booking data model. Add a `photoAssist` screen with a photo picker/camera input, image preview, optional issue notes, and a recommendation result that links to existing service categories/technicians. The frontend uses a graceful local fallback for demo/offline use; `api/analyze-photo.php` is included as an optional server-side vision adapter when `OPENAI_API_KEY` is configured.

## Project structure

- `index.html`: mobile shell and screen markup, including the photo triage screen.
- `css/style.css`: visual system and responsive mobile layout.
- `js/app.js`: navigation, existing app flows, and photo triage behavior.
- `api/analyze-photo.php`: optional vision analysis endpoint with deterministic fallback.
- `js/data.js`: existing sample categories, technicians, bookings, and user data.

## Design

### Style options
- Warm service concierge: 0.06
- Utility-first blue dashboard: 0.08
- Quiet editorial workshop: 0.04

Chosen: **Warm service concierge**.

### Design movement
A modern neighborhood-service app with soft utility surfaces, warm amber highlights, and confident cobalt actions.

### Core principles
- One clear next action per screen.
- Thumb-friendly controls and generous touch targets.
- Trust cues are visible before commitment: verified, rating, arrival timing.
- Use real content density without visual clutter.

### Color philosophy
Cobalt signals dependable action, amber marks attention and diagnosis, and warm off-white surfaces make the app feel human rather than clinical.

### Layout paradigm
Stacked editorial cards with a strong lead action, horizontal chips, and edge-to-edge sections that feel natural on a phone.

### Signature elements
- “Fix by photo” amber-to-cobalt diagnostic card.
- Compact status pills and technician trust rows.
- Soft rounded surfaces with subtle hairline borders instead of heavy shadows.

### Interaction philosophy
Every tap should either move the user closer to a booking or explain what happens next. Photo triage gives immediate feedback, then offers a direct route into the existing booking flow.

### Animation
Use short 160–220ms fades and lift transitions for cards, result reveals, and toast feedback. Avoid decorative motion during form completion.

### Typography system
Use system UI typography with heavy display weights for section leads, compact 12–13px metadata, and 15–16px body copy for comfortable mobile reading.

### Brand essence
FixDali helps busy homeowners get the right trusted repair person without guessing. Personality: practical, reassuring, local.

### Brand voice
Headlines are direct and caring: “What needs fixing today?” and “Show us the problem.” CTAs are specific: “Find my service” and “Book a technician.”

### Wordmark & logo
Retain the FixDali name, paired with a simple wrench/spark mark in the app chrome.

### Signature brand color
Cobalt `#2857D9`.
