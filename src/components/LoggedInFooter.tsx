import { Link } from 'react-router-dom';

const LoggedInFooter = () => {
  return (
    <footer className="bg-[#f7f7f4] dark:bg-gray-900 border-t border-black/[0.06] dark:border-gray-700 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-12">
          <div>
            <div className="text-[20px] font-extrabold tracking-tight leading-none">
              <span className="text-gray-900 dark:text-white">Safe</span>
              <span className="text-[#2563EB]">Post</span>
              <span className="text-gray-400 text-[14px] font-medium ml-0.5">™</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed mt-2 max-w-[200px]">
              Checks your online advertising and social media content against AHPRA's rules — before you publish, not after.
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="https://www.ahpra.gov.au/Resources/Advertising-hub.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Advertising hub</a></li>
              <li><a href="https://www.medicalboard.gov.au/codes-guidelines-policies/code-of-conduct.aspx" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Code of conduct</a></li>
              <li><a href="https://www.tga.gov.au/resources/guidance/advertising-therapeutic-goods-social-media" target="_blank" rel="noopener noreferrer" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">TGA guidelines</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms-of-use" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Terms of Use</Link></li>
              <li><Link to="/privacy-policy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Connect</h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors duration-200 dark:text-gray-400 dark:hover:text-white">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-4 dark:text-white">Follow Us</h4>
            <div className="flex items-center gap-4 mt-4">
              {/* X / Twitter */}
              <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="X / Twitter">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              {/* Instagram */}
              <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Instagram">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </div>
              {/* LinkedIn */}
              <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="LinkedIn">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              {/* Facebook */}
              <div className="text-gray-400 cursor-not-allowed" title="Coming soon">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Facebook">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-black/[0.06] dark:border-gray-700">
          <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
            Disclaimer: This application is an AI-powered guidance tool and does not constitute legal or regulatory advice.
            AHPRA and the National Boards do not provide pre-approval for advertising.
            Registered health practitioners are ultimately responsible for ensuring their social media activities and advertising complies with the Health Practitioner Regulation National Law.
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">&copy; SafePost&trade; 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default LoggedInFooter;
