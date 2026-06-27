# Contributing to HydroTrain Monitor

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include clear reproduction steps
4. Specify your environment (OS, browser, version)

### Suggesting Features

1. Use the feature request template
2. Describe the problem and proposed solution
3. Explain how it fits the existing architecture

### Pull Requests

1. Fork the repository
2. Create a feature branch from `develop`
   ```
   git checkout -b feature/your-feature
   ```
3. Follow the code style conventions
4. Ensure TypeScript strict mode passes
5. Ensure `npm run lint` and `npm run build` pass
6. Update documentation if needed
7. Submit a pull request against `develop`

## Development Setup

```bash
npm install
npm run dev
```

## Code Style

- TypeScript strict mode — no `any` types
- Feature-first architecture — keep related code together
- Services layer — never import the simulator directly in components
- Prettier formatting — run `npx prettier --write .` before committing
- Follow the existing patterns in the codebase

## Commit Messages

Use conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `refactor:` — code restructuring
- `chore:` — build/config changes

## Questions?

Open a discussion or issue for any questions.
