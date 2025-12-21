const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    console.log('Loaded environment from .env.local');
} else {
    dotenv.config({ path: envPath });
    console.log('Loaded environment from .env');
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'connect-pi-app-assets';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('Error: Missing R2 credentials in .env file.');
    console.error('Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
    process.exit(1);
}

// Sanitize Endpoint similar to r2.ts
let endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
if (process.env.R2_ENDPOINT) {
    let ep = process.env.R2_ENDPOINT;
    if (!ep.startsWith('http')) ep = `https://${ep}`;
    try {
        const url = new URL(ep);
        endpoint = url.origin;
    } catch (e) {
        console.warn("Invalid R2_ENDPOINT, falling back to Account ID construction.");
    }
}

console.log(`Using Endpoint: ${endpoint}`);

const client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

// Expanded CORS rules to include specific origins and methods
const corsRules = [
  {
    "AllowedOrigins": [
        "*",
        "https://i-app-9v46.vercel.app",
        "https://i-app-9v46.vercel.app/",
        "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*", "Content-Type", "Authorization", "x-amz-date", "x-amz-content-sha256", "x-amz-user-agent"],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
];

async function configureCors() {
    try {
        console.log(`Configuring CORS for bucket: ${R2_BUCKET_NAME}...`);
        console.log(`Using Access Key ID: ****${R2_ACCESS_KEY_ID.slice(-4)}`);

        const command = new PutBucketCorsCommand({
            Bucket: R2_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: corsRules,
            },
        });

        await client.send(command);
        console.log('✅ CORS configuration applied successfully!');
        console.log('Allowed Origins:', corsRules[0].AllowedOrigins);
        console.log('Allowed Methods:', corsRules[0].AllowedMethods);
        console.log('The Pi Browser should now be able to upload videos.');
    } catch (error) {
        console.error('❌ Failed to configure CORS:', error);
        if (error.Code === 'NoSuchBucket') {
            console.error(`Bucket "${R2_BUCKET_NAME}" does not exist. Please check your R2_BUCKET_NAME variable.`);
        } else if (error.Code === 'SignatureDoesNotMatch') {
             console.error("Signature Mismatch! Check your R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.");
             console.error("Ensure you are using S3 Compatibility Keys, NOT the API Token.");
        }
    }
}

configureCors();
