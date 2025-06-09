'use client'
import { useState, useRef, useEffect } from 'react';
import { chatService } from '@/services/chat_service';
import type { BotType, ChatResponse, DiseaseQuestionsResponse } from '@/services/chat_service';
import { FaCheck, FaCopy, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const DISEASE_LABELS = [
  'Emphysema', 'Infiltration', 'Pleural_Thickening',
  'Pneumothorax', 'Cardiomegaly', 'No Finding', 'Atelectasis',
  'Edema', 'Effusion', 'Consolidation', 'Mass', 'Nodule',
  'Fibrosis', 'Pneumonia', 'Hernia'
];

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isLocalBot?: boolean;
  confidence?: number;
  followup_questions?: string[];
}

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botType, setBotType] = useState<BotType>('local');
  const [selectedDisease, setSelectedDisease] = useState(DISEASE_LABELS[0]); // Default to first disease
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial suggested questions when botType or selectedDisease changes
  useEffect(() => {
    chatService.setBotType(botType);
    if (botType === 'local') {
      loadSuggestedQuestions();
    } else {
      setSuggestedQuestions([]);
    }
  }, [botType, selectedDisease]);

  const loadSuggestedQuestions = async () => {
    try {
      const response = await chatService.getSuggestedQuestions(selectedDisease);
      setSuggestedQuestions(response.questions);
    } catch (error) {
      console.error('Failed to load suggested questions:', error);
      setSuggestedQuestions([]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      isLocalBot: botType === 'local',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendQuery({
        question: input,
        disease: botType === 'local' ? selectedDisease : undefined,
      });

      const botMessage: Message = {
        text: response.answer,
        sender: 'bot',
        isLocalBot: botType === 'local',
        confidence: response.confidence,
        followup_questions: response.followup_questions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        isLocalBot: botType === 'local',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = async (question: string) => {
    setInput(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyDisease = () => {
    navigator.clipboard.writeText(selectedDisease).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy disease:', err);
    });
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full w-full sm:px-80 px-8 sm:py-6 py-2 mx-auto bg-gray-900 shadow-lg overflow-hidden border-b-2 border-gray-700">
      {/* Header */}
      <div className="bg-gray-800 text-gray-100 p-4 sm:p-6 rounded-3xl mb-2 sm:mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Medical Chatbot</h2>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-red-600 px-3 py-1 rounded-lg hover:text-white border border-red-500"
            >
              Clear Chat
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
          <div className="flex items-center">
            <label htmlFor="bot-type" className="mr-2">Bot Type:</label>
            <select
              id="bot-type"
              value={botType}
              onChange={(e) => setBotType(e.target.value as BotType)}
              className="bg-gray-700 text-gray-100 rounded-xl px-2 py-1"
            >
              <option value="local">X-DET-AI-Bot</option>
              <option value="gemini">Gemini Bot</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="disease" className="mr-2">Disease:</label>
            <select
              id="disease"
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="bg-gray-700 text-gray-100 rounded-xl px-2 py-1"
            >
              {DISEASE_LABELS.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
            <button
              onClick={handleCopyDisease}
              className="ml-2 bg-gray-700 hover:bg-gray-600 text-gray-100 p-2 rounded-xl"
              title="Copy disease name"
              aria-label="Copy disease name"
            >
              {copied ? (
                <FaCheck className="h-4 w-4" />
              ) : (
                <FaCopy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-800 text-gray-100 rounded-t-3xl">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center sm:h-35 h-20 text-gray-400">
            {botType === 'local' ? (
              <div className="flex flex-col gap-2">
                <p>Ask your question about {selectedDisease} or choose from suggested questions below</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-center">
                <p>Ask any medical question to the Gemini medical assistant</p>
                <p className="text-red-200 p-2 bg-red-900/50 rounded-xl text-center">
                  In Gemini chat you need to provide the disease name and more details
                </p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-xl max-w-5xl ${
                  message.sender === 'user' ? 'bg-blue-600 text-gray-100' : 'bg-gray-700 text-gray-100'
                }`}
              >
                {message.sender === 'bot' && !message.isLocalBot ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <p>{message.text}</p>
                )}
                {message.sender === 'bot' && message.isLocalBot && message.confidence !== undefined && (
                  <p className="text-xs mt-1 text-gray-400">
                    Confidence: {(message.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              {message.sender === 'bot' && message.followup_questions && message.followup_questions.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Follow-up questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.followup_questions
                      .slice()
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 3)
                      .map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedQuestionClick(q)}
                          className="text-xs bg-gray-800 border border-blue-500 hover:bg-blue-900 hover:border-2 hover:border-blue-500 text-gray-100 px-2 py-1 rounded-xl"
                        >
                          {q}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (local bot only) */}
      {botType === 'local' && suggestedQuestions.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800">
          <div className="p-4 sm:p-6 border-3 border-gray-700 bg-gray-800 rounded-2xl">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Suggested Questions:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {suggestedQuestions.slice(0, 12).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestionClick(question)}
                  className={`text-left text-sm bg-gray-700 hover:bg-blue-900 hover:border-2 hover:border-blue-500 text-gray-100 sm:px-3 sm:py-2 px-1 py-1 rounded-xl border border-gray-600 ${
                    index >= 4 ? 'hidden sm:block' : ''
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>  
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800 rounded-b-3xl">
        <div className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={botType === 'local' ? `Ask about ${selectedDisease}...` : 'Ask any medical question from Gemini...'}
            className="flex-1 border border-gray-600 bg-gray-800 text-gray-100 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-gray-100 px-4 py-2 rounded-r-xl disabled:bg-blue-400"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              <div className="flex items-center gap-3">
                Send
                <FaPaperPlane className="h-4 w-4" />
              </div>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {botType === 'gemini'
            ? 'Gemini provides general medical information in Markdown format'
            : 'Local bot provides information based on available disease data'}
        </p>
      </div>
    </div>
  );
}