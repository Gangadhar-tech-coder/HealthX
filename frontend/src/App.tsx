import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import ScrollToTop from './components/layout/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Section imports
import Hero from './components/sections/Hero'
import TrustedBanner from './components/sections/TrustedBanner'
import Features from './components/sections/Features'
import HowItWorks from './components/sections/HowItWorks'
import Dashboard from './components/sections/Dashboard'
import Testimonials from './components/sections/Testimonials'
import Pricing from './components/sections/Pricing'
import FAQ from './components/sections/FAQ'
import CTA from './components/sections/CTA'
import About from './components/sections/About'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'

// Page imports
import AuthPage from './pages/AuthPage'
import AssistantPage from './pages/AssistantPage'
import AppointmentsPage from './pages/AppointmentsPage'

function Home() {
  return (
    <>
      <Hero />
      <TrustedBanner />
      <Features />
      <HowItWorks />
      <Dashboard />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  )
}

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route
              path="/features"
              element={
                <PageTransition>
                  <div className="pt-20">
                    <Features />
                  </div>
                </PageTransition>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <PageTransition>
                  <div className="pt-20">
                    <HowItWorks />
                  </div>
                </PageTransition>
              }
            />
            <Route
              path="/pricing"
              element={
                <PageTransition>
                  <div className="pt-20">
                    <Pricing />
                  </div>
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <div className="pt-20">
                    <About />
                  </div>
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <div className="pt-20">
                    <Contact />
                  </div>
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <AuthPage />
                </PageTransition>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AssistantPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AppointmentsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {location.pathname !== '/assistant' && <Footer />}
    </div>
  )
}

export default App
