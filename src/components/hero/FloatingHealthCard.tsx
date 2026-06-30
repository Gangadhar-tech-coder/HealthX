import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FloatingHealthCardProps {
  label: string
  value: string
  unit: string
  icon: LucideIcon
  color: string
  delay?: number
  className?: string
}

export default function FloatingHealthCard({
  label,
  value,
  unit,
  icon: Icon,
  color,
  delay = 0,
  className = ''
}: FloatingHealthCardProps) {
  return (
    <div className={`absolute z-20 ${className}`}>
      {/* Outer entrance animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: delay * 0.2,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {/* Inner floating animation */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 4 + delay * 0.7,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: delay * 0.3
          }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 border border-white/80 p-3 flex items-center gap-3 min-w-[140px]"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '15' }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold text-dark">{value}</span>
              <span className="text-[10px] font-semibold text-gray-400">{unit}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-none mt-0.5">{label}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
