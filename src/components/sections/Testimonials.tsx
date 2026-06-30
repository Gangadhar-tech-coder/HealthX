import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { TESTIMONIALS } from '../../constants/data'
import { staggerContainer, staggerItem, fadeInUp } from '../../utils/animations'

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-gray-lightest/30 relative">
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
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Loved by patients
            <br />
            <span className="gradient-text">and doctors</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            See how HealthX AI is helping patients take control of their health journeys and supporting doctors globally.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="bg-white rounded-2xl p-6 border border-gray-100/80 hover:shadow-lg hover:shadow-gray-200/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Profile info */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-dark">{testimonial.name}</h4>
                  <span className="text-[11px] font-medium text-gray-400 block mt-0.5">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
