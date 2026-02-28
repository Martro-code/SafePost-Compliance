import { Link } from 'react-router-dom';

const LoggedInFooter = () => {
  return (
    <footer className="bg-[#f7f7f4] dark:bg-gray-900 border-t border-black/[0.06] dark:border-gray-700 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-8">
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
            <ul className="space-y-2.5">
              <li className="text-[13px] text-gray-400 dark:text-gray-600">X / Twitter</li>
              <li className="text-[13px] text-gray-400 dark:text-gray-600">Instagram</li>
              <li className="text-[13px] text-gray-400 dark:text-gray-600">LinkedIn</li>
              <li className="text-[13px] text-gray-400 dark:text-gray-600">Facebook</li>
            </ul>
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
