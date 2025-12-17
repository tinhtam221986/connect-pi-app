
const fs = require('fs');

const checks = [
    {
        file: 'src/models/Video.ts',
        contains: ['resourceType:', "enum: ['video', 'image']"],
        message: 'Video Model Validation'
    },
    {
        file: 'src/app/api/video/upload/route.ts',
        contains: ['resourceType: resourceType', "const resourceType = isVideo ? 'video' : 'image'"],
        message: 'Upload Route Validation'
    },
    {
        file: 'src/app/api/feed/route.ts',
        contains: ["resource_type: v.resourceType || 'video'"],
        message: 'Feed Route Validation'
    }
];

let failed = false;

checks.forEach(check => {
    try {
        const content = fs.readFileSync(check.file, 'utf8');
        const missing = check.contains.filter(str => !content.includes(str));
        if (missing.length > 0) {
            console.error(`❌ ${check.message} FAILED. Missing: ${missing.join(', ')}`);
            failed = true;
        } else {
            console.log(`✅ ${check.message} PASSED`);
        }
    } catch (e) {
        console.error(`❌ ${check.message} ERROR: File not found - ${check.file}`);
        failed = true;
    }
});

if (failed) process.exit(1);
console.log('ALL CHECKS PASSED');
