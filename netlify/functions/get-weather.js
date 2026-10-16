// Netlify Function: netlify/functions/get-weather.js
// Node 18+ has fetch; Netlify uses Node 18+ in modern runtimes.
// Reads OPENWEATHER_KEY from environment variables.

exports.handler = async function(event) {
  try {
    const key = process.env.OPENWEATHER_KEY;
    if (!key) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OPENWEATHER_KEY not configured on Netlify' }),
      };
    }

    // get city from querystring or default
    const qs = event.queryStringParameters || {};
    const city = qs.city ? String(qs.city) : 'Voronezh';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(key)}&lang=ru`;

    const res = await fetch(url);
    const text = await res.text();

    // forward status and body
    return {
      statusCode: res.status === 200 ? 200 : res.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Server error' }),
    };
  }
};
