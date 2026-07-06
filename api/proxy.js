export default async function handler(req, res) {
  const url = req.url;
  const targetUrl = `https://generativelanguage.googleapis.com${url}`;

  // Copy only required headers and ignore all forwarding/IP headers to bypass region locks
  const headers = {};
  const allowedHeaders = ['content-type', 'accept', 'x-goog-api-key', 'x-goog-api-client', 'authorization'];
  for (const key of allowedHeaders) {
    if (req.headers[key]) {
      headers[key] = req.headers[key];
    }
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || '';
    
    res.status(response.status);

    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
