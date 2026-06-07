exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const TOKEN = "sl.u.AGjJreg1-uM0pchcXYrGEv51-CvnPlItUaQxPabMsf0LuYqtCQyVQbn_jOU0b8PKZew_GBAw4-v6n6IHPdHAfxZjwyMqb5b4ILQxNikXdN7qUolxyJgHXzlA8KcnXa2aOnTZWqZYcnpDriGx4ur6rLgQxdsYDEiU9lPpLNEtvcOaIKugHW9Dy7qiJIA_TKZK-sIrdsAYdRnkJJT7iAsYsxcW_qt4LEOKfMXz7hQdCBIIq-BS_QRJHCzTtVjtk_cB9MI_TSAF2SiaARBjpkhncgv0leGzXoov0gBaYtBwK9EVxXHKeMw9S5UGqJyDnz_i4q3B_285yWwI5BCc5qI2d8UaT4TUmd3oRWdsm7NVxEGjGUbzAjLJJ27K1yjwl1LRHeD4ha3rFT_pz5msx6Tnh29FaxJ98VLk6KvsvUt-c6bmaD0q3Bl-8uXDBGlzqHUrpmAUIZya53rseoSZWT5xhmvYsxzDDqUZvgAwiJAtpl9to4zKHGeMvRrQygnhNmbpZ71SupROdte5L_FltuFL37QiKSpM9kvCf8oNq7qGJceqEHyOMFvVei00ANZHvyk7nLj_ZQpoxzgIz-P6cc0WXkfCB6SnVF4p4RGpMj68JJ39lysPLH74kmdOQDAFTRfvKl6guvBw8UDow7RWDOtcSrFb40GSWAF3hqT4ZZMty9RrWvFm_X76AfheS_OV4WsddTkI-lB9wRVJBFtax493jY11Avy7J8ly96li_kdOwM6w5I1WNu-NM618U7nBzhQgJfuAdCh951jZMLQRSwq_sJZSfetqvYrZcrOZ2FRJTiPPAq_Ypg385ry0_b36Ooaxfklq4yTYYDqXfnYJEdM56EfFNEwAYsLX4LmKnjMdw9JxCTB53Dpn6DCXb9_-NzIa8gWc21YuMMxd74miCktiGuIs08aLvkBaQhAdZIIeACE-0BaPJylkylIwpdzjZSu30kccC8tHDUfRxSMJfXhcHsi0AgekH3cIq9hdjLL2sncq0C6oiwo-ia-zsA0NYptR-uda9hJiGkGOnu__aOM_vLtr3iLYQOrSCGDTsZDo71zBnpNkfavHyPns6VUIBJDBPt24xWkeuvkZ4Jle51Cdv5wEIMWWhX3-kumNDrZqdqWWDhK9sm6mkqQdhWynurJ0IbFPke8qVeVE1b91zO_xKhUheKQ-mcXZUcAkw3y8BcwBMMOO9G1Ux_3Q7UaoJ8OQHNc4FqhVo6xohPU3GnpQSAt0dhx_SMlhAb6SrMQkVU4cqnTPz1AwoF4cA6Asuj3AypZv3XGf2ogX1yOn6ZoQiM9N9HUGrfcMb-8dygH9-xqXdw";

  try {
    const parsed = JSON.parse(event.body);
    const { audioBase64, ruta } = parsed;

    console.log("ruta:", ruta);
    console.log("audioBase64 length:", audioBase64 ? audioBase64.length : "MISSING");

    const buffer = Buffer.from(audioBase64, "base64");
    console.log("buffer size:", buffer.length);

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
    console.log("Dropbox status:", r.status);
    console.log("Dropbox response:", responseText);

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
    console.log("CATCH error:", e.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
