// server.js (paste this)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ABSTRACT_KEY = process.env.ABSTRACT_KEY || '';
console.log('Loaded ABSTRACT_KEY (masked):', ABSTRACT_KEY ? ABSTRACT_KEY.slice(0,6) + '***' : '<empty>');
const app = express();
app.use(cors());
app.use(express.json());

// const ABSTRACT_KEY = process.env.ABSTRACT_KEY;
// if(!ABSTRACT_KEY) {
//   console.warn('Warning: ABSTRACT_KEY not set in .env. Set it and restart the server.');
// }

app.post('/validate', async (req, res) => {
  try {
    console.log('Incoming /validate request body:', req.body);
    const { email } = req.body;
    if(!email) return res.status(400).json({ error: 'Missing email in request body' });
    if(!ABSTRACT_KEY) return res.status(500).json({ error: 'Server missing API key (ABSTRACT_KEY)' });

    // Use global fetch if Node supports it (Node 18+). If you are on older Node, install node-fetch@2.
    const fetchFn = globalThis.fetch;
    if(!fetchFn) {
      return res.status(500).json({ error: 'No global fetch available. Install Node 18+ or run: npm install node-fetch@2' });
    }

    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${encodeURIComponent(ABSTRACT_KEY)}&email=${encodeURIComponent(email)}`;
    console.log('Calling Abstract API URL:', url.replace(ABSTRACT_KEY, '***API_KEY***'));
    const r = await fetch(url);
    const json = await r.json();
    console.log('Abstract API returned:', json);
    res.json(json);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Proxy running on http://localhost:${PORT}`));
