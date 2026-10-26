# Research & Life scheduler

A self-contained local research scheduler. Open `index.html` in a browser; no server, package manager, or internet connection is required for the app logic.

## Features

- Broad themes such as Research and Hobbies, each containing its own collage of task cards.
- Add your own themes, such as Health, Home, Learning, or Travel.
- Collage-style task cards with visual status, due date, color, and progress.
- Click a card to open its research notes and interactive subtasks.
- Add cards directly from any existing theme and add subtasks from an open task.
- Subtask descriptions are shown beneath their titles when a task is open.
- Notes support basic Markdown, including **bold**, *italics*, code, and inline equations such as `$E = mc^2$`.
- Attach a local image to a card. Images are stored in browser `localStorage` as data URLs.
- Search, status filters, browser-local persistence, and responsive layout.

## Publish as a subpage of `magnesar.github.io`

This folder is prepared to be copied into the root of your GitHub Pages repository:

```text
magnesar.github.io/
└── scheduler/
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── manifest.webmanifest
    └── service-worker.js
```

After pushing the `scheduler/` directory to the repository's published branch, open:

`https://magnesar.github.io/scheduler/`

The relative asset paths, manifest, and service worker are intentionally configured for this subpath. On Android or macOS, use the browser's **Add to Home Screen** or **Install app** action to make it behave like an application.

## Use locally

Open [index.html](./index.html) directly in a modern browser. The starter cards can be edited or deleted. New cards and changes are saved to this browser on this device.

## Supabase sync

The app is configured for the Supabase project `xlaqobmretzuagcmjlun`. It uses the browser-safe publishable key, Supabase Auth, Row Level Security, and the private `research-images` bucket created by the SQL setup.

Sign in with the same scheduler account on each device. The first successful sign-in seeds an empty Supabase project with the starter themes/tasks; subsequent devices load the cloud data. The app keeps a local cache for fallback, but Supabase is the shared source of truth.

The frontend must contain only the project URL and publishable/anon key. Never add the `service_role` key, secret key, database password, or GitHub token to these files.

Each account has its own Supabase rows through `user_id` and Row Level Security. The browser fallback cache is also keyed by the authenticated user's ID, so two accounts using the same browser do not share local data. Supabase Auth may require email confirmation before a newly created account can sign in.

## Archive

Completed cards leave the active board and appear under **Archive**, grouped by completion month. Within an open task, completed subtasks move into a collapsed **Completed subtasks** section, keeping the active checklist focused. Restoring a card is done by opening it from the archive and changing its status back to Planned or In progress.

Each subtask title is shown as a compact nested card within the parent task's list. Clicking it opens a separate nested-card dialog where you can add its own Markdown/LaTeX details, due date, and accent. To persist those extra subtask fields in Supabase, optionally run:

```sql
alter table public.subtasks add column if not exists notes text not null default '';
alter table public.subtasks add column if not exists due_date date;
alter table public.subtasks add column if not exists color text not null default 'sage';
alter table public.subtasks add column if not exists completed_at timestamptz;
```

Completed subtasks show their completion date and are ordered newest-first. Duplicate subtask titles are consolidated per parent task during cloud load.

Cards can be dragged within a theme to change their urgency/order. To sync that order across devices, run:

```sql
alter table public.tasks add column if not exists position integer not null default 0;
alter table public.tasks add column if not exists urgency integer not null default 1;
alter table public.subtasks add column if not exists urgency integer not null default 1;
```

Exact duplicate task titles within the same theme are automatically consolidated on cloud load; dragging a card does not create a new task.

For exact completion dates across devices, run this optional Supabase migration once:

```sql
alter table public.tasks add column if not exists completed_at timestamptz;
```

The app has a fallback for projects where this column has not yet been added, using the task's update timestamp.

Browser storage can also be cleared by browser settings. Image attachments should be kept reasonably small.
