import { motion } from 'framer-motion'
import { scaleIn } from '../../utils/animations'

export default function CTA() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main callout card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-cyan-500 p-8 sm:p-12 lg:p-20 text-center shadow-xl shadow-primary/20 animate-gradient"
        >
          {/* Background circle layers for layout depth */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/[0.06] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to Transform
              <br />
              Your Healthcare?
            </h2>
            <p className="text-base sm:text-lg text-blue-100/90 mt-6 leading-relaxed max-w-lg mx-auto">
              Join over 500,000+ individuals who trust HealthX AI for automated daily wellness checkups and secure patient records tracking.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#pricing"
                className="w-full sm:w-auto bg-white text-primary font-bold rounded-full px-8 py-4 text-base shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Free Trial
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Demo booking form coming soon!')}
                className="w-full sm:w-auto border-2 border-white/30 text-white font-bold rounded-full px-8 py-4 text-base hover:bg-white/10 transition-all duration-300"
              >
                Book a Demo
              </motion.button>
            </div>

            {/* Trust disclaimer */}
            <p className="text-xs text-blue-200/70 mt-8 font-medium">
              No credit card required · Free 14-day trial · Cancel anytime
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
