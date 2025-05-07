//import axios from 'axios';

//export async function getSpecialtyFromAI(problem: string): Promise<string> {
  //const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    //model: 'gpt-3.5-turbo',

   // messages: [
   //   { role: "system", content: "You are a healthcare triage assistant." },
   //   { role: "user", content: `The patient has the following issue: "${problem}". Which therapist specialty is most suitable?` }
   // ],
   // temperature: 0.4
 // }, {
  //  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
 // });

  //const reply = res.data.choices[0].message.content;
  //return reply?.trim();
//}
import fetch from 'node-fetch';

export async function getSpecialtyFromAI(problem: string): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
    const body = {
      contents: [{
        parts: [{
          text: `The patient has the following issue: "${problem}". Which therapist specialty is most suitable? Answer in just one word.`
        }]
      }]
    };
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const json = await res.json();
  
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
  
      if (!reply) {
        throw new Error("No response from Gemini.");
      }
  
      return reply.trim().toLowerCase();
    } catch (err: any) {
      console.error("❌ Gemini API error:", err.message);
      throw err;
    }
  }
  
