import { motion } from 'framer-motion'
import { HeartPulse, Mic, ArrowUp } from 'lucide-react'
import { CHAT_MESSAGES } from '../../constants/data'

export default function ChatInterface() {
  return (
    <div className="w-full max-w-[380px] rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide">HealthX AI</h4>
            <div className="flex items-center gap-1.5 text-xs text-blue-100 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online · Responds Instantly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="bg-gradient-to-b from-gray-50 to-white p-4 space-y-4 min-h-[320px] max-h-[360px] overflow-y-auto">
        {CHAT_MESSAGES.map((msg, index) => {
          const isAssistant = msg.role === 'assistant'
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.8, duration: 0.4 }}
              className={`flex gap-2.5 ${isAssistant ? '' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white rounded-2xl rounded-tl-sm text-gray-700 shadow-sm border border-gray-100'
                      : 'bg-primary text-white rounded-2xl rounded-tr-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span
                  className={`text-[9px] mt-1 ${
                    isAssistant ? 'text-gray-400' : 'text-blue-200 text-right'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </motion.div>
          )
        })}

        {/* Typing Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: CHAT_MESSAGES.length * 0.8, duration: 0.4 }}
          className="flex gap-2.5"
        >
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HeartPulse className="w-4 h-4 text-primary" />
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 typing-dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 typing-dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 typing-dot-3" />
          </div>
        </motion.div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-100 px-4 py-3 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask HealthX anything..."
          disabled
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm border-none outline-none text-gray-400 cursor-not-allowed placeholder:text-gray-400"
        />
        <button
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-not-allowed"
          disabled
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-not-allowed"
          disabled
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
