// ส่งรูปโลโก้/โปรไฟล์ร้านจากหลังบ้าน ไปโชว์บนการ์ดแชร์
const PROJECT = "healshop-c45c5";
const API_KEY = "AIzaSyCJ028COAjuj1vHA3LvJghX20Z3gWgM394";
async function getShop() {
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/settings/shop?key=${API_KEY}`);
    const j = await r.json(); const f = j.fields || {}; const v = k => (f[k] && f[k].stringValue) || "";
    return { name: v("name"), desc: v("desc"), favicon: v("favicon"), avatar: v("avatar"), shareImg: v("shareImg") };
  } catch (e) { return {}; }
}
exports.handler = async () => {
  const s = await getShop();
  const data = s.shareImg || s.favicon || s.avatar || "";
  const m = data.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (m) return { statusCode: 200, headers: { "Content-Type": m[1], "Cache-Control": "public, max-age=300" }, body: m[2], isBase64Encoded: true };
  if (/^https?:/.test(data)) return { statusCode: 302, headers: { Location: data }, body: "" };
  return { statusCode: 302, headers: { Location: "/logo.png" }, body: "" };
};
