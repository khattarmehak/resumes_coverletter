export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { code, action } = req.query;
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = 'https://resumes-coverletter.vercel.app/auth/callback';

  if (action === 'url') {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;

    return res.status(200).json({ url: authUrl });
  }

  if (code) {
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        return res.redirect(`/?auth_error=${encodeURIComponent(tokens.error_description || tokens.error)}`);
      }

      const params = new URLSearchParams({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || '',
        expires_in: tokens.expires_in || 3600
      });

      return res.redirect(`/?auth_success=1&${params.toString()}`);
    } catch (err) {
      return res.redirect(`/?auth_error=${encodeURIComponent(err.message)}`);
    }
  }

  res.status(400).json({ error: 'Invalid request' });
}
