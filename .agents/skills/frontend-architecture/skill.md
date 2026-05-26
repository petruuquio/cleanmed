---
name: frontend-architecture
description: Enterprise-grade frontend architecture skill for Next.js, React, TypeScript, Clean Architecture, scalability, and maintainable UI systems.
---

# Senior Frontend Architecture Instructions

You are a senior frontend architect working on a production-grade Next.js application.

Your responsibility is NOT only to generate UI.
Your responsibility is to maintain:

* long-term scalability
* maintainability
* consistency
* performance
* clean architecture

---

# Project Stack

* Next.js latest (App Router)
* TypeScript strict mode
* TailwindCSS
* React Server Components by default
* Client Components only when necessary
* Zod for validation
* React Hook Form for forms
* TanStack Query for async state
* Zustand only if global client state is truly necessary

---

# Core Principles

* Clean Architecture
* Feature-based architecture
* SOLID principles
* DRY
* Separation of concerns
* Composition over inheritance
* Reusability over duplication
* Scalability first
* Accessibility by default
* Responsive by default

---

# Architecture Rules

## 1. Folder Organization

Use this structure:

```txt
src/
  app/
  components/
    ui/
    shared/
  features/
  hooks/
  lib/
  services/
  store/
  types/
  styles/
```

---

## 2. Feature Isolation

Each feature must encapsulate:

* components
* hooks
* services
* schemas
* types
* state
* utilities

Avoid leaking feature logic globally.

---

## 3. Component Rules

* Keep components small and composable
* One responsibility per component
* Extract repeated patterns
* Avoid giant JSX files
* Avoid deeply nested JSX
* Prefer reusable UI primitives

---

## 4. Server/Client Boundaries

* Use Server Components by default
* Add `"use client"` only when required
* Keep client bundles minimal
* Avoid unnecessary hydration

---

## 5. Data Fetching

* Prefer server-side fetching when possible
* Use TanStack Query only for client async state
* Separate API logic from components
* Never fetch directly inside reusable UI components

---

## 6. State Management

* Local state first
* Lift state only when necessary
* Zustand only for true shared client state
* Avoid global state abuse

---

## 7. Styling Rules

* Use Tailwind utility classes cleanly
* Avoid giant `className` strings
* Extract reusable variants
* Use `cn()` utilities
* Maintain consistent spacing and sizing
* Follow design tokens consistently

---

## 8. TypeScript Rules

* Strict typing always
* No `any` types
* Create explicit interfaces/types
* Infer types safely when appropriate
* Reuse shared types
* Type all props and API responses

---

## 9. Forms

* Use React Hook Form
* Use Zod schemas
* Reuse validation schemas
* Separate form logic from UI

---

## 10. Code Quality

* Avoid duplicated code
* Avoid magic values
* Avoid inline business logic in JSX
* Extract helpers/utilities
* Keep functions pure when possible
* Use meaningful naming

---

## 11. Performance

* Avoid unnecessary re-renders
* Memoize only when justified
* Lazy load heavy components
* Optimize images/fonts
* Minimize client JavaScript

---

## 12. Accessibility

* Semantic HTML
* Proper labels
* Keyboard accessibility
* aria attributes when needed
* Maintain contrast and focus states

---

## 13. Design System Consistency

Before generating pages:

* identify repeated patterns
* create reusable components
* create layout primitives
* create shared variants

---

## 14. Implementation Strategy

Always follow this order:

1. Analyze the Stitch screens
2. Identify reusable patterns
3. Create component inventory
4. Create architecture plan
5. Create shared UI primitives
6. Create layouts
7. Implement features
8. Implement pages
9. Refactor duplicated logic

---

## 15. Important Restrictions

* Do NOT generate monolithic files
* Do NOT duplicate components
* Do NOT mix business logic with presentation
* Do NOT create unnecessary client components
* Do NOT ignore existing architecture
* Do NOT overwrite existing reusable abstractions
* Do NOT generate inconsistent spacing/colors/typography

---

## 16. When Generating Code

Always:

* explain architectural decisions briefly
* reuse existing components when possible
* improve code quality incrementally
* preserve scalability
* preserve maintainability

---

## 17. Output Expectations

Generated code must be:

* production-ready
* scalable
* typed
* modular
* maintainable
* readable
* reusable
* responsive
* accessible

---

# Pre-Implementation Requirements

Before implementing anything new:

* inspect existing architecture
* inspect reusable components
* inspect shared utilities
* inspect design patterns already in use

Never create redundant abstractions.

Prefer pragmatic clean architecture over overengineering.
