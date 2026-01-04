# Deploying Ark.Portfolio Frontend to Hugging Face Spaces

This guide walks you through deploying the Ark.Portfolio frontend to Hugging Face Spaces as a static site.

## Prerequisites

- A Hugging Face account with an access token
- Git installed locally
- Git LFS installed: `git lfs install`
- **git-xet** (required for HuggingFace storage):
  ```powershell
  # Windows - using winget
  winget install git-xet
  
  # Then initialize
  git xet install
  ```

## Step 1: Get HuggingFace Access Token

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new token with **write** access
3. Save the token (starts with `hf_`)

## Step 2: Clone Your HF Space Repository

```powershell
# Clone with authentication
git clone https://YOUR_USERNAME:YOUR_TOKEN@huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME hf-deploy

cd hf-deploy
```

Example:
```powershell
git clone https://arkleinberg:hf_XXXXX@huggingface.co/spaces/arkleinberg/arkleinberg-https-huggingface-co-spaces-arkleinberg-arkworld hf-deploy
```

## Step 3: Build the Frontend

```powershell
cd Ark.Portfolio/Ark.Portfolio.UI
npm install
npm run build
```

This creates the `dist/` folder with the static files.

## Step 4: Copy Built Files to HF Space

```powershell
# Copy built frontend files
Copy-Item -Path "Ark.Portfolio.UI/dist/*" -Destination "hf-deploy/" -Recurse -Force

# Remove old files if they exist
Remove-Item -Path "hf-deploy/prompts.txt" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "hf-deploy/style.css" -Force -ErrorAction SilentlyContinue
```

## Step 5: Create/Update README.md

The README.md must have YAML frontmatter for HF Spaces. Create/replace it:

```markdown
---
title: Ark Portfolio
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
---

# Ark Portfolio

Your portfolio description here.
```

> **Important:** The `sdk: static` tells HuggingFace to serve this as a static HTML site.

## Step 6: Push to HuggingFace Spaces

```powershell
cd hf-deploy

# Stage all changes
git add -A

# Commit
git commit -m "Deploy Ark.Portfolio frontend"

# Push
git push origin main
```

If push fails with "pre-receive hook declined" or xet-storage errors:
1. Install git-xet: `winget install git-xet`
2. Run: `git xet install`
3. Try pushing again

## Step 7: Verify Deployment

Once pushed, HuggingFace will automatically deploy. Visit your Space URL:

```
https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
```

The deployment typically takes 1-2 minutes for static sites.

## Troubleshooting

### Push Fails with xet-storage Error

```powershell
# Install git-xet
winget install git-xet

# Initialize
git xet install

# Retry push
git push origin main
```

### Git LFS Issues

```powershell
# Initialize LFS
git lfs install

# Track large files
git lfs track "*.png"
git add .gitattributes

# Commit and push
git commit -m "Add LFS tracking"
git push origin main
```

### Authentication Issues

```powershell
# Update remote with token
git remote set-url origin https://USERNAME:HF_TOKEN@huggingface.co/spaces/USERNAME/SPACE_NAME

# Verify
git remote -v
```

---

## Full Deployment (Backend + Frontend with Docker)

For full-stack deployment including the backend API, see the Docker-based deployment in the main repository which uses:
- `Dockerfile` - Multi-stage build for all layers
- `nginx.conf` - Reverse proxy configuration
- `start.sh` - Startup script

This requires configuring HF Space secrets:
- `ADMIN_PASSWORD` - Admin login password
- `JWT_SECRET` - JWT signing key

---

*For more information, see the [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)*
