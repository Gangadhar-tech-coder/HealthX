import { motion } from 'framer-motion'
import { TIMELINE_STEPS } from '../../constants/data'
import { fadeInUp } from '../../utils/animations'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-gray-lightest/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-primary bg-primary/[0.06] rounded-full px-4 py-1.5 mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Your health journey,
            <br className="hidden sm:inline" />
            <span className="gradient-text">simplified</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Five simple, automated steps designed to guide you from initial symptom checks to full medical recovery.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative mt-12 max-w-4xl mx-auto">
          
          {/* Vertical connection line */}
          {/* Desktop line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/45 to-primary/10 -translate-x-1/2 hidden lg:block pointer-events-none" />
          {/* Mobile line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 lg:hidden pointer-events-none" />

          {/* Timeline Steps */}
          <div className="space-y-12 sm:space-y-16">
            {TIMELINE_STEPS.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <div key={step.step}>
                  {/* Desktop Layout (sm and up) */}
                  <div className="hidden lg:flex items-center justify-between relative w-full">
                    {/* Left Column (Content if Even, Empty if Odd) */}
                    <div className="w-[calc(50%-32px)] flex justify-end">
                      {isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-gray-200 transition-all duration-300 max-w-md w-full text-right flex flex-col items-end"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step.step}</span>
                          <h3 className="text-lg font-bold text-dark mt-1">{step.title}</h3>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Center Node */}
                    <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-lg shadow-primary/20"
                      >
                        {step.step}
                      </motion.div>
                    </div>

                    {/* Right Column (Content if Odd, Empty if Even) */}
                    <div className="w-[calc(50%-32px)] flex justify-start pl-8 lg:pl-0">
                      {!isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md hover:border-gray-200 transition-all duration-300 max-w-md w-full flex flex-col items-start"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {step.step}</span>
                          <h3 className="text-lg font-bold text-dark mt-1">{step.title}</h3>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout (Strict single-column) */}
                  <div className="flex lg:hidden gap-6 items-start">
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-md">
                        {step.step}
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-bold text-dark">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
