import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { useSite } from '@/context/site-context';

// BJP-style lotus SVG
const LotusIcon = () => (
  <svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    {/* Center tall petal */}
    <path d="M20 38C20 38 15 28 15 20C15 14.5 17 11 20 11C23 11 25 14.5 25 20C25 28 20 38 20 38Z" fill="white"/>
    {/* Left-center petal */}
    <path d="M20 35C20 35 9 27.5 7 18.5C5.5 12.5 8.5 9 12 10C14.5 10.5 16.5 14.5 17.5 19.5C18.5 24.5 20 35 20 35Z" fill="white" opacity="0.9"/>
    {/* Right-center petal */}
    <path d="M20 35C20 35 31 27.5 33 18.5C34.5 12.5 31.5 9 28 10C25.5 10.5 23.5 14.5 22.5 19.5C21.5 24.5 20 35 20 35Z" fill="white" opacity="0.9"/>
    {/* Far left petal */}
    <path d="M20 30C20 30 6 22.5 4 12.5C3 7 6.5 4 10.5 5.5C13.5 7 15.5 13 17 18.5C18.5 24 20 30 20 30Z" fill="white" opacity="0.72"/>
    {/* Far right petal */}
    <path d="M20 30C20 30 34 22.5 36 12.5C37 7 33.5 4 29.5 5.5C26.5 7 24.5 13 23 18.5C21.5 24 20 30 20 30Z" fill="white" opacity="0.72"/>
    {/* Stamen circle */}
    <circle cx="20" cy="20" r="4.5" fill="white"/>
    <circle cx="20" cy="20" r="2.5" fill="#FF7E54" opacity="0.55"/>
  </svg>
);

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { content } = useSite();
  const { general, nav, whatsapp, contactInfo, socialMedia, footer } = content;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
              {general.logoUrl ? (
                <img src={general.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <LotusIcon />
              )}
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors font-hindi">
                {general.siteName}
              </h1>
              <p className={`text-xs font-hindi transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                {general.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-hindi font-medium text-[15px] transition-all hover:text-primary ${
                  location === link.path
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-foreground'
                    : 'text-foreground/90'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              className="rounded-full px-6 font-hindi font-medium"
              onClick={() => setLocation('/contact')}
            >
              {general.navCtaLabel}
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-zinc-900 border-t"
            >
              <div className="flex flex-col py-4 px-4 gap-4">
                {nav.links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`font-hindi text-lg font-medium p-2 rounded-md ${
                      location === link.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-[4px] border-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white">
                  <LotusIcon />
                </div>
                <h2 className="font-heading font-bold text-2xl font-hindi">{general.siteName}</h2>
              </div>
              <p className="text-gray-400 font-hindi mb-6 leading-relaxed">{footer.description}</p>
              <p className="font-hindi text-primary font-semibold text-lg">{footer.tagline}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-semibold text-xl mb-6 font-hindi">महत्वपूर्ण लिंक</h3>
              <ul className="space-y-4 font-hindi text-gray-400">
                {nav.links.map(link => (
                  <li key={link.path}>
                    <Link href={link.path} className="hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading font-semibold text-xl mb-6 font-hindi">संपर्क</h3>
              <ul className="space-y-4 font-hindi text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p>{contactInfo.phone1}</p>
                    <p className="text-sm">कार्यालय</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FaWhatsapp className="w-5 h-5 text-primary mt-1 shrink-0" size={20} />
                  <div>
                    <p>{contactInfo.phone2}</p>
                    <p className="text-sm">WhatsApp</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-heading font-semibold text-xl mb-6 font-hindi">सोशल मीडिया</h3>
              <div className="flex gap-4 mb-6">
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold">
                  f
                </a>
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold">
                  X
                </a>
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-sm font-bold">
                  in
                </a>
              </div>
              <p className="font-hindi text-sm text-gray-400 mb-2">अपडेट्स के लिए सब्सक्राइब करें</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="ईमेल"
                  className="bg-white/10 border border-white/20 rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-primary font-hindi"
                />
                <Button className="rounded-l-none rounded-r-md">भेजें</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8 text-center md:flex md:justify-between md:text-left text-sm text-gray-500 font-hindi">
            <p>{footer.copyright}</p>
            <p className="mt-2 md:mt-0">
              <a href="/admin" className="hover:text-primary transition-colors opacity-40 hover:opacity-100 text-xs">Admin</a>
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      {whatsapp.enabled && (
        <a
          href={`https://wa.me/${whatsapp.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp Contact"
        >
          <FaWhatsapp size={30} />
        </a>
      )}

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            aria-label="Back to Top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
