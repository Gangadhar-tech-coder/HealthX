import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { FEATURES } from '../../constants/data'
import { staggerContainer, staggerItem, fadeInUp } from '../../utils/animations'

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white relative">
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
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Everything you need for
            <br className="hidden sm:inline" />
            <span className="gradient-text">smarter healthcare</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Empowering you with clinically-backed AI tools to monitor, manage, and optimize your health journeys effortlessly.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100/80 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-dark mt-5 group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
