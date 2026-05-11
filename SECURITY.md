# Security policy

## Supported versions

Only the latest release of each `@dash-ui/*` package is supported. Pre-1.0 releases ship from `main`.

## Reporting a vulnerability

Please **do not** open a public issue for security reports.

Instead, use GitHub's private vulnerability reporting:

1. Go to https://github.com/webbertakken/dash-ui/security/advisories/new
2. Describe the issue, the affected package(s) and version(s), and a reproduction if you have one
3. We aim to acknowledge within 72 hours and to ship a fix or mitigation within 14 days for confirmed issues

If you cannot use the GitHub flow, message the repo owner on GitHub directly.

## Scope

In scope:
- Anything that runs in user code: `@dash-ui/react`, `@dash-ui/svelte`, `@dash-ui/wc`, `@dash-ui/tokens`, `@dash-ui/assets`
- The reference dashboards and Storybook builds, only where the vulnerability affects shipped artefacts

Out of scope:
- Issues that require an attacker to already have local access to the user's machine
- Findings in third-party dependencies; please report those upstream and we will pull the patched version
