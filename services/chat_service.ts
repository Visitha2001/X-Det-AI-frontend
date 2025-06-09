import http from './http_service';

// Export the BotType type
export type BotType = 'local' | 'gemini';

// Export the MedicalQuery interface
export interface MedicalQuery {
  question: string;
  disease?: string;
}

// Export the ChatResponse interface
export interface ChatResponse {
  answer: string;
  disclaimer?: string;
  confidence?: number;
  followup_questions?: string[];
}

// Export the DiseaseQuestionsResponse interface
export interface DiseaseQuestionsResponse {
  disease: string;
  questions: string[];
}

class ChatService {
  private currentBot: BotType = 'local';

  setBotType(botType: BotType) {
    this.currentBot = botType;
  }

  getBotType(): BotType {
    return this.currentBot;
  }

  async sendQuery(query: MedicalQuery): Promise<ChatResponse> {
    if (this.currentBot === 'gemini') {
      return this.queryGemini(query.question);
    } else {
      if (!query.disease) {
        throw new Error('Disease is required for local bot');
      }
      return this.queryLocalBot(query.disease, query.question);
    }
  }

  private async queryGemini(question: string): Promise<ChatResponse> {
    try {
      const response = await http.post('/g_chat', { question });
      return response.data;
    } catch (error) {
      console.error('Error querying Gemini:', error);
      throw error;
    }
  }

  private async queryLocalBot(disease: string, question: string): Promise<ChatResponse> {
    try {
      const response = await http.post('/chat', { disease, query: question });
      return {
        answer: response.data.answer,
        confidence: response.data.confidence,
        followup_questions: response.data.followup_questions
      };
    } catch (error) {
      console.error('Error querying local bot:', error);
      throw error;
    }
  }

  async getSuggestedQuestions(disease: string): Promise<DiseaseQuestionsResponse> {
    try {
      const response = await http.get(`/diseases/${disease}/suggested-questions`);
      return response.data;
    } catch (error) {
      console.error('Error getting suggested questions:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();