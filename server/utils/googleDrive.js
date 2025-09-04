const { google } = require('googleapis');

async function uploadBuffer(buffer, name, mimeType) {
  if(process.env.GOOGLE_DRIVE_ENABLED !== 'true') {
    console.log('Google Drive disabled; skipping upload for', name);
    return null;
  }
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const res = await drive.files.create({
      requestBody: {
        name,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined
      },
      media: {
        mimeType,
        body: buffer
      }
    });
    console.log('Uploaded to Google Drive:', res.data.id);
    return res.data;
  } catch (err) {
    console.error('Drive upload error', err.message);
    return null;
  }
}

module.exports = { uploadBuffer };
