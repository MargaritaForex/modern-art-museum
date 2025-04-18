const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function fixEntityStructure(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (item.endsWith('.ts')) {
        const newDirName = item.replace('.ts', '');
        const newDirPath = path.join(dir, newDirName);
        
        // Create new directory if it doesn't exist
        if (!fs.existsSync(newDirPath)) {
          fs.mkdirSync(newDirPath);
        }
        
        // Move files from .ts directory to new directory
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
          const oldFilePath = path.join(fullPath, file);
          const newFilePath = path.join(newDirPath, file);
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`Moved ${oldFilePath} to ${newFilePath}`);
        });
        
        // Remove old directory
        fs.rmdirSync(fullPath);
        console.log(`Removed ${fullPath}`);
      }
      
      // Recursively process subdirectories
      fixEntityStructure(path.join(dir, item.replace('.ts', '')));
    }
  });
}

fixEntityStructure(srcDir); 