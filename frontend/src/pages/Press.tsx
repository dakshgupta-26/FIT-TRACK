import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { Download, Mail, ExternalLink, Newspaper, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Press: React.FC = () => {
  const pressReleases = [
    {
      date: 'July 15, 2026',
      title: 'FitTracker Reaches 50,000 Active Members Across India with Enterprise Dark Glass Redesign',
      category: 'COMPANY ANNOUNCEMENT',
    },
    {
      date: 'May 02, 2026',
      title: 'FitTracker Unveils AI Camera Meal Recognition with 99% Calorie & Macro Accuracy',
      category: 'PRODUCT LAUNCH',
    },
    {
      date: 'January 10, 2026',
      title: 'FitTracker Expands Biometric Cardiac Telemetry & HIPAA-Ready Data Vault',
      category: 'SECURITY & TECH',
    },
  ];

  const mediaOutlets = ['TechCrunch', 'Economic Times', 'YourStory', 'Mint', 'Inc42', 'Product Hunt'];

  const handleDownloadKit = () => {
    toast.success('Downloading FitTracker Official Media Kit (Logos, SVGs, Guidelines)...');
  };

  return (
    <PublicPageLayout
      title="Press & Brand Assets"
      subtitle="News, announcements, official media kits, and brand resources for journalists and creators."
      badge="Press Room"
      seoTitle="Press & Media Kit - FitTracker AI"
      seoDescription="Official press releases, media kit downloads, and media contact information for FitTracker."
    >
      <div className="space-y-16 lg:space-y-20">
        
        {/* Brand Kit Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.04] via-[#14b8a6]/10 to-transparent border border-[#14b8a6]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold tracking-wider text-[#2dd4bf] uppercase">OFFICIAL BRAND ASSETS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Download Brand Kit</h2>
            <p className="text-white/65 text-sm max-w-xl">
              Includes high-res vector logos (SVG, PNG, EPS), brand color swatches, product screenshots, and executive headshots.
            </p>
          </div>

          <Button 
            onClick={handleDownloadKit}
            size="lg" 
            className="bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] flex-shrink-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Kit (.ZIP)
          </Button>
        </div>

        {/* Featured In Publications */}
        <div className="space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 text-center">FEATURED IN LEADING PUBLICATIONS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mediaOutlets.map((pub, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center font-bold text-white/70 text-sm hover:text-[#2dd4bf] hover:border-[#14b8a6]/30 transition-all">
                {pub}
              </div>
            ))}
          </div>
        </div>

        {/* Press Releases List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[#2dd4bf]" />
              <span>Press Releases & Announcements</span>
            </h2>
          </div>

          <div className="space-y-4">
            {pressReleases.map((pr, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-white/50 mb-1">
                    <span>{pr.date}</span>
                    <span>•</span>
                    <span className="text-[#2dd4bf] font-semibold">{pr.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white hover:text-[#2dd4bf] cursor-pointer transition-colors">
                    {pr.title}
                  </h3>
                </div>

                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white self-start sm:self-center">
                  <span>Read Article</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Press Contact Box */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4 max-w-xl mx-auto">
          <Mail className="h-8 w-8 text-[#2dd4bf] mx-auto" />
          <h3 className="text-xl font-bold text-white">Press & Media Enquiries</h3>
          <p className="text-white/65 text-sm">
            For interview requests, executive quotes, or commentary on AI health trends, reach out to our communications team.
          </p>
          <a 
            href="mailto:press@fittracker.ai" 
            className="inline-block text-sm font-mono text-[#2dd4bf] underline hover:text-white transition-colors"
          >
            press@fittracker.ai
          </a>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Press;
