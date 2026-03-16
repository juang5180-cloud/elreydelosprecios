exports.handler = async (event) => {
  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_KEY;
  const HEADS = {
    'Content-Type': 'application/json',
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + SUPA_KEY
  };

  const path = event.path.replace('/.netlify/functions/api', '').replace('/api', '');
  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : null;

  let url;
  if (path === '/auth') {
    url = `${SUPA_URL}/auth/v1/token?grant_type=password`;
  } else {
    url = `${SUPA_URL}/rest/v1${path}`;
    if (event.queryStringParameters) {
      const params = new URLSearchParams(event.queryStringParameters);
      url += '?' + params.toString();
    }
  }

  const res = await fetch(url, {
    method,
    headers: { ...HEADS, ...(event.headers['prefer'] ? { 'Prefer': event.headers['prefer'] } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
};
