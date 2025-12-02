const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function verify() {
  console.log("Starting verification on port 3002...");
  let retries = 10;
  while (retries > 0) {
      try {
        const feedRes = await makeRequest('/api/video/feed');
        if (feedRes.status === 200 && feedRes.body.success) {
            console.log("✅ Video Feed API is working.");
            console.log("Videos returned:", feedRes.body.videos.length);
            return;
        } else {
             console.log("Server response:", feedRes.status);
        }
      } catch (err) {
          console.log("Waiting for server...", err.message);
      }
      await new Promise(r => setTimeout(r, 2000));
      retries--;
  }
  console.error("❌ Failed to verify.");
  process.exit(1);
}

verify();
