import {
  Activity, Pill, CalendarDays, ShieldAlert, BarChart3,
  FileText, Mic, ScanLine, Heart, Moon, Droplets,
  Flame, Clock, Thermometer, Footprints
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Appointments', href: '/appointments' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const FEATURES = [
  {
    icon: Activity,
    title: 'AI Symptom Checker',
    description: 'Describe your symptoms and get instant, AI-powered analysis with potential conditions and next steps.',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Pill,
    title: 'Medication Reminder',
    description: 'Never miss a dose. Smart reminders with drug interaction alerts and refill notifications.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: CalendarDays,
    title: 'Appointment Scheduling',
    description: 'Book appointments with top-rated doctors in your area. Integrated calendar with smart rescheduling.',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: ShieldAlert,
    title: 'Emergency Support',
    description: '24/7 emergency guidance with real-time triage, nearest hospital routing, and emergency contacts.',
    gradient: 'from-red-500/10 to-orange-500/10',
    iconColor: 'text-red-500',
  },
  {
    icon: BarChart3,
    title: 'Health Analytics',
    description: 'Comprehensive dashboards tracking vitals, trends, and personalized health insights over time.',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: FileText,
    title: 'Medical History',
    description: 'Securely store and access your complete medical records, lab results, and treatment history.',
    gradient: 'from-sky-500/10 to-blue-500/10',
    iconColor: 'text-sky-500',
  },
  {
    icon: Mic,
    title: 'Voice AI Assistant',
    description: 'Hands-free health companion. Ask questions, log symptoms, and get guidance using natural voice.',
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconColor: 'text-pink-500',
  },
  {
    icon: ScanLine,
    title: 'Prescription Scanner',
    description: 'Scan prescriptions with your camera. Get dosage info, side effects, and generic alternatives instantly.',
    gradient: 'from-indigo-500/10 to-violet-500/10',
    iconColor: 'text-indigo-500',
  },
]

export const TIMELINE_STEPS = [
  {
    step: 1,
    title: 'Describe Symptoms',
    description: 'Tell our AI assistant about your symptoms using text or voice. Be as detailed as you\'d like.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes your symptoms against millions of medical data points in seconds.',
    icon: Activity,
  },
  {
    step: 3,
    title: 'Get Recommendations',
    description: 'Receive personalized health recommendations, potential conditions, and suggested next steps.',
    icon: BarChart3,
  },
  {
    step: 4,
    title: 'Book a Doctor',
    description: 'If needed, book an appointment with a specialist directly through the app. No phone calls.',
    icon: CalendarDays,
  },
  {
    step: 5,
    title: 'Track Recovery',
    description: 'Monitor your recovery progress with AI-powered tracking and follow-up recommendations.',
    icon: Heart,
  },
]

export const DASHBOARD_CARDS = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', trend: '+2%', data: [65, 70, 68, 72, 74, 71, 72] },
  { label: 'Sleep', value: '7.5', unit: 'hrs', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+12%', data: [6, 7, 6.5, 8, 7, 7.5, 7.5] },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Normal', data: [125, 122, 118, 120, 119, 121, 120] },
  { label: 'Calories', value: '2,150', unit: 'kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', trend: '-5%', data: [2200, 2100, 2300, 2000, 2150, 2250, 2150] },
  { label: 'Appointments', value: '3', unit: 'upcoming', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: 'This week', data: [] },
  { label: 'Medications', value: '4', unit: 'active', icon: Pill, color: 'text-violet-500', bg: 'bg-violet-50', trend: '2 today', data: [] },
]

export const HEALTH_CARDS = [
  { label: 'Heart Rate', value: '72', unit: 'BPM', icon: Heart, color: '#EF4444' },
  { label: 'Health Score', value: '94', unit: 'Excellent', icon: Activity, color: '#10B981' },
  { label: 'Blood Oxygen', value: '98', unit: '%', icon: Droplets, color: '#3B82F6' },
  { label: 'Daily Activity', value: '8,500', unit: 'Steps', icon: Footprints, color: '#F59E0B' },
  { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: '#8B5CF6' },
]

