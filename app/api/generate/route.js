import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const STYLES = {
  "Herzlich & familiär": "herzlich, warm und familiär – wie ein guter Freund",
  "Professionell & höflich": "professionell, höflich und seriös",
  "Locker & freundlich": "locker, entspannt und freundlich",
  "Gehoben & elegant": "gehoben, elegant und kultiviert",
  "Direkt & unkompliziert": "direkt, ehrlich und unkompliziert",
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { restName, contact, style, extra, msgType, message } = body;

    if (!message || !message.trim()) {
      return Response.json({ error: "Keine Nachricht angegeben." }, { status: 400 });
    }

    const name = (restName || "").trim() || "unser Restaurant";
    const signer = (contact || "").trim() || "das Team";
    const styleDesc = STYLES[style] || STYLES["Herzlich & familiär"];

    const system = `Du bist ein Kommunikationsassistent für das Restaurant "${name}".
Schreibe Antworten auf Kundennachrichten. Stil: ${styleDesc}.
${extra ? `Besonderheiten: ${extra}.` : ""}
Unterzeichner: ${signer} – ${name}.
Sprache: immer Deutsch.
Gib GENAU 3 verschiedene Antworten aus, getrennt durch die Zeile "|||".
Kein Vorwort, keine Nummerierung – direkt mit dem Antworttext beginnen.`;

    const prompt = `Art der Nachricht: ${msgType}
Kundennachricht:
"${message}"

Schreibe 3 verschiedene Antworten, getrennt durch "|||".`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("");

    const replies = text.split("|||").map((s) => s.trim()).filter(Boolean).slice(0, 3);

    return Response.json({ replies });
  } catch (err) {
    console.error("API error:", err);
    return Response.json(
      { error: "Fehler beim Generieren. Bitte erneut versuchen." },
      { status: 500 }
    );
  }
}
