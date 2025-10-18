#!/bin/bash

# Silicon Valley Robotics Center - Deployment Script
# This script helps you deploy your website to GitHub Pages

echo "🚀 Silicon Valley Robotics Center - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

# Get repository name
echo "📝 Please enter your repository name (or press Enter for 'silicon-valley-robotics-center'):"
read -r REPO_NAME

if [ -z "$REPO_NAME" ]; then
    REPO_NAME="silicon-valley-robotics-center"
fi

echo ""
echo "🔗 Setting up remote repository..."
echo "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Add remote origin
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Push to GitHub
echo "📤 Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Next steps to enable GitHub Pages:"
    echo "1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "2. Click on 'Settings' tab"
    echo "3. Scroll down to 'Pages' section"
    echo "4. Under 'Source', select 'Deploy from a branch'"
    echo "5. Select 'main' branch and '/ (root)' folder"
    echo "6. Click 'Save'"
    echo ""
    echo "🎉 Your website will be available at:"
    echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo ""
    echo "⏱️  It may take a few minutes for the site to be live."
else
    echo "❌ Failed to push to GitHub. Please check your repository URL and try again."
    exit 1
fi
