import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import { FaTwitter, FaLinkedinIn, FaGithub, FaYoutube } from 'react-icons/fa6'
import { FOOTER_LINKS } from '../../constants/data'
import { fadeInUp } from '../../utils/animations'

export default function Footer() {
  const getFooterLink = (link: string) => {
    switch (link) {
      case 'Features':
        return '/features'
      case 'How It Works':
        return '/how-it-works'
      case 'Pricing':
        return '/pricing'
      case 'About Us':
        return '/about'
      default:
        return null
    }
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
      className="bg-dark text-gray-400 border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Logo & Intro */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary/20 p-1.5 rounded-xl">
                <HeartPulse className="w-6 h-6 text-primary" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                HealthX<span className="text-primary font-light ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-sm">
              Your 24/7 AI Healthcare Companion. Get instant health guidance, symptom analysis, medicine reminders, and secure health record management.
            </p>
            {/* Socials */}
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([columnName, links]) => (
            <div key={columnName} className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
                {columnName}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => {
                  const href = getFooterLink(link)
                  return (
                    <li key={link}>
                      {href ? (
                        <Link
                          to={href}
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {link}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {link}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-white font-semibold text-base">Stay updated with HealthX AI</h4>
            <p className="text-xs text-gray-500 mt-1">Get the latest updates, medical resources and tips sent directly to your inbox.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full bg-white/5 border border-gray-700 px-5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => alert('Thanks for subscribing!')}
              className="bg-primary text-white text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} HealthX AI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">HIPAA Notice</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
