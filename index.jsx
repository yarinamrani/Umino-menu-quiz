import { useState } from "react";

const API = "https://api.anthropic.com/v1/messages";

const SEASONS = [
  { label: "אביב", emoji: "🌸" },
  { label: "קיץ", emoji: "☀️" },
  { label: "סתיו", emoji: "🍂" },
  { label: "חורף", emoji: "🌧️" },
];

const COURSES = [
  { label: "מנה ראשונה", emoji: "🥗" },
  { label: "מנה עיקרית", emoji: "🍽️" },
  { label: "קינוח", emoji: "🍮" },
  { label: "הפתעה", emoji: "🎲" },
];

const STYLES = [
  { label: "ים תיכוני", emoji: "🫒" },
  { label: "אסייתי", emoji: "🥢" },
  { label: "מקומי ישראלי", emoji: "🧆" },
  { label: "פיוז׳ן", emoji: "✨" },
];

async function generateMenu(ingredients, season, course, style) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `אתה שף יצירתי ברמה גבוהה של מסעדת פסאו — בר קוקטיילים ומסעדת גג על הטיילת בראשון לציון מול הים. 
החזר ONLY valid JSON, ללא markdown. סכמה:
{
  "dishes": [
    {
      "name": "שם המנה בעברית",
      "tagline": "משפט קצר שיווקי (עד 6 מילים)",
      "description": "תיאור המנה (2-3 משפטים, פואטי ומפתה)",
      "ingredients_used": ["רכיב1", "רכיב2", "רכיב3"],
      "price_suggestion": number,
      "prep_complexity": "קל / בינוני / מורכב",
      "wow_factor": "מה הופך אותה מיוחדת (משפט אחד)"
    }
  ]
}
dishes חייב להכיל בדיוק 3 מנות.`,
      messages: [{
        role: "user",
        content: `רכיבים זמינים: ${ingredients}
עונה: ${season}
סוג מנה: ${course}
סגנון: ${style}
הצע 3 מנות יצירתיות שמתאימות לאווירת גג מול הים.`
      }]
    })
  });
  const d = await res.json();
  if (d.error) {
    throw new Error(d.error.message || JSON.stringify(d.error));
  }
  const txt = d.content?.find(b => b.type === "text")?.text || "{}";
  let clean = txt.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    // Attempt to fix truncated JSON by closing open structures
    let fixed = clean;
    if (!fixed.endsWith("}")) fixed += '"}]}';
    else if (!fixed.endsWith("]}")) fixed += "]}";
    else if (!fixed.endsWith("]")) fixed += "]";
    return JSON.parse(fixed);
  }
}

const COMPLEXITY_COLOR = { "קל": "#27ae60", "בינוני": "#C4A265", "מורכב": "#e74c3c" };

