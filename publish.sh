#!/usr/bin/env bash
#
# publish.sh — push your site live in one step.
#
# Usage:
#   ./publish.sh "what I changed"
#   ./publish.sh                 (uses a default message)
#
# It saves all your changes, sends them to GitHub, and Vercel
# automatically puts them on your live site within a minute.

set -e
cd "$(dirname "$0")"

# Use your message, or a dated default if you didn't type one.
msg="${*:-Update site ($(date '+%Y-%m-%d %H:%M'))}"

# Are there any changes to publish?
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ Nothing to publish — your site is already up to date."
  exit 0
fi

echo "📦 Saving changes..."
git add -A
git commit -m "$msg"

echo "🚀 Pushing to GitHub (Vercel will deploy automatically)..."
git push origin main

echo ""
echo "🤍 Done! Your changes are on their way live."
echo "   Check your Vercel dashboard — the site updates in under a minute."
