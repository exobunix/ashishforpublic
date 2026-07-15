import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap, Briefcase, BookOpen, Factory,
  Network, Heart, Flag, MapPin, Award, Vote
} from 'lucide-react';
import profileImg from '@assets/आशीष_कुमार_सिंह_छावनी_विधान_सभा_कानपुर_1783515326447.png';
import { useSite } from '@/context/site-context';
import { renderFormattedText } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Preset icon pool for timeline items (cycled)
const ICONS = [Flag, GraduationCap, Network, Briefcase, BookOpen, Factory, Heart, Vote, MapPin, Award, Flag, Vote];

export default function About() {
  const { content } = useSite();
  const { about } = content;

  return (
    <div className="w-full font-hindi pb-24">
      {/* Page Hero */}
      <section className="bg-saffron-gradient text-white pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold font-heading mb-4"
          >
            {about.heroHeading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-medium"
          >
            {renderFormattedText(about.heroSubtitle)}
          </motion.p>
        </div>
      </section>

      {/* Info Card Section */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="max-w-5xl mx-auto shadow-2xl border-none overflow-hidden bg-white/90 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1 bg-secondary/30 relative min-h-[300px]">
                  <img
                    src={about.profileImage || profileImg}
                    alt="Ashish Kumar Singh"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <CardContent className="md:col-span-2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6 font-heading text-foreground">व्यक्तिगत जानकारी</h2>
                  <div className="space-y-4 text-lg">
                    <div className="grid grid-cols-3 border-b pb-3">
                      <span className="font-bold text-muted-foreground">नाम:</span>
                      <span className="col-span-2 font-medium">{renderFormattedText(about.personalName)}</span>
                    </div>
                    <div className="grid grid-cols-3 border-b pb-3">
                      <span className="font-bold text-muted-foreground">पिता:</span>
                      <span className="col-span-2 font-medium">{renderFormattedText(about.personalFather)}</span>
                    </div>
                    <div className="grid grid-cols-3 border-b pb-3">
                      <span className="font-bold text-muted-foreground">जन्म तिथि:</span>
                      <span className="col-span-2 font-medium">{renderFormattedText(about.personalBirth)}</span>
                    </div>
                    <div className="grid grid-cols-3 border-b pb-3">
                      <span className="font-bold text-muted-foreground">शिक्षा:</span>
                      <span className="col-span-2 font-medium">{renderFormattedText(about.personalEducation)}</span>
                    </div>
                    <div className="grid grid-cols-3 pt-1">
                      <span className="font-bold text-muted-foreground">BJP सक्रिय सदस्यता:</span>
                      <span className="col-span-2 font-medium text-primary">{renderFormattedText(about.personalMembership)}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {about.philosophyCards.map((card, i) => (
              <Card key={i} className={`glass-card hover:-translate-y-1 transition-transform border-t-4 ${
                i === 0 ? 'border-t-primary' : i === 1 ? 'border-t-accent' : 'border-t-[#FFB703]'
              }`}>
                <CardContent className="p-8 text-center">
                  <div className="text-primary font-bold text-xl mb-4 font-heading">{renderFormattedText(card.title)}</div>
                  <p className="text-muted-foreground">{renderFormattedText(card.desc)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      {about.aboutUsHeading && about.aboutUsContent && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground relative inline-block">
                {renderFormattedText(about.aboutUsHeading)}
                <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-saffron-gradient rounded-full transform translate-y-2" />
              </h2>
            </div>
            <Card className="border-none shadow-xl bg-orange-50/20 p-8 md:p-12 rounded-2xl border border-orange-100/55">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center font-medium">
                {renderFormattedText(about.aboutUsContent)}
              </p>
            </Card>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">जीवन यात्रा</h2>
            <p className="text-xl text-muted-foreground">शिक्षा, व्यवसाय से लेकर जनसेवा तक का सफर</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 rounded-full" />

            <div className="space-y-12">
              {about.timelineEvents.map((event, i) => {
                const Icon = ICONS[i % ICONS.length];
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                    className={`flex flex-col md:flex-row items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                        <CardContent className="p-6">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-sm font-bold mb-3">
                            {renderFormattedText(event.year)}
                          </span>
                          <h3 className="text-xl font-bold font-heading mb-2">{renderFormattedText(event.title)}</h3>
                          <p className="text-muted-foreground leading-relaxed">{renderFormattedText(event.desc)}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg shrink-0 mt-6">
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Quote */}
      {about.inspirationQuote && (
        <section className="py-16 bg-saffron-gradient text-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <p className="text-2xl md:text-3xl font-bold font-hindi italic">
              "{renderFormattedText(about.inspirationQuote)}"
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