export const CHAT_MESSAGES = [
  {
    role: 'assistant' as const,
    content: "Hello! I'm your HealthX AI assistant. How are you feeling today?",
    time: '9:00 AM',
  },
  {
    role: 'user' as const,
    content: "I've had a headache and slight fever since yesterday evening.",
    time: '9:01 AM',
  },
  {
    role: 'assistant' as const,
    content: "I understand. Let me ask a few questions to better assess your symptoms. How high is your fever, and have you experienced any neck stiffness or sensitivity to light?",
    time: '9:02 AM',
  },
  {
    role: 'user' as const,
    content: "Temperature is 98.4°C. No stiffness, a little light-sensitive.",
    time: '9:03 AM',
  },
  {
    role: 'assistant' as const,
    content: "Based on your symptoms, this appears consistent with a viral illness. I recommend rest, hydration, and paracetamol for comfort. I'll set a symptom check reminder in 6 hours.",
    time: '9:04 AM',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Cardiologist, Mayo Clinic',
    content: 'HealthX AI has transformed how I communicate with patients between visits. The symptom tracking is remarkably accurate and helps me make better-informed decisions.',
    rating: 5,
    avatar: 'SC',
  },
  {
    name: 'James Rodriguez',
    role: 'Patient, Type 2 Diabetes',
    content: "Managing my diabetes has never been easier. The medication reminders and blood sugar tracking have helped me maintain consistently better A1C levels.",
    rating: 5,
    avatar: 'JR',
  },
  {
    name: 'Emily Watson',
    role: 'Nurse Practitioner',
    content: "The AI analysis is impressively thorough. It catches patterns that might take us weeks to notice. It's like having a brilliant colleague available 24/7.",
    rating: 5,
    avatar: 'EW',
  },
  {
    name: 'Michael Park',
    role: 'Healthcare CTO',
    content: 'We integrated HealthX AI across our hospital network. Patient satisfaction scores improved by 40% and readmission rates dropped significantly.',
    rating: 5,
    avatar: 'MP',
  },
  {
    name: 'Aisha Patel',
    role: 'Mother of three',
    content: "As a busy mom, having 24/7 access to reliable health guidance is invaluable. The voice assistant is so natural — my kids actually enjoy their health check-ins.",
    rating: 5,
    avatar: 'AP',
  },
  {
    name: 'Dr. Robert Kim',
    role: 'Family Physician',
    content: 'The prescription scanner alone saves my patients hours. Add in the analytics dashboard and appointment scheduling — this is the future of healthcare.',
    rating: 5,
    avatar: 'RK',
  },
]

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 0,
    period: 'Forever free',
    description: 'Perfect for individuals getting started with AI-powered health tracking.',
    features: [
      'Basic symptom checker',
      '3 health reports/month',
      'Medication reminders',
      'Basic health analytics',
      'Email support',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 19,
    period: '/month',
    description: 'For health-conscious individuals who want the full AI healthcare experience.',
    features: [
      'Unlimited AI consultations',
      'Advanced health analytics',
      'Voice AI assistant',
      'Prescription scanner',
      'Priority doctor booking',
      'Family sharing (up to 4)',
      'Export health reports',
      '24/7 priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 49,
    period: '/user/month',
    description: 'For healthcare organizations and large teams needing advanced integrations.',
    features: [
      'Everything in Pro',
      'HIPAA-compliant API',
      'Custom AI model training',
      'EHR/EMR integration',
      'Admin dashboard',
      'Dedicated account manager',
      'SLA guarantee (99.99%)',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export const FAQ_ITEMS = [
  {
    question: 'Is HealthX AI a replacement for my doctor?',
    answer: 'No. HealthX AI is designed to complement, not replace, professional medical care. Our AI provides preliminary analysis and health guidance, but always recommends consulting with healthcare professionals for diagnosis and treatment.',
  },
  {
    question: 'How does HealthX AI protect my health data?',
    answer: 'We use 256-bit AES encryption, are HIPAA and SOC 2 Type II compliant, and FDA Class II cleared. Your data is stored on secure, isolated servers with strict access controls. We never sell or share your personal health information.',
  },
  {
    question: 'How accurate is the AI symptom checker?',
    answer: 'Our AI has been trained on over 10 million anonymized medical cases and is continuously improved by our team of physicians. In clinical trials, it achieved 94% accuracy in preliminary assessments. However, it should always be used as a starting point, not a definitive diagnosis.',
  },
  {
    question: 'Can I share my account with family members?',
    answer: 'Yes! The Pro plan supports family sharing for up to 4 members. Each family member gets their own private health profile while sharing the subscription. Enterprise plans support unlimited team members.',
  },
  {
    question: 'What happens if I need emergency medical help?',
    answer: "HealthX AI includes an emergency triage feature that can identify potentially urgent symptoms and guide you to call emergency services. It can also share your medical history and current symptoms with emergency responders if you consent.",
  },
  {
    question: 'Can I integrate HealthX AI with my wearable devices?',
    answer: 'Yes! We support Apple Watch, Fitbit, Garmin, Samsung Galaxy Watch, and other popular wearables. Health data from your devices is automatically synced to provide more accurate AI analysis and health recommendations.',
  },
]

export const TRUST_ITEMS = [
  'HIPAA Compliant',
  'SOC 2 Type II Certified',
  '256-bit Encryption',
  'FDA Class II Cleared',
  'Trusted by 500,000+ Users',
  'GDPR Compliant',
  '99.99% Uptime SLA',
]

export const FOOTER_LINKS = {
  'Quick Links': ['Features', 'How It Works', 'Pricing', 'Download App'],
  'Resources': ['Documentation', 'API Reference', 'Health Blog', 'Case Studies'],
  'Company': ['About Us', 'Careers', 'Press Kit', 'Partners'],
  'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Notice'],
}
