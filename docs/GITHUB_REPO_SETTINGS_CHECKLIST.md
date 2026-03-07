# GitHub Repository Settings Checklist

Use this checklist after publishing `DoCHEngV2` to GitHub.

## Branch protection (`main`)

- [ ] Require pull request before merge
- [ ] Require at least 1 approval (2 recommended after team growth)
- [ ] Dismiss stale approvals on new commits
- [ ] Require conversation resolution before merge
- [ ] Require status checks to pass before merge
- [ ] Required check: `quality`
- [ ] Require branches to be up to date before merging
- [ ] Restrict force pushes
- [ ] Restrict branch deletion

## Pull request quality controls

- [ ] Enable auto-delete head branches
- [ ] Enable merge queue (if available and team needs serialized merges)
- [ ] Allow squash merge (recommended)
- [ ] Configure default squash commit title/body strategy

## Security controls

- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable secret scanning (if available)
- [ ] Enable push protection for secrets (if available)

## Ownership and contribution

- [ ] Update `.github/CODEOWNERS` with real team handles
- [ ] Ensure PR template is active (`.github/PULL_REQUEST_TEMPLATE.md`)
- [ ] Ensure issue forms are active (`.github/ISSUE_TEMPLATE/*`)

## CI enforcement

- [ ] Confirm `.github/workflows/ci.yml` runs on PRs and pushes
- [ ] Confirm lint/typecheck/test execute successfully on GitHub Actions

## Future multi-app readiness

- [ ] Preserve `apps/` convention for subdomain apps
- [ ] Require each app PR to include docs and quality checks
- [ ] Keep shared contracts stable in root platform modules
