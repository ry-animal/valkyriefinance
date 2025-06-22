#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');

// UI components that should be imported from @valkyrie/ui
const UI_COMPONENTS = [
  'Alert',
  'AlertDescription',
  'AlertTitle',
  'Avatar',
  'AvatarFallback',
  'AvatarImage',
  'Badge',
  'Button',
  'Card',
  'CardContent',
  'CardDescription',
  'CardFooter',
  'CardHeader',
  'CardTitle',
  'Checkbox',
  'DropdownMenu',
  'DropdownMenuCheckboxItem',
  'DropdownMenuContent',
  'DropdownMenuGroup',
  'DropdownMenuItem',
  'DropdownMenuLabel',
  'DropdownMenuPortal',
  'DropdownMenuRadioGroup',
  'DropdownMenuRadioItem',
  'DropdownMenuSeparator',
  'DropdownMenuShortcut',
  'DropdownMenuSub',
  'DropdownMenuSubContent',
  'DropdownMenuSubTrigger',
  'DropdownMenuTrigger',
  'Input',
  'Label',
  'Progress',
  'Select',
  'SelectContent',
  'SelectGroup',
  'SelectItem',
  'SelectLabel',
  'SelectScrollDownButton',
  'SelectScrollUpButton',
  'SelectSeparator',
  'SelectTrigger',
  'SelectValue',
  'Skeleton',
  'Table',
  'TableBody',
  'TableCaption',
  'TableCell',
  'TableFooter',
  'TableHead',
  'TableHeader',
  'TableRow',
  'Tabs',
  'TabsContent',
  'TabsList',
  'TabsTrigger',
  'Toaster',
];

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Track what components we're importing from @valkyrie/ui
  const importedComponents = new Set();

  // Replace individual component imports
  UI_COMPONENTS.forEach((component) => {
    const patterns = [
      // Single component import
      new RegExp(
        `import\\s*{\\s*${component}\\s*}\\s*from\\s*['"]@/components/ui/[^'"]+['"];?`,
        'g'
      ),
      // Component in multi-import
      new RegExp(
        `import\\s*{([^}]*\\b${component}\\b[^}]*)}\\s*from\\s*['"]@/components/ui/[^'"]+['"];?`,
        'g'
      ),
    ];

    patterns.forEach((pattern) => {
      if (pattern.test(content)) {
        importedComponents.add(component);
        hasChanges = true;
      }
    });
  });

  // Remove all old UI imports
  content = content.replace(
    /import\s*{[^}]*}\s*from\s*['"]@\/components\/ui\/[^'"]+['"];?\n?/g,
    ''
  );

  // Add single import for all UI components at the top
  if (importedComponents.size > 0) {
    const componentsArray = Array.from(importedComponents).sort();
    const importStatement = `import { ${componentsArray.join(', ')} } from '@valkyrie/ui';\n`;

    // Find where to insert the import (after other imports)
    const lines = content.split('\n');
    let insertIndex = 0;

    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '' && insertIndex > 0) {
      } else if (insertIndex > 0) {
        // We've found the end of imports
        break;
      }
    }

    lines.splice(insertIndex, 0, importStatement);
    content = lines.join('\n');
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
    return true;
  }

  return false;
}

// Find all TypeScript/TSX files in the web app
const webAppPath = path.join(__dirname, '../apps/web/src');
const files = glob
  .sync('**/*.{ts,tsx}', { cwd: webAppPath })
  .map((file) => path.join(webAppPath, file))
  .filter((file) => !file.includes('node_modules'));

console.log(`Found ${files.length} files to process...`);

let updatedCount = 0;
files.forEach((file) => {
  if (updateImports(file)) {
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files.`);
console.log('Import migration complete!');
