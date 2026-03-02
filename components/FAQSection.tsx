import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, subtitle, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
      <div className="max-w-4xl mx-auto px-6 pb-24 md:pb-32">
        {subtitle ? (
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-500">{subtitle}</p>
          </div>
        ) : (
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-14 text-center">
            {title}
          </h2>
        )}

        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border bg-white overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-black/[0.08] shadow-md shadow-black/[0.04]'
                    : 'border-black/[0.06] shadow-sm shadow-black/[0.02] hover:border-black/[0.1] hover:shadow-md hover:shadow-black/[0.04]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
                >
                  <span className="text-[15px] font-semibold text-gray-900 leading-snug pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                      isOpen ? 'bg-gray-100' : 'bg-gray-50 group-hover:bg-gray-100'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '500px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
