const THEMES = [
  { label: '꽃나라', emoji: '🌸' },
  { label: '별나라', emoji: '⭐' },
  { label: '천국',   emoji: '☁️' },
  { label: '지옥',   emoji: '🔥' },
];

export default function handler(req, res) {
  const { name, theme } = req.query;
  const themeIndex = parseInt(theme);
  const t = (!isNaN(themeIndex) && THEMES[themeIndex]) ? THEMES[themeIndex] : null;

  const ogTitle = '꽃별천지 이름점 🌸⭐☁️🔥';
  const ogDescription = t
    ? `난 사후에 어떤 나라로? ${t.label} ${t.emoji}`
    : '이름의 획수로 알아보는 사후 세계 — 꽃나라, 별나라, 천국, 지옥';

  const host = req.headers.host ?? '';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const ogImage = `${protocol}://${host}/ogimage.png`;
  const appUrl = `/?name=${encodeURIComponent(name ?? '')}&theme=${themeIndex}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDescription}" />
  <meta http-equiv="refresh" content="0;url=${appUrl}" />
  <script>window.location.replace("${appUrl}");</script>
</head>
<body></body>
</html>`);
}
