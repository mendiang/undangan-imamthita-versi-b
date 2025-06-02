// netlify/functions/submit-message.js
const { google } = require("googleapis");

// Kredensial Service Account (akan diambil dari Environment Variables di Netlify)
// Jangan hardcode di sini!
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ganti newline literal
};

// ID Spreadsheet Google Anda (bisa diambil dari URL spreadsheet)
// Contoh URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_ANDA/edit
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID; 
// Nama sheet di dalam spreadsheet Anda (defaultnya 'Sheet1')
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    // Validasi data sederhana (tambahkan sesuai kebutuhan)
    if (!data.guestName || !data.attendance) {
      return { statusCode: 400, body: JSON.stringify({ error: "Nama dan Konfirmasi Kehadiran wajib diisi." }) };
    }

    // Siapkan data untuk ditulis ke sheet
    const timestamp = new Date().toISOString();
    const newRow = [
      timestamp,
      data.guestName,
      data.attendance,
      data.attendance === 'Hadir' ? (data.guestCount || 1) : '', // Hanya isi jika hadir
      data.guestMessage || "",
    ];

    // Autentikasi dengan Google
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Tulis data ke Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`, // Sesuaikan range dengan jumlah kolom Anda
      valueInputOption: "USER_ENTERED", // Atau "RAW" jika tidak ingin Google Sheets memformat
      resource: {
        values: [newRow],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Pesan berhasil terkirim!" }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan internal.", details: error.message }),
    };
  }
};