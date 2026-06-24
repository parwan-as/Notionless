# Notionless

A Notion-style block editor built with React and TypeScript. Documents are made of composable blocks (text, headings, lists, images, and links to nested pages) with drag-and-drop reordering, a slash command palette, passwordless auth, and persistence to Supabase.

## Features

- Block-based editor where each line can be turned into text, headings (H1-H3), bulleted lists, images, or sub-page links
- Slash command palette: type `/` to open a keyboard-navigable menu (arrow keys to move, Enter to select) for changing block types
- `contentEditable` editing with caret-aware handling for Enter, Backspace, and Tab using the DOM selection API
- Drag-and-drop block reordering with [@dnd-kit](https://dndkit.com/)
- Nested pages: create linked sub-pages, navigate them through a breadcrumb, and delete them with confirmation
- Image uploads for covers and inline images via Supabase Storage, cleaned up on delete
- Magic-link sign-in with Supabase Auth, protected routes, and session-aware redirects
- Autosave that syncs to Supabase 500ms after you stop typing
- Light and dark mode driven by CSS custom properties that follow the system preference

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite (React Compiler enabled) |
| Backend | Supabase (Postgres, Auth, Storage, Row-Level Security) |
| Routing | React Router |
| State | use-immer for immutable updates, React Context for app state |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | CSS Modules + CSS custom properties |
| Testing | Vitest + Testing Library + jsdom |

## Notes on the architecture

- `withInitialState` is a HOC that fetches a page (or scaffolds the start page) by slug before mounting the editor, keeping data loading out of the view layer.
- `useSyncedState` wraps `useImmer` and fires a debounced sync callback on every change, separating local editing from network persistence.
- `NodeTypeSwitcher` is the single place that renders the right block component (`BasicNode`, `PageNode`, `ImageNode`) for each node type.
- The auth context object, provider, and hook live in separate files so Vite fast refresh and the ESLint rules stay happy.
- Pages and storage objects are scoped to their owner (`auth.uid() = created_by`) through Row-Level Security, enforced in the database.

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_API_KEY=your-anon-key
```

### 3. Set up Supabase

Create a `pages` table:

| column | type | notes |
| --- | --- | --- |
| `id` | `uuid` | primary key, default `gen_random_uuid()` |
| `slug` | `text` | unique |
| `title` | `text` | |
| `cover` | `text` | |
| `nodes` | `jsonb` | |
| `created_by` | `uuid` | references `auth.users` |

Enable Row-Level Security and add a policy so users only access their own rows:

```sql
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own pages"
ON public.pages
FOR ALL
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
```

Create a Storage bucket named `notionless`, and add `SELECT`, `INSERT`, and `DELETE` policies on it scoped to authenticated users.

Under Authentication > URL Configuration, set the Site URL and add your local dev URL (for example `http://localhost:5173/**`) to the redirect allowlist so magic links work locally.

### 4. Run

```bash
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── Node/        Block components (text, list, image, page link) + command palette
├── Page/        Page shell: cover, title, breadcrumb, spacer
├── auth/        Magic-link auth, session context, protected routes
├── state/       App state context, page state, synced/persisted state hooks
├── components/  Shared UI (image loader, spinner)
└── utils/       Supabase helpers, debounce, types
```

## License

MIT
