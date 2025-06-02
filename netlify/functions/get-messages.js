// netlify/functions/get-messages.js
const { google } = require("googleapis");

// Kredensial Service Account (akan diambil dari Environment Variables di Netlify)
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// ID Spreadsheet Google Anda
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
// Nama sheet di dalam spreadsheet Anda
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"], // Hanya perlu izin baca
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Baca data dari Google Sheet
    // Asumsikan header ada di baris pertama, jadi mulai dari A2
    // Sesuaikan range jika kolom Anda lebih banyak atau berbeda
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:E`, // Ambil kolom Timestamp, Nama, Kehadiran, Jml Tamu, Pesan
                                  // A2:E berarti mulai dari baris 2, kolom A sampai E, semua baris ke bawah
    });

    const rows = response.data.values;
    let messages = [];

    if (rows && rows.length) {
      messages = rows.map(row => ({
        timestamp: row[0] || '', // Kolom A
        name: row[1] || '',      // Kolom B
        attendance: row[2] || '',// Kolom C
        guestCount: row[3] || '', // Kolom D
        message: row[4] || '',   // Kolom E
      })).filter(msg => msg.name && msg.message); // Filter pesan yang valid (nama dan pesan ada)
      // Anda mungkin ingin mengurutkan berdasarkan timestamp di sini jika perlu
      // messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Pesan terbaru di atas
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messages: messages }),
    };
  } catch (error) {
    console.error("Error fetching messages from Google Sheets:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal mengambil pesan.", details: error.message }),
    };
  }
};