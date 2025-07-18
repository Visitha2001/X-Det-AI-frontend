'use client'
import { useState, useRef, useEffect } from 'react';
import { chatService } from '@/services/chat_service';
import type { BotType, ChatResponse, DiseaseQuestionsResponse } from '@/services/chat_service';
import { FaCheck, FaCopy, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedDisease, setSelectedDisease] = useState(DISEASE_LABELS[0]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full w-full sm:px-80 px-8 sm:py-8 py-15 mx-auto bg-gray-900 shadow-lg overflow-hidden border-b-2 border-gray-700"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 text-gray-100 p-4 sm:p-6 rounded-3xl mb-2 sm:mb-3"
        >
          <div className="flex justify-between items-center">
            <motion.h2 
              whileHover={{ scale: 1.02 }}
              className="text-xl font-bold"
            >
              Medical Chatbot
            </motion.h2>
            {messages.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearChat}
                className="text-sm text-red-200 bg-red-950 px-3 py-1 rounded-lg hover:text-white border hover:bg-red-950 border-red-500"
              >
                Clear Chat
              </motion.button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
            <div className="flex items-center">
              <label htmlFor="bot-type" className="mr-2">Bot Type:</label>
              <motion.select
                whileHover={{ scale: 1.02 }}
                id="bot-type"
                value={botType}
                onChange={(e) => setBotType(e.target.value as BotType)}
                className="bg-gray-700 text-gray-100 rounded-xl px-2 py-1"
              >
                <option value="local">X-DET-AI-Bot</option>
                <option value="gemini">Gemini Bot</option>
              </motion.select>
            </div>
            <div className="flex items-center">
              <label htmlFor="disease" className="mr-2">Disease:</label>
              <motion.select
                whileHover={{ scale: 1.02 }}
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
              </motion.select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chat messages */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-800 text-gray-100 rounded-t-3xl">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center sm:h-35 h-20 text-gray-400"
            >
              {botType === 'local' ? (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col gap-2"
                >
                  <p>Ask your question about {selectedDisease} or choose from suggested questions below</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col gap-2 text-center"
                >
                  <p>Ask any medical question to the Gemini medical assistant</p>
                  <motion.p 
                    whileHover={{ scale: 1.02 }}
                    className="text-red-200 p-2 bg-red-900/50 rounded-xl text-center"
                  >
                    In Gemini chat you need to provide the disease name and more details
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`inline-block px-4 py-2 rounded-xl max-w-5xl ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-gray-100' 
                        : 'bg-gray-700 text-gray-100'
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
                  </motion.div>
                  {message.sender === 'bot' && message.followup_questions && message.followup_questions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.2 }}
                      className="mt-2"
                    >
                      <p className="text-xs text-gray-400 mb-1">Follow-up questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.followup_questions
                          .slice()
                          .sort(() => Math.random() - 0.5)
                          .slice(0, 3)
                          .map((q, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 58, 138, 0.5)' }}
                              whileTap={{ scale: 0.95 }}
                              onHoverEnd={() => {}}
                              onClick={() => handleSuggestedQuestionClick(q)}
                              className="text-xs bg-gray-800 border border-blue-500 text-gray-100 px-2 py-1 rounded-xl"
                            >
                              {q}
                            </motion.button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (local bot only) */}
        {botType === 'local' && suggestedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 sm:p-6 border-t bg-gray-700/50"
          >
            <motion.div
              whileHover={{ scale: 1.005 }}
              className="p-4 sm:p-6 bg-gray-700/60 rounded-2xl"
            >
              <h3 className="text-sm font-medium text-gray-300 mb-2">Suggested Questions:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {suggestedQuestions.slice(0, 12).map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 58, 138, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onHoverEnd={() => {}}
                    onClick={() => handleSuggestedQuestionClick(question)}
                    className={`text-left text-sm bg-gray-700 text-gray-100 sm:px-3 sm:py-2 px-1 py-1 rounded-xl border border-gray-600 ${
                      index >= 4 ? 'hidden sm:block' : ''
                    }`}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>  
            </motion.div>
          </motion.div>
        )}

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-4 sm:p-6 border-t bg-gray-800 rounded-b-3xl"
        >
          <div className="flex">
            <motion.textarea
              whileFocus={{ borderColor: '#3b82f6' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={botType === 'local' ? `Ask about ${selectedDisease}...` : 'Ask any medical question from Gemini...'}
              className="flex-1 bg-gray-700/80 text-gray-100 rounded-l-xl px-4 py-2 resize-none"
              rows={1}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#3b82f6' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-gray-100 px-4 py-2 rounded-r-xl disabled:bg-blue-900"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-gray-100 mr-2"
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
                </motion.span>
              ) : (
                <div className="flex items-center gap-3">
                  Send
                  <motion.div
                    whileHover={{ x: [0, 2, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaPaperPlane className="h-4 w-4" />
                  </motion.div>
                </div>
              )}
            </motion.button>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-gray-400 mt-2"
          >
            {botType === 'gemini'
              ? 'Gemini provides general medical information in Markdown format'
              : 'Local bot provides information based on available disease data'}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-red-900 bg-opacity-20 text-red-100 p-4 sm:py-10 sm:px-50"
      >
        <h2 className="text-2xl font-bold text-red-100 mb-2">⚠️ Important Disclaimer</h2>
        <p className="text-sm leading-relaxed">
          This AI-powered medical chatbot is intended for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
          <br />
          Always seek the guidance of your doctor or another qualified health provider with any questions you may have regarding a medical condition. Never ignore or delay seeking medical advice because of information you received from this chatbot.
          <br />
          If you are experiencing a medical emergency, please call your local emergency number or go to the nearest hospital immediately.
        </p>
      </motion.div>
    </>
  );
}