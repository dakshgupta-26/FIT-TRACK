import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Sparkles, Calendar, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'How AI Computer Vision Is Changing Personal Nutrition Tracking',
      date: 'July 28, 2026',
      author: 'Dr. Ananya Rao',
      summary: 'Exploring how deep learning models break down multi-ingredient meals from a single smartphone photo.',
    },
    {
      title: 'Understanding Heart Rate Variability (HRV) for Recovery',
      date: 'July 14, 2026',
      author: 'Daksh Gupta',
      summary: 'Why tracking autonomic nervous system signals helps prevent overtraining and optimizes workout timing.',
    },
  ];

  return (
    <PublicPageLayout
      title="FitTracker Engineering & Health Blog"
      subtitle="Articles, scientific research, and engineering deep-dives from the FitTracker team."
      badge="Official Blog"
      seoTitle="FitTracker Blog - Health Science & AI"
      seoDescription="Articles on health science, nutrition AI, and workout telemetry by FitTracker."
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {posts.map((post, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono text-white/50">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-[#2dd4bf]" /> {post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3 text-cyan-400" /> {post.author}</span>
            </div>
            <h2 className="text-xl font-bold text-white hover:text-[#2dd4bf] transition-colors cursor-pointer">{post.title}</h2>
            <p className="text-sm text-white/65 leading-relaxed">{post.summary}</p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default BlogPage;
