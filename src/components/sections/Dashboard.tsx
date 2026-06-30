import { motion } from 'framer-motion'
import { DASHBOARD_CARDS } from '../../constants/data'
import { scaleIn, fadeInUp } from '../../utils/animations'

export default function Dashboard() {
  const mockWeeklyData = [65, 80, 55, 90, 75, 85, 70]
  const mockWeeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Sparkline generator helper
  const renderSparkline = (data: number[], strokeColor: string) => {
    if (!data || data.length === 0) return null
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const width = 100
    const height = 40
    const padding = 2

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - padding - ((val - min) / range) * (height - 2 * padding)
      return `${x},${y}`
    })

    const polylinePoints = points.join(' ')
    const fillPoints = `0,${height} ${polylinePoints} ${width},${height}`

    return (
      <svg className="w-full h-10 mt-3" viewBox={`0 0 ${width} ${height}`}>
        {/* Shaded Area */}
        <polygon
          points={fillPoints}
          style={{ fill: strokeColor, opacity: 0.06 }}
        />
        {/* Stroke Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Helper to map color names to hex codes for inline styling
  const getColorHex = (colorClass: string) => {
    if (colorClass.includes('red-500')) return '#EF4444'
    if (colorClass.includes('indigo-500')) return '#6366F1'
    if (colorClass.includes('blue-500')) return '#3B82F6'
    if (colorClass.includes('orange-500')) return '#F97316'
    if (colorClass.includes('emerald-500')) return '#10B981'
    if (colorClass.includes('violet-500')) return '#8B5CF6'
    return '#3B82F6'
  }

  return (
    <section id="about" className="py-24 lg:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-primary bg-primary/[0.06] rounded-full px-4 py-1.5 mb-4">
            AI Dashboard
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
            Your health,
            <br />
            <span className="gradient-text">at a glance</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            A comprehensive, patient-centered analytics dashboard designed to monitor and visualize your health trends.
          </p>
        </motion.div>

        {/* Dashboard Mockup Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden mt-12"
        >
          {/* Mockup Windows Header bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-xs font-semibold text-gray-400">HealthX Patient Portal</span>
            <span className="text-xs text-gray-400 font-medium">Mon, Jun 30, 2026</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DASHBOARD_CARDS.map((card, index) => {
              const Icon = card.icon
              const isPositive = card.trend.includes('+') || card.trend.includes('Normal')
              const hexColor = getColorHex(card.color)

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200/80 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 leading-none">{card.label}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {card.trend}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-xl sm:text-2xl font-extrabold text-dark">{card.value}</span>
                      <span className="text-xs font-medium text-gray-400">{card.unit}</span>
                    </div>
                  </div>

                  {/* Sparkline (if present) */}
                  {card.data && card.data.length > 0 ? (
                    renderSparkline(card.data, hexColor)
                  ) : (
                    <div className="h-10 mt-3 flex items-center">
                      <div className="w-full bg-gray-50 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: card.label === 'Appointments' ? '75%' : '50%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bar Chart Section */}
          <div className="mt-6 rounded-2xl border border-gray-100 p-5">
            <h4 className="text-sm font-bold text-dark mb-5">Weekly Calorie Deficit & Activity Trend</h4>
            <div className="flex items-end justify-between gap-3 h-[140px] pt-4">
              {mockWeeklyData.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5 flex-1 group cursor-pointer">
                  {/* Visual Bar container */}
                  <div className="w-full bg-gray-50 rounded-t-lg h-full flex items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary group-hover:from-primary group-hover:to-primary-light transition-all duration-300"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-dark transition-colors">
                    {mockWeeklyDays[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
