exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const TOKEN = "sl.u.AGgcR0bTH8vKaKw2W9NLNv16f7chn5SnLzebok9Y_UdioYiCae-WsOyQylghPu4zkxWvuF7l86l6oA4AFOgObPCSnCOShJvkpv_9jMhVFmDS7BlBkNHcSkg__JIgjh7ISECpTOcfOCXnEWycdMuWSygh4Kw0xJy2ODL6VIloBeHHWopuDQQTDIC6ktDNDFTFl5Z7HecAeRr0cnrHli53o56UYhMife9kgp2jKmAqTmd-58YO8cofBQeEDgV4RomcmlEsvH28TJ8sAr3nLAWmt58IezeGJ4GUzX3JfRYq70jETZcBFQwjvS4Pk2J0pFSn6p9cDCDS6Czq4fm-6Jz7lZvhXzFjHJfHY5ReAkZRecNRwoBvs97ogpt59hFfaiQSTDrsvOuulHHbCcouFzrjCVn5jVSZIJ0Wm4-6awJfQLXo4fKUXKBXJjinQKFon5qIT7F3F2vcPzvZ0ZOThCWwl-EBFNULMKv0Vkc8F6tWz03jRl8LVyv7G7DvTYbE02syaU7cLJoAulnVcNUBQLN1Ui-WwpGZ2mEfK5BTHTsrxnP1NJDo1lqdXuPz9d4Ti6SBPX8_7c41fpocBPb3EG2mrAF1T4w1hfGysZSJRMr8p4Lmyed0pC-v7yTV88uVjCbLD4pp8pJ2RzIKJCqwn_bEDy7hwFeJX5SBCLIOu4268avw27nmZqHUt7p-LBt3Y8nrVzIJfM_n-5cP9joWclLwIuEfwWpZnWiGVLyvNW7IPsWxRn6VV5uQ5RgCSwv_r27y5TvkHEPwX3bqHToyR8xe1yIf1uapH9g22_UiNldb3984qOOlNwwql4eESfPK1JeZ1y75udt_KZ5_crNR6VXEnVx7j6V8rQXDQhS5VOlSH8RlfaLbpp44u1lCM0qo1K11olW4vg1K6LbtnerGYduFlC6Ky0Q0LylLFueWIqAod0kIDvvAnrAZKAXrcpFoe5u6wDkRLV-lFwj0UApnuvLaGHMadbh88KQucg2QwbiJUHggmUI4Q0GZPdM1LmX5JzXTCXO3IhVcMTfiIHc31LxhCePe7ekW_01bISx35VVNPfOLQb522KD2QJ1FQG8Obm8nOe25C4p5FKsAb_wJ5LzoE_Z5ORrAXAScz3XP8L0ovpBHoVQpHZq_eIWZWnrxUaW-QxOtMmWItMxYFlUkDpaA1Ozf3f7Xkr1l9TFSG-ubEUfWrQz84IM8AuUbStutDp1p5QrQkdEliGyjOVw-CwSTsr8A33UsZ5CHRCkT-bdcPM4QR3KsljpHUoxMnrc0hz6oGCXcbhOabKk3Ow5on3jA83RewZGMmRnGXG347My5DqbuCw";

  try {
    const parsed = JSON.parse(event.body);
    const { audioBase64, ruta } = parsed;
    const buffer = Buffer.from(audioBase64, "base64");

    const r = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TOKEN,
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
