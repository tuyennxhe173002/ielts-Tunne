---
page: dashboard
---
A minimal dashboard page for students to manage their IELTS journey.

**DESIGN SYSTEM (REQUIRED):**
# Design System Document: The Academic Luminary

## 1. Overview & Creative North Star
This design system is built to transform the traditional, often cluttered landscape of educational platforms into a high-end editorial experience. 

**Creative North Star: The Academic Luminary**
The visual identity is defined by "Precision through Breath." We avoid the "template" look by eschewing rigid grids in favor of intentional asymmetry and layered depth. Instead of boxes and lines, we use light and tone to guide the student’s eye. The goal is to make the IELTS journey feel less like a chore and more like a premium, guided ascent toward a global future. We achieve this through "Atmospheric UI"—where content floats on a sea of soft gradients and glass-like surfaces.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, authoritative blue, supported by a sophisticated range of neutral "surface" tones that allow for complex layering without visual noise.

*   **The Primary Core:** Use `primary` (#006184) for high-emphasis actions and `primary_container` (#007ba7) for branded backgrounds and primary call-to-actions.
*   **The "No-Line" Rule:** We do not use 1px solid borders to separate sections. Boundaries must be defined solely through background color shifts. For example, a section using `surface_container_low` should sit directly against a `surface` background to create a clean, modern break.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers.
    *   **Level 0 (Base):** `surface` or `background`.
    *   **Level 1 (Sections):** `surface_container_low`.
    *   **Level 2 (Cards/Modules):** `surface_container_lowest` (White) or Glassmorphism.
*   **The "Glass & Gradient" Rule:** To achieve the "Modern Educational" feel, use `primary` to `primary_container` linear gradients (at 135 degrees) for hero sections. Floating elements should utilize the "Glassmorphism" effect: `surface_container_lowest` at 70% opacity with a 16px to 32px backdrop-blur.
*   **Signature Textures:** Incorporate a very subtle noise texture (3-5% opacity) over the blue gradients to add a "tactile paper" feel to the digital experience.

---

## 3. Typography: The Editorial Voice
We use **Inter** exclusively. The weight distribution is designed to mimic a high-end magazine, creating a clear hierarchy that rewards scanning.

*   **Display & Headlines:** Use `display-lg` (3.5rem) and `headline-lg` (2rem) with SemiBold weights. These should have a tighter letter-spacing (-0.02em) to feel authoritative and "locked in."
*   **Body Copy:** Use `body-lg` (1rem) for general reading. Maintain a generous line-height of **1.7**. This "breathing room" is essential for educational content, reducing cognitive load for students.
*   **Labels:** Use `label-md` (0.75rem) in All Caps with +0.05em tracking for secondary metadata or overlines.

---

## 4. Elevation & Depth
In this design system, depth is a functional tool, not a decoration. We move away from traditional drop shadows toward **Tonal Layering**.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. This creates a "soft lift" that is felt rather than seen.
*   **Ambient Shadows:** When an element must "float" (e.g., a primary CTA or a featured course card), use a shadow tinted with the `on_surface` color at 6% opacity, with a 40px blur and 10px Y-offset. Never use pure black for shadows.
*   **The "Ghost Border" Fallback:** If a container requires more definition (e.g., inside a dashboard preview), use the `outline_variant` token at **15% opacity**. It should be a suggestion of a line, not a hard boundary.
*   **Glassmorphism Depth:** For "Action-first" modules, use a semi-transparent `surface_variant` border (0.5px) around glassmorphic cards to simulate the edge of a glass pane catching the light.

---

## 5. Components

### Buttons
*   **Primary:** `primary_container` background with `on_primary_container` text. Use a `xl` (1.5rem) corner radius for a modern, approachable feel.
*   **Secondary:** Glassmorphic style (semi-transparent blur) with a `primary` ghost border.
*   **Interaction:** On hover, apply a soft elevation increase and a subtle scale (1.02x). Implement a ripple effect using a white overlay at 10% opacity.

### Educational Cards
*   **Style:** Forbid the use of dividers. Use `title-lg` for the heading and `body-md` for the description. 
*   **Layout:** Use asymmetrical padding (e.g., 32px top/left, 48px bottom/right) to create a custom, high-end feel.

### Input Fields
*   **Style:** `surface_container_high` background, `none` border, `md` (0.75rem) corner radius. 
*   **Active State:** Transition the background to `surface_container_lowest` and add a 1px `primary` ghost border.

### Dashboard Previews
*   Use `surface_dim` for the background of the preview area to make the white "dashboard cards" pop. Use the `sm` (0.25rem) rounding for internal dashboard elements to contrast with the `xl` rounding of the landing page's main CTAs.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Whitespace as a Tool:** Treat empty space as a premium element. If a section feels crowded, increase the vertical padding using the scale (e.g., 120px to 160px).
*   **Layer Glass on Gradients:** Place glassmorphic cards specifically over blue gradient backgrounds to maximize the blur effect.
*   **Embrace Asymmetry:** Place a "Dashboard Preview" slightly off-grid or overlapping a text block to break the "boxed" feel.

### Don’t:
*   **Don't use 100% Opaque Borders:** This kills the premium, editorial feel. Use tonal shifts instead.
*   **Don't use Center-Align for Long Text:** Keep body copy left-aligned for readability, especially in an educational context. Reserve center-alignment only for `display-sm` section headers.
*   **Don't Over-Shadow:** If more than three elements on a screen have shadows, the hierarchy is lost. Use tonal stacking for most elements and reserve shadows for the "Hero" actions.

**Page Structure:**
1. Sidebar: Home, My Courses, Learning Path, Mock Tests, Profile, Settings.
2. Top bar: Search, Notifications, User avatar.
3. Content Main Area:
- Continue Learning: Large card, current course, progress bar, CTA: "Continue Learning".
- Statistics: Total learning hours, Estimated Band score, Mock tests completed.
- Schedule: Timeline of upcoming classes/due assignments.
