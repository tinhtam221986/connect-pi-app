const { S3Client, ListBucketsCommand, GetBucketCorsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

// Credentials provided by user
const R2_ACCOUNT_ID = '8e3265763a96bdc4211f48b8aee1e135';
const R2_ACCESS_KEY_ID = 'cb6d41cc3da35e506ba9820162a991f4';
const R2_SECRET_ACCESS_KEY = '4e024ff7ff5eb8d1067a9ba92e77f20b8b3027452bef8a0cc34fe67ac5254af2';
const R2_BUCKET_NAME = 'connect-pi-app-assets';

const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

async function verifyR2() {
    console.log('--- Verifying R2 Configuration ---');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Bucket: ${R2_BUCKET_NAME}`);

    // 1. Check Authentication (List Buckets)
    try {
        console.log('\n1. Checking Authentication (ListBuckets)...');
        const data = await client.send(new ListBucketsCommand({}));
        console.log('✅ Auth Successful! Buckets found:');
        data.Buckets.forEach(b => console.log(` - ${b.Name}`));
    } catch (err) {
        console.error('❌ Auth Failed:', err.message);
        return;
    }

    // 2. Check CORS
    try {
        console.log('\n2. Checking CORS Configuration...');
        const corsData = await client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }));
        console.log('✅ CORS Configuration found:');
        console.log(JSON.stringify(corsData.CORSRules, null, 2));
    } catch (err) {
        console.error('❌ CORS Check Failed:', err.message);
    }

    // 3. Check Write Permission (Put Object)
    try {
        console.log('\n3. Checking Write Permission (PutObject)...');
        const testKey = 'test-verification-file.txt';
        await client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: testKey,
            Body: 'Hello R2 Verification',
            ContentType: 'text/plain'
        }));
        console.log(`✅ Write Successful! Uploaded ${testKey}`);
    } catch (err) {
        console.error('❌ Write Check Failed:', err.message);
    }
}

verifyR2();
