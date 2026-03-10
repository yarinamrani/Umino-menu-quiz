<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>UMINO – מבחן תפריט</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0c0c0f; color: #e8e8e8; overflow-x: hidden; }
  #root { min-height: 100dvh; }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.5/babel.min.js"></script>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useCallback, useMemo } = React;

const EXAM = {
  mc: [
    { id:1, cat:"קוקטיילי בית", q:"מהם המרכיבים העיקריים בקוקטייל Arigato?", o:["רום לבן, אומשו, סירופ דבש ולימון טרי","אומשו, וויסקי, סירופ קיווי ביתי ויין אדום","ג׳ין, אומשו, סירופ קיווי ביתי ומי סוכר","וודקה, וויסקי, סירופ מנגו ויין לבן"], c:1 },
    { id:2, cat:"קוקטיילי בית", q:"איך תתאר/י ללקוח את הטעם של קוקטייל פלומה שפריץ?", o:["מתקתק-טרופי, עשיר וחלק, עם טעמים דומיננטיים של ליים ודבש","חמוץ-עדין, עם נגיעה מתוקה וטעמים דומיננטיים של לימון ונענע","מריר-עמוק, עם טעם חזק של טקילה ואגוזי מלך","חמצמץ-מריר, קליל ומרענן, עם טעמים דומיננטיים של אשכולית וקמפרי"], c:3 },
    { id:3, cat:"קוקטיילי בית", q:"מה ההבדל בין קוקטייל Passion Gin לבין קוקטייל Shi Shi?", o:["שניהם מכילים פסיפלורה, אך Passion Gin מבוסס ג׳ין עם לימון, ו-Shi Shi מבוסס יוזומון עם אפרול וביטר לימון","שניהם מבוססי ג׳ין, אך Passion Gin מכיל מנגו ו-Shi Shi מכיל ליצ׳י","שניהם מכילים וודקה, אך Passion Gin חמוץ יותר ו-Shi Shi מריר יותר","Passion Gin הוא קוקטייל חם ו-Shi Shi מוגש קר על קרח"], c:0 },
    { id:4, cat:"קוקטיילי בית", q:"לקוח מבקש קוקטייל מתקתק וטרופי. איזה קוקטייל בית תמליץ/י?", o:["פלומה שפריץ – טקילה, אפרול, קמפרי וליים","Shi Shi – יוזומון, אפרול וביטר לימון","סולי גולד – טקילה, מנגו, פסיפלורה וסירופ שקדים ביתי","וויסקי סאוור – וויסקי, לימון ומי סוכר"], c:2 },
    { id:5, cat:"קוקטיילים קלאסיים", q:"מה מייחד את המרגריטה הקלאסית מבחינת טעם?", o:["חמצמצה ומרעננת עם טעם אלכוהולי ברור, וטעמים דומיננטיים של ליים וטקילה","מתקתקה וקלילה עם טעם פירותי עדין וטעמים דומיננטיים של תפוז ורום","חמצמצה ומרירה עם טעמים דומיננטיים של אפרול ואשכולית","מרירה ועמוקה עם נגיעת עשן וטעמים דומיננטיים של מזקל ולימון"], c:0 },
    { id:6, cat:"בירות", q:"מה מייחד את בירת ליפמנס?", o:["בירה חזקה על בסיס דובדבנים שמתיישנת בעץ","לאגר כהה בסגנון גרמני עם טעם קרמל עמוק","בירת חיטה לא מסוננת מבלגיה עם נגיעות הדרים","בירה קלילה ומוגזת בסגנון אסייתי עם פירותיות"], c:0 },
    { id:7, cat:"בירות", q:"לקוח מבקש בירה יפנית. מה תציע/י?", o:["סינגה – בירת חיטה תאילנדית","סטלה – לאגר בלגי","פאולנר – בירת חיטה לא מסוננת","קירין – לאגר יפני בהיר"], c:3 },
    { id:8, cat:"יינות", q:"לקוח מעוניין ביין לבן עם גוף מלא ורעננות. מה תמליץ/י?", o:["שאבלי אלברט בישו, יבש ומינרלי עם נגיעות לימון","סוביניון בלאן – קסטל, גוף מלא עם רעננות לימונית וגוון טרופי","שרדונה לוריא, גוף קל ומינרלי עם נגיעות פירות","גוורץ לה פיאצה, חצי יבש עם ריחות אפרסק ומי ורדים"], c:1 },
    { id:9, cat:"יינות", q:"מהן התכונות של יין הרוזה ויספרינג אנג׳ל?", o:["דובדבן, תפוז סיני וגוף כבד – מגיע מדרום צרפת","אפרסק, ליצ׳י ומתיקות בולטת – מגיע מחבל הריין","תות שדה, אשכולית אדומה וחמיצות מעודנת – מגיע מפרובאנס","פירות יער כהים, וניל ועומק – מגיע מטוסקנה"], c:2 },
    { id:10, cat:"משקאות חריפים", q:"מה ההבדל בין גלנליווט 12 למקאלן 12?", o:["גלנליווט 12 הוא סקוטי חלק, ומקאלן 12 הוא סקוטי עדין עם טעמים של וניל ועץ","גלנליווט 12 הוא בורבון אמריקאי, ומקאלן 12 הוא סקוטי מעושן","גלנליווט 12 מיושן בחביות שרי, ומקאלן 12 מיושן בחביות בורבון","שניהם זהים מבחינת טעם, ההבדל רק במחיר ובמיתוג"], c:0 },
    { id:11, cat:"משקאות חריפים", q:"כמה סוגי טקילה יש בתפריט ומהם?", o:["שלושה סוגים: פטרון סילבר, דון חוליו בלאנקו ודון חוליו רפוסאדו","שניים בלבד: דון חוליו בלאנקו ודון חוליו רפוסאדו","ארבעה סוגים: אמיסריו סילבר, פטרון סילבר, דון חוליו בלאנקו ודון חוליו רפוסאדו","חמישה סוגים: אמיסריו סילבר ורפוסאדו, פטרון סילבר, דון חוליו בלאנקו ורפוסאדו"], c:2 },
    { id:12, cat:"ראשונות", q:"כיצד יש להסביר ללקוח את הדרך הנכונה לאכול נאמס עוף?", o:["לוקחים חסה, מכניסים את הנאמס, שמים מעל את הסלטון ולבסוף טובלים ברוטב","אוכלים את הנאמס ישירות מהצלחת עם רוטב בצד","חותכים את הנאמס, שמים על הסלטון ואוכלים עם מקלות","עוטפים את הנאמס בדף אורז נוסף וטובלים ברוטב סויה"], c:0 },
    { id:13, cat:"ראשונות", q:"למי מומלץ להציע את מנת הנאמס והגיוזה?", o:["רק ללקוחות שאוהבים אוכל חריף ומתובל","רק ללקוחות שמזמינים מנה עיקרית של סושי","ללקוחות שמחפשים מנה טבעונית בלבד","ללקוחות שלא אוכלים דגים"], c:3 },
    { id:14, cat:"ראשונות", q:"מהם מילויי הגיוזה הזמינים בתפריט?", o:["סלמון, עוף, טופו ובקר","עוף, בקר, טופו ואספרגוס","עוף, טונה, שיטאקי וירקות מעורבים","עוף, בקר, שיטאקי ובטטה"], c:3 },
    { id:15, cat:"ראשונות דגים", q:"מה חשוב לשאול לקוח לפני שהוא מזמין קראנץ׳ & טונה?", o:["האם הוא מעדיף את הדג צרוב או נא לגמרי","האם יש לו אלרגיה לגלוטן כי יש טמפורה במנה","האם הוא רוצה תוספת אורז בצד להשלמת המנה","האם הוא אוהב כוסברה, ולעדכן שהמנה חרפרפה"], c:3 },
    { id:16, cat:"ראשונות דגים", q:"למי מומלץ להציע אצבעות סלמון טמפורה ופיש אנד צ׳יפס?", o:["רק ללקוחות שמזמינים סושי כמנה עיקרית","ללקוחות שלא אוכלים דגים נאים","ללקוחות שמחפשים מנה קלה ודיאטטית","רק ללקוחות שמכירים את התפריט היטב"], c:1 },
    { id:17, cat:"סלטים", q:"לקוח רוצה סלט אבל לא אוכל חריף. מה תמליץ/י?", o:["סלט בנגקוק – אפשר להוריד את החריפות לפי בקשה","סלט קולורידה – מרכיבים עדינים עם רוטב ויניגרט כוסברה, חשוב לציין על הכוסברה","סלט פפאיה – מגיע עם חריפות בצד שאפשר לא לשים","סלט אייסברג יפני – סלט פשוט ללא תבלינים כלל"], c:1 },
    { id:18, cat:"סלטים", q:"האם ניתן להוריד את החריפות בסלט פפאיה?", o:["כן, אפשר לבקש מהמטבח להכין גרסה עדינה ללא צ׳ילי","לא, הסלט מאוד חריף ולא ניתן לבצע שינויים בחריפות. השינוי היחיד האפשרי הוא ללא בוטנים","כן, אפשר לבקש את הרוטב בצד ולהוסיף לפי טעם אישי","לא ניתן להוריד חריפות, אבל אפשר להוסיף ירקות נוספים כדי לאזן"], c:1 },
    { id:19, cat:"סלטים", q:"מהו הסלט הכי נמכר והמומלץ ביותר במסעדה?", o:["סלט קולורידה","סלט אייסברג יפני","סלט פפאיה","סלט בנגקוק"], c:3 },
    { id:20, cat:"סלטים", q:"כיצד ניתן להפוך את סלט הקולורידה למנה ללא גלוטן?", o:["על ידי הוצאת הקריספי בטטה מהמנה","לא ניתן – הסלט מכיל גלוטן ואין אפשרות לשינוי","על ידי החלפת הרוטב לרוטב סויה ללא גלוטן","על ידי הוצאת הבוטנים והחלפה בשקדים"], c:0 },
    { id:21, cat:"באנים", q:"מה מייחד את הלחמנייה של הבאנים באומינו?", o:["לחמנייה אפויה בתנור עם קראסט קריספי מבחוץ","פיתה יפנית דקה ורכה על בסיס אורז מאודה","באגט צרפתי מיני חם ופריך עם שומשום מעל","לחמנייה יפנית מאודה עם מרקם אוורירי וספוגי"], c:3 },
    { id:22, cat:"באנים", q:"האם ניתן להוסיף מרכיבים לבאן?", o:["כן, ניתן להוסיף כל מרכיב מהתפריט בתוספת תשלום","לא, ניתן להוציא מרכיבים אבל לא ניתן לשים מרכיב נוסף במקום","תלוי בסוג הבאן – בחלקם ניתן ובחלקם לא","כן, אבל רק ירקות נוספים ללא תוספת תשלום"], c:1 },
    { id:23, cat:"סושי ספיישל", q:"מה מייחד את הטריו רול?", o:["רול עם אורז חום במקום לבן, עטוף בשלוש שכבות אצות שונות","קומבינציה של שלושה רולים קטנים בצלחת אחת משותפת","רול ללא אורז, עם שלושה סוגי דגים – טונה אדומה, סלמון ודניס, במעטפת מלפפון","רול עם שלוש שכבות של סלמון בשלושה טקסטורים שונים"], c:2 },
    { id:24, cat:"סושי ספיישל", q:"מה האפשרויות למעטפת ב-Yummy Roll?", o:["מלפפון או אבוקדו, לבחירת הלקוח תמיד","מנגו או אבוקדו, בהתאם לעונה","טונה צרובה או סלמון צרוב לפי העדפה","דף אורז או דף סויה לפי סוג הרול"], c:1 },
    { id:25, cat:"פוקה בול", q:"מהן אפשרויות הבסיס והחלבון בפוקה בול?", o:["בסיס: אורז לבן או אורז חום. חלבון: עוף, סלמון או טופו","בסיס: אורז סושי בלבד. חלבון: סלמון, טונה רגילה או בקר","בסיס: אטריות חיטה או אורז סושי. חלבון: סלמון, דניס או טופו","בסיס: אורז סושי או אטריות שעועית. חלבון: סלמון, ספייסי טונה או טופו"], c:3 },
  ],
  open: [
    { id:26, cat:"שירות ומכירה", q:"לקוח מחפש סלט עם חלבון. מה תמליץ/י ולמה? ציין/י גם אפשרות לתוספת חלבון בסלט אחר.", pts:["סלט בנגקוק – הכי נמכר, מכיל דניס קריספי","סלט קולורידה – ניתן להוסיף עוף או טופו ב-11 ש״ח"] },
    { id:27, cat:"ידע תפריט", q:"באילו מנות חובה לציין ללקוח שיש כוסברה? ולמה זה חשוב?", pts:["קראנץ׳ & טונה","סלט קולורידה","באן אסאדו","יש אנשים שלא אוהבים כוסברה וחשוב לציין מראש"] },
    { id:28, cat:"ידע תפריט", q:"לקוח טבעוני רוצה להזמין ארוחה מלאה (ראשונה, עיקרית, קינוח). הרכב/י לו ארוחה מלאה מהתפריט עם הסבר קצר על כל מנה.", pts:["ראשונה: נאמס צמחוני / גיוזה שיטאקי או בטטה","עיקרית: רול צמחוני / פוקה בול עם טופו / באן טופו","קינוח: מלבי קוקוס ופקאן או קרמינו טבעוני"] },
    { id:29, cat:"ידע תפריט", q:"מה ההבדל בין סשימי טונה לסשימי סלמון מבחינת רוטבים, ליווי ואפשרות לשינויים?", pts:["סשימי טונה: רוטב תפוזים הדרים, עשבי תיבול, צ׳ילי – אפשר שינויים","סשימי סלמון: מיקס עשבים, בוטנים, צ׳ילי, רוטב תאילנדי – אי אפשר שינויים"] },
    { id:30, cat:"שירות ומכירה", q:"לקוח מתלבט בין מנת ראשונה של דגים. הוא לא אוכל חריף ומעדיף דברים קלים. מה תמליץ/י ואיזו מנה תמנע/י מלהציע? נמק/י.", pts:["מומלץ: קראנץ׳ & סלמון – לא חריפה, טעם לימוני עדין","מומלץ: סשימי טונה – אפשר להתאים","להימנע: קראנץ׳ & טונה – חרפרפה ולא ניתן לשינוי"] },
  ]
};

