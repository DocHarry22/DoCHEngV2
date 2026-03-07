# GitHub Bootstrap Guide (DoCHEngV2)

Use this once to publish this folder as a GitHub repository.

## 1. Initialize Git (if needed)

```bash
git init
```

## 2. Configure default branch

```bash
git branch -M main
```

## 3. Add all files and commit

```bash
git add .
git commit -m "chore(repo): bootstrap DoCHEngV2 parent repository"
```

## 4. Create a GitHub repository

Create a new empty repository in GitHub (for example: `dochengv2`).

Do not initialize it with README/.gitignore on GitHub if this local folder already has them.

## 5. Add remote and push

```bash
git remote add origin https://github.com/<your-org-or-user>/dochengv2.git
git push -u origin main
```

## 6. Verify GitHub Actions

After push, check Actions tab for `CI` workflow:

- Lint
- Typecheck
- Test

## 7. Optional: protect main branch

In GitHub branch protection rules, require status checks:

- `quality`

## Notes for future subdomain apps

- Place each new app in `apps/<app-name>`.
- Keep shared platform contracts in root `src/lib` until workspace tooling is introduced.
- Ensure new app onboarding includes lint/typecheck/test scripts.
