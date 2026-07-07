import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ReactNode } from 'react'

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1]

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 80, // Slide in from right
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeCurve,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: -80, // Slide out to left
    transition: {
      duration: 0.5,
      ease: easeCurve,
    },
  },
}

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
