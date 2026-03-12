import React, { useState } from 'react';
import { AlertCircle, ChevronDown, Sparkles, Shield } from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'social_media_post', label: 'Social media post' },
  { value: 'website_content', label: 'Website / landing page content' },
  { value: 'google_ad', label: 'Google ad' },
  { value: 'email_marketing', label: 'Email / newsletter' },
  { value: 'blog_article', label: 'Blog article' },
  { value: 'print_ad', label: 'Print / brochure' },
  { value: 'other', label: 'Other' },
];

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter_x', label: 'X / Twitter' },
  { value: 'google', label: 'Google Ads' },
  { value: 'website', label: 'Website' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other / not applicable' },
];

const EXAMPLE_CONTENT = `✨ Transform Your Smile at Sydney CBD Dental! ✨

"I had the most amazing experience here! Dr. Smith fixed my teeth in just 2 visits and I've never felt more confident. Best dentist in Sydney!" - Sarah M. ⭐⭐⭐⭐⭐

We GUARANTEE you'll love your results or your money back!

🔥 LIMITED TIME: 50% off teeth whitening this month only! 🔥

Before & After photos available on request.

Our award-winning team of specialists have helped over 10,000 patients achieve their perfect smile. Results that last a LIFETIME!

Book now and get a FREE consultation valued at $200.

#SydneyDentist #TeethWhitening #SmileTransformation`;

interface ContentInputFormProps {
  onSubmit: (content: string, contentType: string, platform: string) => void;
  error: string | null;
  authError?: boolean;
}

export function ContentInputForm({ onSubmit, error, authError }: ContentInputFormProps) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('social_media_post');
  const [platform, setPlatform] = useState('instagram');
  const [charCount, setCharCount] = useState(0);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) return;
    onSubmit(content.trim(), contentType, platform);
  };

  const loadExample = () => {
    setContent(EXAMPLE_CONTENT);
    setCharCount(EXAMPLE_CONTENT.length);
  };

  const isValid = content.trim().length >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intro card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="text-base font-semibold text-blue-900 mb-1">
          Check your content for AHPRA compliance
        </h2>
        <p className="text-sm text-blue-700">
          Paste your social media post, advertisement, or online content below. SafePost will
          analyse it against AHPRA advertising guidelines, the Health Practitioner Regulation National Law Act 2009, and TGA requirements.
        </p>
      </div>

      {/* Content type + platform row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Content type
          </label>
          <div className="relative">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
          <div className="relative">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Content to check
          </label>
          <button
            type="button"
            onClick={loadExample}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Load example
          </button>
        </div>
        <textarea
          value={content}
          onChange={handleContentChange}
          rows={10}
          placeholder="Paste your social media post, ad copy, or website content here…"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono leading-relaxed"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">{charCount} characters</p>
          {content.trim().length > 0 && content.trim().length < 10 && (
            <p className="text-xs text-red-500">Please enter at least 10 characters</p>
          )}
        </div>
      </div>

      {/* API error */}
      {error && (
        <div className={`flex gap-3 border rounded-lg p-4 ${authError ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${authError ? 'text-amber-500' : 'text-red-500'}`} />
          <div>
            <p className={`text-sm font-medium ${authError ? 'text-amber-800' : 'text-red-800'}`}>
              {authError ? 'Session expired' : 'Analysis failed'}
            </p>
            <p className={`text-sm mt-0.5 ${authError ? 'text-amber-600' : 'text-red-600'}`}>{error}</p>
            {authError && (
              <a
                href="/login"
                className="mt-3 inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Log in
              </a>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer + submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-xs text-gray-400 flex-1">
          ⚖️ SafePost provides AI-assisted guidance only and does not constitute legal advice.
          Always consult a qualified compliance professional for final review.
        </p>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Shield className="w-4 h-4" />
          Check compliance
        </button>
      </div>
    </form>
  );
}