const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifySetup() {
  console.log('Verifying setup...');
<<<<<<< HEAD

=======

>>>>>>> origin/main
  // 1. Verify MongoDB
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');
<<<<<<< HEAD

=======

>>>>>>> origin/main
    // Test simple connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }

  // 2. Verify R2
  try {
    console.log('Connecting to R2...');
    if (!process.env.R2_ACCOUNT_ID) throw new Error('R2_ACCOUNT_ID missing');
<<<<<<< HEAD

=======

>>>>>>> origin/main
    const client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
     });

    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    console.log('✅ R2 Connection successful. Buckets:', result.Buckets.map(b => b.Name));
<<<<<<< HEAD

=======

>>>>>>> origin/main
    const targetBucket = result.Buckets.find(b => b.Name === process.env.R2_BUCKET_NAME);
    if (targetBucket) {
        console.log(`✅ Target bucket '${process.env.R2_BUCKET_NAME}' found.`);
    } else {
        console.warn(`⚠️ Target bucket '${process.env.R2_BUCKET_NAME}' NOT found in account. Available buckets: ${result.Buckets.map(b => b.Name).join(', ')}`);
    }

  } catch (error) {
    console.error('❌ R2 connection failed:', error);
  }
}

verifySetup();
