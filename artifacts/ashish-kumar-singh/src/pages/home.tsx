import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { AnimatedCounter } from '@/components/animated-counter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ArrowRight, Heart, Scale, Flame, CheckCircle2 } from 'lucide-react';
import profileImg from '@assets/आशीष_कुमार_सिंह_छावनी_विधान_सभा_कानपुर_1783515326447.png';
import { useSite } from '@/context/site-context';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const CARD_ICONS = [Heart, Scale, Flame];

export default function Home() {
  const [, setLocation] = useLocation();
  const { content } = useSite();
  const { hero, stats, mission, homeTimeline, quoteBanner, joinSection } = content;

  return (
    <div className="w-full overflow-hidden font-hindi">
      {/* Hero Section — pt-24 on all sizes ensures content clears fixed header */}
      <section className="relative min-h-[100dvh] pt-24 flex items-center bg-secondary/30 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="order-2 md:order-1 space-y-8"
            >
              <motion.div variants={fadeUp} className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 text-primary font-medium text-sm shadow-sm">
                  <Flame size={16} className="text-[#FF9933]" />
                  {hero.partyBadge}
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground leading-tight">
                  {hero.headline.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-gradient">{hero.headline.split(' ').slice(-1)[0]}</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-medium">{hero.subheading}</p>
                <div className="pt-4 pb-2">
                  <p className="text-2xl font-serif italic text-primary/80 border-l-4 border-primary pl-4">
                    "{hero.quote}"
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full text-lg px-8 shadow-xl shadow-primary/20" onClick={() => setLocation('/about')}>
                  {hero.cta1} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-lg px-8 bg-white/50 backdrop-blur-sm" onClick={() => setLocation('/contact')}>
                  {hero.cta2}
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full text-lg px-6 hover:bg-white/50" onClick={() => setLocation('/vision')}>
                  <Play className="mr-2 w-5 h-5 text-primary" /> {hero.cta3}
                </Button>
              </motion.div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-1 md:order-2 flex justify-center md:justify-end relative"
            >
              <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-t from-primary/20 to-transparent">
                <img
                  src={hero.profileImage || profileImg}
                  alt="Ashish Kumar Singh"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 md:bottom-12 md:-left-12 glass-card p-4 rounded-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{hero.floatingBadgeTitle}</p>
                  <p className="text-sm text-muted-foreground">{hero.floatingBadgeSub}</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-foreground text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-4"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm md:text-base text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-primary font-bold text-lg mb-2">{mission.sectionLabel}</motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">
              {mission.heading}
            </motion.h3>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
              {mission.description}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {mission.cards.map((item, i) => {
              const Icon = CARD_ICONS[i % CARD_ICONS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="h-full border-none shadow-xl shadow-primary/5 hover:-translate-y-2 transition-transform duration-300 bg-secondary/20">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center text-primary mb-6 rotate-3">
                        <Icon size={32} />
                      </div>
                      <h4 className="text-2xl font-bold mb-4 font-heading">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {mission.coreValues.map((value, i) => (
              <span key={i} className="px-6 py-3 rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20">
                {value}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="py-24 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-primary font-bold text-lg mb-2">{homeTimeline.heading}</h2>
              <h3 className="text-4xl md:text-5xl font-bold font-heading text-foreground">{homeTimeline.subheading}</h3>
            </div>
            <Button variant="outline" className="rounded-full bg-white" onClick={() => setLocation('/about')}>
              {homeTimeline.ctaLabel} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeTimeline.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 md:pl-0 md:pt-12"
              >
                <div className="hidden md:block absolute top-0 left-0 right-0 h-1 bg-border" />
                <div className="hidden md:block absolute top-[-6px] left-8 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                <div className="md:hidden absolute top-0 left-[11px] bottom-0 w-1 bg-border" />
                <div className="md:hidden absolute top-2 left-0 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                <div className="glass-card p-6 rounded-2xl relative z-10 md:mt-4 bg-white/60">
                  <span className="inline-block px-3 py-1 rounded bg-foreground text-white text-sm font-bold mb-3">{item.year}</span>
                  <h4 className="text-xl font-bold mb-2 font-heading">{item.title}</h4>
                  <p className="text-muted-foreground">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-24 bg-saffron-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <svg className="w-16 h-16 mx-auto mb-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-3xl md:text-5xl font-bold leading-tight font-hindi mb-8">
              "{quoteBanner}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA / Join Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-foreground text-white rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">{joinSection.heading}</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{joinSection.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input type="text" placeholder="आपका नाम"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-primary text-white" />
                <input type="tel" placeholder="मोबाइल नंबर"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-primary text-white" />
                <Button size="lg" className="rounded-full px-8 py-4 h-auto text-lg w-full sm:w-auto">
                  {joinSection.ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
