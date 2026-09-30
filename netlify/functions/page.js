// ส่งหน้าเว็บ พร้อมใส่ชื่อร้านจากหลังบ้านลงการ์ดแชร์
const PROJECT = "healshop-c45c5";
const API_KEY = "AIzaSyCJ028COAjuj1vHA3LvJghX20Z3gWgM394";
async function getShop() {
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/settings/shop?key=${API_KEY}`);
    const j = await r.json(); const f = j.fields || {}; const v = k => (f[k] && f[k].stringValue) || "";
    return { name: v("name"), desc: v("desc"), favicon: v("favicon"), avatar: v("avatar") };
  } catch (e) { return {}; }
}
const esc = s => String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
exports.handler = async (event) => {
  const host = (event.headers && (event.headers.host || event.headers.Host)) || "healshop.netlify.app";
  let html = await (await fetch(`https://${host}/app.html`)).text();
  const s = await getShop();
  html = html.replace(/(property="og:image" content=")[^"]*/, "$1https://" + host + "/share.jpg?t=" + Date.now().toString().slice(0,7))
             .replace(/(name="twitter:image" content=")[^"]*/, "$1https://" + host + "/share.jpg")
             .replace(/(property="og:url" content=")[^"]*/, "$1https://" + host + "/");
  if (s.name) {
    const t = esc(s.name + " รีวิว 💕");
    html = html.replace(/(property="og:title" content=")[^"]*/, "$1" + t)
               .replace(/(property="og:site_name" content=")[^"]*/, "$1" + esc(s.name))
               .replace(/<title>[^<]*<\/title>/, `<title>${esc(s.name)} รีวิว</title>`);
    const d = esc(s.desc || ("รีวิวจากลูกค้าจริงของร้าน " + s.name));
    html = html.replace(/(property="og:description" content=")[^"]*/, "$1" + d)
               .replace(/(name="description" content=")[^"]*/, "$1" + d);
  }
  return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60" }, body: html };
};
