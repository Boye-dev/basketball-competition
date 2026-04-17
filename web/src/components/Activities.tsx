import { motion } from 'framer-motion'
import { Dribbble, Heart, Dice5 } from 'lucide-react'

const activities = [
  {
    icon: Dribbble,
    title: 'Basketball',
    description: 'Full-court 5v5 tournament with knockout rounds. Show your team\'s dominance on the court.',
    gradient: 'from-orange-500 to-red-600',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    icon: Heart,
    title: 'Aerobics',
    description: 'High-energy group fitness sessions to warm up and keep the crowd moving between games.',
    gradient: 'from-pink-500 to-purple-600',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    icon: Dice5,
    title: 'Board Games',
    description: 'Chill out zone with chess, scrabble, and card games. Perfect for downtime between matches.',
    gradient: 'from-accent-green to-emerald-600',
    shadowColor: 'shadow-green-500/20',
  },
]

export default function Activities() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-navy-800/50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-4xl md:text-6xl font-black mb-4">
            What&apos;s <span className="text-accent-green">Happening</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            More than just basketball — a full day of fun activities for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.title}
              className={`group relative p-8 rounded-2xl bg-navy-900/80 border border-white/5 hover:border-white/10 transition-all duration-500 ${activity.shadowColor} hover:shadow-xl`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${activity.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <activity.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3 text-white group-hover:text-accent-yellow transition-colors duration-300">
                {activity.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {activity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
