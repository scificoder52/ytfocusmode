import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateVideoSummary = async (videoInfo: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing YouTube video content. Create concise, informative summaries based on the video's title and description. Focus on the main topics, key points, and potential value for viewers."
        },
        {
          role: "user",
          content: `Please analyze and provide a summary of this YouTube video based on its information:\n\n${videoInfo}\n\nProvide a structured summary including:\n1. Main Topic\n2. Key Points\n3. Target Audience\n4. Potential Value`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your API key or try again later.');
    }
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate video summary. Please try again.');
  }
};