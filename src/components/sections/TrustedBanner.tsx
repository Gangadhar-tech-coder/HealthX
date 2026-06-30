import { ShieldCheck, Lock, Users, Award, ShieldAlert } from 'lucide-react'
import { TRUST_ITEMS } from '../../constants/data'

export default function TrustedBanner() {
  // Map index to a premium icon for visual interest
  const getIcon = (item: string) => {
    if (item.includes('HIPAA') || item.includes('SOC 2')) {
      return <ShieldCheck className="w-4.5 h-4.5 text-primary/70 flex-shrink-0" />
    }
    if (item.includes('Encryption')) {
      return <Lock className="w-4.5 h-4.5 text-primary/70 flex-shrink-0" />
    }
    if (item.includes('Users')) {
      return <Users className="w-4.5 h-4.5 text-primary/70 flex-shrink-0" />
    }
    if (item.includes('FDA')) {
      return <Award className="w-4.5 h-4.5 text-primary/70 flex-shrink-0" />
    }
    return <ShieldAlert className="w-4.5 h-4.5 text-primary/70 flex-shrink-0" />
  }

  // Double the list to support seamless scrolling marquee
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <section className="relative py-6 border-y border-gray-100 bg-gray-lightest/50 overflow-hidden select-none">
      {/* Left Gradient Overlay Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      
      {/* Right Gradient Overlay Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Marquee Wrapper */}
      <div className="flex overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee py-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {getIcon(item)}
              <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                {item}
              </span>
              <span className="text-gray-300 ml-8">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
