import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) {
      alert('Please fill out all required fields.')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormState({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSuccess(false), 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-white min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Contact Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-primary bg-primary/[0.06] rounded-full px-4 py-1.5 mb-4">
            Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark tracking-tight leading-tight">
            Connect with our
            <br />
            <span className="gradient-text">health experts</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
            Have questions about clinical safety, enterprise integration, or just want to send us feedback? Get in touch with our support, sales, or medical advisory teams.
          </p>
        </motion.div>

        {/* Layout: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Info Side (4 cols on lg) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Contact Cards */}
            <motion.div
              variants={staggerItem}
              className="bg-gray-lightest/30 rounded-2xl p-6 border border-gray-100 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark mb-1">Email Support</h3>
                <p className="text-sm text-gray-500 mb-2">For general support, medical info or media requests.</p>
                <a href="mailto:support@healthx-ai.com" className="text-sm font-semibold text-primary hover:underline">
                  support@healthx-ai.com
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="bg-gray-lightest/30 rounded-2xl p-6 border border-gray-100 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark mb-1">Call Support</h3>
                <p className="text-sm text-gray-500 mb-2">Mon-Fri from 9am to 6pm EST.</p>
                <a href="tel:+18005550199" className="text-sm font-semibold text-secondary hover:underline">
                  +1 (800) 555-0199
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="bg-gray-lightest/30 rounded-2xl p-6 border border-gray-100 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark mb-1">HQ Office</h3>
                <p className="text-sm text-gray-500 mb-2">Visit us for corporate queries.</p>
                <address className="text-sm font-semibold text-gray-700 not-italic">
                  100 Innovation Way, Suite 400<br />
                  San Francisco, CA 94107
                </address>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="bg-gray-lightest/30 rounded-2xl p-6 border border-gray-100 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark mb-1">Hours of Operation</h3>
                <p className="text-sm text-gray-500">
                  AI symptom analysis: <strong>24/7/365</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Doctor booking & support: <strong>Mon-Sun 8 AM - 10 PM</strong>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Side (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-lg shadow-gray-100/50"
          >
            <h2 className="text-2xl font-bold text-dark mb-2">Send us a message</h2>
            <p className="text-sm text-gray-400 mb-8">We will reply to your inquiry within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Describe your request in detail..."
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200 resize-y"
                />
              </div>

              {/* Status Display */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-emerald-800"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Thank you! Your message has been sent successfully.</span>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-primary text-white text-sm font-semibold rounded-full px-8 py-3.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>

            </form>
          </motion.div>

        </div>

      </div>
    </div>
  )
}
