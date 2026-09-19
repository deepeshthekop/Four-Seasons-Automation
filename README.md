# Four Seasons QA Automation Assessment

![WebdriverIO](https://img.shields.io/badge/WebdriverIO-9-EA5906?logo=webdriverio&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)
[![CI](https://github.com/deepeshthekop/Four-Seasons-Automation/actions/workflows/e2e.yml/badge.svg)](https://github.com/deepeshthekop/Four-Seasons-Automation/actions/workflows/e2e.yml)

A JavaScript/WebdriverIO E2E framework for the QA Automation Engineer technical assessment. The single scenario covers the required Four Seasons Resort Cabo Del Sol booking/cart flow on the public production website. It stops at cart verification without completing a booking or submitting payment.

## Automated scenario

1. Open the [hotel/resort directory](https://www.fourseasons.com/find_a_hotel_or_resort/).
2. Select **Los Cabos (Cabo Del Sol)** and verify the property URL and heading.
3. Select a two-night stay starting 30 days from the current local date and verify the applied dates.
4. Check rates and verify the results page, property code, dates, and occupancy in the search URL.
5. Select the first visible, enabled **Add to Cart** action, capturing its room name, rate plan, displayed average nightly price, and currency before clicking.
6. Wait for the Discover page and updated cart indicator, then open the cart.
7. Verify the property, selected room and rate, occupancy (two adults, no children), currency, and pricing consistency.

## Tech stack

- JavaScript ES modules and Node.js
- WebdriverIO 9 with the local runner, Mocha, Chrome, and spec reporter
- ESLint 10 and Prettier 3

## Project structure

```text
├── package.json
├── package-lock.json
├── wdio.conf.js
├── eslint.config.js
└── test/
    ├── pages/
    │   ├── hotel-directory.page.js
    │   ├── resort.page.js
    │   └── accommodations.page.js
    ├── components/
    │   ├── consent.component.js
    │   └── cart.component.js
    ├── data/
    │   └── booking.data.js
    ├── utils/
    │   └── pricing.js
    └── specs/
        └── room-cart.e2e.js
```

Pages own page-specific interactions, including the resort calendar. Components handle consent and the cart overlay. Booking data contains the scenario inputs and future-date construction; the pricing utility calculates the acceptable cart room-amount range from the displayed average nightly price. The spec coordinates the flow and assertions.

## Prerequisites and setup

- Node.js 24.x (recommended)
- npm and desktop Google Chrome
- Internet access to run the test against the live Four Seasons website

From the repository root:

```sh
npm ci
```

## Running the project

| Command                | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `npm run wdio`         | Run the complete E2E scenario in headed Chrome        |
| `npm run lint`         | Check JavaScript source and configuration with ESLint |
| `npm run format`       | Format project files with Prettier                    |
| `npm run format:check` | Verify formatting without changing files              |

Local `npm run wdio` uses headed Chrome. A native headless mode is available for experimentation on macOS/Linux:

```sh
HEADLESS=true npm run wdio
```

## CI/CD

The GitHub Actions workflow in `.github/workflows/e2e.yml` installs dependencies with `npm ci`, checks formatting, runs ESLint, and executes the E2E scenario in headed Chrome on Ubuntu 24.04 with Node.js 24 and one browser worker. WebdriverIO automatically supplies an Xvfb virtual display when no Linux display is available; CI does not enable Chrome native headless mode.

Native headless execution returned Access Denied during local verification against Four Seasons, so CI uses normal headed Chrome with the Xvfb virtual display. The complete E2E scenario has been successfully verified on the GitHub-hosted Ubuntu runner.

It runs on pushes to `main`, pull requests targeting `main`, manual dispatch, and Mondays at 11:00 UTC (7:00 AM Toronto during daylight-saving time). The weekly schedule is an example scheduled execution against the live production website. If the E2E step fails, available `artifacts/` diagnostics are uploaded; missing diagnostics do not cause another failure.

## Design decisions

- Page objects and components keep UI interactions separate from test assertions.
- Dates are calculated relative to today, and the test does not depend on a specific room always being available.
- Room, rate, and pricing details are captured from the same room/rate context as the selected Add to Cart action.
- Condition-based waits cover visibility, enabled controls, navigation, loading indicators, and cart updates; there are no fixed sleeps.
- Consent is accepted when present. If initially absent, it is checked again on the resort page; successful acceptance avoids a redundant check.
- One browser worker is sufficient for the single E2E scenario and avoids unnecessary concurrent traffic against the production site.

## Pricing verification

The accommodations page displays an average nightly price at limited precision, while the cart displays the room amount for the full stay with cents. Directly multiplying the displayed average by the number of nights can therefore differ from the cart amount.

During investigation, the Four Seasons reservation response confirmed that pricing retains more precision than is displayed on the accommodations page. For example, one rate returned an average nightly price of CAD 1,612.48 and a two-night room total of CAD 3,224.97, while the UI displayed the average nightly price as CAD 1,612.

The E2E test remains a black-box UI test and does not depend on the reservation API. It captures the displayed average nightly price and currency before adding the room, derives an acceptable rounding interval from the displayed precision, and scales that interval by the number of nights. The cart's room amount must fall within that range, and its currency must match exactly.

The assertion intentionally excludes **Est. Total** and does not calculate taxes, fees, or service charges, which represent a different pricing concept.

## Reliability and limitations

This test runs against the live production website, so room availability, page content, and response times can vary. Condition-based waits handle normal asynchronous loading, but the test cannot guarantee that a directly bookable room will be available for the generated dates.

- If no directly bookable room is available for the generated stay, the test does not search alternative dates.
- Selection requires a visible, enabled direct **Add to Cart** action; a separate bed-option selection flow is not implemented.
- Selectors and text parsing expect English UI text and amounts using commas for grouping and a decimal point.
- On failure, diagnostic artifacts including a screenshot, page HTML, and URL/body text are saved under the git-ignored `artifacts/` directory.

## Test recording

The recording below demonstrates the complete automated E2E scenario, from hotel selection through cart verification and successful test completion.

[▶ View the E2E test execution](https://drive.google.com/file/d/1cqE-PSqr52pVksv32ib9aO4vjyoibaLy/view?usp=sharing)
