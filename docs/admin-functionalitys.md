# Admin Functionalities Details - Big4 OVLs

## Overview
The Big4 Admin system is a comprehensive backend interface allowing administrators to completely manage the e-commerce store's inventory and catalog structure. It relies on a Next.js App Router setup with Server Actions for data mutations, supported by an Express/Prisma backend.

## 1. Dashboard Capabilities
The dashboard acts as the central intelligence hub, aggregating data through `dashboardService.getStats()`.
*   **Real-time Statistics**: Calculates and displays aggregate counts for:
    *   Total products in the catalog.
    *   Active vs. Archived products.
    *   Products considered "Low Stock" (configurable, typically <= 5).
    *   Total number of Categories and Brands.
*   **Recent Activity**: Fetches and displays a short list of the most recently added or modified products.
*   **Quick Routing**: Provides one-click access to filtered views (e.g., `/admin/products?status=active`, `/admin/products?sort=stock-asc`).

## 2. Catalog Management (Categories & Brands)
Categories and Brands share a very similar, highly optimized functional flow designed for rapid data entry.

*   **Create**:
    *   Admins can create a new category/brand directly from the list page using an inline input field.
    *   Action triggers `createCategoryAction`/`createBrandAction`.
    *   Automatically generates URL-friendly slugs from the provided names.
*   **Read / List**:
    *   Fetches all categories/brands alongside an aggregate count of active products associated with each entity (`_count: { products: number }`).
    *   Implements consistent pagination (6 items per page) to efficiently manage extensive catalogs.
*   **Update (Inline Rename)**:
    *   Admins can click "Rename" to transform the table cell into an active input field.
    *   Includes a no-op guard: the "Save" button is explicitly disabled if the input name remains unchanged.
    *   Saves the change via `updateCategoryAction`/`updateBrandAction` without requiring a page navigation.
    *   Client-side Zod validation enforces input requirements before triggering server actions.
*   **Delete**:
    *   Protected by a confirmation dialog (`ConfirmDialog`).
    *   **Safety Check**: The system explicitly warns the administrator if the Category/Brand currently has associated products. Products must be reassigned or deleted before the Category/Brand can be safely removed to maintain database integrity.

## 3. Inventory & Product Management
The product management system is the most feature-rich section of the admin panel.

### Listing & Filtering
*   **Data Table**: Displays a paginated/scrollable list of products (6 per page) with key metrics (SKU, Category, Brand, Price, Stock, Status).
*   **Quick Stock Update**: Clicking the stock number in the table opens a mechanism to quickly adjust inventory levels without navigating to the full edit form, complete with Zod-based constraint validation.

### Product Creation & Editing (`ProductForm.tsx`)
A unified form handles both the creation of new products and the editing of existing ones.
*   **Core Data Points**:
    *   `Name` (Text)
    *   `SKU` (Text - Stock Keeping Unit)
    *   `Category` (Foreign Key - Dropdown selection)
    *   `Brand` (Foreign Key - Optional Dropdown selection)
    *   `Description` (Rich text/textarea)
*   **Pricing & Inventory**:
    *   `Selling Price`: The public-facing price (validated > 0).
    *   `Cost Price`: The internal cost for margin calculations (validated > 0).
    *   `Stock`: Current physical inventory count.
*   **Media Management**:
    *   Integrates an `ImageUploader` component.
    *   Allows uploading multiple images.
    *   The first uploaded image is automatically designated as the primary `imageUrl` (thumbnail).
    *   Additional images are stored in a JSON/relational structure with `displayOrder` and `publicId`.
*   **Validation**:
    *   Comprehensive client-side validation utilizes shared Zod schemas (`safeParse`) to strictly validate fields (Name lengths, valid UUIDs, Price/Cost >= 0, image array limits) before submission.
    *   Provides granular, field-specific error feedback, automatically managing ARIA states and shifting focus to invalid fields without relying on heavy third-party form libraries.

## 4. Backend Integration (Server & Actions)
The admin panel interacts with the database (Prisma) through a combination of Next.js Server Actions and an Express backend API.

*   **Next.js Actions**: (`@/actions/product.actions`, `@/actions/category.actions`, etc.)
    *   Used for direct form submissions and UI mutations from the admin client components.
    *   Provides strong typing and direct integration with React's `useTransition`/loading states.
*   **Express Routes**: (`apps/server/src/routes/`)
    *   The backend also exposes standard REST endpoints for potential external integrations or specific complex queries.
    *   `admin.routes.ts`: Currently handles `/products` for admin fetching.
    *   `category.routes.ts`: Handles fetching categories with product aggregation counts (`_count`).
    *   *Note*: The Express API provides a parallel pathway for data access alongside Next.js Server Actions, allowing flexibility in how the frontend requests data.

## 5. Prompts System
A dedicated mechanism for administrators to quickly access standard operating prompts.
*   **Storage**: Prompts are managed statically via structured JSON files in `apps/admin/public/prompts/` (e.g., `bedroom.json`).
*   **Accessibility**: Available instantly via the desktop sidebar accordion or through the mobile "More" drawer in the bottom navigation.
*   **Functionality**: Activating a category loads a modal (`PromptModal`) that fetches the prompt payload, rendering a read-only preview and offering a seamless one-click "Copy to Clipboard" action with visual confirmation.
