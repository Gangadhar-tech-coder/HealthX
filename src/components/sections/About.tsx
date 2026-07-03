import { motion } from 'framer-motion'
import { Shield, HeartPulse, Users, Target, Award, Activity } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

const STATS = [
  { label: 'Active Users', value: '500k+', description: 'Trusting HealthX daily for wellness' },
  { label: 'AI Accuracy', value: '94%', description: 'In preliminary clinical evaluations' },
  { label: 'Partner Doctors', value: '1,200+', description: 'Certified specialists nationwide' },
  { label: 'Compliance', value: '100%', description: 'HIPAA & SOC 2 Type II certified' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Privacy & Security First',
    description: 'We leverage state-of-the-art 256-bit encryption and adhere strictly to medical privacy guidelines (HIPAA).',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: HeartPulse,
    title: 'Clinical Rigor',
    description: 'Our AI model is continuously validated and vetted by healthcare professionals and clinical databases.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Users,
    title: 'Patient Empowerment',
    description: 'We believe health information should be accessible to everyone, giving you direct control over your records.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Target,
    title: 'Smart Simplicity',
    description: 'We turn complex clinical data points into readable timelines and action plans you can execute easily.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
]

export default function About() {
  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Hero Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-primary bg-primary/[0.06] rounded-full px-4 py-1.5 mb-4">
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark tracking-tight leading-tight">
            Pioneering the future of
            <br />
            <span className="gradient-text">accessible healthcare</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
            At HealthX AI, we are bridging the gap between individuals and professional medical insights. Our mission is to make smart, clinically-backed preventative care accessible to everyone, anywhere, at any time.
          </p>
        </motion.div>

        {/* Vision & Mission Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-dark">Our Vision</h2>
            <p className="text-gray-500 leading-relaxed text-base sm:text-lg">
              We envision a world where preventative healthcare is proactive, personalized, and painless. By combining cutting-edge LLMs and medical knowledge systems, we enable early symptom analysis that helps users seek clinical support long before symptoms worsen.
            </p>
            <p className="text-gray-500 leading-relaxed text-base">
              HealthX AI acts as a smart health assistant in your pocket, organizing your charts, medication alerts, medical records, and booking calendars into one fluid, HIPAA-secure experience.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-cyan-500/5 p-8 border border-gray-100 shadow-sm flex flex-col justify-center min-h-[300px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-dark">Our Mission</h2>
              <blockquote className="text-xl font-medium text-gray-700 italic border-l-4 border-primary pl-4">
                "To democratize healthcare intelligence and empower individuals to navigate their wellness journeys with clarity and confidence."
              </blockquote>
              <p className="text-gray-500 text-sm">
                Supported by clinical researchers, physicians, and software engineers dedicated to high-compliance and patient-centered engineering.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-28"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="bg-gray-lightest/30 rounded-2xl p-6 border border-gray-100 text-center hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-dark mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values Section */}
        <div className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-dark tracking-tight">Our Core Values</h2>
            <p className="text-gray-500 mt-3">The foundational principles that guide every decision, line of code, and patient interaction.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map((value, idx) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-5 text-primary`}>
                      <Icon className={`w-6 h-6 ${value.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

      </div>
    </div>
  )
}
