import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateVideoSummary = async (videoInfo: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this YouTube video content and create a clear, structured summary that's easy to understand and take notes from. Format the response in clear sections:

Topic Overview
- Main subject of the video in 1-2 sentences

Key Concepts
- List the 3-5 most important concepts
- Keep each point clear and concise
- Use simple, straightforward language

Learning Outcomes
- What specific knowledge or skills will viewers gain
- List practical takeaways

Additional Notes
- Any important definitions, examples, or context
- Technical terms explained simply

Here's the video information to analyze:

${videoInfo}

Format the response with clear headings and bullet points, avoiding any special characters or markdown symbols.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "Unable to generate summary.";
  } catch (error: any) {
    console.error('Error generating summary:', error);
    if (error?.message?.includes('PERMISSION_DENIED')) {
      throw new Error('Invalid Gemini API key. Please check your API key and try again.');
    }
    if (error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }
    throw new Error('Failed to generate video summary. Please try again.');
  }
};