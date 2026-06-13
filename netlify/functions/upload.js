exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const APP_KEY = "jqad265ksglkes4";
  const APP_SECRET = "ybq2gzwoyp9hdaj";
  const REFRESH_TOKEN = "ygMt313G_VkAAAAAAAAAAVoak_vJbsFVqLKyompszK1CWENqwE_ACife3y39bHWx";

  try {
    const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
        client_id: APP_KEY,
        client_secret: APP_SECRET
      })
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "token refresh failed: " + t }) };
    }

    const tokenData = await tokenRes.json();
    const ACCESS_TOKEN = tokenData.access_token;

    const parsed = JSON.parse(event.body);
    const { audioBase64, ruta } = parsed;
    const buffer = Buffer.from(audioBase64, "base64");

    const r = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + ACCESS_TOKEN,
        "Dropbox-API-Arg": JSON.stringify({
          path: ruta,
          mode: "add",
          autorename: true
        }),
        "Content-Type": "application/octet-stream"
      },
      body: buffer
    });

    const responseText = await r.text();

    if (!r.ok) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: responseText })
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true })
    };

  } catch(e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
