import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Support',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been sent! Our support team will reply within 4 hours.');
    }, 1000);
  };

  const faqs = [
    { q: 'How quickly does support respond?', a: 'Our support team responds to all tickets within 2 to 4 hours, 24/7.' },
    { q: 'Can I request a demo for my gym or team?', a: 'Yes! Select "Business & Enterprise" in the contact form, and our sales engineering team will set up a live demo.' },
    { q: 'Where are FitTracker offices located?', a: 'Our primary engineering hub is in Bengaluru, India, with executive operations in San Francisco, CA.' },
  ];

  return (
    <PublicPageLayout
      title="Get in Touch with FitTracker"
      subtitle="Have a question, feedback, or enterprise inquiry? We're here to help you 24 hours a day."
      badge="Contact & Support"
      seoTitle="Contact Us - FitTracker AI Support"
      seoDescription="Reach out to the FitTracker team for technical support, partnership inquiries, or media questions."
    >
      <div className="space-y-16 lg:space-y-24">
        
        {/* Main Grid: Contact Form + Direct Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Map Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#2dd4bf]" />
                <span>Direct Contact Channels</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/50 uppercase">Customer Support</div>
                    <a href="mailto:support@fittracker.ai" className="text-sm font-medium text-white hover:text-[#2dd4bf] transition-colors">
                      support@fittracker.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] flex-shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/50 uppercase">Enterprise Sales</div>
                    <a href="mailto:biz@fittracker.ai" className="text-sm font-medium text-white hover:text-[#2dd4bf] transition-colors">
                      biz@fittracker.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/50 uppercase">Global Headquarters</div>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Vector Map Card */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="font-semibold text-white">Bengaluru Tech Hub</span>
                <span className="text-[#2dd4bf] font-mono">12.9716° N, 77.5946° E</span>
              </div>
              
              <div className="h-44 w-full rounded-2xl bg-[#07111f] border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                <div className="relative z-10 text-center space-y-2">
                  <div className="relative flex h-4 w-4 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#14b8a6]" />
                  </div>
                  <div className="text-xs font-bold text-white">FitTracker Engineering Center</div>
                  <span className="text-[10px] text-white/50 block">Bengaluru • San Francisco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  We'd love to hear from you. Fill out the form below and we'll reply promptly.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-center space-y-4"
                >
                  <CheckCircle2 className="h-12 w-12 text-[#2dd4bf] mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Message Delivered!</h3>
                  <p className="text-white/70 text-sm">
                    Thank you, {formData.name}. Our engineering support team has received your ticket and will follow up via email at <span className="text-[#2dd4bf] font-mono">{formData.email}</span> within 4 hours.
                  </p>
                  <Button 
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', category: 'General Support', message: '' }); }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Daksh Gupta"
                        required
                        className="bg-white/[0.04] border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="daksh@example.com"
                        required
                        className="bg-white/[0.04] border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 rounded-md bg-[#07111f] border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-[#14b8a6]"
                      >
                        <option value="General Support">General Support</option>
                        <option value="Billing & Pricing">Billing & Pricing</option>
                        <option value="Business & Enterprise">Business & Enterprise</option>
                        <option value="API Integration">API Integration</option>
                        <option value="Bug Report">Bug Report</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70">Subject</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="bg-white/[0.04] border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/70">Message *</label>
                    <Textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your question or inquiry in detail..."
                      required
                      className="bg-white/[0.04] border-white/10 text-white text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] font-semibold flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-[#2dd4bf]" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-white/65 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Contact;
