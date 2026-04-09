import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import PublicFooter from '../components/layout/PublicFooter';
import { getArticleBySlug } from '../utils/newsLoader';

const categoryColors: Record<string, string> = {
  'Press Release': 'bg-blue-50 text-blue-700',
  'Blog': 'bg-green-50 text-green-700',
  'Industry News': 'bg-amber-50 text-amber-700',
  'Regulatory Update': 'bg-purple-50 text-purple-700',
};

const NewsArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f7f4] items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
        <Link to="/news" className="text-[#2563EB] text-[14px] font-medium hover:underline">
          Back to News
        </Link>
      </div>
    );
  }

  const { Component } = article;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>{article.title} — SafePost</title>
        <meta name="description" content={article.excerpt} />
        <link rel="canonical" href={`https://www.safepost.com.au/news/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": article.title,
          "description": article.excerpt,
          "author": { "@type": "Person", "name": article.author },
          "datePublished": article.date,
          "publisher": {
            "@type": "Organization",
            "name": "SafePost",
            "url": "https://www.safepost.com.au"
          },
          "url": `https://www.safepost.com.au/news/${slug}`
        })}</script>
      </Helmet>
      <PublicHeader />

      {/* Article Content */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-24 md:pb-32">
          {/* Back link */}
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB] hover:text-blue-700 transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to News
          </Link>

          {/* Article header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
                {article.category}
              </span>
              <time dateTime={article.date} className="text-[12px] text-gray-400">
                {new Date(article.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12] text-gray-900 mb-4">
              {article.title}
            </h1>
            <p className="text-[14px] text-gray-500">
              By {article.author}
            </p>
          </div>

          {/* Article body */}
          <div className="prose prose-gray max-w-none
            [&>p]:text-[15px] [&>p]:text-gray-600 [&>p]:leading-relaxed [&>p]:mb-6
            [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-4
            [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-3
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#2563EB]/30 [&>blockquote]:pl-6 [&>blockquote]:my-8 [&>blockquote]:italic
            [&>blockquote>p]:text-[15px] [&>blockquote>p]:text-gray-600 [&>blockquote>p]:leading-relaxed
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-[15px] [&>ul>li]:text-gray-600 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:text-[15px] [&>ol>li]:text-gray-600 [&>ol>li]:mb-2
            [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-blue-700
          ">
            <Component />
          </div>

          {/* Standardised article disclaimer */}
          <div className="mt-12 pt-8 border-t border-black/[0.08]">
            <p className="text-[13px] font-bold text-gray-700 mb-2">Disclaimer</p>
            <p className="text-[13px] text-gray-500 leading-relaxed italic">
              SafePost is an independent compliance tool. It is not affiliated with, endorsed by, or connected to AHPRA or the TGA in any way. This article is for general information purposes only and does not constitute legal or regulatory advice. The regulatory landscape may change — always refer to the current AHPRA advertising guidelines and TGA advertising code for the most up-to-date requirements. For advice specific to your situation, consult a qualified healthcare lawyer or your medical defence organisation.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default NewsArticlePage;
