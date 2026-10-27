/* 六级以上生词标注：在当前网页正文里，给六级以上的词后面加上 [音标 中文]。再点一次书签取消。词库：ECDICT（MIT） */
(function () {
  var old = document.querySelectorAll('.cet6x');
  if (old.length) { old.forEach(function (n) { n.remove(); }); var b0 = document.getElementById('cet6x-badge'); if (b0) b0.remove(); return; }
  var BASE = 'https://yu1992-maker.github.io/yunjumin/tools/';
  function badge(t) {
    var b = document.getElementById('cet6x-badge');
    if (!b) { b = document.createElement('div'); b.id = 'cet6x-badge'; document.body.appendChild(b);
      b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#0d6e63;color:#fff;font:14px/1.4 -apple-system,PingFang SC,sans-serif;padding:10px 14px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.2);cursor:pointer';
      b.onclick = function () { b.remove(); }; }
    b.textContent = t;
  }
  badge('正在加载生词库…');
  var cached = window.__cet6x;
  (cached ? Promise.resolve(cached) : fetch(BASE + 'vocab.json').then(function (r) { return r.json(); })).then(function (V) {
    window.__cet6x = V;
    var root = document.querySelector('.wysiwyg, article, main, [role=main]') || document.body;
    var seen = {}, n = 0;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (t) {
      var p = t.parentNode; if (!p || /^(SCRIPT|STYLE|NOSCRIPT|BUTTON|CODE|TEXTAREA)$/.test(p.nodeName) || p.closest('nav,header,footer,.cet6x')) return 2;
      return /[a-z]{3}/.test(t.nodeValue) ? 1 : 2; } });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (t) {
      var s = t.nodeValue, re = /\b([A-Za-z][a-z]+(?:-[a-z]+)*)\b/g, m, last = 0, frag = null;
      while ((m = re.exec(s))) {
        var w = m[1], k = w.toLowerCase();
        if (w !== k) { var before = s.slice(0, m.index).trim(); if (before && !/[.!?“"]$/.test(before)) continue; }
        var e = V[k]; if (!e || seen[k]) continue;
        seen[k] = 1; n++;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(s.slice(last, m.index + w.length)));
        var span = document.createElement('span'); span.className = 'cet6x';
        span.textContent = ' [' + (e[0] ? '/' + e[0] + '/ ' : '') + e[1] + ']';
        span.style.cssText = 'color:#0d6e63;font-size:.78em;font-weight:500;background:#e6f2f0;border-radius:4px;padding:0 3px;margin-left:1px;white-space:nowrap';
        frag.appendChild(span); last = m.index + w.length;
      }
      if (frag) { frag.appendChild(document.createTextNode(s.slice(last))); t.parentNode.replaceChild(frag, t); }
    });
    badge('✓ 已标注 ' + n + ' 个六级以上生词（再点一次书签取消）');
    setTimeout(function () { var b = document.getElementById('cet6x-badge'); if (b) b.style.opacity = '.6'; }, 4000);
  }).catch(function (e) { badge('生词库加载失败：' + e); });
})();
