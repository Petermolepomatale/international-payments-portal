# 🚀 CircleCI & SonarCloud Setup Guide

## Quick Setup (5-10 minutes)

Follow these steps to activate your CI/CD pipeline with security scanning.

---

## 📋 Step 1: Connect CircleCI (2 minutes)

### 1.1 Sign Up/Login
1. Go to: **https://circleci.com/signup/**
2. Click **"Sign Up with GitHub"**
3. Authorize CircleCI to access your GitHub account

### 1.2 Add Your Project
1. Once logged in, click **"Projects"** in the left sidebar
2. Find **"international-payments-portal"** in the list
3. Click **"Set Up Project"** button
4. CircleCI will automatically detect your `.circleci/config.yml` file
5. Click **"Start Building"**

✅ **Done!** CircleCI will start running your pipeline immediately.

---

## 🔍 Step 2: Connect SonarCloud (3 minutes)

### 2.1 Sign Up/Login
1. Go to: **https://sonarcloud.io/**
2. Click **"Log in"** (top right)
3. Click **"With GitHub"**
4. Authorize SonarCloud to access your GitHub account

### 2.2 Import Your Project
1. Click the **"+"** icon (top right)
2. Select **"Analyze new project"**
3. Choose **"international-payments-portal"** from the list
4. Click **"Set Up"**
5. Choose **"With CircleCI"** as the analysis method
6. Click **"Continue"**

### 2.3 Get Your Token
1. SonarCloud will show you a **project token**
2. **COPY THIS TOKEN** (you'll need it in the next step)
3. It looks like: `sqp_1234567890abcdef...`

---

## 🔐 Step 3: Connect CircleCI to SonarCloud (2 minutes)

### 3.1 Add SonarCloud Token to CircleCI
1. Go back to **CircleCI** (https://circleci.com)
2. Click on your **"international-payments-portal"** project
3. Click **"Project Settings"** (top right)
4. Click **"Environment Variables"** in the left menu
5. Click **"Add Environment Variable"**
6. Enter:
   - **Name**: `SONAR_TOKEN`
   - **Value**: Paste the token you copied from SonarCloud
7. Click **"Add Variable"**

✅ **Done!** Your pipeline is now fully connected.

---

## 🎉 Step 4: Trigger Your First Pipeline Run

### Option A: Make a Small Change
```bash
cd international-payments-portal
echo "# Pipeline Active" >> README.md
git add README.md
git commit -m "Activate CI/CD pipeline"
git push origin main
```

### Option B: Manually Trigger
1. Go to CircleCI dashboard
2. Click on your project
3. Click **"Trigger Pipeline"**
4. Click **"Trigger Pipeline"** again to confirm

---

## 📊 What Happens Next?

### CircleCI Will:
- ✅ Install dependencies
- ✅ Run security audits
- ✅ Execute linting checks
- ✅ Run all tests with coverage
- ✅ Send results to SonarCloud
- ✅ Build production bundles

### SonarCloud Will:
- 🔍 Analyze code quality
- 🛡️ Detect security hotspots
- 🐛 Find bugs and vulnerabilities
- 📈 Track code coverage
- 📊 Generate quality reports

---

## 🔗 Quick Links

| Service | URL | Purpose |
|---------|-----|---------|
| **CircleCI Dashboard** | https://app.circleci.com/pipelines/github/Petermolepomatale/international-payments-portal | View pipeline runs |
| **SonarCloud Dashboard** | https://sonarcloud.io/project/overview?id=international-payments-portal | View code quality |
| **GitHub Repository** | https://github.com/Petermolepomatale/international-payments-portal | Source code |

---

## 🆘 Troubleshooting

### Pipeline Fails on First Run?
- **Normal!** First runs often need dependency caching
- Click **"Rerun workflow from failed"** in CircleCI
- Second run should succeed

### SonarCloud Not Receiving Data?
- Check that `SONAR_TOKEN` is set in CircleCI environment variables
- Verify the token hasn't expired
- Check CircleCI logs for SonarQube scanner errors

### Need Help?
- CircleCI Docs: https://circleci.com/docs/
- SonarCloud Docs: https://docs.sonarcloud.io/

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] CircleCI shows your project
- [ ] Pipeline runs automatically on commits
- [ ] All pipeline steps pass (green checkmarks)
- [ ] SonarCloud shows your project
- [ ] SonarCloud receives analysis data
- [ ] Quality Gate status is visible
- [ ] GitHub shows CircleCI status checks

---

## 🎯 Your Configuration Files

These files are already in your repository:

- **`.circleci/config.yml`** - Pipeline configuration
- **`sonar-project.properties`** - SonarCloud settings

No changes needed - they're ready to go!

---

**Total Setup Time: ~5-10 minutes**

Once connected, your pipeline runs automatically on every commit! 🚀
