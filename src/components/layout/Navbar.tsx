import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse, Menu, X } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { NAV_LINKS } from '../../constants/data'

export default function Navbar() {
  const { isScrolled } = useScrollPosition()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.getElementById(href.slice(1))
    if (element) {
      const offset = 80 // navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-2 group"
          >
            <div className="bg-primary/10 p-1.5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-dark flex items-center">
              HealthX<span className="text-primary font-light ml-0.5">AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm font-medium text-gray-600 hover:text-dark transition-colors py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, '#pricing')}
              className="text-sm font-medium text-gray-600 hover:text-dark transition-colors"
            >
              Sign In
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, '#pricing')}
              className="bg-primary text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-dark focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg z-45 md:hidden flex flex-col px-6 py-8 gap-6 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-50"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <a
                href="#pricing"
                onClick={(e) => handleNavClick(e, '#pricing')}
                className="text-center text-base font-semibold text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                Sign In
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleNavClick(e, '#pricing')}
                className="text-center bg-primary text-white text-base font-semibold rounded-full py-3.5 hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
