"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  RefreshCw,
  Bot,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash2,
  Sparkles,
} from "lucide-react";
import axios from "axios";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
}

interface ChatbotInterfaceProps {
  mapid?: number;
  locationName?: string;
  className?: string;
}

export const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({
  mapid,
  locationName,
  className = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://crimewatch-be-production.up.railway.app/";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "bot",
        content: `Halo! Saya adalah asisten AI keamanan wisata. ${
          locationName
            ? `Saya dapat membantu Anda dengan informasi keamanan tentang ${locationName}.`
            : "Saya dapat membantu Anda dengan informasi keamanan."
        } Silakan ajukan pertanyaan Anda!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [locationName]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (!mapid && !locationName) {
      alert("Lokasi belum dipilih. Silakan pilih lokasi terlebih dahulu.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      type: "bot",
      content: "Sedang menganalisis data...",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/chatbot`, {
        mapid: mapid || 1,
        question: inputMessage,
      });

      const data = response.data;

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content:
          data.reply ||
          "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [...filtered, botMessage];
      });
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "bot",
        content:
          "Maaf, terjadi kesalahan dalam memproses pertanyaan Anda. Silakan coba lagi.",
        timestamp: new Date(),
        error: true,
      };

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [...filtered, errorMessage];
      });

      setIsConnected(false);
      setTimeout(() => setIsConnected(true), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome-new",
      type: "bot",
      content: `Halo! Saya adalah asisten AI keamanan wisata. ${
        locationName
          ? `Saya dapat membantu Anda dengan informasi keamanan tentang ${locationName}.`
          : "Saya dapat membantu Anda dengan informasi keamanan."
      } Silakan ajukan pertanyaan Anda!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const suggestedQuestions = [
    "Bagaimana tingkat keamanan di lokasi ini?",
    "Jenis kejahatan apa yang paling sering terjadi?",
    "Kapan waktu yang paling aman untuk berkunjung?",
    "Apa saja tips keamanan untuk wisatawan?",
    "Bagaimana tren kejahatan dalam 3 bulan terakhir?",
  ];

  return (
    <Card
      className={`flex flex-col h-full border-0 shadow-lg bg-white ${className}`}
    >
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 pt-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Asisten AI Keamanan
              </h3>
              {locationName && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="w-3 h-3" />
                  {locationName}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="text-xs px-2 py-1"
            >
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-white/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0 min-h-0">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                    : message.error
                    ? "bg-red-50 text-red-800 border border-red-200 rounded-2xl rounded-bl-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm"
                } p-4`}
              >
                <div className="flex items-start gap-3">
                  {message.type === "bot" && (
                    <div className="p-1 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                      <Clock className="w-3 h-3" />
                      {formatTime(message.timestamp)}
                      {message.isLoading && (
                        <RefreshCw className="w-3 h-3 animate-spin ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t bg-white">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Pertanyaan yang disarankan:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto p-2 rounded-full border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 bg-transparent"
                  onClick={() => setInputMessage(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanyakan tentang keamanan lokasi..."
                disabled={isLoading || !isConnected}
                className="pr-12 rounded-full border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !isConnected}
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 rounded-full p-0"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotInterface;
