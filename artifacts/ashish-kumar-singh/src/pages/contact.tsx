import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSite } from '@/context/site-context';
import { renderFormattedText } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'नाम कम से कम 2 अक्षरों का होना चाहिए'),
  phone: z.string().min(10, 'कृपया सही मोबाइल नंबर दर्ज करें'),
  email: z.string().email('कृपया सही ईमेल दर्ज करें').optional().or(z.literal('')),
  subject: z.string().min(2, 'विषय दर्ज करें'),
  message: z.string().min(10, 'संदेश कम से कम 10 अक्षरों का होना चाहिए'),
});

const volunteerSchema = z.object({
  name: z.string().min(2, 'नाम अनिवार्य है'),
  phone: z.string().min(10, 'सही मोबाइल नंबर दर्ज करें'),
  area: z.string().min(2, 'क्षेत्र का नाम दर्ज करें'),
});

export default function Contact() {
  const { toast } = useToast();
  const { content } = useSite();
  const { contactPage, contactInfo, whatsapp } = content;

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', subject: '', message: '' },
  });

  const volunteerForm = useForm<z.infer<typeof volunteerSchema>>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { name: '', phone: '', area: '' },
  });

  const onSubmitContact = () => {
    toast({ title: "संदेश भेजा गया", description: "आपका संदेश आशीष कुमार सिंह जी की टीम तक पहुंच गया है।" });
    contactForm.reset();
  };

  const onSubmitVolunteer = () => {
    toast({ title: "पंजीकरण सफल", description: "स्वयंसेवक के रूप में जुड़ने के लिए धन्यवाद।" });
    volunteerForm.reset();
  };

  return (
    <div className="w-full font-hindi pb-24">
      {/* Hero */}
      <section className="bg-saffron-gradient text-white pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">{renderFormattedText(contactPage.heroHeading)}</h1>
        <p className="text-xl md:text-2xl font-medium">"{renderFormattedText(contactPage.heroSubtitle)}"</p>
      </section>

      {/* Info & Form Grid */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Info Card */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="h-full shadow-xl border-none">
                <CardContent className="p-8 md:p-10 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-6">संपर्क विवरण</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">कार्यालय पता</p>
                          <p className="text-muted-foreground">{renderFormattedText(contactInfo.address)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                          <Phone size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">फोन नंबर</p>
                          <p className="text-muted-foreground">{contactInfo.phone1} (कार्यालय)</p>
                          <p className="text-muted-foreground">{contactInfo.phone2} (WhatsApp)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                          <Mail size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">ईमेल</p>
                          <p className="text-muted-foreground">{contactInfo.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                          <FaWhatsapp size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">WhatsApp</p>
                          <a
                            href={`https://wa.me/${whatsapp.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            +{whatsapp.number}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-secondary/50 rounded-xl border border-border">
                    <h4 className="font-bold font-heading text-lg mb-2">कार्यालय का समय</h4>
                    <p>{renderFormattedText(contactPage.officeHours)}</p>
                    <p className="text-muted-foreground">{renderFormattedText(contactPage.sundayHours)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="h-full shadow-xl border-none">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold font-heading mb-6">हमें संदेश भेजें</h3>
                  <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
                      <FormField control={contactForm.control} name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>नाम *</FormLabel>
                            <FormControl><Input placeholder="आपका पूरा नाम" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={contactForm.control} name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>मोबाइल नंबर *</FormLabel>
                            <FormControl><Input type="tel" placeholder="10 अंकों का मोबाइल नंबर" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={contactForm.control} name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ईमेल (वैकल्पिक)</FormLabel>
                            <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={contactForm.control} name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>विषय *</FormLabel>
                            <FormControl><Input placeholder="संदेश का विषय" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={contactForm.control} name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>संदेश *</FormLabel>
                            <FormControl><Textarea placeholder="अपनी बात लिखें..." rows={4} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full rounded-full py-6 text-lg font-bold font-hindi">
                        संदेश भेजें →
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-2xl overflow-hidden shadow-xl h-72">
            <iframe
              src="https://maps.google.com/maps?q=Shyam+Nagar+Kanpur&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              title="Office Location"
            />
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">{renderFormattedText(contactPage.volunteerHeading)}</h2>
          <p className="text-muted-foreground mb-8">{renderFormattedText(contactPage.volunteerDesc)}</p>
          <Card className="shadow-xl border-none">
            <CardContent className="p-8">
              <Form {...volunteerForm}>
                <form onSubmit={volunteerForm.handleSubmit(onSubmitVolunteer)} className="space-y-4">
                  <FormField control={volunteerForm.control} name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>पूरा नाम *</FormLabel>
                        <FormControl><Input placeholder="आपका नाम" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={volunteerForm.control} name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>मोबाइल नंबर *</FormLabel>
                        <FormControl><Input type="tel" placeholder="10 अंकों का नंबर" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={volunteerForm.control} name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>आपका क्षेत्र / वार्ड *</FormLabel>
                        <FormControl><Input placeholder="जैसे: श्याम नगर, छावनी..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full rounded-full py-5 text-lg font-bold font-hindi">
                    स्वयंसेवक बनें →
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold font-heading mb-10 text-center">{contactPage.faqHeading}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {contactPage.faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-4 shadow-sm data-[state=open]:border-primary data-[state=open]:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-lg py-4 hover:no-underline">
                  {renderFormattedText(faq.q)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed text-base">
                  {renderFormattedText(faq.a)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
