exports.handler = async function(event) {
  const TOKEN = "sl.u.AGjJreg1-uM0pchcXYrGEv51-CvnPlItUaQxPabMsf0LuYqtCQyVQbn_jOU0b8PKZew_GBAw4-v6n6IHPdHAfxZjwyMqb5b4ILQxNikXdN7qUolxyJgHXzlA8KcnXa2aOnTZWqZYcnpDriGx4ur6rLgQxdsYDEiU9lPpLNEtvcOaIKugHW9Dy7qiJIA_TKZK-sIrdsAYdRnkJJT7iAsYsxcW_qt4LEOKfMXz7hQdCBIIq-BS_QRJHCzTtVjtk_cB9MI_TSAF2SiaARBjpkhncgv0leGzXoov0gBaYtBwK9EVxXHKeMw9S5UGqJyDnz_i4q3B_285yWwI5BCc5qI2d8UaT4TUmd3oRWdsm7NVxEGjGUbzAjLJJ27K1yjwl1LRHeD4ha3rFT_pz5msx6Tnh29FaxJ98VLk6KvsvUt-c6bmaD0q3Bl-8uXDBGlzqHUrpmAUIZya53rseoSZWT5xhmvYsxzDDqUZvgAwiJAtpl9to4zKHGeMvRrQygnhNmbpZ71SupROdte5L_FltuFL37QiKSpM9kvCf8oNq7qGJceqEHyOMFvVei00ANZHvyk7nLj_ZQpoxzgIz-P6cc0WXkfCB6SnVF4p4RGpMj68JJ39lysPLH74kmdOQDAFTRfvKl6guvBw8UDow7RWDOtcSrFb40GSWAF3hqT4ZZMty9RrWvFm_X76AfheS_OV4WsddTkI-lB9wRVJBFtax493jY11Avy7J8ly96li_kdOwM6w5I1WNu-NM618U7nBzhQgJfuAdCh951jZMLQRSwq_sJZSfetqvYrZcrOZ2FRJTiPPAq_Ypg385ry0_b36Ooaxfklq4yTYYDqXfnYJEdM56EfFNEwAYsLX4LmKnjMdw9JxCTB53Dpn6DCXb9_-NzIa8gWc21YuMMxd74miCktiGuIs08aLvkBaQhAdZIIeACE-0BaPJylkylIwpdzjZSu30kccC8tHDUfRxSMJfXhcHsi0AgekH3cIq9hdjLL2sncq0C6oiwo-ia-zsA0NYptR-uda9hJiGkGOnu__aOM_vLtr3iLYQOrSCGDTsZDo71zBnpNkfavHyPns6VUIBJDBPt24xWkeuvkZ4Jle51Cdv5wEIMWWhX3-kumNDrZqdqWWDhK9sm6mkqQdhWynurJ0IbFPke8qVeVE1b91zO_xKhUheKQ-mcXZUcAkw3y8BcwBMMOO9G1Ux_3Q7UaoJ8OQHNc4FqhVo6xohPU3GnpQSAt0dhx_SMlhAb6SrMQkVU4cqnTPz1AwoF4cA6Asuj3AypZv3XGf2ogX1yOn6ZoQiM9N9HUGrfcMb-8dygH9-xqXdw";

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { ruta } = JSON.parse(event.body);
    const buffer = Buffer.from(event.body, "base64");

    // Usar upload session para manejar cualquier tamaño
    const r = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TOKEN,
        "Dropbox-API-Arg": JSON.stringify({
          path: ruta,
          mode: "add",
          autorename: true,
          mute: false
        }),
        "Content-Type": "application/octet-stream"
      },
      body: Buffer.from(JSON.parse(event.body).audioBase64, "base64")
    });

    if (!r.ok) {
      const txt = await r.text();
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: txt })
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
