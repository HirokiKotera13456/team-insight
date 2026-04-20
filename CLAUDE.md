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
