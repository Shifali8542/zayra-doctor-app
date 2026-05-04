# Zayra Doctor App

Production-ready React Native mobile app for cardiologists reviewing live cardiac anomalies.

## Tech Stack

- **React Native** (Expo SDK 54) — works with Expo Go and React Native CLI
- **TypeScript** strict mode
- **React Navigation** (Native Stack + Bottom Tabs)
- **Clean architecture** — feature-based modular structure
- **Centralized theme system** with light + dark mode

## Quick Start

```bash
# Install
npm install
# or
yarn

# Run
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web preview
```

> Requires Node 20+ and Expo CLI. Light theme is rendered by default and matches the reference design exactly.

## Folder Structure

```
src/
├── theme/                    # colors, spacing, fonts, lightTheme, darkTheme, theme
├── context/                  # ThemeContext, AuthContext
├── navigation/               # RootNavigator, AuthNavigator, AppNavigator
├── components/               # Reusable UI primitives
│   ├── Layout/               # Responsive container
│   ├── Button/ Card/ Tag/ Avatar/ Header/ Input/ Toggle/
│   ├── BottomTabs/           # Custom tab bar
│   ├── StatBadge/ SeverityBadge/ MetricCard/ SectionTitle/
│   ├── EcgWaveform/          # Procedural SVG ECG renderer
│   ├── WaveformPlaceholder/
│   ├── CaseCard/             # Shared case row
│   └── Icon.tsx              # Custom SVG icon set
├── screens/                  # Screen-specific composition
│   ├── auth/                 # Login, Signup
│   ├── home/                 # PulseDesk
│   ├── claim/                # Claim detail flow
│   ├── cases/                # Triage queue
│   ├── traceview/            # ECG inspection
│   ├── alyna/                # AI assistant chat
│   ├── impact/               # Doctor stats / lifesaving moments
│   └── profile/              # Profile + settings
├── features/                 # Per-feature business logic (hooks)
│   ├── dashboard/hooks/      # useDashboard
│   ├── cases/hooks/          # useCases
│   ├── claim/hooks/          # useClaim
│   ├── traceview/hooks/      # useTraceView
│   ├── alyna/hooks/          # useAlyna
│   ├── impact/hooks/         # useImpact
│   ├── profile/hooks/        # useProfile
│   └── auth/hooks/           # useAuthForm
├── data/                     # mockData.ts (DELETE when API is ready)
├── types/                    # Shared domain types
└── utils/                    # responsive, format helpers, useResponsive
```

Every screen follows: `ScreenName/ScreenName.tsx + ScreenName.style.ts`.
Every component follows: `Component/Component.tsx + Component.style.ts`.

## Design System

- **No hardcoded colors** — everything pulls from `theme.colors`
- **No inline styles** — every `.tsx` has a paired `.style.ts`
- **Spacing scale** on 4pt grid: `xxs` (2) → `massive` (56)
- **Typography variants**: `eyebrow`, `body`, `bodyStrong`, `title`, `h1`–`h3`, `display`, `metricLarge`
- **Radii**: from `xs` (4) to `pill` (999)

## Theme System

Light theme matches the reference design pixel-perfectly:
- Background: `#EEF4F7`
- Hero gradient: `#0A2540` → `#1FA59B`
- Primary action: `#0A2540`
- Surface: `#FFFFFF`

Dark theme is also fully wired — toggle from the **Profile screen → App preferences → Theme**.

## Responsiveness

Breakpoints: `mobile` (<600), `tablet` (600–1023), `desktop` (≥1024).

Layout component centers content with a `maxWidth` of ~480–560 on tablet/desktop so the mobile-style UX scales cleanly to wider viewports without overlap.

## Mock Data

All mock data lives in **`src/data/mockData.ts`** — a single, deletable file.

When connecting real APIs, replace the calls in:
- `src/features/dashboard/hooks/useDashboard.ts`
- `src/features/cases/hooks/useCases.ts`
- `src/features/claim/hooks/useClaim.ts`
- `src/features/traceview/hooks/useTraceView.ts`
- `src/features/alyna/hooks/useAlyna.ts`
- `src/features/impact/hooks/useImpact.ts`
- `src/features/profile/hooks/useProfile.ts`

…with your API client and delete `mockData.ts`.

## Auth

- `Login` and `Signup` screens use a stub `AuthContext`
- A **"Skip for now"** button is included on both as requested — remove when no longer needed

## ECG Waveform

`EcgWaveform` is a procedural SVG renderer that synthesizes lifelike ECG strips by varying P-wave / QRS / T-wave parameters per `severity`. It scales to any width and supports zoom in TraceView without dropping frames.
