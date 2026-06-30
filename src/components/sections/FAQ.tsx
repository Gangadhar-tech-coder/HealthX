import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '../../constants/data'
import { fadeInUp } from '../../utils/animations'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gray-lightest/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-primary bg-primary/[0.06] rounded-full px-4 py-1.5 mb-4">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Frequently asked
            <br className="hidden sm:inline" />
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Quick answers to common questions about HealthX AI diagnostics, pricing, medical compliance, and data security.
          </p>
        </motion.div>

        {/* Accordion FAQ list */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div key={index} className="first:pt-0 last:pb-0 py-1">
                  {/* Trigger Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-5 text-left group focus:outline-none"
                  >
                    <span className="text-base font-bold text-dark group-hover:text-primary transition-colors duration-200">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 group-hover:text-primary transition-all duration-300 flex-shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-primary' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {/* Collapsible Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 text-sm text-gray-500 leading-relaxed max-w-[90%]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
