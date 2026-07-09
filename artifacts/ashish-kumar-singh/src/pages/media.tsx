import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Image as ImageIcon, Calendar } from 'lucide-react';
import { useSite } from '@/context/site-context';
import { DEFAULT_CONTENT } from '@/lib/site-content';

// Stable placeholder colors
const COLORS = ['bg-primary/20', 'bg-accent/20', 'bg-emerald-500/20', 'bg-blue-500/20'];

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  
  let videoId = '';
  
  if (url.includes('/shorts/')) {
    const parts = url.split('/shorts/');
    if (parts[1]) {
      videoId = parts[1].split('?')[0].split('&')[0];
    }
  } else if (url.includes('v=')) {
    const match = url.match(/[?&]v=([^&#]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1]) {
      videoId = parts[1].split('?')[0].split('&')[0];
    }
  } else if (!url.includes('/') && url.length > 5) {
    videoId = url;
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
}

export default function Media() {
  const { content } = useSite();
  const { media } = content;

  const [activeCategory, setActiveCategory] = useState(media.categories[0] || 'सभी');

  const firstCat = media.categories[0];

  const defaultPhotos = DEFAULT_CONTENT.media.photos || [];
  const photos = media.photos && media.photos.length > 0 ? media.photos : defaultPhotos;

  const filtered = activeCategory === firstCat
    ? photos
    : photos.filter(p => p.category === activeCategory);

  return (
    <div className="w-full font-hindi pb-24">
      {/* Hero */}
      <section className="bg-saffron-gradient text-white pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">{media.heroHeading}</h1>
        <p className="text-xl md:text-2xl font-medium">{media.heroSubtitle}</p>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading mb-8 text-center">{media.photoHeading}</h2>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {media.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map(photo => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-none shadow-md group cursor-pointer">
                    <div className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden w-full h-full">
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full ${photo.color || 'bg-primary/20'} flex items-center justify-center`}>
                          <ImageIcon className="w-12 h-12 text-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span className="text-primary text-sm font-bold">{photo.category}</span>
                        <h4 className="text-white font-medium">{photo.title}</h4>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-24 bg-secondary/30 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">{media.videoHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {media.videos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {video.embedUrl ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(video.embedUrl)}
                      title={video.title}
                      className="w-full aspect-video"
                      allowFullScreen
                    />
                    <div className="p-4 bg-white">
                      <h4 className="font-bold font-heading">{video.title}</h4>
                    </div>
                  </div>
                ) : (
                  <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white">
                    <div className="aspect-video bg-foreground relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/60" />
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors z-10">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold font-heading line-clamp-2">{video.title}</h4>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press & News */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">{media.newsHeading}</h2>
          <div className="space-y-6">
            {media.news.map((news, i) => (
              <Card key={i} className="hover:border-primary transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar size={14} /> <span>{news.date}</span>
                      <span className="px-2 py-0.5 bg-secondary text-foreground rounded text-xs ml-2">{news.source}</span>
                    </div>
                    <h3 className="text-xl font-bold font-heading">{news.title}</h3>
                  </div>
                  <Button variant="outline" className="shrink-0">पूरी खबर पढ़ें</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
