# Specification

## Summary
**Goal:** Fix footer visibility on mobile devices and update the logo in the About page to match the Navbar logo.

**Planned changes:**
- Remove any CSS/Tailwind classes in `Layout.tsx` that hide the footer on mobile (e.g. `hidden`, `md:flex` without a mobile fallback), ensuring the footer renders below all page content on all screen sizes including the `/about` route.
- Update `AboutPage.tsx` to display the same UniShare logo (icon + wordmark) used in the Navbar, using the same asset file and consistent styling.

**User-visible outcome:** The footer is now visible on mobile devices across all pages, and the About page displays the correct up-to-date UniShare logo matching the Navbar.
