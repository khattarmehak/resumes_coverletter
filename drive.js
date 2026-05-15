export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No auth token' });
  const accessToken = authHeader.replace('Bearer ', '');

  const { title, content, folderId } = req.body;

  try {
    const docResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    const doc = await docResponse.json();
    if (!doc.documentId) {
      return res.status(500).json({ error: 'Failed to create document', details: doc });
    }

    const docId = doc.documentId;

    const requests = buildDocRequests(content);

    if (requests.length > 0) {
      await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });
    }

    if (folderId) {
      const fileMetaResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${docId}?fields=parents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const fileMeta = await fileMetaResponse.json();
      const currentParents = (fileMeta.parents || []).join(',');

      await fetch(`https://www.googleapis.com/drive/v3/files/${docId}?addParents=${folderId}&removeParents=${currentParents}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    }

    res.status(200).json({
      documentId: docId,
      url: `https://docs.google.com/document/d/${docId}/edit`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function buildDocRequests(content) {
  const requests = [];
  const lines = content.split('\n');
  let index = 1;

  const insertText = (text) => {
    requests.push({ insertText: { location: { index }, text } });
    index += text.length;
  };

  const applyStyle = (startIndex, endIndex, style) => {
    if (style.bold || style.italic || style.fontSize) {
      const textStyle = {};
      const fields = [];
      if (style.bold !== undefined) { textStyle.bold = style.bold; fields.push('bold'); }
      if (style.italic !== undefined) { textStyle.italic = style.italic; fields.push('italic'); }
      if (style.fontSize) { textStyle.fontSize = { magnitude: style.fontSize, unit: 'PT' }; fields.push('fontSize'); }
      requests.push({
        updateTextStyle: {
          range: { startIndex, endIndex },
          textStyle,
          fields: fields.join(',')
        }
      });
    }
    if (style.paragraphStyle) {
      requests.push({
        updateParagraphStyle: {
          range: { startIndex, endIndex },
          paragraphStyle: style.paragraphStyle,
          fields: Object.keys(style.paragraphStyle).join(',')
        }
      });
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      insertText('\n');
      continue;
    }

    if (trimmed.startsWith('NAME:')) {
      const text = trimmed.replace('NAME:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, {
        bold: true,
        fontSize: 20,
        paragraphStyle: { alignment: 'CENTER' }
      });
      continue;
    }

    if (trimmed.startsWith('TAGLINE:')) {
      const text = trimmed.replace('TAGLINE:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, {
        fontSize: 10,
        paragraphStyle: { alignment: 'CENTER' }
      });
      continue;
    }

    if (trimmed.startsWith('CONTACT:')) {
      const text = trimmed.replace('CONTACT:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, {
        fontSize: 10,
        paragraphStyle: { alignment: 'CENTER' }
      });
      continue;
    }

    if (trimmed.startsWith('SECTION:')) {
      const text = trimmed.replace('SECTION:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, {
        bold: true,
        fontSize: 9,
        paragraphStyle: { spaceAbove: { magnitude: 8, unit: 'PT' }, spaceBelow: { magnitude: 2, unit: 'PT' } }
      });
      continue;
    }

    if (trimmed.startsWith('ROLE:')) {
      const text = trimmed.replace('ROLE:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, { bold: true, fontSize: 10 });
      continue;
    }

    if (trimmed.startsWith('COMPANY:')) {
      const text = trimmed.replace('COMPANY:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, { bold: true, fontSize: 10 });
      continue;
    }

    if (trimmed.startsWith('DESCRIPTOR:')) {
      const text = trimmed.replace('DESCRIPTOR:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, { italic: true, fontSize: 9 });
      continue;
    }

    if (trimmed.startsWith('BULLET:')) {
      const text = '• ' + trimmed.replace('BULLET:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, { fontSize: 10 });
      continue;
    }

    if (trimmed.startsWith('SKILLS:')) {
      const text = trimmed.replace('SKILLS:', '').trim() + '\n';
      const start = index;
      insertText(text);
      applyStyle(start, index - 1, { fontSize: 9 });
      continue;
    }

    if (trimmed.startsWith('BOLD_LABEL:')) {
      const parts = trimmed.replace('BOLD_LABEL:', '').trim().split('||');
      const label = parts[0] ? parts[0].trim() + ': ' : '';
      const rest = parts[1] ? parts[1].trim() : '';
      const fullText = label + rest + '\n';
      const start = index;
      insertText(fullText);
      if (label) {
        applyStyle(start, start + label.length, { bold: true, fontSize: 10 });
        applyStyle(start + label.length, index - 1, { bold: false, fontSize: 10 });
      } else {
        applyStyle(start, index - 1, { fontSize: 10 });
      }
      continue;
    }

    const text = trimmed + '\n';
    const start = index;
    insertText(text);
    applyStyle(start, index - 1, { fontSize: 10 });
  }

  return requests;
}
