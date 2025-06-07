#!/bin/bash

# Create a simple AI trip planner favicon using CSS and HTML
cat > temp_favicon.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; }
        .favicon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .plane {
            width: 18px;
            height: 18px;
            background: white;
            clip-path: polygon(50% 0%, 0% 100%, 50% 75%, 100% 100%);
            transform: rotate(45deg);
        }
        .ai-dots {
            position: absolute;
            width: 3px;
            height: 3px;
            background: #FBBF24;
            border-radius: 50%;
        }
        .dot1 { top: 6px; left: 6px; }
        .dot2 { top: 6px; right: 6px; }
        .dot3 { bottom: 6px; left: 6px; }
        .dot4 { bottom: 6px; right: 6px; }
    </style>
</head>
<body>
    <div class="favicon">
        <div class="plane"></div>
        <div class="ai-dots dot1"></div>
        <div class="ai-dots dot2"></div>
        <div class="ai-dots dot3"></div>
        <div class="ai-dots dot4"></div>
    </div>
</body>
</html>
EOF

echo "HTML favicon template created"
