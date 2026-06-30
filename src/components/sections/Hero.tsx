import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare, Shield, Sparkles, Clock } from 'lucide-react'
import ChatInterface from '../hero/ChatInterface'
import FloatingHealthCard from '../hero/FloatingHealthCard'
import { HEALTH_CARDS } from '../../constants/data'
import { staggerContainer, staggerItem, slideInRight } from '../../utils/animations'

export default function Hero() {
  const handleTryAssistant = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('how-it-works')
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-white z-10 pt-28 lg:pt-0">
      {/* Background decoration blobs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none -z-10 -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-secondary/[0.02] rounded-full blur-[100px] pointer-events-none -z-10 translate-y-1/4 -translate-x-1/4" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.35]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column - Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:w-[55%] flex flex-col"
          >
            {/* Announcement Badge */}
            <motion.div variants={staggerItem} className="w-fit">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.06] border border-primary/10 px-4 py-1.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                  AI-Powered Healthcare — Now Available
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={staggerItem} 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-extrabold tracking-tight text-dark leading-[1.1] mt-6"
            >
              Your <span className="gradient-text-blue">24/7 AI</span>
              <br className="hidden sm:inline" />
              Healthcare
              <br className="hidden sm:inline" />
              <span className="gradient-text">Companion</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              variants={staggerItem} 
              className="text-base sm:text-lg text-gray-500 max-w-xl mt-6 leading-relaxed"
            >
              Get instant health guidance, symptom analysis, medicine reminders, and secure health record management — anytime, anywhere.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              variants={staggerItem} 
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-full px-8 py-4 font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-dark transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                onClick={handleTryAssistant}
                className="inline-flex items-center justify-center gap-2 bg-white text-dark border border-gray-200 rounded-full px-8 py-4 font-semibold text-base hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 text-gray-500" />
                Try AI Assistant
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={staggerItem} 
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pt-8 border-t border-gray-100"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-primary/60" />
                <span>Secure Health Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-primary/60" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-primary/60" />
                <span>24/7 Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Chat & Floating Cards */}
          <motion.div 
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="lg:w-[45%] flex justify-center items-center relative min-h-[480px] w-full"
          >
            {/* Soft Glow behind Chat */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/[0.06] rounded-full blur-[80px] -z-10" />

            {/* Chat Card */}
            <ChatInterface />

            {/* Floating Health Cards (Hidden on mobile/tablet for clean visual, visible on desktop) */}
            <div className="hidden lg:block">
              {/* Heart Rate */}
              <FloatingHealthCard
                label={HEALTH_CARDS[0].label}
                value={HEALTH_CARDS[0].value}
                unit={HEALTH_CARDS[0].unit}
                icon={HEALTH_CARDS[0].icon}
                color={HEALTH_CARDS[0].color}
                delay={1}
                className="-top-4 -right-10"
              />
              
              {/* Health Score */}
              <FloatingHealthCard
                label={HEALTH_CARDS[1].label}
                value={HEALTH_CARDS[1].value}
                unit={HEALTH_CARDS[1].unit}
                icon={HEALTH_CARDS[1].icon}
                color={HEALTH_CARDS[1].color}
                delay={2}
                className="bottom-4 -left-12"
              />

              {/* Blood Oxygen */}
              <FloatingHealthCard
                label={HEALTH_CARDS[2].label}
                value={HEALTH_CARDS[2].value}
                unit={HEALTH_CARDS[2].unit}
                icon={HEALTH_CARDS[2].icon}
                color={HEALTH_CARDS[2].color}
                delay={3}
                className="top-1/3 -left-16"
              />

              {/* Temperature */}
              <FloatingHealthCard
                label={HEALTH_CARDS[4].label}
                value={HEALTH_CARDS[4].value}
                unit={HEALTH_CARDS[4].unit}
                icon={HEALTH_CARDS[4].icon}
                color={HEALTH_CARDS[4].color}
                delay={4}
                className="-bottom-4 -right-8"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