export default function App() {
  const [ingredients, setIngredients] = useState("");
  const [season, setSeason] = useState(null);
  const [course, setCourse] = useState(null);
  const [style, setStyle] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);

  const canGenerate = ingredients.trim().length > 3 && season !== null && course !== null && style !== null;

  const generate = async () => {
    setLoading(true);
    setResult(null);
    setExpanded(null);
    setError(null);
    try {
      const r = await generateMenu(ingredients, SEASONS[season].label, COURSES[course].label, STYLES[style].label);
      setResult(r);
      setExpanded(0);
    } catch (e) {
      setError(`שגיאה: ${e.message}`);
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "system-ui,sans-serif", direction: "rtl", color: "#e0ddd5", padding: "24px 16px 60px", maxWidth: 500, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#C4A265", opacity: 0.6, marginBottom: 4 }}>PASEO ROOFTOP</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>🍽️ MENU<span style={{ color: "#C4A265" }}>AI</span></div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>תפריט עונתי לפי מה שיש במלאי</div>
      </div>

      {/* Ingredients input */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 8, fontWeight: 600 }}>🛒 רכיבים זמינים</div>
        <textarea
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          placeholder="לדוגמה: סלמון טרי, אבוקדו, עלי בייבי, לימון, שמן זית, פרמזן, בזיליקום, שרי, שום..."
          rows={3}
          style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 14, padding: "12px 14px", color: "#e0ddd5", fontSize: 13, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "system-ui,sans-serif" }}
        />
      </div>

      {/* Season */}
      <Section title="🌿 עונה">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SEASONS.map((s, i) => (
            <PillChip key={i} active={season === i} onClick={() => setSeason(i)}>{s.emoji} {s.label}</PillChip>
          ))}
        </div>
      </Section>

      {/* Course */}
      <Section title="📋 סוג מנה">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COURSES.map((c, i) => (
            <PillChip key={i} active={course === i} onClick={() => setCourse(i)}>{c.emoji} {c.label}</PillChip>
          ))}
        </div>
      </Section>

      {/* Style */}
      <Section title="🎨 סגנון">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STYLES.map((s, i) => (
            <PillChip key={i} active={style === i} onClick={() => setStyle(i)}>{s.emoji} {s.label}</PillChip>
          ))}
        </div>
      </Section>

      {/* Button */}
      <button onClick={generate} disabled={!canGenerate || loading} style={{
        width: "100%", padding: 15, borderRadius: 28, fontSize: 15, fontWeight: 800,
        cursor: canGenerate && !loading ? "pointer" : "not-allowed",
        background: canGenerate && !loading ? "#C4A265" : "#1a1a1a",
        color: canGenerate && !loading ? "#000" : "#444",
        border: "none", letterSpacing: 1, marginTop: 4, transition: "all .3s",
        boxShadow: canGenerate && !loading ? "0 0 28px #C4A26533" : "none",
      }}>
        {loading ? "👨‍🍳 השף חושב..." : "✨ צור תפריט"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 16, textAlign: "center", color: "#e74c3c", fontSize: 13 }}>{error}</div>
      )}

      {/* Results */}
      {result?.dishes && !loading && (
        <div style={{ marginTop: 28, animation: "fadeIn .5s ease" }}>
          <div style={{ fontSize: 11, color: "#C4A265", letterSpacing: 4, marginBottom: 14, textAlign: "center" }}>3 הצעות מנות</div>
          {result.dishes.map((dish, i) => (
            <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{
              background: "#111", borderRadius: 18, marginBottom: 10, overflow: "hidden",
              border: `1px solid ${expanded === i ? "#C4A26566" : "#1e1e1e"}`,
              boxShadow: expanded === i ? "0 4px 24px #C4A26522" : "none",
              cursor: "pointer", transition: "all .3s",
            }}>
              {/* Dish header */}
              <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#C4A26522", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#C4A265" }}>{i + 1}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{dish.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#C4A265", fontStyle: "italic", marginRight: 30 }}>{dish.tagline}</div>
                </div>
                <div style={{ textAlign: "left", flexShrink: 0, marginRight: 8 }}>
                  {dish.price_suggestion > 0 && <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>₪{dish.price_suggestion}</div>}
                  <div style={{ fontSize: 10, color: COMPLEXITY_COLOR[dish.prep_complexity] || "#888", marginTop: 2 }}>{dish.prep_complexity}</div>
                </div>
              </div>

              {/* Expanded */}
              {expanded === i && (
                <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1e1e1e" }}>
                  <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.8, marginTop: 14, marginBottom: 12 }}>{dish.description}</div>
                  
                  <div style={{ background: "#C4A26511", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#C4A265", letterSpacing: 2, marginBottom: 6 }}>WOW FACTOR</div>
                    <div style={{ fontSize: 12, color: "#ddd" }}>{dish.wow_factor}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8 }}>רכיבים מהמלאי</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {dish.ingredients_used?.map((ing, j) => (
                        <span key={j} style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 10, padding: "4px 10px", fontSize: 11, color: "#aaa" }}>{ing}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        textarea::placeholder { color: #444; }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8, fontWeight: 600 }}>{title}</div>
      {children}
    </div>
  );
}

function PillChip({ active, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600,
      background: active ? "#C4A265" : "#111",
      color: active ? "#000" : "#888",
      border: `1px solid ${active ? "#C4A265" : "#222"}`,
      transition: "all .2s",
    }}>{children}</div>
  );
}
