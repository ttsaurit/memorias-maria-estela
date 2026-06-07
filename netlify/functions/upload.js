exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const TOKEN = "sl.u.AGjMvGBaDy2TY3J84oKhTwHKCjC04SmFn_0WfI0zp0u4OtzKY3Ij8lx2SXtgK1CkVXFUsRZQ6xn9bDlWoCIYrj-eyXxFrjMrxVCrZfKRJgLoA0Isdz4W3TEZKj2MVndgKYv_resRIrUY6Hyvzmm_iXXp1UnipC4fXpo4Qg43K3xJgakxS4GdkGwMpk8wD-m2pd4qNRcP-N2_GhUlwDPsjXNWMQkx0vqrrGxznRCLRsolBLL6T0RcA9cdS9yaHyB6nl1Ph040uE_L_MSGLP7PlTJPuxIGSwObCrdJv0E0cVnN8rtRa6UoMQzJtqx2GACGnenjo1JVTVS-al4UyePYDFNzM0M2zQGLeludBhexEqQ1LtDWWQ-BqQcKPW8pezfiJA6U1ZQU5iJpZc5JzeRou4S6sYMaVbuYrenXnzXvK-VuA9WXAEvOwIeIxXfeglPmQbISmtfZuItdS2OKswV5tijRhhy0qqB5i-587xbH7ku7YnHeAyUkOikaAmoSzKaHNntZM6d_QxSv_HCSs1-lECAzTWyR_eTHWdAvlcd_YYtZb6zZt2zUASf0mwaC2wY4hNt0c-wa6wOpTbB7ffEtzAD0HktghR03ivkvRyZBbai5eP9CmZUWD3XJiyzB8qizcwDvyvXTorf-WKtpftSHFkLHM2G-aM8bvSL6fb5J3afo_0KyXGwfpeP4Qq6l3cle8FZQNuRw6dShkfROpI_8uPeQ_4txfoRuFJkr0-SwtumageLCSoii2Jk2jj_HYe9nwG4hFKgX-WFG3Lo3u7TVPIUexaESV9ofwZuP8RfN9E82_y0Yn07m29qFN6pH6GUBJuCvP9UrevAAqMA0BIwZvIU2nY43eNWYBvdyTclkq6foM7Kb_Hg4XvHcjU333_1__4HbkrDk7dcDjvCom_c0KQL1LW3WVB2bqWWVHUPSwtvLVBhV9UsjB03DAptTaToG2BVEF934Lm0pEhr5LbiD4cAocejsrg9Xr7nTcf3FDBpEWZTRaJdTCeYVC6uwDc67g7dD-Z4ZPF1ehPYgjhnHAOuTC0-3gT4WZpKMEl1jr9DWSMzAQQM2kL3lAh-2Mx-lS2s2NqUkg0rlCZNGA55BP8kaE5tNCniBJo2-IdZWvBvq2euCJgmVDELwLCj-tZ3yXUSzgNXH4uSACDs4vudqDojtbZIa-DZApWjZyPxtSXSAggtdEGbSbDNx6Am1keYu4wS6nJkB0tA4eKJ79WhCXj0UOQ-11t0j4ALPZgZYQ-Y4PCm8DNRbcX-SFChcQBU3lZWEZ8PX7j1P-qq80NS5dmeA5F5WNZSSvZUDMB_MEj6qxg";

  try {
    const body = JSON.parse(event.body);
    const { audioBase64, mimeType, ruta } = body;

    const buffer = Buffer.from(audioBase64, "base64");

    const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
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

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: err }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
