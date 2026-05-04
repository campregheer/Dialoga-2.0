import axios from "axios";

export const generateDiaryPrompt = async () => {
  try {
    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.2",
      prompt: `
Você é um assistente emocional.

Escreva uma única frase que sirva como começo de um diário

Regras:
- Tom acolhedor
- Natural (como uma pessoa falando)
- Evite clichês
- Máximo 25 palavras

Seed: ${Date.now()}
`,
      stream: false
    });

    let text = res.data.response;

    // limpa quebras de linha e espaços
    text = text.replace(/\n/g, " ").trim();

    return text;

  } catch (err) {
    console.error("ERRO OLLAMA:", err);

    // fallback
    return "Hoje eu me senti...";
  }
};