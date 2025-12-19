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

const client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

// User provided CORS configuration
const corsRules = [
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
];

async function configureCors() {
    try {
        console.log(`Configuring CORS for bucket: ${R2_BUCKET_NAME}...`);

        const command = new PutBucketCorsCommand({
            Bucket: R2_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: corsRules,
            },
        });

        await client.send(command);
        console.log('✅ CORS configuration applied successfully!');
        console.log('The Pi Browser should now be able to upload videos.');
    } catch (error) {
        console.error('❌ Failed to configure CORS:', error);
        if (error.Code === 'NoSuchBucket') {
            console.error(`Bucket "${R2_BUCKET_NAME}" does not exist. Please check your R2_BUCKET_NAME variable.`);
        }
    }
}

configureCors();
