const fs = require('fs');

// Create a simple ICO file manually
function createFavicon() {
    // ICO file structure for a 16x16 32-bit icon
    const width = 16;
    const height = 16;
    
    // ICO header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);  // Reserved (must be 0)
    header.writeUInt16LE(1, 2);  // Type (1 = icon)
    header.writeUInt16LE(1, 4);  // Number of images
    
    // Icon directory entry (16 bytes)
    const dirEntry = Buffer.alloc(16);
    dirEntry.writeUInt8(width, 0);   // Width
    dirEntry.writeUInt8(height, 1);  // Height
    dirEntry.writeUInt8(0, 2);       // Color palette (0 = no palette)
    dirEntry.writeUInt8(0, 3);       // Reserved
    dirEntry.writeUInt16LE(1, 4);    // Color planes
    dirEntry.writeUInt16LE(32, 6);   // Bits per pixel
    dirEntry.writeUInt32LE(1024 + 40, 8);  // Image size (pixels + BMP header)
    dirEntry.writeUInt32LE(22, 12);  // Offset to image data
    
    // BMP header (40 bytes)
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0);     // Header size
    bmpHeader.writeInt32LE(width, 4);   // Width
    bmpHeader.writeInt32LE(height * 2, 8); // Height (doubled for ICO)
    bmpHeader.writeUInt16LE(1, 12);     // Planes
    bmpHeader.writeUInt16LE(32, 14);    // Bits per pixel
    bmpHeader.writeUInt32LE(0, 16);     // Compression
    bmpHeader.writeUInt32LE(1024, 20);  // Image size
    bmpHeader.writeUInt32LE(0, 24);     // X pixels per meter
    bmpHeader.writeUInt32LE(0, 28);     // Y pixels per meter
    bmpHeader.writeUInt32LE(0, 32);     // Colors used
    bmpHeader.writeUInt32LE(0, 36);     // Important colors
    
    // Create pixel data (16x16 = 256 pixels, 4 bytes each BGRA)
    const pixels = Buffer.alloc(1024);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = ((height - 1 - y) * width + x) * 4; // Flip vertically
            
            // Calculate distance from center for circular design
            const centerX = 8, centerY = 8;
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            
            if (dist <= 7.5) {
                // Purple gradient background
                const factor = dist / 7.5;
                const r = Math.floor(79 + (124 - 79) * factor);
                const g = Math.floor(70 + (58 - 70) * factor);
                const b = Math.floor(229 + (237 - 229) * factor);
                
                // White airplane shape in center
                if ((x >= 6 && x <= 9 && y >= 5 && y <= 10) &&
                    ((x === 8) || (y === 8) || 
                     (x === 7 && (y === 6 || y === 9)) ||
                     (x === 9 && (y === 6 || y === 9)))) {
                    pixels[pixelIndex] = 255;     // B
                    pixels[pixelIndex + 1] = 255; // G
                    pixels[pixelIndex + 2] = 255; // R
                    pixels[pixelIndex + 3] = 255; // A
                }
                // Yellow AI dots at corners
                else if ((x === 5 && y === 5) || (x === 10 && y === 5) ||
                         (x === 5 && y === 10) || (x === 10 && y === 10)) {
                    pixels[pixelIndex] = 36;      // B
                    pixels[pixelIndex + 1] = 191; // G
                    pixels[pixelIndex + 2] = 251; // R
                    pixels[pixelIndex + 3] = 255; // A
                }
                // Background gradient
                else {
                    pixels[pixelIndex] = b;       // B
                    pixels[pixelIndex + 1] = g;   // G
                    pixels[pixelIndex + 2] = r;   // R
                    pixels[pixelIndex + 3] = 255; // A
                }
            } else {
                // Transparent outside circle
                pixels[pixelIndex] = 0;
                pixels[pixelIndex + 1] = 0;
                pixels[pixelIndex + 2] = 0;
                pixels[pixelIndex + 3] = 0;
            }
        }
    }
    
    // Combine all parts
    const iconFile = Buffer.concat([header, dirEntry, bmpHeader, pixels]);
    
    return iconFile;
}

// Generate and save the favicon
try {
    console.log('🔄 Creating AI Trip Planner favicon...');
    const faviconData = createFavicon();
    fs.writeFileSync('./favicon.ico', faviconData);
    console.log('✅ AI Trip Planner favicon.ico created successfully!');
    console.log('📁 File size:', faviconData.length, 'bytes');
    
    // Verify the file was created
    if (fs.existsSync('./favicon.ico')) {
        const stats = fs.statSync('./favicon.ico');
        console.log('📂 File verified - size:', stats.size, 'bytes');
    }
} catch (error) {
    console.error('❌ Error creating favicon:', error);
    console.error('Stack trace:', error.stack);
}