const L = ["\u05D0","\u05D1","\u05D2","\u05D3"];

function App() {
  const [screen, setScreen] = useState("start");
  const [name, setName] = useState("");
  const [idx, setIdx] = useState(0);
  const [mcAns, setMcAns] = useState({});
  const [openAns, setOpenAns] = useState({});
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(false);

  const all = useMemo(() => [
    ...EXAM.mc.map(q => ({...q, type:"mc"})),
    ...EXAM.open.map(q => ({...q, type:"open"})),
  ], []);
  const total = all.length;
  const cur = all[idx];
  const pct = (idx / total) * 100;

  const mcScore = useMemo(() => {
    if (screen !== "results") return 0;
    return EXAM.mc.filter(q => mcAns[q.id] === q.c).length;
  }, [screen, mcAns]);

  const pickMc = useCallback((i) => {
    if (fb) return;
    setSel(i);
    setFb(true);
    setMcAns(p => ({...p, [cur.id]: i}));
    setTimeout(() => {
      setFb(false); setSel(null);
      idx < total-1 ? setIdx(n=>n+1) : setScreen("results");
    }, 1200);
  }, [fb, cur, idx, total]);

  const nextOpen = useCallback(() => {
    idx < total-1 ? setIdx(n=>n+1) : setScreen("results");
  }, [idx, total]);

  const restart = () => {
    setScreen("start"); setIdx(0); setMcAns({}); setOpenAns({}); setSel(null); setFb(false); setName("");
  };

  // ── START ──
  if (screen === "start") return (
    <div style={S.wrap}>
      <div style={S.center}>
        <div style={S.kanji}>海</div>
        <h1 style={S.logo}>UMINO</h1>
        <p style={S.sub}>מבחן תפריט למלצרים וברמנים</p>
        <div style={S.stats}>
          <div style={S.stat}><b style={S.statN}>25</b><span style={S.statL}>אמריקאיות</span></div>
          <div style={S.divider}/>
          <div style={S.stat}><b style={S.statN}>5</b><span style={S.statL}>פתוחות</span></div>
          <div style={S.divider}/>
          <div style={S.stat}><b style={S.statN}>75</b><span style={S.statL}>ציון עובר</span></div>
        </div>
        <input style={S.input} placeholder="הכנס/י שם מלא" value={name} onChange={e=>setName(e.target.value)} dir="rtl"/>
        <button style={{...S.btn, opacity: name.trim()?1:0.4}} disabled={!name.trim()} onClick={()=>setScreen("exam")}>התחל מבחן</button>
      </div>
    </div>
  );

  // ── RESULTS ──
  if (screen === "results") {
    const p = Math.round((mcScore/25)*100);
    const pass = p >= 75;
    const clr = pass ? "#4ade80" : "#f87171";
    return (
      <div style={S.wrap}>
        <div style={S.center}>
          <div style={S.kanji}>海</div>
          <h1 style={{...S.logo, fontSize:22}}>תוצאות המבחן</h1>
          <p style={S.sub}>{name}</p>
          <div style={{...S.circle, borderColor:clr}}>
            <span style={{fontSize:42,fontWeight:700,color:clr}}>{p}</span>
            <span style={{fontSize:18,color:"#888",marginTop:12}}>%</span>
          </div>
          <div style={{...S.badge, background:pass?"rgba(74,222,128,0.15)":"rgba(248,113,113,0.15)", color:clr}}>
            {pass ? "עבר/ה בהצלחה ✓" : "לא עבר/ה ✗"}
          </div>
          <p style={{fontSize:14,color:"#777",marginBottom:28}}>{mcScore} תשובות נכונות מתוך 25</p>

          <div style={S.section}>
            <p style={S.secTitle}>פירוט שאלות אמריקאיות</p>
            {EXAM.mc.map(q => {
              const ok = mcAns[q.id] === q.c;
              return (
                <div key={q.id} style={S.row}>
                  <span style={{...S.dot, background: ok?"#4ade80":"#f87171"}}/>
                  <span style={S.rowQ}>{q.id}. {q.q.length > 55 ? q.q.slice(0,55)+"..." : q.q}</span>
                  {!ok && <span style={S.rowAns}>תשובה: {L[q.c]}</span>}
                </div>
              );
            })}
          </div>

          <div style={S.section}>
            <p style={S.secTitle}>תשובות פתוחות (לבדיקת מנהל)</p>
            {EXAM.open.map(q => (
              <div key={q.id} style={{padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <p style={{fontSize:14,fontWeight:600,color:"#ccc",margin:"0 0 6px"}}>{q.id}. {q.q}</p>
                <p style={{fontSize:14,color:"#999",margin:"0 0 10px",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{openAns[q.id] || "(לא נענה)"}</p>
                <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(196,162,101,0.06)"}}>
                  <p style={{fontSize:11,color:"#c4a265",fontWeight:700,margin:"0 0 4px"}}>נקודות מצופות:</p>
                  {q.pts.map((pt,i) => <p key={i} style={{fontSize:12,color:"#888",margin:"2px 0",lineHeight:1.4}}>• {pt}</p>)}
                </div>
              </div>
            ))}
          </div>

          <button style={{...S.btn, marginTop:20}} onClick={restart}>מבחן חדש</button>
        </div>
      </div>
    );
  }

  // ── EXAM ──
  const isMc = cur.type === "mc";
  return (
    <div style={S.wrap}>
      <div style={S.progBg}><div style={{...S.progFill, width:pct+"%"}}/></div>
      <div style={S.header}>
        <span style={{fontSize:13,color:"#888"}}>{name}</span>
        <span style={{fontSize:13,color:"#c4a265",fontWeight:600}}>{idx+1} / {total}</span>
      </div>
      <div style={S.pill}>{isMc ? "אמריקאית" : "שאלה פתוחה"} · {cur.cat}</div>
      <div style={S.qCard}><p style={S.qText}>{cur.q}</p></div>

      {isMc ? (
        <div style={S.opts}>
          {cur.o.map((opt,i) => {
            let bg = "rgba(255,255,255,0.04)", brd = "1px solid rgba(255,255,255,0.1)";
            if (fb && i === cur.c) { bg="rgba(74,222,128,0.15)"; brd="1px solid #4ade80"; }
            else if (fb && i === sel && i !== cur.c) { bg="rgba(248,113,113,0.15)"; brd="1px solid #f87171"; }
            return (
              <button key={i} onClick={()=>pickMc(i)} style={{...S.optBtn, background:bg, border:brd}}>
                <span style={S.optL}>{L[i]}</span>
                <span style={S.optT}>{opt}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{padding:"0 16px"}}>
          <textarea style={S.ta} dir="rtl" placeholder="כתוב/י את תשובתך כאן..." rows={5}
            value={openAns[cur.id]||""} onChange={e=>setOpenAns(p=>({...p,[cur.id]:e.target.value}))}/>
          <div style={S.hints}>
            <p style={{fontSize:12,color:"#c4a265",fontWeight:700,margin:"0 0 6px"}}>נקודות שצריך לכסות:</p>
            {cur.pts.map((pt,i) => <p key={i} style={{fontSize:13,color:"#999",margin:"2px 0",lineHeight:1.5}}>• {pt}</p>)}
          </div>
          <button style={{...S.btn, width:"100%", marginTop:12, opacity:(openAns[cur.id]||"").trim()?1:0.4}}
            disabled={!(openAns[cur.id]||"").trim()} onClick={nextOpen}>
            {idx < total-1 ? "שאלה הבאה ←" : "סיים מבחן"}
          </button>
        </div>
      )}
    </div>
  );
}

const S = {
  wrap: { direction:"rtl", minHeight:"100dvh", background:"linear-gradient(170deg,#0c0c0f 0%,#1a1a2e 40%,#16213e 100%)", fontFamily:"'Segoe UI',Tahoma,sans-serif", color:"#e8e8e8", paddingBottom:40 },
  center: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100dvh", padding:"32px 20px" },
  kanji: { fontSize:56, color:"#c4a265", marginBottom:8, fontWeight:300 },
  logo: { fontSize:36, fontWeight:200, letterSpacing:12, color:"#c4a265", margin:"0 0 8px" },
  sub: { fontSize:15, color:"#888", margin:"0 0 36px" },
  stats: { display:"flex", alignItems:"center", gap:20, marginBottom:36 },
  stat: { display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  statN: { fontSize:28, fontWeight:600, color:"#fff" },
  statL: { fontSize:12, color:"#777" },
  divider: { width:1, height:36, background:"rgba(255,255,255,0.1)" },
  input: { width:260, padding:"14px 18px", borderRadius:12, border:"1px solid rgba(196,162,101,0.3)", background:"rgba(255,255,255,0.05)", color:"#fff", fontSize:16, textAlign:"center", outline:"none", marginBottom:20, direction:"rtl" },
  btn: { padding:"14px 48px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#c4a265,#a8893a)", color:"#0c0c0f", fontSize:16, fontWeight:700, cursor:"pointer", letterSpacing:1 },
  progBg: { position:"sticky", top:0, height:3, background:"rgba(255,255,255,0.06)", zIndex:10 },
  progFill: { height:3, background:"linear-gradient(90deg,#c4a265,#e8d5a8)", transition:"width 0.4s ease", borderRadius:"0 2px 2px 0" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px 8px" },
  pill: { margin:"0 20px 16px", display:"inline-block", padding:"6px 16px", borderRadius:20, background:"rgba(196,162,101,0.1)", color:"#c4a265", fontSize:12, fontWeight:600 },
  qCard: { margin:"0 16px 20px", padding:"24px 20px", borderRadius:16, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" },
  qText: { fontSize:17, lineHeight:1.7, margin:0, fontWeight:500 },
  opts: { display:"flex", flexDirection:"column", gap:10, padding:"0 16px" },
  optBtn: { display:"flex", alignItems:"flex-start", gap:12, padding:"16px 18px", borderRadius:14, cursor:"pointer", textAlign:"right", direction:"rtl", transition:"all 0.2s", width:"100%", fontFamily:"inherit", color:"#e8e8e8", fontSize:15 },
  optL: { flexShrink:0, width:28, height:28, borderRadius:8, background:"rgba(196,162,101,0.15)", color:"#c4a265", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 },
  optT: { flex:1, lineHeight:1.6, paddingTop:2 },
  ta: { width:"100%", padding:16, borderRadius:14, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"#e8e8e8", fontSize:15, lineHeight:1.7, fontFamily:"inherit", outline:"none", resize:"vertical", boxSizing:"border-box", minHeight:120 },
  hints: { margin:"12px 0", padding:"14px 16px", borderRadius:12, background:"rgba(196,162,101,0.06)", border:"1px solid rgba(196,162,101,0.15)" },
  circle: { width:120, height:120, borderRadius:"50%", border:"3px solid", display:"flex", alignItems:"center", justifyContent:"center", gap:2, marginBottom:16 },
  badge: { padding:"8px 24px", borderRadius:20, fontSize:15, fontWeight:700, marginBottom:12 },
  section: { width:"100%", maxWidth:500, marginBottom:28 },
  secTitle: { fontSize:14, color:"#c4a265", fontWeight:700, marginBottom:12, paddingBottom:8, borderBottom:"1px solid rgba(196,162,101,0.2)" },
  row: { display:"flex", alignItems:"center", gap:10, padding:"6px 0", fontSize:13, borderBottom:"1px solid rgba(255,255,255,0.03)" },
  dot: { width:8, height:8, borderRadius:"50%", flexShrink:0 },
  rowQ: { flex:1, color:"#aaa" },
  rowAns: { fontSize:12, color:"#c4a265", flexShrink:0 },
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
