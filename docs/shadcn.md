# Integrating shadcn/ui in a Monorepo

This guide outlines the best practices for integrating `shadcn/ui` components within a monorepo structure, ensuring proper installation, import paths, and configuration.

## Monorepo File Structure

When setting up a new monorepo project with `shadcn/ui`, the recommended file structure is as follows:

```
apps
└── web         # Your main application (e.g., Next.js app)
    ├── app
    │   └── page.tsx
    ├── components
    │   └── login-form.tsx
    ├── components.json
    └── package.json
packages
└── ui          # Shared UI components and utilities
    ├── src
    │   ├── components
    │   │   └── button.tsx
    │   ├── hooks
    │   ├── lib
    │   │   └── utils.ts
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
turbo.json
```

## Adding Components

To add `shadcn/ui` components to your project, navigate to your application's path (e.g., `apps/web`) and use the `bunx shadcn@latest add` command. The CLI intelligently determines the component type and installs files to the correct locations.

```bash
cd apps/web
bunx --bun shadcn@latest add [COMPONENT]
```

**Examples:**

*   **Adding a single component:**
    If you run `bunx shadcn@latest add button`, the CLI will install the `button` component under `packages/ui/src/components` and update import paths in `apps/web`.

*   **Adding a block/multiple components:**
    If you run `bunx shadcn@latest add login-01`, the CLI will install `button`, `label`, `input`, and `card` components under `packages/ui/src/components`, and the `login-form` component under `apps/web/components`.

## Importing Components

Components, hooks, and utilities are imported from the `@workspace/ui` package.

*   **Importing a component:**
    ```typescript
    import { Button } from "@workspace/ui/components/button"
    ```

*   **Importing hooks and utilities:**
    ```typescript
    import { useTheme } from "@workspace/ui/hooks/use-theme"
    import { cn } from "@workspace/ui/lib/utils"
    ```

## `components.json` Configuration

Every workspace that uses `shadcn/ui` must have a `components.json` file. This file guides the CLI on how and where to install components and defines aliases for proper imports.

### `apps/web/components.json`

This configuration is for your main application.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  }
}
```

### `packages/ui/components.json`

This configuration is for your shared UI package.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/lib/utils",
    "hooks": "@workspace/ui/hooks",
    "lib": "@workspace/ui/lib",
    "ui": "@workspace/ui/components"
  }
}
```

### Key Requirements for `components.json`

*   **Consistency:** Ensure that `style`, `iconLibrary`, and `baseColor` are identical across both `components.json` files.
*   **Aliases:** The `aliases` field is crucial. It tells the CLI how to resolve paths for components, hooks, and utilities.
    *   For `apps/web`, `components` points to local app components (`@/components`), while `ui` points to the shared `@workspace/ui` components.
    *   For `packages/ui`, all aliases (`components`, `utils`, `hooks`, `lib`, `ui`) point to paths within the `@workspace/ui` package itself.
*   **Tailwind CSS v4:** If you are using Tailwind CSS v4, leave the `tailwind.config` field empty in both `components.json` files.

By adhering to these configurations, the `shadcn/ui` CLI will correctly install UI components, blocks, libraries, and hooks to their designated paths and manage import statements automatically.