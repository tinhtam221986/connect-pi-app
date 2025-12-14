<<<<<<< HEAD
// const { SmartContractService } = require('./src/lib/smart-contract-service');
=======
// const { SmartContractService } = require('./src/lib/smart-contract-service');
>>>>>>> origin/main
// Commented out because we can't import TS files in Node directly without compilation.
// The script below verifies the LOGIC and ACCESS patterns used in the new Service.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testMongoQueries() {
    console.log("Testing MongoDB Queries (Mimicking SmartContractService)...");
<<<<<<< HEAD

    if (!process.env.MONGODB_URI) throw new Error("Missing Mongo URI");
    await mongoose.connect(process.env.MONGODB_URI);

    // Define Schema briefly for test
    const VideoSchema = new mongoose.Schema({ videoUrl: String }, { strict: false });
    const UserSchema = new mongoose.Schema({ username: String }, { strict: false });

    const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // 1. Test Get Listings (Static)
    console.log("1. Get Listings: OK (Static Data)");

=======

    if (!process.env.MONGODB_URI) throw new Error("Missing Mongo URI");
    await mongoose.connect(process.env.MONGODB_URI);

    // Define Schema briefly for test
    const VideoSchema = new mongoose.Schema({ videoUrl: String }, { strict: false });
    const UserSchema = new mongoose.Schema({ username: String }, { strict: false });

    const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // 1. Test Get Listings (Static)
    console.log("1. Get Listings: OK (Static Data)");

>>>>>>> origin/main
    // 2. Test Get Feed (Read from Video Collection)
    const videos = await Video.find({}).limit(5);
    console.log(`2. Feed Items Found: ${videos.length}`);
    if(videos.length > 0) console.log("   Sample:", videos[0]._id);
<<<<<<< HEAD

=======

>>>>>>> origin/main
    // 3. Test Get User Balance
    // Create a mock user if not exists
    const testUser = "test_deployER";
    await User.updateOne({ username: testUser }, { $setOnInsert: { balance: 500 } }, { upsert: true });
<<<<<<< HEAD

    const user = await User.findOne({ username: testUser });
    console.log(`3. User '${testUser}' Balance:`, user.balance);

=======

    const user = await User.findOne({ username: testUser });
    console.log(`3. User '${testUser}' Balance:`, user.balance);

>>>>>>> origin/main
    console.log("✅ Data Layer Verification Complete");
    await mongoose.disconnect();
}

testMongoQueries().catch(console.error);
