import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import TrustedBanner from './components/sections/TrustedBanner'
import Features from './components/sections/Features'
import HowItWorks from './components/sections/HowItWorks'
import Dashboard from './components/sections/Dashboard'
import Testimonials from './components/sections/Testimonials'
import Pricing from './components/sections/Pricing'
import FAQ from './components/sections/FAQ'
import CTA from './components/sections/CTA'
import Footer from './components/layout/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Hero />
          <TrustedBanner />
          <Features />
          <HowItWorks />
          <Dashboard />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
