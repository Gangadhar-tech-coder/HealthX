import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Plus,
  MessageSquare,
  AlertTriangle,
  HeartPulse,
  LogOut,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  History,
  Mic,
  Volume2,
  VolumeX
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  checkSymptoms,
  getConversations,
  getConversationMessages,
  Conversation,
  Message
} from '../api/assistant'

const SUPPORTED_LANGS = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Español' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'hi-IN', name: 'हिन्दी' },
  { code: 'te-IN', name: 'తెలుగు' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ar-SA', name: 'العربية' }
]

export default function AssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConvId, setCurrentConvId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingHistory, setFetchingHistory] = useState(false)
  const [username, setUsername] = useState('')

  // Voice Speech States
  const [isListening, setIsListening] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en-US')
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true)
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null)
  const [currentWordRange, setCurrentWordRange] = useState<{ start: number; end: number } | null>(null)

  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const activeSpeakingIdRef = useRef<number | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('username') || 'User'
    setUsername(storedUser)
    loadConversations()

    // 1. Initialize Web Speech API Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = selectedLang

      rec.onstart = () => {
        setIsListening(true)
      }
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          setInput((prev) => {
            const trimmed = prev.trim()
            return trimmed ? `${trimmed} ${transcript}` : transcript
          })
        }
      }
      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      rec.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = rec
    }

    // Clean up Speech Synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
        }
      }
    }
  }, [])

  // 2. Dynamically update Speech Recognition language when state changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLang
    }
  }, [selectedLang])

  // Auto-scroll chat area on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-read on generation is handled directly in handleSend

  // Trigger audio if Auto-Read is toggled back ON (undo mute)
  useEffect(() => {
    if (voiceOutputEnabled && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === 'assistant') {
        const parsed = parseMessageContent(lastMsg)
        speakText(parsed.response_text, lastMsg.id)
      }
    }
  }, [voiceOutputEnabled])

  // Restart speaking in the new language if changing language mid-speech
  useEffect(() => {
    if (activeSpeakingIdRef.current !== null) {
      const speakId = activeSpeakingIdRef.current
      const speakingMsg = messages.find(m => m.id === speakId)
      if (speakingMsg) {
        const parsed = parseMessageContent(speakingMsg)
        speakText(parsed.response_text, speakId, true)
      }
    }
  }, [selectedLang])

  const loadConversations = async () => {
    try {
      const list = await getConversations()
      setConversations(list)
      if (list.length > 0 && currentConvId === null) {
        handleSelectConversation(list[0].id)
      }
    } catch (err) {
      console.error('Failed to load conversations', err)
    }
  }

  const handleSelectConversation = async (id: number) => {
    // Cancel active speaking on thread switch
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      setCurrentlySpeakingId(null)
      setCurrentWordRange(null)
      activeSpeakingIdRef.current = null
    }
    setFetchingHistory(true)
    setCurrentConvId(id)
    try {
      const history = await getConversationMessages(id)
      setMessages(history)

      // Auto-read the last assistant message of the switched thread if enabled
      if (voiceOutputEnabled && history.length > 0) {
        const lastMsg = history[history.length - 1]
        if (lastMsg.role === 'assistant') {
          const parsed = parseMessageContent(lastMsg)
          speakText(parsed.response_text, lastMsg.id, true)
        }
      }
    } catch (err) {
      console.error('Failed to load message history', err)
    } finally {
      setFetchingHistory(false)
    }
  }

  const handleNewChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      setCurrentlySpeakingId(null)
      setCurrentWordRange(null)
      activeSpeakingIdRef.current = null
    }
    setCurrentConvId(null)
    setMessages([])
    setInput('')
  }

  const handleSignOut = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      setCurrentlySpeakingId(null)
      setCurrentWordRange(null)
      activeSpeakingIdRef.current = null
    }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.dispatchEvent(new Event('auth-change'))
    navigate('/login')
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    // Cancel speech synthesis if speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      setCurrentlySpeakingId(null)
      setCurrentWordRange(null)
      activeSpeakingIdRef.current = null
    }

    const userMessage = input.trim()
    setInput('')

    const tempUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages((prev) => [...prev, tempUserMsg])
    setLoading(true)

    try {
      const data = await checkSymptoms(userMessage, currentConvId)
      
      if (currentConvId === null) {
        setCurrentConvId(data.conversation_id)
        loadConversations()
      }

      const tempAiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: JSON.stringify({
          response_text: data.response_text,
          urgency_level: data.urgency_level,
          recommended_action: data.recommended_action
        }),
        created_at: new Date().toISOString()
      }
      setMessages((prev) => [...prev, tempAiMsg])
      
      // Automatically speak out the response immediately if enabled
      if (voiceOutputEnabled) {
        speakText(data.response_text, tempAiMsg.id, true)
      }
    } catch (err) {
      console.error('Symptom check failed', err)
      const errorMsgText = 'Sorry, I encountered an error checking your symptoms. Please try again.'
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: JSON.stringify({
          response_text: errorMsgText,
          urgency_level: 'low',
          recommended_action: 'Retry your submission.'
        }),
        created_at: new Date().toISOString()
      }
      setMessages((prev) => [...prev, errorMsg])
      
      if (voiceOutputEnabled) {
        speakText(errorMsgText, errorMsg.id, true)
      }
    } finally {
      setLoading(false)
    }
  }

  // 4. Web Speech API Speech-to-Text Microphone triggers
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
        }
        setCurrentlySpeakingId(null)
        setCurrentWordRange(null)
        activeSpeakingIdRef.current = null
      }
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error(e)
      }
    }
  }

  // 5. Web Speech API Text-to-Speech speaker helpers with native language matching & word highlighting
  const speakText = (text: string, msgId: number, forceRestart: boolean = false) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech (speech synthesis) is not supported in this browser.')
      return
    }

    if (currentlySpeakingId === msgId && !forceRestart) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      setCurrentlySpeakingId(null)
      setCurrentWordRange(null)
      activeSpeakingIdRef.current = null
      return
    }

    // Set synchronously to block older asynchronous callbacks
    activeSpeakingIdRef.current = msgId

    // Force clear any pending queue
    window.speechSynthesis.cancel()
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    // Wrap in setTimeout to let browser audio thread fully process the cancel signal before queueing speak
    setTimeout(() => {
      // Double check if we were cancelled or changed during the timeout
      if (activeSpeakingIdRef.current !== msgId) return

      // Strip markdown markers (like *, _, #, `) for clean voice reading
      const cleanText = text.replace(/[*_#`~[\]]/g, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)

      // Set voice language locale
      utterance.lang = selectedLang

      // Match browser available native voice engine for non-English languages
      const voices = window.speechSynthesis.getVoices()
      const prefix = selectedLang.split('-')[0]
      const nativeVoice = voices.find(v => 
        v.lang.startsWith(prefix) || 
        v.lang.replace('_', '-').startsWith(prefix)
      )

      if (nativeVoice) {
        utterance.voice = nativeVoice
      }

      utterance.onstart = () => {
        if (activeSpeakingIdRef.current === msgId) {
          setCurrentlySpeakingId(msgId)
          setCurrentWordRange({ start: 0, end: 0 })
        }
      }
      
      utterance.onend = () => {
        if (activeSpeakingIdRef.current === msgId) {
          setCurrentlySpeakingId(null)
          setCurrentWordRange(null)
          activeSpeakingIdRef.current = null
        }
      }
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e)
        if (activeSpeakingIdRef.current === msgId) {
          setCurrentlySpeakingId(null)
          setCurrentWordRange(null)
          activeSpeakingIdRef.current = null
        }
      }

      // Bound word boundary events to set high-performance range values
      utterance.onboundary = (event: any) => {
        if (event.name === 'word' && activeSpeakingIdRef.current === msgId) {
          const charIndex = event.charIndex
          const textAfterIndex = cleanText.substring(charIndex)
          
          // Regex supports letters/apostrophes/Unicode blocks for Latin, Hindi, Telugu, Chinese, Arabic, French, German
          const wordMatch = textAfterIndex.match(/^[\w'\u00C0-\u017F\u0900-\u097F\u0c00-\u0c7f\u0600-\u06FF\u4e00-\u9fa5]+/u)
          const wordLength = wordMatch ? wordMatch[0].length : 0

          setCurrentWordRange({
            start: charIndex,
            end: charIndex + wordLength
          })
        }
      }

      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  // 6. Highlight text renderer based on active boundary range
  const renderHighlightedText = (text: string, msgId: number) => {
    if (currentlySpeakingId !== msgId || !currentWordRange) {
      return <span>{text}</span>
    }
    const { start, end } = currentWordRange
    const part1 = text.substring(0, start)
    const part2 = text.substring(start, end)
    const part3 = text.substring(end)

    return (
      <span>
        {part1}
        <span className="bg-primary/20 text-primary font-semibold px-0.5 rounded transition-all duration-100 animate-pulse">
          {part2}
        </span>
        {part3}
      </span>
    )
  }

  const parseMessageContent = (msg: Message) => {
    if (msg.role === 'user') {
      return { response_text: msg.content }
    }
    try {
      return JSON.parse(msg.content)
    } catch (e) {
      return { response_text: msg.content, urgency_level: 'low', recommended_action: '' }
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-lightest/30 text-dark relative overflow-hidden pt-20">
      
      {/* Sidebar - Thread History */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div className="p-4 flex flex-col flex-grow min-h-0">
          
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-300 rounded-xl py-3 px-4 flex items-center justify-center gap-2.5 font-bold text-sm mb-6 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Symptom Check
          </button>

          {/* Conversation history list */}
          <div className="flex items-center text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 px-1">
            <History className="w-3.5 h-3.5 mr-1.5" />
            Recent Logs
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-1.5 min-h-0 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">No logs saved.</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left rounded-xl p-3 flex items-center justify-between text-sm transition-all duration-200 cursor-pointer ${
                    currentConvId === conv.id
                      ? 'bg-primary/5 text-primary border border-primary/15 font-semibold'
                      : 'hover:bg-gray-50 text-gray-600 hover:text-dark border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentConvId === conv.id ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="truncate">Checkup #{conv.id}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Voice Auto-Read Toggle Switch */}
        <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 bg-gray-50/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bold">Auto-Read Responses</span>
          </div>
          <button
            onClick={() => {
              setVoiceOutputEnabled(!voiceOutputEnabled)
              if (voiceOutputEnabled) {
                window.speechSynthesis.cancel()
                if (window.speechSynthesis.paused) {
                  window.speechSynthesis.resume()
                }
                setCurrentlySpeakingId(null)
                setCurrentWordRange(null)
                activeSpeakingIdRef.current = null
              }
            }}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              voiceOutputEnabled ? 'bg-primary' : 'bg-gray-200'
            }`}
            title="Read new answers aloud automatically"
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                voiceOutputEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-dark truncate">{username}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Chat Interface Area */}
      <section className="flex-grow flex flex-col min-w-0 bg-white relative">
        
        {/* Medical disclaimer header banner */}
        <div className="bg-amber-50/80 border-b border-amber-100/60 py-3 px-4 sm:px-6 flex items-start gap-2.5 text-xs text-amber-800 relative z-10">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">
            MEDICAL DISCLAIMER: This assistant provides general health possibilities based on symptoms. It is not a clinical diagnosis. Always consult a licensed physician or visit an emergency room in high-risk scenarios.
          </span>
        </div>

        {/* Conversation flow viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {fetchingHistory ? (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-xs font-medium text-gray-500">Loading history logs...</span>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome / Prompt state */
            <div className="h-full max-w-2xl mx-auto flex flex-col justify-center items-center text-center space-y-6">
              <div className="bg-primary/10 p-4 rounded-3xl text-primary animate-pulse-glow">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
                  HealthX Symptom Checker
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Hi {username}! Let's check your symptoms. Describe how you are feeling (e.g. pain severity, duration) and get immediate guidance.
                </p>
              </div>

              {/* Sample prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                {[
                  'I have a mild throbbing headache since yesterday morning',
                  'Fever of 101°F accompanied by a dry cough'
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(promptText)}
                    className="p-3 text-left text-xs bg-gray-lightest/50 border border-gray-100 hover:border-primary/20 hover:bg-primary/[0.02] rounded-xl transition-all duration-200 cursor-pointer text-gray-600 hover:text-dark flex items-center justify-between"
                  >
                    <span>{promptText}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Thread Message Bubbles */
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                const parsed = parseMessageContent(msg)
                const isEmergency = parsed.urgency_level === 'emergency'

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isUser
                          ? 'bg-primary text-white'
                          : isEmergency
                          ? 'bg-red-500 text-white'
                          : 'bg-secondary text-white'
                      }`}>
                        {isUser ? username.charAt(0).toUpperCase() : <HeartPulse className="w-4 h-4" />}
                      </div>

                      {/* Message body */}
                      <div className="space-y-2.5 relative">
                        <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm border relative group min-w-[150px] ${
                          isUser
                            ? 'bg-primary text-white border-primary-dark/10'
                            : isEmergency
                            ? 'bg-red-50/90 text-red-900 border-red-200'
                            : 'bg-gray-lightest/40 text-dark border-gray-100'
                        }`}>
                          
                          {/* Speak / Stop Speak Bubble Overlay Button */}
                          {!isUser && (
                            <button
                              onClick={() => speakText(parsed.response_text, msg.id)}
                              className={`absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer ${
                                currentlySpeakingId === msg.id
                                  ? 'opacity-100 text-primary bg-primary/10'
                                  : 'text-gray-400 hover:text-dark hover:bg-gray-200/50'
                              }`}
                              title={currentlySpeakingId === msg.id ? 'Stop Reading' : 'Read Aloud'}
                            >
                              {currentlySpeakingId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Message Text content with Speech Highlight */}
                          <p className={!isUser ? 'pr-6' : ''}>
                            {isUser ? parsed.response_text : renderHighlightedText(parsed.response_text, msg.id)}
                          </p>
                          
                          {/* Recommended Action block for AI responses */}
                          {!isUser && parsed.recommended_action && (
                            <div className={`mt-3 pt-3 border-t text-xs flex flex-col gap-1 ${
                              isEmergency ? 'border-red-200' : 'border-gray-200/50'
                            }`}>
                              <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500">
                                Recommended Action:
                              </span>
                              <span className={isEmergency ? 'text-red-700 font-semibold' : 'text-gray-600'}>
                                {parsed.recommended_action}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Emergency High-risk warning card call-out */}
                        {!isUser && isEmergency && (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-600 text-white rounded-2xl p-4 flex gap-3 items-start border border-red-700 shadow-lg shadow-red-200/40"
                          >
                            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-white animate-bounce mt-0.5" />
                            <div className="space-y-1">
                              <h4 className="text-sm font-extrabold uppercase tracking-wide">
                                CRITICAL WARNING
                              </h4>
                              <p className="text-xs leading-relaxed text-red-50">
                                These symptoms indicate a potentially life-threatening medical emergency. Please dial emergency dispatchers (911) or self-transport to the closest emergency center immediately!
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-lightest/40 border border-gray-100 rounded-2xl p-4 flex items-center gap-1.5 shadow-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot-1" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot-2" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot-3" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input box form */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-3 relative">
            <input
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Describe symptoms by typing or speaking..."
              disabled={loading || fetchingHistory}
              className="flex-grow rounded-full border border-gray-200 pl-5 pr-[215px] py-3.5 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200 disabled:bg-gray-50"
            />
            
            {/* Language Selector Dropdown */}
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value)
              }}
              disabled={loading || fetchingHistory}
              className="absolute right-24 bg-gray-50 border border-gray-200 text-xs text-gray-500 rounded-full px-2.5 py-1.5 focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50 cursor-pointer max-w-[85px] truncate"
              title="Spoken Language"
            >
              {SUPPORTED_LANGS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            {/* STT Microphone Recording Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading || fetchingHistory}
              className={`absolute right-12 p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer disabled:bg-transparent disabled:text-gray-300 ${
                isListening
                  ? 'bg-red-500 text-white shadow-md shadow-red-200/80'
                  : 'text-gray-400 hover:text-primary hover:bg-gray-50'
              }`}
              title={isListening ? 'Stop recording voice' : 'Dictate symptoms'}
            >
              {isListening ? (
                <div className="relative flex items-center justify-center w-5 h-5">
                  <span className="absolute w-7 h-7 rounded-full bg-red-400/50 animate-ping" />
                  <Mic className="w-4 h-4 text-white relative z-10" />
                </div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading || fetchingHistory}
              className="absolute right-2 bg-primary hover:bg-primary-dark text-white rounded-full p-2.5 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </section>
    </div>
  )
}
