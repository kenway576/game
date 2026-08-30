const https = require('https');
const fs = require('fs');
const path = require('path');

const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function generateGoogleImage(prompt, destPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    });

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + encodeURIComponent(key),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(body);
            const part = json.candidates[0].content.parts.find(p => p.inlineData);
            if (part && part.inlineData) {
              const buffer = Buffer.from(part.inlineData.data, 'base64');
              fs.writeFileSync(destPath, buffer);
              resolve(buffer.length);
            } else {
              reject(new Error('No inlineData in parts'));
            }
          } catch (e) {
            reject(new Error('JSON Parse Error: ' + e.message));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 250)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = { generateGoogleImage };
