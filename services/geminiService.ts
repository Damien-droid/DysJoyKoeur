import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to play audio buffer
async function playAudioData(base64Data: string, sampleRate = 24000) {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate });
        
        const bytes = decode(base64Data);
        
        // Decode raw PCM manually if needed, but the response usually gives us raw data that needs specific handling
        // For the new Gemini TTS, it returns raw PCM. We need to wrap it in a WAV container or decode directly.
        // Let's try simpler Float32 conversion if it is raw PCM or use decodeAudioData if it has headers.
        
        // However, the new @google/genai examples show manual decoding for PCM.
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
        console.error("Audio playback error:", error);
    }
}

export const generateSentence = async (words: string, mode: 'serious' | 'fun'): Promise<string> => {
  try {
    const prompt = mode === 'fun' 
      ? `Agis comme un générateur pour enfants. Crée une phrase courte, très drôle et absurde qui contient OBLIGATOIREMENT les mots suivants : "${words}". La phrase doit être adaptée à un enfant de 8 ans.`
      : `Crée une phrase simple, scolaire et grammaticalement correcte (niveau CE2/CM1) qui contient les mots suivants : "${words}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "Désolé, je n'ai pas pu inventer une phrase.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Erreur de génération IA");
  }
};

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
    console.error("TTS Error:", error);
    throw new Error("Erreur de lecture audio");
  }
};
