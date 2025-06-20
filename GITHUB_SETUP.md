# GitHub Integration Setup Guide

This guide will help you set up the complete GitHub integration for Valkyrie Finance, including automated deployments, visual testing, and CI/CD workflows.

## 🚀 Quick Setup Checklist

### 1. Repository Configuration

✅ **Repository is already connected**: `https://github.com/ry-animal/valkyriefinance.git`

### 2. Enable GitHub Pages

1. Go to your repository: [Settings → Pages](https://github.com/ry-animal/valkyriefinance/settings/pages)
2. Under "Source", select "GitHub Actions"
3. Your Storybook will be deployed to: `https://ry-animal.github.io/valkyriefinance/`

### 3. Set Up Chromatic (Visual Testing)

1. **Sign up for Chromatic**: [https://chromatic.com](https://chromatic.com)
2. **Connect your GitHub repository** to Chromatic
3. **Get your project token** from the Chromatic dashboard
4. **Add the token to GitHub Secrets**:
   - Go to [Repository Settings → Secrets and Variables → Actions](https://github.com/ry-animal/valkyriefinance/settings/secrets/actions)
   - Click "New repository secret"
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: Your project token from Chromatic
   - Click "Add secret"

### 4. Configure Environment Variables

Create these secrets in your GitHub repository:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `CHROMATIC_PROJECT_TOKEN` | Your Chromatic project token | ✅ Required |
| `GITHUB_TOKEN` | Auto-provided by GitHub | ✅ Auto-configured |

## 🔧 Workflow Details

### 1. Storybook & Chromatic Workflow (`.github/workflows/storybook-chromatic.yml`)

**Triggers on:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**What it does:**
- ✅ Installs dependencies with caching
- ✅ Builds all packages
- ✅ Runs linting checks
- ✅ Builds Storybook
- ✅ Runs Chromatic visual tests
- ✅ Deploys Storybook to GitHub Pages (main branch only)
- ✅ Runs accessibility tests
- ✅ Runs E2E tests

### 2. Deploy Storybook Workflow (`.github/workflows/deploy-storybook.yml`)

**Triggers on:**
- Push to `main` branch
- Manual workflow dispatch

**What it does:**
- ✅ Builds Storybook for production
- ✅ Deploys to GitHub Pages
- ✅ Optimized for fast deployments

## 🧪 Testing Strategy

### Visual Testing with Chromatic
- **Automatic**: Runs on every PR and push
- **Manual**: `pnpm --filter storybook-host test:visual`
- **CI**: `pnpm --filter storybook-host test:visual:ci`

### Accessibility Testing
- **Automatic**: Runs in CI pipeline
- **Manual**: `pnpm --filter storybook-host test:a11y`

### E2E Testing
- **Automatic**: Runs in CI pipeline
- **Manual**: `pnpm --filter storybook-host test:e2e`

## 🌐 Deployment URLs

After setup completion:

- **Production Storybook**: `https://ry-animal.github.io/valkyriefinance/`
- **Chromatic Dashboard**: Available in your Chromatic project
- **GitHub Actions**: [Actions tab](https://github.com/ry-animal/valkyriefinance/actions)

## 🔍 Monitoring & Maintenance

### GitHub Actions Status
- Monitor builds: [GitHub Actions](https://github.com/ry-animal/valkyriefinance/actions)
- Check deployment logs for any issues
- All workflows include proper error handling

### Chromatic Integration
- Review visual changes in Chromatic dashboard
- Approve/reject visual changes as needed
- Monitor visual regression trends

### Performance Optimization
- Workflows use pnpm caching for faster builds
- Chromatic runs only on pre-built Storybook for speed
- Parallel job execution where possible

## 🚨 Troubleshooting

### Common Issues

**1. Chromatic fails with "Project token not found"**
- ✅ Verify `CHROMATIC_PROJECT_TOKEN` is set in GitHub Secrets
- ✅ Check token is copied correctly (no extra spaces)
- ✅ Ensure token has proper permissions in Chromatic

**2. GitHub Pages deployment fails**
- ✅ Check Pages is enabled in repository settings
- ✅ Verify "GitHub Actions" is selected as source
- ✅ Check workflow permissions in repository settings

**3. Build fails on dependencies**
- ✅ Verify `pnpm-lock.yaml` is committed
- ✅ Check Node.js version compatibility (using v20)
- ✅ Clear cache and retry if needed

**4. Accessibility tests fail**
- ✅ Check component implementations for a11y compliance
- ✅ Review failed test details in workflow logs
- ✅ Update components to meet accessibility standards

### Getting Help

1. **Check workflow logs** in GitHub Actions
2. **Review Chromatic dashboard** for visual testing issues
3. **Check Storybook build logs** for component errors
4. **Verify environment variables** are properly set

## 🎯 Next Steps

1. **Set up Chromatic** by following the steps above
2. **Enable GitHub Pages** in repository settings
3. **Create your first PR** to test the workflow
4. **Add more components** and stories to grow your design system
5. **Configure notifications** for build failures (optional)

## 📚 Additional Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Storybook Documentation](https://storybook.js.org/docs)
- [GitHub Pages Setup](https://docs.github.com/en/pages)

---

Your GitHub integration is now ready! 🎉 The next push to main will trigger your first automated deployment.
