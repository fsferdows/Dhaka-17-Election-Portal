
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_CANDIDATES, MOCK_EVENTS, MOCK_VOTING_CENTERS } from "../constants";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance with a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class ElectionAssistant {
  async ask(query: string, lang: 'EN' | 'BN' = 'BN') {
    const candidateContext = MOCK_CANDIDATES.map(c => 
      `${c.name} (Party: ${c.party}): Manifesto Focus - ${c.manifesto}`
    ).join("\n");

    const eventContext = MOCK_EVENTS.map(e => 
      `${e.title} at ${e.location} on ${e.date}`
    ).join("\n");

    const votingCenterContext = MOCK_VOTING_CENTERS.map(vc =>
      `Center Name: ${vc.name} (${vc.nameBn}), Area: ${vc.area}, Address: ${vc.address} (${vc.addressBn})`
    ).join("\n");

    const systemInstruction = `
      You are the official AI Assistant for the Dhaka-17 Constituency Election Portal.
      Constituency Profile: Dhaka-17 includes high-profile areas like Gulshan (1 & 2), Banani, Baridhara (including DOHS), Dhaka Cantonment, and high-density residential zones like Bhashantek and Shahzadpur.
      
      Your Knowledge Base:
      1. Candidates and their plans:
      ${candidateContext}
      
      2. Upcoming events:
      ${eventContext}

      3. Official Polling/Voting Centers:
      ${votingCenterContext}
      
      Your Goals:
      - Help voters find their nearest voting center. If they provide an address or neighborhood (like "Banani" or "Gulshan"), look up the center from the list above.
      - If they provide a mock NID number (starting with digits), explain that for precise individual mapping they should check the official Election Commission website, but provide the list of major centers in their area based on your knowledge base.
      - Answer questions about candidate manifestos and upcoming campaign events.
      
      Guidelines:
      - Respond in ${lang === 'BN' ? 'Bengali' : 'English'}.
      - Maintain strict neutrality. Do not favor any candidate.
      - Comply with the Bangladesh Digital Security Act 2018: Avoid provocative language or unverified rumors.
      - Be polite, professional, and patriotic.
    `;

    try {
      // Use the global ai instance directly.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3, // Lower temperature for high factual accuracy regarding centers and names
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return lang === 'BN' 
        ? "দুঃখিত, আমি এই মুহূর্তে আপনার প্রশ্নের উত্তর দিতে পারছি না। অনুগ্রহ করে আবার চেষ্টা করুন।" 
        : "I apologize, I cannot process your request right now. Please try again shortly.";
    }
  }
}

export const assistant = new ElectionAssistant();
