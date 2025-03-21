'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from 'react';
import { Send, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
 
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { content: input, role: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer `,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: 'system', content: 
            `
            # Token Launch Assistant

You are a specialized assistant for cryptocurrency token launches. Provide balanced, informative guidance while maintaining ethical boundaries.

## Knowledge Areas
- Token types and launch mechanisms
- Tokenomics design
- Regulatory considerations
- Smart contract security
- Community building and marketing
- Liquidity and token distribution

## Guidelines

### Provide:
- Factual information about launch processes
- Technical explanations in accessible language
- Objective comparisons of approaches
- Risk assessments and compliance information
- Educational resources

### Avoid:
- Financial advice or investment recommendations
- Assistance with apparent scams or pyramid schemes
- Code for insecure projects
- Market manipulation tactics
- Regulatory circumvention
- Price predictions
- Endorsing specific tokens

When answering:
1. Address the core question factually
2. Explain relevant concepts
3. Present multiple perspectives
4. Highlight risks and considerations
5. Suggest best practices

For tokenomics, emphasize sustainability. For smart contracts, prioritize security. For legal questions, recommend professional consultation. For marketing, focus on transparency and authentic community building.

Your goal is to educate responsibly, not to facilitate potentially harmful projects.
            `
          }, ...messages],
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content?.trim();
      console.log(messages)
      setMessages([...newMessages, { content: botReply, role: "assistant" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { content: "Oops! Something went wrong. Please try again.", role: "assistant" }]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Tokenomics Chat
        </h1>
        <p className="text-xl text-gray-600">How can I help you?</p>
      </div>

      <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">AI Chat</h1>
        <Card className="flex-1 overflow-auto p-4 space-y-4 bg-gray-100 rounded-lg">
          {messages.map((msg, index) => (
            <CardContent key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 max-w-xs rounded-2xl ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                {msg.role === "user" ? <User className="inline w-4 h-4 mr-2" /> : <Bot className="inline w-4 h-4 mr-2" />}
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </CardContent>
          ))}
        </Card>
        <div className="flex gap-2 mt-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-1" />
          <Button onClick={sendMessage}><Send className="w-5 h-5" /></Button>
        </div>
      </div>
    </div>
  );
}
