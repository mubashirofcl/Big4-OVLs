# Big4 OVLs - UI & Architecture Guidelines

This document outlines the complete UI architecture, folder structure, and best practices for the Big4 project. The project is built using Next.js (App Router), React 19, Tailwind CSS v4, shadcn/ui, Framer Motion, and GSAP.

## 1. Architecture Overview

- **Framework**: Next.js 16.x using the **App Router** (`/app` directory).
- **Styling**: Tailwind CSS v4 for utility-first styling.
- **UI Components**: `shadcn/ui` for accessible, customizable base components (built on Radix UI).
- **Animations**:
  - `framer-motion` for React-driven UI transitions and micro-interactions.
  - `gsap` for complex, timeline-based or scroll-driven animations.
- **State Management**: React Context / Hooks for local state. Server Components for data fetching.
- **Icons**: `lucide-react`.
- **Package Manager**: `pnpm` (Workspace configured).

### 1.1 Server vs Client Components
By default, all components in the `app` directory are **React Server Components (RSC)**. 
- Use Server Components for data fetching, backend logic, and static UI.
- Add the `"use client"` directive at the top of the file for components that require interactivity (e.g., `useState`, `useEffect`, `onClick`), or use browser APIs.

---

## 2. Folder Structure

Here is the comprehensive folder structure for the project:

```text
Big4-OVLs/
├── app/                      # Next.js App Router (Pages & Routing)
│   ├── layout.tsx            # Root layout (HTML, Body, Providers)
│   ├── page.tsx              # Root page (Home Page)
│   ├── globals.css           # Global styles and Tailwind entry point
│   ├── (auth)/               # Route Group for Authentication (URL won't include /auth)
│   │   ├── login/page.tsx    # /login route
│   │   └── register/page.tsx # /register route
│   ├── dashboard/            # /dashboard route
│   │   ├── layout.tsx        # Dashboard-specific layout (Sidebar, Header)
│   │   └── page.tsx          # Dashboard Home
│   └── api/                  # Next.js API Routes (Backend logic)
│       └── users/route.ts    # /api/users endpoint
│
├── components/               # Reusable React Components
│   ├── ui/                   # shadcn/ui base components (buttons, dialogs, inputs)
│   ├── layout/               # Layout components (Header, Footer, Sidebar, Navigation)
│   ├── animations/           # Reusable animation wrappers (Framer Motion / GSAP)
│   │   ├── FadeIn.tsx
│   │   └── ParallaxScroll.tsx
│   └── features/             # Domain-specific components
│       └── auth/             # Auth-related UI (LoginForm, UserMenu)
│
├── lib/                      # Utility functions and shared logic
│   ├── utils.ts              # Common utilities (e.g., cn() for tailwind-merge/clsx)
│   ├── constants.ts          # Global constants, site config
│   ├── api.ts                # API client helpers (fetch wrappers)
│   └── hooks/                # Custom React hooks (e.g., useMediaQuery, useAuth)
│
├── public/                   # Static assets (images, fonts, favicons)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── types/                    # TypeScript interfaces and types (if applicable)
│   └── index.d.ts            
│
├── styles/                   # Additional CSS files (if not using globals.css exclusively)
│
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── package.json              # Project dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration (if needed for v4)
├── eslint.config.mjs         # ESLint configuration
├── components.json           # shadcn/ui configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

---

## 3. UI Architecture & Guidelines

### 3.1 Styling (Tailwind CSS v4 + shadcn/ui)
- We use **Tailwind CSS** for all styling. Avoid writing custom CSS in `.css` files unless absolutely necessary.
- **shadcn/ui** components are located in `components/ui/`. These are not distributed via an npm package, but are owned by you. You can customize them directly.
- Use the `cn()` utility (provided by `clsx` and `tailwind-merge` in `lib/utils.ts`) to merge Tailwind classes dynamically.

### 3.2 Animations Strategy
- **Framer Motion (`framer-motion`)**:
  - Use for layout transitions, enter/exit animations (e.g., Dialogs, Menus), and simple interactions (hover, tap).
  - Wrap components in `<motion.div>` for declarative animations.
- **GSAP (`gsap`)**:
  - Use for complex scroll-triggered animations (`ScrollTrigger`), complex timelines, or animating non-React elements/SVGs.
- **TW Animate CSS (`tw-animate-css`)**:
  - Use for standard, predefined CSS animations using Tailwind utility classes.

### 3.3 Component Design Principles
- **Separation of Concerns**: Keep components small and focused. If a component handles too much state or logic, break it down.
- **Composition over Configuration**: Prefer passing children (React nodes) to components rather than exposing excessive props for customization.
- **Client vs Server Boundary**: Keep interactivity isolated. For example, if a page needs a button that uses `onClick`, extract the button into a Client Component rather than making the whole page a Client Component.

---

## 4. Best Practices & Conventions

### 4.1 Naming Conventions
- **Files & Folders**: 
  - React components: PascalCase (e.g., `Button.tsx`, `LoginForm.tsx`).
  - Next.js route files: strict lowercase (e.g., `page.tsx`, `layout.tsx`, `route.ts`).
  - Utility/Library files: camelCase (e.g., `utils.ts`, `fetchApi.ts`).
- **Variables & Functions**: camelCase.
- **Types/Interfaces**: PascalCase, often prefixed with `I` (optional but consistent) or descriptive (e.g., `UserProps`).

### 4.2 Data Fetching
- Fetch data in **Server Components** using the standard `fetch()` API for better performance and SEO.
- Next.js extends `fetch` to automatically memoize requests and handle caching/revalidation.
- Pass fetched data down to Client Components as props.

### 4.3 State Management
- **Local State**: Use `useState` and `useReducer` for component-level state.
- **Global State**: For complex shared state across the app, consider using Context API or lightweight libraries like Zustand. For simple apps, passing props or using Server state often suffices.
- **URL State**: Use the URL (search params) as the source of truth for shareable state (e.g., active filters, search queries, pagination).

### 4.4 Error Handling
- Use Next.js `error.tsx` files to gracefully handle errors within specific route segments.
- Validate incoming API request data (e.g., using `zod`).

---

## 5. Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Start Dev Server**: `pnpm dev`
3. **Add new UI component**: Use shadcn CLI: `npx shadcn-ui@latest add [component-name]`
4. **Linting**: Run `pnpm lint` before pushing changes to ensure code quality.
