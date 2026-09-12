import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { AIRAG } from "../api/AIAPI"

const AIChat = () => {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string, timestamp: Date }[]>([
        { role: 'ai', content: "Hello! I've analyzed your latest financial documents. How can I help you today?", timestamp: new Date() }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
        setIsLoading(true)

        try {
            const response = await AIRAG({ message: userMessage })
            setMessages(prev => [...prev, { role: 'ai', content: response.message || response, timestamp: new Date() }])
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing your request. Please try again.", timestamp: new Date() }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                    <MessageSquare className="text-indigo-600" />
                    AI Financial Assistant
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Ask anything about your financial data, market trends, or risk profiles.</p>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                msg.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                            }`}>
                                {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'ai' 
                                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-tl-none' 
                                        : 'bg-indigo-600 text-white rounded-tr-none'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                                    {msg.role === 'ai' ? 'AI Assistant' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                                <Bot size={18} />
                            </div>
                            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-indigo-600" />
                                <span className="text-sm text-gray-500">AI is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative"
                    >
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Finsight AI..." 
                            disabled={isLoading}
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm disabled:opacity-50"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-gray-400"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <div className="mt-3 flex items-center gap-4 px-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                            <Sparkles size={12} className="text-amber-500" />
                            AI is powered by latest data
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIChat
