export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No auth token' });
  const accessToken = authHeader.replace('Bearer ', '');

  const SHEET_NAME = 'Job Applications 2026';
  const HEADERS = ['Company', 'Role', 'Date Posted', 'Date Applied', 'Status', 'Resume Version', 'Resume URL', 'Cover Letter URL', 'Notes'];

  async function getOrCreateSheet() {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${SHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    const searchData = await searchRes.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: { title: SHEET_NAME },
        sheets: [{
          properties: { title: 'Applications' },
          data: [{ rowData: [{ values: HEADERS.map(h => ({ userEnteredValue: { stringValue: h }, userEnteredFormat: { textFormat: { bold: true } } })) }] }]
        }]
      })
    });
    const sheet = await createRes.json();
    return sheet.spreadsheetId;
  }

  if (req.method === 'GET') {
    try {
      const sheetId = await getOrCreateSheet();
      const dataRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!A:I`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const data = await dataRes.json();
      const rows = data.values || [];
      const headers = rows[0] || HEADERS;
      const applications = rows.slice(1).map((row, i) => {
        const obj = { _rowIndex: i + 2 };
        headers.forEach((h, j) => { obj[h] = row[j] || ''; });
        return obj;
      });
      res.status(200).json({ applications, sheetId, sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { company, role, datePosted, dateApplied, status, resumeVersion, resumeUrl, coverLetterUrl, notes } = req.body;
      const sheetId = await getOrCreateSheet();
      const row = [company, role, datePosted || '', dateApplied || new Date().toLocaleDateString('en-CA'), status || 'Applied', resumeVersion || '', resumeUrl || '', coverLetterUrl || '', notes || ''];

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!A:I:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] })
        }
      );
      res.status(200).json({ success: true, sheetId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'PATCH') {
    try {
      const { rowIndex, field, value, sheetId } = req.body;
      const colMap = { 'Status': 'E', 'Notes': 'I', 'Resume URL': 'G', 'Cover Letter URL': 'H' };
      const col = colMap[field];
      if (!col) return res.status(400).json({ error: 'Invalid field' });

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!${col}${rowIndex}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [[value]] })
        }
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
