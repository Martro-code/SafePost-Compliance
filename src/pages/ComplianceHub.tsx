import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FAQSection from '../components/ui/FAQSection';
import PublicFooter from '../components/layout/PublicFooter';
import PublicHeader from '../components/layout/PublicHeader';

const ComplianceHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>Compliance Hub — AHPRA &amp; TGA Advertising Rules</title>
        <meta name="description" content="Everything Australian medical practitioners need to know about AHPRA and TGA advertising compliance — what counts as advertising, what activities trigger investigations, and what the rules cover." />
      </Helmet>


      <PublicHeader />


      {/* Hero Section */}
      <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Compliance hub
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
            Everything Australian medical practitioners and practices need to understand AHPRA and TGA advertising rules
          </p>
        </div>
      </section>

      {/* Social Media Is Advertising */}
      <div className="-mt-8">
      <FAQSection
        title="Social media is advertising"
        subtitle="What counts as advertising — and what happens if you get it wrong"
        items={[
          {
            question: 'What is social media?',
            answer: (
              <>
                <p>Social media is a term that is constantly evolving but generally refers to internet-based tools that allow individuals and groups to communicate, to advertise or share opinions, information, ideas, messages, experiences, images, and video or audio clips. They may include blogs, social networks, video and photo-sharing sites, wikis, or a myriad of other media, used for:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>social networking (Facebook, X, WeChat, Weibo, WhatsApp)</li>
                  <li>professional networking (LinkedIn, Yammer)</li>
                  <li>discussion forums (Reddit, Whirlpool, Discord, Quora)</li>
                  <li>media sharing (YouTube, Flickr, Instagram, TikTok, Pinterest)</li>
                  <li>microblogging (Tumblr, Blogger)</li>
                  <li>audio publishing (Spotify, iTunes, Podcasts)</li>
                  <li>text publishing (Blogs, SlideShare)</li>
                  <li>knowledge/information aggregation (Wikipedia)</li>
                  <li>booking sites and apps (HealthEngine, Whitecoat, Podium)</li>
                </ul>
              </>
            ),
          },
          {
            question: 'What is social media advertising?',
            answer:
              'Any social media activity intended to attract patients, promote services, or drive engagement with your practice is considered advertising under Australian law. This applies to all platforms and includes both public posts and closed channels such as private Facebook groups or dark marketing, unless they meet strict health professional-only access requirements.',
          },
          {
            question: 'What do the rules cover?',
            answer:
              'Both AHPRA and the TGA regulate what you can say online. AHPRA\u2019s National Law prohibits false or misleading claims, patient testimonials, and content that creates unreasonable expectations about treatment results. The TGA\u2019s Advertising Code adds additional requirements whenever a post promotes medicines, medical devices, or supplements.',
          },
          {
            question: 'Can I be investigated for what I post on social media?',
            answer:
              'AHPRA and the National Boards recognise the freedom of expression for practitioners and their right to communicate, including advocating for causes via social media, provided their activities do not involve the abuse or discrimination of others, or present a risk to the public. Registered practitioners will not be investigated purely for holding or expressing their views on social media. Regulatory action may be considered if the way a practitioner expresses their views presents a risk to public safety, provides false or misleading information, breaches privacy or confidentiality, risks the public\u2019s confidence in their profession, or requires action to maintain professional standards. All notifications to AHPRA are assessed according to their individual merits and circumstances to determine if they reach the threshold requiring an investigation or regulatory action.',
          },
          {
            question: 'How does social media use affect my professional standing?',
            answer:
              'A primary objective of the National Registration and Accreditation Scheme is to protect the public. Community trust in registered health practitioners is essential. Every practitioner has a responsibility to behave ethically to justify this trust. Inappropriate use of social media can result in harm to patients and the profession, particularly given the changing nature of privacy and the capacity for material to be posted by others. Harm may include breaches of confidentiality, defamation of colleagues or employers, violation of practitioner\u2013patient boundaries, or an unintended exposure of personal information to the public, employers, consumers and others. Information published on social media is often impossible to remove or change and can be circulated widely, easily and rapidly. Be very careful about what you like or post online \u2014 regardless of where in the world the site is based or the language used.',
          },
        ]}
      />
      </div>

      {/* Activities That May Trigger Investigation */}
      <div className="-mt-8">
      <FAQSection
        title="Activities that may trigger investigation"
        subtitle="Online advertising and social media activities most likely to attract AHPRA and TGA scrutiny"
        groups={[
          {
            label: 'Advertising breaches \u2014 AHPRA and TGA',
            items: [
              {
                question: 'Patient testimonials and reviews',
                answer:
                  'Sharing or endorsing patient testimonials about clinical outcomes is prohibited under Section 133 of the Health Practitioner Regulation National Law Act 2009. This includes reposting Google reviews, featuring patient success stories, and posts that reference treatment results \u2014 even when the patient has given consent.',
              },
              {
                question: 'Before and after images',
                answer:
                  'Publishing before and after photos for cosmetic, surgical, or aesthetic procedures is explicitly prohibited under AHPRA\u2019s advertising guidelines. This applies to all platforms including Instagram, Facebook, and your practice website \u2014 regardless of whether images are anonymised or accompanied by disclaimers.',
              },
              {
                question: 'Unsubstantiated claims and superlatives',
                answer:
                  'Describing yourself or your practice as \u2018the best\u2019, \u2018leading\u2019, \u2018top-rated\u2019, or \u2018most experienced\u2019 without objective evidence constitutes misleading advertising. Claims about treatment outcomes, success rates, or comparative superiority that cannot be independently verified are a common trigger for AHPRA complaints.',
              },
              {
                question: 'Product and treatment endorsements',
                answer:
                  'Endorsing specific pharmaceutical products, medical devices, or cosmetic treatments on social media \u2014 including paid partnerships, gifted product posts, and affiliate arrangements \u2014 can breach both AHPRA advertising guidelines and TGA advertising requirements. Practitioners are held to a higher standard than general influencers.',
              },
            ],
          },
          {
            label: 'Social media conduct breaches',
            items: [
              {
                question: 'Social media conduct and professionalism',
                answer:
                  'Your professional obligations apply online as much as they do in the clinic. Posts made in a personal capacity \u2014 including complaints about colleagues, patients, or your workplace \u2014 can result in a formal AHPRA notification. Even accounts with no explicit link to your profession can be traced through the public register.',
              },
              {
                question: 'Patient confidentiality on social media',
                answer:
                  'Inadvertently disclosing patient information through social media is one of the most common compliance risks practitioners overlook. A photo, a comment, or even a combination of seemingly harmless details can be enough to identify a patient \u2014 triggering both an AHPRA notification and a privacy complaint.',
              },
              {
                question: 'Public health misinformation',
                answer:
                  'As a registered practitioner, your views carry authority. Posting, sharing, or endorsing content that contradicts established public health guidance or the best available scientific evidence can breach your Code of Conduct obligations \u2014 even when posted on a personal account.',
              },
            ],
          },
        ]}
      />
      </div>

      {/* Call to Action */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Check your content before you post
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            SafePost checks your social media posts and advertising against AHPRA and TGA rules in seconds
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/pricing/medical-practitioners')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-7 py-3 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] active:scale-[0.97] hover:shadow-blue-600/30 min-w-[180px]"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3 text-[15px] font-semibold text-gray-600 hover:text-gray-900 rounded-xl border border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02] transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.97] min-w-[180px]"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ComplianceHub;
