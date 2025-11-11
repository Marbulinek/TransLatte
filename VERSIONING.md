# Versioning & Release Strategy

TransLatté uses **Semantic Versioning** (SemVer) and **automated releases** via GitHub Actions.

## Version Format

Versions follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backward compatible (e.g., 1.0.0 → 1.0.1)

## Automatic Versioning

When you push to the `master` branch, the CI/CD pipeline automatically:

1. ✅ Runs all tests across Node 14.x, 16.x, 18.x, 20.x
2. ✅ Builds the project
3. ✅ Determines version bump type based on commit message
4. ✅ Bumps the version in `package.json`
5. ✅ Creates a git tag (e.g., `v1.1.1`)
6. ✅ Publishes to npm registry
7. ✅ Pushes version bump and tags back to GitHub

### Commit Message Convention

The version bump type is determined by your commit message:

| Commit Message Pattern | Version Bump | Example |
|------------------------|--------------|---------|
| `feat:` or `feature:` | **MINOR** | `feat: add cache system` → 1.0.0 → 1.1.0 |
| `BREAKING CHANGE` or `major:` | **MAJOR** | `major: remove deprecated API` → 1.1.0 → 2.0.0 |
| Any other message | **PATCH** | `fix: resolve placeholder issue` → 1.1.0 → 1.1.1 |

### Examples

```bash
# Patch version bump (1.1.0 → 1.1.1)
git commit -m "fix: correct cache key generation"
git push origin master

# Minor version bump (1.1.0 → 1.2.0)
git commit -m "feat: add support for TypeScript 5.4"
git push origin master

# Major version bump (1.1.0 → 2.0.0)
git commit -m "major: change CLI argument structure

BREAKING CHANGE: --input flag renamed to --source"
git push origin master
```

## Manual Release

You can also trigger a release manually from GitHub Actions:

1. Go to **Actions** → **Manual Release**
2. Click **Run workflow**
3. Select version bump type (patch/minor/major)
4. Click **Run workflow**

## NPM Token Setup

To enable automatic publishing, add your npm token as a GitHub secret:

1. Generate npm token: `npm token create` (with publish permissions)
2. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: `npm_xxxxxxxxxxxxxxxxxxxxx` (your npm token)
6. Click **Add secret**

## Preventing Version Bumps

If you want to push to master without triggering a version bump:

```bash
git commit -m "docs: update README [skip ci]"
git push origin master
```

The `[skip ci]` flag prevents the CI/CD pipeline from running.

## Version History

All version bumps are automatically tagged in git. View version history:

```bash
# List all version tags
git tag

# View changes between versions
git log v1.0.0..v1.1.0 --oneline

# Checkout a specific version
git checkout v1.1.0
```

## Release Notes

After each release, update `CHANGELOG.md` with:
- New features
- Bug fixes
- Breaking changes
- Migration guide (for major versions)

## Current Version

The current version is always shown in:
- `package.json` → `version` field
- npm registry: https://www.npmjs.com/package/translatte
- GitHub tags: https://github.com/Marbulinek/TransLatte/tags

## Rollback

If a release has issues:

1. **Unpublish from npm** (within 72 hours):
   ```bash
   npm unpublish translatte@1.1.1
   ```

2. **Revert the version commit**:
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

3. **Delete the tag**:
   ```bash
   git tag -d v1.1.1
   git push origin :refs/tags/v1.1.1
   ```

## Best Practices

1. ✅ Write clear commit messages following the convention
2. ✅ Test locally before pushing to master
3. ✅ Use feature branches for development
4. ✅ Only push to master when ready to release
5. ✅ Update CHANGELOG.md after each release
6. ✅ Use `[skip ci]` for documentation-only changes
7. ✅ Test the package after publish: `npm install translatte@latest`
