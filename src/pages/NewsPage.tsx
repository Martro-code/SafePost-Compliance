import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import PublicFooter from '../components/layout/PublicFooter';
import { getAllArticles } from '../utils/newsLoader';


const categoryColors: Record<string, string> = {
  'Press Release': 'bg-blue-50 text-blue-700',
  'Blog': 'bg-green-50 text-green-700',
  'Industry News': 'bg-amber-50 text-amber-700',
  'Regulatory Update': 'bg-purple-50 text-purple-700',
};

const NewsPage: React.FC = () => {
  const sortedArticles = getAllArticles().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>News &amp; Updates — SafePost</title>
        <meta name="description" content="The latest news, regulatory updates and compliance guides for Australian medical practitioners from the SafePost team." />
      </Helmet>
      <PublicHeader />

      {/* Hero */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-gray-900 mb-6">
              AHPRA &amp; TGA compliance news
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl">
              The latest updates, press releases, and industry insights from SafePost
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="w-full pb-24 md:pb-32" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6">
          {sortedArticles.length === 0 ? (
            <p className="text-gray-500 text-[14px]">No articles yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/news/${article.slug}`}
                  className="text-left bg-white rounded-2xl border border-black/[0.06] p-8 hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
                      {article.category}
                    </span>
                    <time dateTime={article.date} className="text-[12px] text-gray-400">
                      {new Date(article.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <div className="flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#2563EB] transition-colors duration-200 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB]">
                      Read more
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default NewsPage;
