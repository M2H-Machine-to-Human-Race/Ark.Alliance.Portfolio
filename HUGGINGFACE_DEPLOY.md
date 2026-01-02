# Deploying Ark.Portfolio to Hugging Face Spaces

This guide walks you through deploying Ark.Portfolio to Hugging Face Spaces.

## Prerequisites

- A Hugging Face account
- Git installed locally
- HF CLI (optional but recommended)

## Step 1: Clone Your HF Space Repository

```bash
# Clone the existing space (or create a new one)
git clone https://huggingface.co/spaces/arkleinberg/arkleinberg-https-huggingface-co-spaces-arkleinberg-arkworld
cd arkleinberg-https-huggingface-co-spaces-arkleinberg-arkworld
```

Or create a new space at [huggingface.co/new-space](https://huggingface.co/new-space) with SDK = Docker.

## Step 2: Copy Project Files

Copy the following files from Ark.Portfolio to your HF Space:

```bash
# Copy all required directories
cp -r /path/to/Ark.Portfolio/Ark.Portfolio.Backend ./
cp -r /path/to/Ark.Portfolio/Ark.Portfolio.UI ./
cp -r /path/to/Ark.Portfolio/Ark.Portfolio.Share ./

# Copy Docker files
cp /path/to/Ark.Portfolio/Dockerfile ./
cp /path/to/Ark.Portfolio/nginx.conf ./
cp /path/to/Ark.Portfolio/start.sh ./
cp /path/to/Ark.Portfolio/.dockerignore ./

# Copy HF readme as README.md (this is required!)
cp /path/to/Ark.Portfolio/huggingface-readme.md ./README.md
```

## Step 3: Push to HF Spaces

```bash
git add .
git commit -m "Deploy Ark.Portfolio"
git push
```

## Step 4: Configure Secrets

1. Go to your Space's Settings
2. Navigate to **Variables and secrets**
3. Add the following **Secrets** (not Variables!):

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `ADMIN_PASSWORD` | Your secure password | Admin login password |
| `JWT_SECRET` | Random secure string | JWT signing key |

> **Important:** Use Secrets, not Variables! Secrets are hidden and won't be copied if someone clones your Space.

### Optional AI Secrets

If you want AI features enabled:

| Secret Name | Value |
|-------------|-------|
| `OPENAI_API_KEY` | `sk-...` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `GOOGLE_AI_API_KEY` | Your API key |

## Step 5: Wait for Build

HF Spaces will automatically build your Docker container. This may take 5-10 minutes.

Monitor the build status in the Logs tab of your Space.

## Step 6: Verify Deployment

Once running:

1. **Test Frontend**: Visit your Space URL
2. **Test API**: Visit `<space-url>/api/health`
3. **Test Admin**: Visit `<space-url>/admin` and login with:
   - Username: `admin`
   - Password: Your `ADMIN_PASSWORD` secret

## Troubleshooting

### Build Fails

Check the build logs for errors. Common issues:
- Missing files in the Space repository
- Incorrect `YAML` frontmatter in `README.md`

### API Returns 502

The backend may still be starting. Wait 30 seconds and try again.

### Login Fails

Ensure you've set the `ADMIN_PASSWORD` secret in Space Settings.

## Updating the Deployment

To update your deployment:

```bash
cd your-hf-space
git pull origin main  # Get any remote changes
# Make your changes or copy updated files
git add .
git commit -m "Update deployment"
git push
```

HF Spaces will automatically rebuild and redeploy.

---

For more information, see the [Hugging Face Spaces Docker Documentation](https://huggingface.co/docs/hub/spaces-sdks-docker).
