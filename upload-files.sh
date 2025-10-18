#!/bin/bash

echo "🚀 Silicon Valley Robotics Center - File Upload Helper"
echo "====================================================="
echo ""
echo "Since Git push isn't working, here's what you need to do:"
echo ""
echo "1. Go to: https://github.com/JerryAlfred/roboticscenter-cursor"
echo "2. Click 'uploading an existing file' or drag and drop"
echo "3. Upload these files:"
echo ""

# List all files that need to be uploaded
ls -la *.html *.css *.js *.md *.json 2>/dev/null | while read line; do
    filename=$(echo $line | awk '{print $NF}')
    if [[ "$filename" != "upload-files.sh" ]]; then
        echo "   📄 $filename"
    fi
done

echo ""
echo "4. Commit message: 'Add complete Silicon Valley Robotics Center website'"
echo "5. Click 'Commit changes'"
echo ""
echo "6. Enable GitHub Pages:"
echo "   - Go to Settings → Pages"
echo "   - Source: 'Deploy from a branch'"
echo "   - Branch: 'main'"
echo "   - Folder: '/ (root)'"
echo "   - Click 'Save'"
echo ""
echo "🌐 Your website will be live at:"
echo "https://jerryalfred.github.io/roboticscenter-cursor"
echo ""
echo "⏱️  It may take 5-10 minutes for the site to be live."
