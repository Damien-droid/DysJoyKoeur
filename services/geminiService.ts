import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Décode une chaîne Base64 en un tableau d'octets (Uint8Array).
 * @param base64 La chaîne encodée en Base64.
 * @returns Uint8Array contenant les données binaires décodées.
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Joue des données audio brutes (PCM) reçues de l'API Gemini.
 * @param base64Data Les données audio encodées en Base64.
 * @param sampleRate Le taux d'échantillonnage (par défaut 24000 Hz pour Gemini).
 */
async function playAudioData(base64Data: string, sampleRate = 24000) {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate });
        
        const bytes = decode(base64Data);
        
        // Les données audio de Gemini TTS sont généralement en PCM brut.
        // Nous les convertissons ici en Float32 pour l'API Web Audio.
        const dataInt16 = new Int16Array(bytes.buffer);
        const float32Data = new Float32Array(dataInt16.length);
        for (let i = 0; i < dataInt16.length; i++) {
             float32Data[i] = dataInt16[i] / 32768.0;
        }

        const buffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
        buffer.getChannelData(0).set(float32Data);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
        
        return new Promise<void>((resolve) => {
            source.onended = () => resolve();
        });

    } catch (error) {
        console.error("Erreur de lecture audio:", error);
    }
}

/**
 * Génère une phrase contenant une liste de mots donnés, adaptée aux enfants.
 * @param words Les mots à inclure dans la phrase.
 * @param mode Le mode de génération ('serious' pour scolaire, 'fun' pour ludique).
 * @returns La phrase générée par l'IA.
 */
export const generateSentence = async (words: string, mode: 'serious' | 'fun'): Promise<string> => {
  try {
    const prompt = mode === 'fun' 
      ? `Agis comme un générateur pour enfants. Crée une phrase courte, très drôle et absurde qui contient OBLIGATOIREMENT les mots suivants : "${words}". La phrase doit être adaptée à un enfant de 8 ans.`
      : `Crée une phrase simple, scolaire et grammaticalement correcte (niveau CE2/CM1) qui contient les mots suivants : "${words}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text?.trim() || "Désolé, je n'ai pas pu inventer une phrase.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Erreur de génération IA");
  }
};

/**
 * Génère de la parole (Text-to-Speech) à partir d'un texte.
 * @param text Le texte à lire.
 * @param voiceName La voix à utiliser ('Puck' ou 'Kore').
 */
export const generateSpeech = async (text: string, voiceName: 'Puck' | 'Kore' = 'Kore'): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        await playAudioData(base64Audio);
    }
  } catch (error) {
    console.error("Erreur TTS:", error);
    throw new Error("Erreur de lecture audio");
  }
};
