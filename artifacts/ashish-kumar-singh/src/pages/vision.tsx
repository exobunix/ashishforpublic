import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tractor, Shield, Briefcase, BookOpen, HeartPulse,
  Wifi, Leaf, Scale, Home, Target, CheckCircle2
} from 'lucide-react';
import { useSite } from '@/context/site-context';

// Icon pool for priorities (cycled)
const PRIORITY_ICONS = [Tractor, Shield, Briefcase, BookOpen, HeartPulse, Wifi, Leaf, Scale, Home, Target, Tractor, Shield];

export default function Vision() {
  const { content } = useSite();
  const { vision } = content;

  return (
    <div className="w-full font-hindi pb-24">
      {/* Hero */}
      <section className="bg-saffron-gradient text-white pt-32 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold font-heading mb-4"
          >
            {vision.heroHeading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-medium max-w-3xl mx-auto"
          >
            "{vision.heroSubtitle}"
          </motion.p>
        </div>
      </section>

      {/* Priorities Grid */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">{vision.prioritiesHeading}</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {vision.priorities.map((item, i) => {
              const Icon = PRIORITY_ICONS[i % PRIORITY_ICONS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold font-heading mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">{vision.roadmapHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {vision.roadmap.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border rounded-2xl p-6 relative overflow-hidden group hover:border-primary transition-colors shadow-sm hover:shadow-md"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                <span className="text-primary font-bold text-sm mb-2 block">{step.phase}</span>
                <h3 className="text-xl font-bold font-heading mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">{vision.achievementsHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vision.achievements.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <CheckCircle2 className="text-primary shrink-0 mt-1" />
                <p className="font-medium text-lg">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sankalp Pledge */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-primary/20 rounded-3xl p-10 shadow-2xl relative"
          >
            <h2 className="text-3xl font-bold font-heading mb-8 text-primary">{vision.pledgeHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {vision.pledges.map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="font-bold">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      {vision.missionStatement && (
        <section className="py-16 bg-saffron-gradient text-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className="text-2xl md:text-3xl font-bold font-hindi italic">
              "{vision.missionStatement}"
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
