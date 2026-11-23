# FixDali delivery checklist

- [x] Refresh the mobile UI with a clearer home hierarchy, touch-friendly controls, modern cards, and responsive phone framing.
- [x] Add a visible “Fix by photo” entry point on Home.
- [x] Add a photo triage screen where a user can select or capture an image, preview it, add optional notes, and request a recommended service.
- [x] Show the inferred service, confidence, explanation, and a direct “See matching technicians” action.
- [x] Preserve the existing service browsing, technician detail, booking, booking history, messages, profile, and admin flows.
- [x] Add an optional PHP vision adapter with an offline fallback so the prototype still works without an external AI key.
- [ ] Configure `OPENAI_API_KEY` in the server environment to enable production vision analysis instead of the demo fallback.
