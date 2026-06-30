import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '../../constants/data'
import { staggerContainer, staggerItem, fadeInUp } from '../../utils/animations'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white relative">
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
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Simple, transparent
            <br className="hidden sm:inline" />
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Choose the perfect plan tailored to your health tracking and medical consultation needs. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch"
        >
          {PRICING_PLANS.map((plan, index) => {
            const isHighlighted = plan.highlighted

            return (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                className={`rounded-3xl p-8 transition-all duration-300 relative ${
                  isHighlighted
                    ? 'bg-white border-2 border-primary shadow-xl shadow-primary/[0.08] lg:scale-105 z-10'
                    : 'bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/30'
                }`}
              >
                {/* Most Popular Badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold rounded-full px-4 py-1.5 shadow-md uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                {/* Name */}
                <h3 className="text-xl font-bold text-dark">{plan.name}</h3>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-extrabold text-dark">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-gray-400">$</span>
                      <span className="text-4xl font-extrabold text-dark">{plan.price}</span>
                      <span className="text-sm font-medium text-gray-400">{plan.period}</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-3 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="my-6 border-t border-gray-100" />

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isHighlighted ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`mt-8 w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                      : 'bg-gray-50 text-dark border border-gray-200/80 hover:bg-gray-100'
                  }`}
                  onClick={() => alert(`Starting setup for ${plan.name} plan...`)}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
