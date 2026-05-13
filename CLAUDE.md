# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev

# Build & Deploy
npm run build
npm run deploy           # build + Firebase full deploy
npm run deploy:hosting   # hosting only
npm run deploy:firestore # Firestore Rules only

# Lint
npm run lint

# Tests
npm test
npm run test:watch
npm run test:coverage

# Run a single test file
npx jest src/components/ui/__tests__/HistoryChart.test.tsx
```

## Project layout

```
team-insight/
├── pages/                        # Next.js route entry points
│   ├── _app.tsx                  # Global providers (Auth, Theme)
│   ├── _document.tsx             # HTML shell; custom font loading
│   ├── index.tsx                 # Redirects to /login
│   └── app/                     # Authenticated pages
│       ├── assessment.tsx
│       ├── dashboard.tsx
│       └── history.tsx
├── src/
│   ├── components/
│   │   ├── layout/               # AppLayout, FocusLayout
│   │   ├── presentation/         # Pure UI components (no state)
│   │   └── ui/                   # Reusable widgets; __tests__/ inside
│   ├── constants/                # Score labels, axis definitions; __tests__/ inside
│   ├── containers/               # Page-level logic (composes hooks → Presentation)
│   ├── contexts/                 # AuthContext; __tests__/ inside
│   ├── data/                     # questions.ts (version-controlled)
│   ├── hooks/                    # Data-fetching hooks; __tests__/ inside
│   ├── lib/                      # Firebase init, Firestore helpers, auth; __tests__/ inside
│   ├── theme/                    # MUI theme configuration
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # Pure helpers (comments, export, summary); __tests__/ inside
├── firestore.rules               # Firestore security rules
├── firebase.json                 # Firebase Hosting / Firestore config
├── jest.config.js
├── jest.setup.js
└── next.config.js
```

## Testing

Tests use **Jest + React Testing Library** with `jest-environment-jsdom`.

### Where tests live

Each module keeps its tests in a sibling `__tests__/` directory:

```
src/hooks/
  useAssessment.ts
  __tests__/
    useAssessment.test.ts
```

Current test coverage spans:

| Area | File |
|---|---|
| UI components | `src/components/ui/__tests__/` |
| Auth context | `src/contexts/__tests__/AuthContext.test.tsx` |
| Hooks | `src/hooks/__tests__/useAssessment`, `useAxisScores`, `useAssessmentHistory` |
| Firestore helpers | `src/lib/__tests__/firestore.test.ts` |
| Auth helpers | `src/lib/__tests__/auth.test.ts` |
| Score constants | `src/constants/__tests__/scores.test.ts` |
| Utility functions | `src/utils/__tests__/` |

### Conventions

- Firebase SDK is mocked via `jest.setup.js`; tests never hit real Firestore or Auth.
- Path alias `@/` resolves to `src/` (configured in `jest.config.js` and `tsconfig.json`).
- Coverage is collected from all `src/**/*.{ts,tsx}` except `*.d.ts` and `index.ts` re-exports.
- `pages/` and `src/containers/` are **not** unit-tested — they are thin wiring layers covered implicitly by hook/component tests.

### Adding a test

1. Create `src/<layer>/__tests__/<filename>.test.ts(x)`.
2. Mock Firebase where needed — follow the patterns in `src/lib/__tests__/firestore.test.ts`.
3. Run `npm test` to verify all tests still pass.

## Architecture

This is a **Next.js 14 static export** app hosted on Firebase Hosting. `output: 'export'` in `next.config.js` means there is no server-side rendering — all pages are pre-rendered as static HTML.

### Layer structure

| Layer | Directory | Role |
|---|---|---|
| Pages | `pages/` | Route entry points; delegate immediately to containers |
| Containers | `src/containers/` | Page-level logic; compose hooks and pass props to Presentation |
| Presentation | `src/components/presentation/` | Pure UI rendering; receives all data/callbacks as props |
| Hooks | `src/hooks/` | Data fetching and state (`useAssessment`, `useAuth`, `useAxisScores`, `useAssessmentHistory`) |
| UI components | `src/components/ui/` | Reusable display widgets (charts, cards, indicators) |
| Layout | `src/components/layout/` | `AppLayout` (with nav), `FocusLayout` (fullscreen for assessment/login) |
| Lib | `src/lib/` | Firebase initialization (`firebase.ts`), Firestore helpers (`firestore.ts`), auth helpers (`auth.ts`) |

### Auth flow

`AuthContext` (`src/contexts/AuthContext.tsx`) exposes `{ user, loading }` via `useAuth()`. `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) wraps authenticated pages — unauthenticated users are redirected to `/login`.

Root `/` redirects to `/login`; authenticated app pages live under `pages/app/`.

### Assessment (diagnosis) flow

1. `pages/app/assessment.tsx` → `AssessmentContainer` → `useAssessment(uid)`
2. `useAssessment` initializes all slider answers to 50, steps through `questions` from `src/data/questions.ts`
3. On final step, `calculateScores()` averages answers per axis → saves to Firestore via `saveAxisScores()`
4. Guest users (no uid) get scores saved to `localStorage` under `guest_assessment_scores`

### Score system

4 axes, each 0–100 (50 = neutral, no good/bad judgment):

| Key | Label | Low → High |
|---|---|---|
| `energy` | 行動エネルギー | 熟慮 → 即行動 |
| `thinking` | 判断基準 | 感情重視 → 論理重視 |
| `planning` | 進め方 | 柔軟 → 計画通り |
| `vision` | 視点 | 具体・現実 → 抽象・将来 |

Score = simple average of answers for each axis (no weights currently applied).

### Firestore data model

```
users/{uid}
  axis_scores/latest          # latest AxisScoreData (+ version field)
  assessment_history/{id}     # AssessmentHistory entries ordered by answeredAt desc
```

Security rules restrict all access to the authenticated owner only.

### Environment variables

All Firebase config is injected via `NEXT_PUBLIC_FIREBASE_*` env vars (see `next.config.js`). These must be set in `.env.local` for local development.

### Question data versioning

`src/data/questions.ts` is version-controlled. Changes to questions affect score comparability with existing `assessment_history` records — treat modifications carefully. The `version` field on `AxisScoreData` tracks which question set was used.
