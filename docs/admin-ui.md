# Admin UI Details - Big4 OVLs

## Overview
The Big4 Admin panel is a custom-built, responsive dashboard for managing the "Tiles & Sanitary" inventory, categories, brands, and overall metrics. It emphasizes a modern, light SaaS theme aesthetic designed to give administrators immediate insights and quick action access, with a highly polished mobile experience.

## Layout & Structure (`AdminShell.tsx`, `Sidebar.tsx`, `Header.tsx`, `layout.tsx`)
The general structure of the admin area is composed of a main shell layout that includes a persistent sidebar navigation on desktop (replaced by a Bottom Navigation bar on mobile), a top header, and a main content area.

### 1. Sidebar (`Sidebar.tsx`) & Bottom Nav (`BottomNav.tsx`)
*   **Design**: Light theme (`var(--bg-sidebar)`) with a premium SaaS feel. Features a prominent, centered "Big4" logo.
*   **Navigation Links**:
    *   **Dashboard** (`/admin`)
    *   **Products** (`/admin/products`)
    *   **Brands** (`/admin/brands`)
    *   **Categories** (`/admin/categories`)
*   **Prompt Area**: An expandable "Prompts" accordion section containing icons for Bedroom, Office, Bathroom, and Kitchen prompt retrieval.
*   **Interactivity**: Active links are highlighted with a soft background and dark text.
*   **Mobile Support**: The sidebar is completely hidden on mobile screens (`< 768px`) and is replaced by a fixed white Bottom Navigation bar that provides quick access to core routes. The "More" drawer in the bottom nav conveniently houses the Prompt Area to ensure mobile parity.

### 2. Header (`Header.tsx`)
*   **Desktop Layout**: Right-aligned profile section featuring the user's name and email stacked, followed by their avatar, and a standardized white "Logout" button with a subtle shadow and border.
*   **Mobile Layout**: Features the company logo (`logo2.png`) on the top left (since the sidebar is hidden) to balance the profile avatar and logout icon on the right.

### 3. Dashboard Page (`/admin/page.tsx`)
The main landing page for administrators, built with a premium SaaS aesthetic.

*   **Stat Cards (Top Section)**:
    *   **Total Products**: A prominent dark gradient hero card showing total, active, and archived products.
    *   **Low Stock**: Highlights items with 5 or fewer in stock, styled with a warning border if applicable.
    *   **Categories & Brands**: A combined metric card linking to the categories management page.
    *   *Mobile Design*: Cards stack vertically in a standard grid layout on mobile devices instead of horizontal scrolling.
*   **Bottom Section (Grid Layout)**:
    *   **Products Added Chart**: A visual bar chart representing the number of products added over the last 6 months.
    *   **Recent Products List**: Displays the latest products featuring a 40x40 thumbnail image, name, category, SKU, price, and color-coded stock status.
    *   **Top Categories**: A sidebar widget showing a progress-bar style breakdown of top categories by product count.
    *   **Quick Actions Panel**: Interactive link buttons (Add New Product, Manage Categories, Manage Brands).

### 4. Categories & Brands Management UI (`CategoryListClient.tsx`, `BrandListClient.tsx`)
*   **Top Bar**: Features a text input and a "+ Add" `LoadingButton` (styled as a black pill) for inline, rapid creation of new entities.
*   **List/Table View**: 
    *   Clean data tables on desktop. On mobile, these seamlessly transform into stacked cards for better readability.
    *   Displays Name, Product Count, and Actions.
    *   Implements a 6-item per page pagination structure.
    *   *Empty States*: Beautiful empty state indicators with large emojis (📂/🏷️) and clear instructions if no items exist.
*   **Inline Editing**: Clicking "Rename" replaces the text with a focused, blue-bordered input box and "Save" / "Cancel" buttons. The "Save" button intelligently disables if the name hasn't changed.
*   **Error Feedback**: Form errors are rendered directly below the relevant inputs using the `var(--danger)` semantic token.
*   **Confirmation Modals**: Uses `ConfirmDialog` for deletions to prevent accidental loss of data.

### 5. Product Management UI
*   **Product Listing (`ProductTable.tsx`)**:
    *   Rich data table displaying: Image Thumbnail, Name, SKU, Category, Brand, Price, Stock, Status.
    *   Data is paginated (6 items per page) and transforms into stacked cards on mobile devices.
*   **Product Form (`ProductForm.tsx`)**:
    *   A comprehensive, two-column grid layout on desktop.
    *   *Left Column (Main Fields)*: Inputs use standard SaaS rounded rectangles (`var(--radius-md)`). The fields are logically grouped into distinct "Basic Details" and "Pricing & Inventory" cards.
    *   *Right Column (Media & Actions)*: Houses the `ImageUploader` and primary actions.
    *   *Mobile Sticky Action Bar*: On mobile, the "Save" and "Cancel" buttons are anchored to the bottom of the screen in a fixed, white sticky bar (above the bottom nav) for easy access.
    *   *Error Handling*: Form validation errors are dynamically mapped to individual fields, highlighting inputs with red borders and rendering descriptive text below them.

### 6. Image Management (`ImageUploader.tsx`)
*   **Sequential Cropping**: Users can upload up to 5 images at once. The cropper forces a 1:1 aspect ratio (no "Skip Crop" option) and seamlessly queues multiple images, prompting the user with "Next" until the final "Crop & Upload" step.
*   **Crop Modal UI**: A modern, sleek, centered white dialog card housing the cropper and zoom controls, providing a native application feel rather than a raw dark overlay.

## General Design System Attributes
*   **Color Palette**: Semantic theme utilizing CSS variables (`--bg-primary`, `--text-primary`, `--accent`) for both Light and Dark modes, ensuring flawless adaptation:
    *   Primary Action/Submit: `var(--gray-900)` (Inverts in dark mode for high contrast)
    *   Primary Accent: `var(--brand-500)` or `var(--accent)`
    *   Success/Active: `var(--success)`
    *   Danger/Error: `var(--danger)` and `var(--danger-light)`
*   **Theme System (Dark Mode)**:
    *   **Architecture**: Built with a custom `ThemeProvider` and inline blocking script in `layout.tsx` to read `localStorage` and `window.matchMedia` preferences, completely preventing Flash of Unstyled Content (FOUC) without relying on external libraries.
    *   **Toggle UI**: A native `ThemeToggle` button is available in the desktop Header and mobile BottomNav, offering instant switching.
*   **Typography**: Clean sans-serif fonts, using varying weights (600/700 for headers and labels, 400 for text) to establish strong visual hierarchy.
*   **Components**: Heavy reliance on reusable UI components like `LoadingButton`, `ConfirmDialog`, `ImageUploader`, and custom `ToastProvider` for feedback. The design heavily utilizes pill-shaped buttons (`var(--radius-pill)`) for primary actions and rounded rectangles (`var(--radius-md)`) for data inputs.
