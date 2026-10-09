/* ==========================================================================
   TeacherStudio Pairs Helper - derive pairs/groups/keywords from teacher
   content. Pure functions (no DOM) so in-app preview and exported HTML
   share one logic.
   QUY UOC SOAN (reuses the A/B/C/D form, no new form needed):
   - Matching/Connect: question -> correct answer (Q-A pair).
   - Drag & Drop: options = group names, correct = the group of the item.
     Ex: item "Ga" | group "Dong vat" | group "Thuc vat" | answer A.
   - Crossword: correct answer = keyword (auto unaccented on check).
   ========================================================================== */

// Strip Vietnamese accents + uppercase, keep A-Z0-9 only.
// Note: NFD does NOT decompose D with stroke, so map it explicitly.
export function normText(s) {
  return String(s || '')
    .replace(/Đ/g, 'D').replace(/đ/g, 'd')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
}

// Left-right pairs from content.pairs (if any) or question -> correct answer
export function pairsFromContent(content, max = 6) {
  const qs = (content && content.questions) || [];
  if (content && content.pairs && content.pairs.length) {
    return content.pairs.slice(0, max).map((p, i) => ({ id: i, left: p.left, right: p.right }));
  }
  return qs.slice(0, max).map((q, i) => ({
    id: i,
    left: q.question,
    right: (q.answers && q.answers[q.correctAnswer]) || q.explanation || ('Y nghia ' + (i + 1))
  }));
}

// Classification groups for Drag & Drop. Returns null when the content
// is not group-shaped -> caller falls back to demo data.
export function dragGroupsFromContent(content, maxItems = 8) {
  const qs = ((content && content.questions) || []).slice(0, maxItems);
  if (!qs.length) return null;
  // Convention: every question needs >= 2 options (group names)
  const usable = qs.every(q => Array.isArray(q.answers) && q.answers.filter(a => String(a || '').trim()).length >= 2);
  if (!usable) return null;
  const groups = [];
  qs.forEach(q => {
    (q.answers || []).forEach(a => {
      const name = String(a || '').trim();
      if (name && groups.indexOf(name) < 0) groups.push(name);
    });
  });
  if (groups.length < 2 || groups.length > 4) return null;
  const cats = groups.map((t, i) => ({ id: 'cat_' + i, title: t }));
  const items = qs.map((q, i) => {
    const target = String((q.answers || [])[q.correctAnswer] || '').trim();
    let gi = groups.indexOf(target);
    if (gi < 0) gi = 0;
    return { id: i, text: q.question, targetCat: 'cat_' + gi };
  });
  return { cats, items };
}

// Crossword keywords from content.words (if any) or teacher correct answers
export function crosswordWordsFromContent(content, max = 8) {
  if (content && content.words && content.words.length) return content.words.slice(0, max);
  const qs = (content && content.questions) || [];
  const words = qs.slice(0, max).map((q, i) => {
    const ans = (q.answers && q.answers[q.correctAnswer]) || '';
    return { id: i + 1, clue: q.question, answer: normText(ans) };
  }).filter(w => w.answer && w.answer.length >= 2 && w.answer.length <= 12);
  return words;
}
