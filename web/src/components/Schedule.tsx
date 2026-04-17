import { motion } from 'framer-motion'

const scheduleItems = [
  { time: '9:00 AM', event: 'Check-in & Registration', tag: 'Start' },
  { time: '9:30 AM', event: 'Opening Ceremony & Warm-Up Aerobics', tag: 'Ceremony' },
  { time: '10:00 AM', event: 'Group Stage Games Begin', tag: 'Basketball' },
  { time: '12:30 PM', event: 'Lunch Break & Board Games Zone Opens', tag: 'Break' },
  { time: '1:30 PM', event: '3-Point Contest & Free Throw Contest', tag: 'Contest' },
  { time: '2:30 PM', event: 'Semi-Finals', tag: 'Basketball' },
  { time: '3:30 PM', event: 'Finals & Championship Game', tag: 'Finals' },
  { time: '4:30 PM', event: 'Awards Ceremony & Closing', tag: 'End' },
]

const tagColors: Record<string, string> = {
  Start: 'bg-accent-green/20 text-accent-green',
  Ceremony: 'bg-purple-500/20 text-purple-400',
  Basketball: 'bg-orange-500/20 text-orange-400',
  Break: 'bg-accent-sky/20 text-accent-sky',
  Contest: 'bg-accent-yellow/20 text-accent-yellow',
  Finals: 'bg-red-500/20 text-red-400',
  End: 'bg-gray-500/20 text-gray-400',
}

export default function Schedule() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-4xl md:text-6xl font-black mb-4">
            Event <span className="text-accent-sky">Schedule</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            A packed day of action from start to finish.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-green via-accent-yellow to-accent-sky" />

          <div className="space-y-6">
            {scheduleItems.map((item, i) => (
              <motion.div
                key={i}
                className="relative flex items-start gap-6 md:gap-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0 w-16 md:w-24 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white border-4 border-navy-900 shadow-lg" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-navy-800/60 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors duration-300">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-mono font-bold text-accent-yellow">
                      {item.time}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagColors[item.tag]}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-lg">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
