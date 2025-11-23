# ShiftTally

**Overtime & pay calculator for healthcare workers**

Know your real take-home pay per shift/week/pay period before you clock in.

## Features

- **Quick Tally**: Enter a few numbers, instantly see gross vs net pay
- **Overtime calculation**: Automatic 1.5x for hours over 40/week
- **Differentials**: Night, weekend, holiday, charge nurse, preceptor
- **All 50 states + DC**: Accurate state tax calculations
- **Facility presets**: Save your common shift configurations
- **Dark mode**: Easy on the eyes during night shifts

## Tech Stack

- **React Native + Expo**: Cross-platform iOS & Android
- **TypeScript**: Type-safe pay calculations
- **Monorepo**: Shared pay engine that can power web/API later

## Project Structure

```
shifttally/
├── apps/
│   └── mobile/          # React Native Expo app
├── packages/
│   └── core/            # Pay calculation engine
├── .github/
│   └── workflows/       # CI/CD
└── package.json         # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install dependencies
pnpm install

# Build the core package
pnpm core build
```

### Running the App

```bash
# Start Expo dev server
pnpm dev

# Or run on specific platform
pnpm mobile ios     # iOS Simulator
pnpm mobile android # Android Emulator
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run core engine tests only
pnpm core test

# Run with coverage
pnpm core test -- --coverage
```

## Pay Engine API

The core calculation function:

```typescript
import { calculateShiftPay } from '@shifttally/core';

const result = calculateShiftPay({
  baseRate: 45,           // $/hour
  shiftHours: 12,         // hours this shift
  weeklyHours: 36,        // hours already worked this week
  state: 'TX',            // work state (no state tax in TX)
  diffs: {
    night: true,          // +$3/hr
    weekend: false,
    holiday: false,
    charge: false,
    preceptor: false,
  },
});

console.log(result.gross);  // $768
console.log(result.net);    // ~$590 (after federal taxes)
console.log(result.breakdown); // Detailed breakdown
```

## Tax Calculations

MVP uses effective tax rate approximations:

- **Federal**: ~15% effective rate (configurable)
- **FICA**: 6.2% Social Security
- **Medicare**: 1.45%
- **State**: Lookup table for all 50 states + DC

Future versions will implement progressive brackets.

## Privacy

ShiftTally stores all data locally on your device. We don't collect any personal health information (PHI), and we never sell your data.

## License

Proprietary - All rights reserved
