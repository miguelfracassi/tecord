const crypto = require("crypto");
const dns = require("dns").promises;
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const SECRET = process.env.AUTH_SECRET || crypto.createHash("sha256").update(String(process.env.DATABASE_URL) + String(process.env.ADMIN_PASSWORD)).digest("hex");

let ready = null;
function ensure() {
  if (!ready) ready = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT NOT NULL, password_hash TEXT NOT NULL, theme TEXT NOT NULL DEFAULT 'auto', color TEXT NOT NULL DEFAULT '#0656BF', created_at TIMESTAMPTZ DEFAULT now())`;
    await sql`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
    await sql`CREATE INDEX IF NOT EXISTS messages_user_idx ON messages (user_id, id)`;
  })().catch((e) => { ready = null; throw e; });
  return ready;
}

const hmac = (s) => crypto.createHmac("sha256", SECRET).update(s).digest("hex");
const safeEq = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const b64 = (s) => Buffer.from(s).toString("base64url");

function hashPw(pw) { const salt = crypto.randomBytes(16).toString("hex"); return salt + ":" + crypto.scryptSync(pw, salt, 64).toString("hex"); }
function checkPw(pw, stored) { const [salt, h] = String(stored).split(":"); if (!salt || !h) return false; return safeEq(crypto.scryptSync(pw, salt, 64).toString("hex"), h); }

const MAXAGE = 30 * 86400;
function setSession(res, uid) {
  const p = b64(JSON.stringify({ uid, exp: Date.now() + MAXAGE * 1000 }));
  res.setHeader("Set-Cookie", `tk=${p}.${hmac(p)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAXAGE}`);
}
function clearSession(res) { res.setHeader("Set-Cookie", "tk=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"); }

async function getUser(req) {
  const m = /(?:^|;\s*)tk=([^;]+)/.exec(req.headers.cookie || "");
  if (!m) return null;
  const [p, h] = m[1].split(".");
  if (!p || !h || !safeEq(hmac(p), h)) return null;
  let d; try { d = JSON.parse(Buffer.from(p, "base64url").toString()); } catch (e) { return null; }
  if (!d.uid || Date.now() > d.exp) return null;
  const r = await sql`SELECT id,name,email,phone,password_hash,theme,color FROM users WHERE id=${d.uid}`;
  return r[0] || null;
}
const pub = (u) => ({ name: u.name, email: u.email, phone: u.phone, theme: u.theme, color: u.color });

async function mailOk(email) {
  const d = email.split("@")[1];
  try { return (await dns.resolveMx(d)).length > 0; } catch (e) { try { return (await dns.resolve4(d)).length > 0; } catch (e2) { return false; } }
}
module.exports = { sql, ensure, hashPw, checkPw, setSession, clearSession, getUser, pub, mailOk };
