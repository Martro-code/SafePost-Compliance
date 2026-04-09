import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import LoggedInLayout from '../components/layout/LoggedInLayout';
import { useAuth } from '../hooks/useAuth';
import PublicFooter from '../components/layout/PublicFooter';

const SoftwareTerms: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const [tocOpen, setTocOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  if (loading) return null;

  const contentSection = (
    <section className="w-full" style={{ backgroundColor: '#f7f7f4' }}>
      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-12">

          {/* Sidebar Navigation */}
          <nav className="flex md:flex-col gap-4 md:gap-2 md:pt-1">
            <button onClick={() => navigate('/terms-of-use')} className={`text-[13px] font-medium text-left transition-colors duration-200 ${location.pathname === '/terms-of-use' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'}`}>Software Terms of Use</button>
            <button onClick={() => navigate('/website-terms')} className={`text-[13px] font-medium text-left transition-colors duration-200 ${location.pathname === '/website-terms' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'}`}>Website Terms of Use</button>
            <button onClick={() => navigate('/privacy-policy')} className={`text-[13px] font-medium text-left transition-colors duration-200 ${location.pathname === '/privacy-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'}`}>Privacy Policy</button>
            <button onClick={() => navigate('/cookie-policy')} className={`text-[13px] font-medium text-left transition-colors duration-200 ${location.pathname === '/cookie-policy' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-900'}`}>Cookies Policy</button>
          </nav>

          {/* Document Content */}
          <div className="max-w-[800px] space-y-8">
            {user && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Software Terms of Use</h1>
              <p className="text-[14px] text-gray-500">Last updated 23 March 2026</p>
            </div>

            {/* Table of Contents */}
            <div className="border border-black/[0.08] rounded-xl overflow-hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-[13px] font-semibold text-gray-700 hover:bg-black/[0.02] transition-colors duration-150"
              >
                Contents
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: tocOpen ? '900px' : '0px', opacity: tocOpen ? 1 : 0 }}
              >
                <ul className="px-5 pb-4 pt-1 space-y-1.5 list-none">
                  {[
                    ['1. Reading and accepting these terms', '#reading-and-accepting-these-terms'],
                    ['2. Eligibility', '#eligibility'],
                    ['3. Duration of your subscription', '#duration-of-your-subscription'],
                    ['4. The software', '#the-software'],
                    ['5. Data hosting', '#data-hosting'],
                    ['6. Client obligations', '#client-obligations'],
                    ['7. Fees and payment', '#fees-and-payment'],
                    ['8. Intellectual property and data', '#intellectual-property-and-data'],
                    ['9. Third party software & terms', '#third-party-software-and-terms'],
                    ['10. Confidentiality', '#confidentiality'],
                    ['11. Privacy', '#privacy'],
                    ['12. Liability', '#liability'],
                    ['13. Upgrades and downgrades', '#upgrades-and-downgrades'],
                    ['14. Cancellation', '#cancellation'],
                    ['15. Dispute resolution', '#dispute-resolution'],
                    ['16. Force majeure', '#force-majeure'],
                    ['17. Notices', '#notices'],
                    ['18. General', '#general'],
                    ['19. Definitions', '#definitions'],
                  ].map(([label, href]) => (
                    <li key={href} className="text-[13px] text-gray-500">
                      <a href={href} className="hover:text-[#2563EB] transition-colors duration-150">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Preamble */}
            <div>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                We are SafePost Pty Ltd (ACN 695 801 604), an Australian business with ABN 17 695 801 604 (<strong>SafePost</strong>, <strong>we</strong>, <strong>our</strong> or <strong>us</strong>) and we provide an AI-assisted review platform that helps medical and allied health practitioners analyse proposed online and social media content against Australian Health Practitioner Regulation Agency (AHPRA) and Therapeutic Goods Administration (TGA) guidelines. SafePost flags potentially problematic text, provides relevant legislative references and suggests alternative phrasing to assist users in managing their own regulatory and compliance obligations, as described on our Website (<strong>Software</strong>).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                These terms of use (<strong>Terms</strong>) govern your access to the Software and us providing you any other goods and services as set out in these Terms (<strong>Subscription</strong>). You can view the most updated version of our Terms at <a href="https://www.safepost.com.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Safepost.com.au</a> (<strong>Website</strong>). Please read these terms of use carefully before agreeing to proceed with your Subscription.
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Your Subscription is for the tiered package as selected by you and agreed between us by means of the Website (<strong>Subscription Tier</strong>).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed font-medium text-gray-700">
                Please note that your Subscription will continue to renew indefinitely, and you will continue to incur Subscription Fees, unless you notify us that you want to cancel your Subscription in accordance with clause 14. Please ensure you contact us if you want to cancel your Subscription.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 id="reading-and-accepting-these-terms" className="text-lg font-bold text-gray-900 leading-snug mb-3">1. Reading and accepting these terms</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">In these Terms, capitalised words and phrases have the meanings given to them where they are followed by bolded brackets, or as set out in the Definitions table at the end of these Terms.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">By clicking the &ldquo;I accept these Terms&rdquo; button on our Website, paying for your Subscription or otherwise accepting the benefit of any part of your Subscription, you agree to be bound by these Terms which form a binding contractual agreement between you the person acquiring a Subscription or the company you represent and are acquiring the Subscription on behalf of (<strong>&lsquo;you&rsquo;</strong> or <strong>&lsquo;your&rsquo;</strong>) and us.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We may change these Terms at any time by notifying you, and your continued use of the Software following such an update will represent an agreement by you to be bound by the Terms as amended.</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 id="eligibility" className="text-lg font-bold text-gray-900 leading-snug mb-3">2. Eligibility</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">By accepting these Terms, you represent and warrant that:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">you have the legal capacity and authority to enter into a binding contract with us; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">you are authorised to use the payment you provided when purchasing a Subscription.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">The Software is not intended for use by any person under the age of 18 years old or any person who has previously been suspended or prohibited from using the Software.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">By using the Software, you represent and warrant that you are over the age of 18 years. Please do not access the Software if you are under the age of 18 years old.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">The Software is designed exclusively for use by medical and allied health professionals. By accepting these Terms and accessing the Software, you represent and warrant that you are:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">a registered health practitioner in Australia;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">a healthcare practice operating in Australia; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">an authorised representative, employee, or contractor acting directly on behalf of a registered health practitioner or healthcare practice.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We reserve the right to request proof of your professional registration or employment status and may suspend or terminate your Account immediately if we determine you do not meet these eligibility requirements.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If you are signing up not as an individual but on behalf of your company, your medical practice, your employer, an organisation, government or other legal entity (<strong>Represented Entity</strong>), then &ldquo;you&rdquo; or &ldquo;your&rdquo; means the Represented Entity and you are binding the Represented Entity to this agreement. If you are accepting this agreement and using our Software on behalf of a Represented Entity, you represent and warrant that you are authorised to do so.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If your employment or authorisation to act on behalf of the Represented Entity ceases or changes, or if you are the Represented Entity and a User&rsquo;s employment or authorisation ceases, you must notify us immediately so we can revoke or update their access to the Software. You acknowledge and agree that you remain strictly responsible and liable for all activity conducted on your Account (including any regulatory breaches, data uploads, or incurred Subscription Fees) by any former employee or unauthorised User if you fail to promptly notify us of this change.</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 id="duration-of-your-subscription" className="text-lg font-bold text-gray-900 leading-snug mb-3">3. Duration of your subscription</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">Your Subscription and these Terms commence on the date you agree to be bound by these Terms and continues for the Subscription Period and any Renewal Periods applicable, unless terminated earlier in accordance with clause 14.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Subject to clause 3(c), upon expiration of the Subscription Period, this agreement will automatically and indefinitely renew on an ongoing basis for a period equal to the Subscription Period (<strong>Renewal Period</strong>).</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">This agreement will not automatically renew on expiry of the Subscription or Renewal Period (<strong>Renewal Date</strong>) if you cancel your Subscription at any time via the Billing page within your account. If you cancel your Subscription, the cancellation will take effect at the end of your current paid billing period. You will continue to have full access to your Subscription until that date, after which this agreement will not automatically renew. No pro-rata refunds will be provided for the remaining days in your current billing period.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">For annual subscriptions, at least 30 days prior to the expiry of the Renewal Date, we will provide you with advanced written notice of the agreement renewing and any applicable changes to the Subscription Fees or these Terms (<strong>Renewal Notice</strong>).</li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 id="the-software" className="text-lg font-bold text-gray-900 leading-snug mb-3">4. The software</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.1 Scope of your subscription and the software</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">We will provide you, to the extent described in your Subscription Tier, the Software.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Your Subscription includes the benefits and limitations of your Subscription Tier as set out on our Website, or as otherwise communicated to you when you subscribe for your Subscription (and as amended from time to time by notice to you).</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.2 Accounts</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Accounts)</strong> To use the Software, you may be required to sign-up, register and receive an account through the Website (an <strong>Account</strong>).</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Provide Information)</strong> As part of the Account registration process and as part of your continued use of the Website, you may be required to provide personal information and details, such as your email address, first and last name, preferred username, a secure password, billing address, your ABN, your practice&rsquo;s name and address, mobile phone number, profile information, payment details (through our third party payment platform only), and other information as determined by us from time to time.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Warranty)</strong> You warrant that any information you give to us in the course of completing the Account registration process is accurate, honest, correct and up-to-date.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Acceptance)</strong> Once you complete the Account registration process, we may, in our absolute discretion, choose to accept you as a registered user within the Website and provide you with an Account.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.3 General disclaimer</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-3">You acknowledge and agree that:</p>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">while the Software is designed to assist you in identifying potential compliance issues with AHPRA and TGA guidelines, it is an automated tool and does not guarantee absolute legal or regulatory compliance. It is not a substitute for independent legal or professional compliance advice.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">you are solely responsible for manually reviewing, verifying and approving any content reviewed or generated by the Software before publishing it online or on social media.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">you remain strictly liable for ensuring your advertising and content complies with the Health Practitioner Regulation National Law, TGA regulations and all other applicable laws. We accept no liability, and you indemnify us against, any regulatory audits, fines, penalties or disciplinary actions taken against you resulting from your use of, or reliance upon, the Software.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.4 Artificial intelligence disclaimer</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">You acknowledge that the Software utilises artificial intelligence (AI) to review proposed content, flag potential regulatory issues, and suggest alternative phrasing.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">While the AI is designed to assist you in managing your compliance obligations, it is not infallible. You acknowledge that AI technologies can misinterpret legal or medical context, hallucinate and generate inaccurate, incomplete or non-compliant outputs.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You agree that you must independently verify all AI-generated suggestions, flagged issues and legislative references against current AHPRA guidelines, TGA regulations, and the Health Practitioner Regulation National Law before publishing any content.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You retain strict and sole responsibility for any content you publish online or on social media. You must make informed decisions and shall not rely solely on SafePost or its AI outputs to satisfy your professional, legal, or advertising obligations.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You agree to promptly notify us if you identify suspected errors, hallucinations, or misapplied legislative references generated by the AI, to assist us in the ongoing maintenance of the Software.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">4.5 Software licence</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">While your Subscription is maintained, we grant to you a non-exclusive, non-transferable licence to use the Software for the Number of Software Users. If your Subscription Tier on the Website does not specify a Number of Software Users, your licence to use the Software under this clause will be limited to one User.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We may from time to time, in our absolute discretion, release enhancements to the Software (<strong>Enhancements</strong>). Any Enhancements to the Software will not limit or otherwise affect these Terms. Enhancements may cause downtime or delays from time to time, and credits will not be provided for such downtime.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We may change any features of the Software at any time on notice to you.</li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 id="data-hosting" className="text-lg font-bold text-gray-900 leading-snug mb-3">5. Data hosting</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-3">We will store User Data you upload to the Software using a third party hosting service selected by us (<strong>Hosting Services</strong>), subject to the following terms:</p>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(hosting location)</strong> You acknowledge and agree that we may use storage servers to host the Software through cloud-based services, and potentially other locations outside Australia.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(service quality)</strong> While we will use our best efforts to select an appropriate hosting provider, we do not guarantee that the Hosting Services will be free from errors or defects or that User Data will be accessible or available at all times.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(security)</strong> We will use our best efforts to ensure that User Data is stored securely. However, we do not accept responsibility or liability for any unauthorised use, destruction, loss, damage or alteration to User Data, including due to hacking, malware, ransomware, viruses, malicious computer code or other forms of interference.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(backups &amp; disaster recovery)</strong> In the event that User Data is lost due to a system failure, we cannot guarantee that any backup will be available, or if available that such a backup will be free from errors or defects.</li>
              </ul>
            </div>

            {/* 6 */}
            <div>
              <h2 id="client-obligations" className="text-lg font-bold text-gray-900 leading-snug mb-3">6. Client obligations</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">6.1 Client material</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">You warrant that all information, documentation and other Material you provide to us for the purpose of receiving the Software is complete, accurate and up-to-date.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You release us from all liability in relation to any loss or damage arising out of or in connection with the Software, to the extent such loss or damage is caused or contributed to by information, documentation or any other Material provided by you being incomplete, inaccurate or out-of-date.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You strictly must not upload, input, or otherwise submit to the Software any personal information, identifiable patient data or sensitive health information relating to any patient or third party (including, but not limited to, real patient names or medical histories contained within drafted testimonials or case studies).</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Uploading prohibited content in contravention of clause 6.1(c) constitutes a material breach of these Terms. If you upload such information, we reserve the right to immediately suspend your access, and the prohibited data will be destroyed as soon as reasonably practicable in accordance with our Privacy Policy. We accept no liability for the deletion of this data.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">6.2 Your obligations</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>You must, and must ensure that all Users, comply with these Terms at all times.</strong> You acknowledge and agree that we will have no liability in respect of any damage, loss or expense which arises in connection with your, your Personnel&rsquo;s, or any User&rsquo;s, breach of these Terms, and you indemnify us in respect of any such damage, loss or expense.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You must not, and must not encourage or permit any User, Personnel or any third party to, without our prior written approval:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">upload any sensitive information, personal health information or commercial secrets using the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">upload any inappropriate, offensive, illicit, illegal, pornographic, sexist, homophobic or racist material using the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">use the Software for any purpose other than for the purpose for which it was designed, including in a manner that is illegal or fraudulent or facilitates illegal or fraudulent activity;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">upload any material that is owned or copyrighted by a third party;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">make copies of the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">adapt, modify or tamper in any way with the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">remove or alter any copyright, trade mark or other notice on or forming part of the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">act in any way that may harm our reputation or that of associated or interested parties or do anything at all contrary to the interests of us or the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">use the Software in a way which infringes the Intellectual Property Rights of any third party;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">create derivative works from or translate the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">publish or otherwise communicate the Software to the public, including by making it available online or sharing it with third parties;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">integrate the Software with third party data or Software, or make additions or changes to the Software (including by incorporating APIs into the Software) other than in accordance with any instructions provided by us in writing;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">intimidate, harass, impersonate, stalk, threaten, bully or endanger any other User or distribute unsolicited commercial content, junk mail, spam, bulk content or harassment in connection with the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">sell, loan, transfer, sub-licence, hire or otherwise dispose of the Software to any third party, other than granting a User access as permitted under these Terms;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">decompile or reverse engineer the Software or any part of it, or otherwise attempt to derive its source code;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">share your Account or Account information, including log in details or passwords, with any other person. Any use of your Account by any person who is not the account holder is strictly prohibited. You must immediately notify us of any unauthorised use of your Account, password or email, or any other breach or potential breach of the Software&rsquo;s security;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">copy, reproduce, translate, adapt, vary or modify the Software without our express written consent;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">attempt to circumvent any technological protection mechanism or other security feature of the Software; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">permit any use of the Software in addition to the Number of Software Users.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If you become aware of misuse of your Subscription by any person, any errors in the material on your Subscription or any difficulty in accessing or using your Subscription, please contact us immediately using the contact details or form provided on our Website.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You agree, and you must ensure that all Users agree:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">to comply with each of your obligations in these Terms;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">to sign up for an Account in order to use the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">that information given to you through the Software, by us or another User, is general in nature and we take no responsibility for anything caused by any actions you take in reliance on that information; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">that we may cancel your, or any User&rsquo;s, Account at any time if we consider, in our absolute discretion, that you or they are in breach of, or are likely to breach, this clause 6.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 7 */}
            <div>
              <h2 id="fees-and-payment" className="text-lg font-bold text-gray-900 leading-snug mb-3">7. Fees and payment</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.1 Free trial</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">We may offer a free trial period for new Subscriptions (<strong>Free Trial Period</strong>). If you register for a Free Trial Period, you will have access to the features included in your chosen Subscription Tier for the duration of the trial.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You acknowledge and agree that unless you cancel your Subscription before the expiration of the Free Trial Period, your Subscription will automatically convert to a paid recurring Subscription.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Upon conversion, your nominated payment method will immediately be charged the applicable Subscription Fees for your first billing cycle, and automatic recurring billing will apply in accordance with clause 7.3.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.2 Subscription fees</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">You must pay subscription fees to us in the amounts specified on the Website for your Subscription Tier, or as otherwise agreed in writing (<strong>Subscription Fees</strong>).</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">All Subscription Fees must be paid in advance and are non-refundable for change of mind.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Unless otherwise agreed in writing, the Subscription Fees are due and payable on a recurring basis for the duration of your Subscription, with the first payment being due on the first day of the Subscription Period (or immediately after the expiry of any applicable Free Trial Period) and at the beginning of every Renewal Period thereafter.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.3 Automatic recurring billing</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">Your Subscription will continue to renew on an automatic indefinite basis unless you notify us that you wish to cancel in accordance with this clause 7.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">While your Subscription is maintained, your Subscription Fees will continue to be debited at the beginning of each Renewal Period from the payment method you nominated when you registered for an Account.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">By signing up for a recurring Subscription, you acknowledge and agree that your Subscription has an initial and recurring payment feature, and you accept responsibility for all recurring charges prior to your cancellation of your Subscription.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.4 Grace period</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">If you fail to cancel your Subscription prior to a Renewal Period and you are charged recurring charges, you have up to 10 Business Days from the date of that renewal to cancel your Subscription by contacting us through our Website (<strong>Grace Period</strong>). If you cancel your Subscription within the Grace Period, please contact us via our Website to request a refund for any recurring fees charged to you during the Grace Period.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.5 Changes to subscription fees</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">We may, from time to time, change our Subscription Fees and provide you with 10 Business Days&rsquo; notice prior to the changes. During this time, you have the opportunity to cancel your Subscription with us. If you do not cancel your Subscription before the new Subscription Fees take effect, the Grace Period in clause 7.4 will apply.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.6 Late payments</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">We reserve the right to suspend all or part of the Software indefinitely if you fail to pay any Fees in accordance with this clause 7.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.7 GST</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Unless otherwise indicated, the <strong>Fees include GST</strong>.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.8 Card surcharges</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">We reserve the right to charge credit card surcharges in the event payments are made using a credit, debit or charge card (including Visa, MasterCard or American Express).</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">7.9 Online payment partner</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">We use a third-party online payment partner, currently Stripe (<strong>Online Payment Partner</strong>) to collect Subscription Fees.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">As we have notified you of Stripe&rsquo;s terms and provided you with a copy of <a href="https://stripe.com/au/legal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Stripe&rsquo;s Terms</a>, you acknowledge and agree that:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">the processing of payments by the Online Payment Partner will be, in addition to this agreement, subject to the terms, conditions and privacy policies of the Online Payment Partner;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">you release us and our Personnel in respect of all liability for loss, damage or injury which may be suffered by any person arising from any act or omission of the Online Payment Partner, including any issue with security or performance of the Online Payment Partner&rsquo;s platform or any error or mistake in processing your payment; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">we reserve the right to correct, or to instruct our Online Payment Partner to correct, any errors or mistakes in collecting your payment.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 8 */}
            <div>
              <h2 id="intellectual-property-and-data" className="text-lg font-bold text-gray-900 leading-snug mb-3">8. Intellectual property and data</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">8.1 Software content intellectual property</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Our ownership)</strong> Subject to clause 8.1(c), we retain ownership of all Materials provided to you throughout the course of your Subscription in connection with the Software (including text, graphics, logos, design, icons, images, sound and video recordings, pricing, downloads and software) (<strong>Software Content</strong>) and reserve all rights in any Intellectual Property Rights owned or licensed by us in the Software Content not expressly granted to you.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Licence to you)</strong> You are granted a licence to the Software Content, for the Number of Software Uses, and you may make a temporary electronic copy of all or part of any materials provided to you for the sole purpose of viewing them and using them for the purposes of the Software. You must not otherwise reproduce, transmit, adapt, distribute, sell, modify or publish those materials or any Software Content without prior written consent from us or as otherwise permitted by law.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You acknowledge that the Software&rsquo;s compliance database utilises, references, and incorporates publicly available regulatory guidelines, legislation, and materials sourced from AHPRA, the National Boards, the TGA and other government or regulatory bodies (<strong>Regulatory Content</strong>). We do not claim ownership, copyright, or exclusive Intellectual Property Rights over the underlying Regulatory Content. Our Intellectual Property Rights are strictly limited to the Software, the AI algorithms, our proprietary databases and the specific compilation, formatting, design and presentation of the Regulatory Content within our Software.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">8.2 User data</h3>
              <h4 className="text-[15px] font-semibold text-gray-800 mb-2">Our rights and obligations</h4>
              <ol className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">You grant to us (and our Personnel) a non-exclusive, royalty free, non-transferable, worldwide and irrevocable licence to use User Data to the extent reasonably required to provide the Software, and for our internal business purposes, including to improve the Software and our other products and services, and including to apply machine learning and other analytics processes to the User Data.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We reserve the right to remove any User Data at any time, for any reason, including where we deem User Data to be inappropriate, offensive, illicit, illegal, pornographic, sexist, homophobic or racist.</li>
              </ol>
              <h4 className="text-[15px] font-semibold text-gray-800 mb-2 mt-4">Your obligations and grant of licence to us</h4>
              <ol className="list-[lower-alpha] pl-5 space-y-3" start={3}>
                <li className="text-[14px] text-gray-500 leading-relaxed">You are responsible for ensuring that:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">you share User Data only with intended recipients; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">all User Data is appropriate and not in contravention of these Terms.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">warrant that our use of User Data will not infringe any third-party Intellectual Property Rights; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">indemnify us from and against all losses, claims, expenses, damages and liabilities (including any taxes, fees or costs) which arise out of such infringement.</li>
                  </ul>
                </li>
              </ol>
              <h4 className="text-[15px] font-semibold text-gray-800 mb-2 mt-4">Use of de-identified user data for platform improvement</h4>
              <ol className="list-[lower-alpha] pl-5 space-y-3" start={5}>
                <li className="text-[14px] text-gray-500 leading-relaxed">We may use the User Data you submit to SafePost for regulatory assessment (including post text, assessment results, and related metadata) for the purposes of improving, developing, and refining our platform and AI assessment capabilities. Before using any User Data for these purposes, we will de-identify it by removing all information that could reasonably identify you or your practice.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">De-identified User Data may be used to:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">analyse patterns in regulatory issues identified across the platform</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">improve the accuracy and relevance of our AI-powered assessments</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">develop new assessment categories and regulatory coverage</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">produce aggregated, non-identifiable insights about advertising trends among Australian medical practitioners</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">All uses will be in accordance with our Privacy Policy, and we will not use your submitted content in a way that could reasonably identify you, your practice, or your patients. We will not sell de-identified data to third parties.</li>
              </ol>
            </div>

            {/* 9 */}
            <div>
              <h2 id="third-party-software-and-terms" className="text-lg font-bold text-gray-900 leading-snug mb-3">9. Third party software &amp; terms</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">9.1 Third party terms</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">If we are required to acquire goods or services supplied by a third party, you may be subject to the terms and conditions of that third party (<strong>&lsquo;Third Party Terms&rsquo;</strong>).</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Provided that we have notified you of such Third Party Terms and provided you with a copy of those terms, you agree to any Third Party Terms applicable to any goods or services supplied by a third party that we acquire as part of providing the Software to you and we will not be liable for any loss or damage suffered by you in connection with such Third Party Terms.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You have the right to reject any Third Party Terms. If you reject the Third Party Terms, we cannot provide the Software to you and clause 14 will apply.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">9.2 Third party software integrations</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">You acknowledge and agree that issues can arise when data is uploaded to software, when data is transferred between different software programs, and when different software programs are integrated together. We cannot guarantee that integration processes between the Software and other software programs will be free from errors, defects or delay.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You agree that we will not be liable for the functionality of any third party goods or services, including any third party software, or for the functionality of the Software if you integrate it with third party software, or change or augment the Software, including by making additions or changes to the Software code, and including by incorporating APIs into the Software.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If you add third party software or software code to the Software, integrate the Software with third party software, or make any other changes to the Software, including the Software code (<strong>User Software Changes</strong>), then:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">you acknowledge and agree that User Software Changes can have adverse effects on the Software;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">you will indemnify us in relation to any loss or damage that arises in connection with the User Software Changes;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">we will not be liable for any failure in the Software, to the extent such failure is caused or contributed to by a User Software Change;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">we may require you to change or remove User Software Changes, at our discretion, and if we do so, you must act promptly;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">we may suspend your access to the Software until you have changed or removed the User Software Change; and/or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">we may change or remove any User Software Change, in our absolute discretion. We will not be liable for loss of data or any other loss or damage you may suffer in relation to our amendment to, or removal of, any User Software Change.</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">9.3 Third party links</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">The Software may contain links to third-party websites or resources, including outbound links to AHPRA, the TGA or other regulatory bodies for your reference. These links are provided for your convenience only.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We do not endorse, control, monitor, or take responsibility for the content, accuracy, privacy practices, or availability of any third-party websites.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">You acknowledge and agree that we will not be liable for any loss or damage arising from your use of, or reliance on, any third-party website or resource linked from the Software.</li>
              </ul>
            </div>

            {/* 10 */}
            <div>
              <h2 id="confidentiality" className="text-lg font-bold text-gray-900 leading-snug mb-3">10. Confidentiality</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">Except as contemplated by these Terms, a party must not, and must not permit any of its Personnel, use or disclose to any person any Confidential Information disclosed to it by the other party without the disclosing party&rsquo;s prior written consent.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Each party must promptly notify the other party if it learns of any potential, actual or suspected loss, misappropriation or unauthorised access to, or disclosure or use of Confidential Information or other compromise of the security, confidentiality, or integrity of Confidential Information.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">The notifying party will investigate each potential, actual or suspected breach of confidentiality and assist the other party in connection with any related investigation.</li>
              </ul>
            </div>

            {/* 11 */}
            <div>
              <h2 id="privacy" className="text-lg font-bold text-gray-900 leading-snug mb-3">11. Privacy</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">We collect personal information about you in the course of providing you with the Software, to contact and communicate with you, to respond to your enquiries and for other purposes set out in our Privacy Policy which can be found at <a href="https://www.safepost.com.au/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">www.safepost.com.au/privacy-policy</a>.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Our Privacy Policy contains more information about how we use, disclose and store your personal information and details how you can access and correct your personal information.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">By agreeing to these Terms, you agree to our handling of personal information in accordance with our Privacy Policy.</li>
              </ul>
            </div>

            {/* 12 */}
            <div>
              <h2 id="liability" className="text-lg font-bold text-gray-900 leading-snug mb-3">12. Liability</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">12.1 Warranties and limitations</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Warranties)</strong> We warrant that:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">during the Subscription Period, the Software will be provided as described to you in, and subject to, these Terms; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">to our knowledge, the use of the Software in accordance with these Terms will not infringe the Intellectual Property Rights of any third party.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Errors)</strong> We will correct any errors, bugs or defects in the Software which arise during your Subscription and which are notified to us by you, unless the errors, bugs or defects:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">result from the interaction of the Software with any other Software or computer hardware, software or services not approved in writing by us;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">result from any misuse of the Software; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">result from the use of the Software by you other than in accordance with these Terms.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Service Limitations)</strong> While we will use our best endeavours to ensure the Software is working for its intended purpose, you acknowledge and agree that from time to time, you may encounter the following issues:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">the Software may have errors or defects;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">the Software may not be accessible at times;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">messages sent through the Software may not be delivered promptly, or delivered at all;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">information you receive or supply through the Software may not be secure or confidential; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">any information provided through the Software may not be accurate or true.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Exclusion)</strong> To the maximum extent permitted by applicable law, all express or implied representations and warranties not expressly stated in these Terms are excluded.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(Consumer law)</strong> Nothing in these Terms is intended to limit the operation of the Australian Consumer Law contained in the <em>Competition and Consumer Act 2010</em> (Cth) (<strong>ACL</strong>). Under the ACL, the Client may be entitled to certain remedies (like a refund, replacement or repair) if there is a failure with the goods or services provided.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">12.2 Liability caps</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">To the maximum extent permitted by law, we are not liable for any errors, omissions, or inaccuracies generated by the Software (including the Software&rsquo;s AI), nor for any subsequent regulatory audits, disciplinary actions, TGA penalties or AHPRA fines resulting from your use of or reliance on the Software.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">To the maximum extent permitted by law and subject to clause 12.2(c), the total liability of each party in respect of loss or damage sustained by the other party in connection with these Terms or the Software is limited to the total Fees paid to us by you in the 3 months preceding the date of the event giving rise to the relevant liability.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Clause 12.2(b) does not apply to either party&rsquo;s liability in respect of loss or damage sustained by them arising from the other party&rsquo;s breach of:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">clause 6 (Client Obligations);</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">third party intellectual property rights;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">clause 8 (Intellectual Property); and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">clause 10 (Confidentiality).</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">12.3 Consequential loss</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-3">To the maximum extent permitted by law, neither party will be liable for any incidental, special or consequential loss or damages, or damages for loss of data, business or business opportunity, goodwill, anticipated savings, profits or revenue in connection with these Terms or any goods or services provided by us, except:</p>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">in relation to a party&rsquo;s liability for fraud, personal injury, death or loss or damage to tangible property; or</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">to the extent this liability cannot be excluded under the <em>Competition and Consumer Act 2010</em> (Cth).</li>
              </ul>
            </div>

            {/* 13 */}
            <div>
              <h2 id="upgrades-and-downgrades" className="text-lg font-bold text-gray-900 leading-snug mb-3">13. Upgrades and downgrades</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">You may notify us that you would like to upgrade or downgrade your Subscription Tier or the Number of Software Users at any time. If you do, we will:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">take reasonable steps to promptly provide you with access to the new Subscription Tier or the additional Number of Software Users; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">upon providing such access, apply the new, relevant Subscription Fees to the Renewal Period immediately following the period in which your access to the new Subscription Tier was provided, and you will be charged at the new Subscription Fee in every subsequent Renewal Period.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If you choose to downgrade your Subscription or Number of Software Users, access to the new Subscription Tier or Number of Users and the new Subscription Fees will kick in at the start of the next Renewal Period, unless we notify you otherwise. We generally do not pro-rate downgrades in between Renewal Periods, however we reserve the right to from time to time.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If you choose to downgrade your Subscription, you acknowledge and agree we are not liable, and you release us from all claims in relation to, any loss of content, features, or capacity, including any User Data.</li>
              </ul>
            </div>

            {/* 14 */}
            <div>
              <h2 id="cancellation" className="text-lg font-bold text-gray-900 leading-snug mb-3">14. Cancellation</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">14.1 Cancellation at any time</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">You may cancel your Subscription at any time using the self-service cancellation feature on the Billing page within the Software. Your cancellation will take effect at the end of your current paid billing period. You will continue to have full access to your Subscription until that date, and no pro-rata refunds will be provided for the remainder of the billing period.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">We may cancel or terminate your Subscription for convenience by providing you with written notice. Unless specified otherwise in our notice, such cancellation will take effect at the end of your current billing period.</li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">14.2 Cancellation for breach</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-3 mb-6">
                <li className="text-[14px] text-gray-500 leading-relaxed">Either party may cancel your Subscription immediately by written notice if there has been a Breach of these Terms.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">A &ldquo;<strong>Breach</strong>&rdquo; of these Terms means:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">a party (<strong>Notifying Party</strong>) considers the other party (or any of its Personnel or Users) is in breach of these Terms and notifies the other party;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">the other party is given 10 Business Days to rectify the breach; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">the breach has not been rectified within 10 Business Days or another period agreed between the parties in writing.</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">14.3 Effect of termination</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-3">Upon termination of this agreement:</p>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">where termination is for convenience under clause 14.1, you will retain access to the Software until the end of your then-current billing cycle. At the end of that billing cycle, your subscription will not renew, and your access will cease;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">upon the cessation of your access under clause 14.3(a), or upon immediate termination for any other reason, you will no longer have access to the Software, your Account, or your User Data. We will have no responsibility to store or otherwise retain any User Data (and you release us in respect of any loss or damage which may arise out of us not retaining any User Data beyond that point);</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">unless agreed in writing, any Subscription Fees that would otherwise have been payable after termination for the remainder of the relevant Renewal Period will remain payable and, to the maximum extent permitted by law, no Subscription Fees already paid will be refundable; and</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">each party must comply with all obligations that are by their nature intended to survive the end of this agreement, including without limitation the liability caps, intellectual property rights and confidentiality clause.</li>
              </ul>
            </div>

            {/* 15 */}
            <div>
              <h2 id="dispute-resolution" className="text-lg font-bold text-gray-900 leading-snug mb-3">15. Dispute resolution</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">A party claiming that a dispute has arisen under or in connection with this agreement must not commence court proceedings arising from or relating to the dispute, other than a claim for urgent interlocutory relief, unless that party has complied with the requirements of this clause.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">A party that requires resolution of a dispute which arises under or in connection with this agreement must give the other party or parties to the dispute written notice containing reasonable details of the dispute and requiring its resolution under this clause.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Once the dispute notice has been given, each party to the dispute must then use its best efforts to resolve the dispute in good faith. If the dispute is not resolved within a period of 14 days (or such other period as agreed by the parties in writing) after the date of the notice, any party to the dispute may take legal proceedings to resolve the dispute.</li>
              </ul>
            </div>

            {/* 16 */}
            <div>
              <h2 id="force-majeure" className="text-lg font-bold text-gray-900 leading-snug mb-3">16. Force majeure</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">We will not be liable for any delay or failure to perform its obligations under this agreement if such delay or failure arises out of a Force Majeure Event.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">If a Force Majeure Event occurs, we must use reasonable endeavours to notify you of:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">reasonable details of the Force Majeure Event; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">so far as is known, the probable extent to which we will be unable to perform or be delayed in performing its obligations under this agreement.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Subject to compliance with clause 16(b), our relevant obligation will be suspended during the Force Majeure Event to the extent that it is affected by the Force Majeure Event.</li>
                <li className="text-[14px] text-gray-500 leading-relaxed">For the purposes of this agreement, a &lsquo;Force Majeure Event&rsquo; means any:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">act of God, lightning strike, meteor strike, earthquake, storm, flood, landslide, explosion or fire;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">strikes or other industrial action outside of the control of us;</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">war, terrorism, sabotage, blockade, revolution, riot, insurrection, civil commotion, epidemic, pandemic; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">any decision of a government authority in relation to COVID-19, or any threat of COVID-19 beyond the reasonable control of us, to the extent it affects our ability to perform our obligations.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 17 */}
            <div>
              <h2 id="notices" className="text-lg font-bold text-gray-900 leading-snug mb-3">17. Notices</h2>
              <ul className="list-[lower-alpha] pl-5 space-y-3">
                <li className="text-[14px] text-gray-500 leading-relaxed">A notice or other communication to a party under these Terms must be:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">in writing and in English; and</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">delivered via email to the other party, to the email address specified in the Order, or if no email address is specified in the Order, then the email address most regularly used by the parties to correspond regarding the subject matter of this agreement as at the date of this agreement (<strong>Email Address</strong>). The parties may update their Email Address by notice to the other party.</li>
                  </ul>
                </li>
                <li className="text-[14px] text-gray-500 leading-relaxed">Unless the party sending the notice knows or reasonably ought to suspect that an email was not delivered to the other party&rsquo;s Email Address, notice will be taken to be given:
                  <ul className="list-[lower-roman] pl-5 space-y-2 mt-2">
                    <li className="text-[14px] text-gray-500 leading-relaxed">24 hours after the email was sent, unless that falls on a Saturday, Sunday or a public holiday in the state or territory whose laws govern this agreement, in which case the notice will be taken to be given on the next occurring business day in that state or territory; or</li>
                    <li className="text-[14px] text-gray-500 leading-relaxed">when replied to by the other party,</li>
                  </ul>
                  <p className="text-[14px] text-gray-500 leading-relaxed mt-2">whichever is earlier.</p>
                </li>
              </ul>
            </div>

            {/* 18 */}
            <div>
              <h2 id="general" className="text-lg font-bold text-gray-900 leading-snug mb-3">18. General</h2>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.1 Governing law and jurisdiction</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">This agreement is governed by the law applying in New South Wales, Australia. Each party irrevocably submits to the exclusive jurisdiction of the courts of New South Wales, Australia and courts of appeal from them in respect of any proceedings arising out of or in connection with this agreement. Each party irrevocably waives any objection to the venue of any legal process on the basis that the process has been brought in an inconvenient forum.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.2 Waiver</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">No party to this agreement may rely on the words or conduct of any other party as a waiver of any right unless the waiver is in writing and signed by the party granting the waiver.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.3 Severance</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Any term of this agreement which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity and enforceability of the remainder of this agreement is not limited or otherwise affected.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.4 Joint and several liability</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">An obligation or a liability assumed by, or a right conferred on, two or more persons binds or benefits them jointly and severally.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.5 Assignment</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">A party cannot assign, novate or otherwise transfer any of its rights or obligations under this agreement without the prior written consent of the other party.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.6 Entire agreement</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">This agreement embodies the entire agreement between the parties and supersedes any prior negotiation, conduct, arrangement, understanding or agreement, express or implied, in relation to the subject matter of this agreement.</p>

              <h3 className="text-[15px] font-semibold text-gray-800 mb-2">18.7 Interpretation</h3>
              <ul className="list-[lower-alpha] pl-5 space-y-2">
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(singular and plural)</strong> words in the singular includes the plural (and vice versa);</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(currency)</strong> a reference to $ or &ldquo;dollar&rdquo; is to Australian currency;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(gender)</strong> words indicating a gender includes the corresponding words of any other gender;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(defined terms)</strong> if a word or phrase is given a defined meaning, any other part of speech or grammatical form of that word or phrase has a corresponding meaning;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(person)</strong> a reference to &ldquo;person&rdquo; or &ldquo;you&rdquo; includes an individual, the estate of an individual, a corporation, an authority, an association, consortium or joint venture (whether incorporated or unincorporated), a partnership, a trust and any other entity;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(party)</strong> a reference to a party includes that party&rsquo;s executors, administrators, successors and permitted assigns, including persons taking by way of novation and, in the case of a trustee, includes any substituted or additional trustee;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(this agreement)</strong> a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure is a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure to or of this agreement, and a reference to this agreement includes all schedules, exhibits, attachments and annexures to it;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(document)</strong> a reference to a document (including this agreement) is to that document as varied, novated, ratified or replaced from time to time;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(headings)</strong> headings and words in bold type are for convenience only and do not affect interpretation;</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(includes)</strong> the word &ldquo;includes&rdquo; and similar words in any form is not a word of limitation; and</li>
                <li className="text-[14px] text-gray-500 leading-relaxed"><strong>(adverse interpretation)</strong> no provision of this agreement will be interpreted adversely to a party because that party was responsible for the preparation of this agreement or that provision.</li>
              </ul>
            </div>

            {/* Definitions */}
            <div>
              <h2 id="definitions" className="text-lg font-bold text-gray-900 leading-snug mb-3">19. Definitions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] text-gray-500 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left text-gray-700 font-semibold px-4 py-3 border border-gray-200 w-[200px]">Term</th>
                      <th className="text-left text-gray-700 font-semibold px-4 py-3 border border-gray-200">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Confidential Information', 'means information of or provided by a party that is by its nature confidential information, is designated by that party as confidential, or that the other party knows or ought to know is confidential, but does not include information which is or becomes, without a breach of confidentiality, public knowledge.'],
                      ['Hosting Services', 'has the meaning given in clause 5.'],
                      ['Intellectual Property Rights', 'means any and all present and future intellectual and industrial property rights throughout the world (whether registered or unregistered), including copyright, trade marks, designs, patents, moral rights, semiconductor and circuit layout rights, trade, business, company and domain names, and other proprietary rights, trade secrets, know-how, technical data, confidential information and the right to have information kept confidential, or any rights to registration of such rights (including renewal), whether created before or after the date of this agreement.'],
                      ['Material', 'means tangible and intangible information, documents, reports, software (including source and object code), inventions, data and other materials in any media whatsoever.'],
                      ['Number of Software Users', 'means the number of Users that you may make the Software available to, in accordance with your Subscription Tier.'],
                      ['Personnel', 'means, in respect of a party, its officers, employees, contractors (including subcontractors) and agents.'],
                      ['Software', 'has the meaning given in the first paragraph of these Terms.'],
                      ['Software Content', 'has the meaning set out in clause 8.1(a).'],
                      ['Subscription', 'has the meaning given in the first paragraph of these Terms.'],
                      ['Subscription Fees', 'has the meaning set out in clause 7 of these Terms.'],
                      ['Subscription Period', 'means the period of your Subscription to the Software as agreed on the Website.'],
                      ['Subscription Tier', 'has the meaning given in the first paragraph of these Terms.'],
                      ['User', 'means you and any third party end user of the Software who you make the Software available to.'],
                      ['User Data', 'means any files, data, document, information or any other Materials, which is uploaded to the Software by you or any other User or which you, your Personnel or Users otherwise provide to us under or in connection with these Terms, including any Intellectual Property Rights attaching to those materials.'],
                      ['Website', 'means the website at the URL set out in the first paragraph of these Terms, and any other website operated by us in connection with the Software.'],
                    ].map(([term, definition], i) => (
                      <tr key={i} className={`align-top ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700">{term}</td>
                        <td className="px-4 py-3 border border-gray-200 leading-relaxed">{definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );

  if (user) {
    return (
      <LoggedInLayout>
        <>
          <div className="max-w-6xl mx-auto px-6 pt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
          {contentSection}
        </>
      </LoggedInLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f4]">
      <Helmet>
        <title>Terms of Use — SafePost</title>
        <meta name="description" content="The terms governing your use of the SafePost compliance checking service." />
      </Helmet>
      <PublicHeader />

      {contentSection}

      <PublicFooter />
    </div>
  );
};

export default SoftwareTerms;
