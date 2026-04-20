import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'

const infoCards = [
  {
    icon: Calendar,
    label: 'Date',
    value: 'May 7-9, 2026',
    color: 'text-accent-yellow',
    bg: 'bg-accent-yellow/10',
    border: 'border-accent-yellow/20',
  },
  {
    icon: Clock,
    label: 'Time',
    value: '4:30 PM',
    color: 'text-accent-green',
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/20',
  },
  {
    icon: MapPin,
    label: 'Venue',
    value: 'Unilorin Campus',
    color: 'text-accent-sky',
    bg: 'bg-accent-sky/10',
    border: 'border-accent-sky/20',
  },
]

export default function EventInfo() {
  return (
    <section id="event-info" className="relative py-24 overflow-hidden">
      {/* Angled top divider */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-navy-900 -skew-y-2 origin-top-left" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-4xl md:text-6xl font-black mb-4">
            Event <span className="text-accent-yellow">Details</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Mark your calendar and get ready for an unforgettable day of competition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {infoCards.map((card, i) => (
            <motion.div
              key={card.label}
              className={`relative p-8 rounded-2xl ${card.bg} border ${card.border} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <card.icon className={`w-10 h-10 ${card.color} mb-4`} />
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
                {card.label}
              </p>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
