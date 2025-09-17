
import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

const PrivacyPolicyPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} />
            <main className="container mx-auto px-4 py-20 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg dark:prose-invert mt-12 max-w-none">
                        <p>LegalDraft AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>

                        <h2>1. Information We Collect</h2>
                        <p>We may collect personal information in the following ways:</p>
                        <ul>
                            <li><strong>Information You Provide:</strong> This includes account registration data (name, email), payment information (processed by a third-party payment processor like Stripe), and any communications you send to us.</li>
                            <li><strong>Document Data:</strong> We collect and store the documents you upload for analysis or generate using our service ("Document Data"). This data is treated as confidential.</li>
                            <li><strong>Usage Data:</strong> We automatically collect information about your interaction with our Service, such as IP address, browser type, pages visited, and features used.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, operate, and maintain our Service.</li>
                            <li>Process your transactions and manage your subscription.</li>
                            <li>Improve, personalize, and expand our Service.</li>
                            <li>Communicate with you, including for customer service and to provide you with updates and other information relating to the Service.</li>
                            <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights.</li>
                        </ul>
                        <p><strong>We do not use your confidential Document Data to train our AI models without your explicit, opt-in consent.</strong></p>


                        <h2>3. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your information with third-party service providers to perform services on our behalf, such as payment processing, data analysis, and hosting. These third parties are obligated to protect your information and are not permitted to use it for any other purpose.</p>
                        <p>We may also disclose your information if required by law or in response to valid requests by public authorities (e.g., a court or a government agency).</p>

                        <h2>4. Data Security</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. All data is encrypted in transit using SSL/TLS technology and encrypted at rest. However, no electronic transmission or storage is 100% secure, and we cannot guarantee its absolute security.</p>
                        
                        <h2>5. Your Data Rights</h2>
                        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                        <ul>
                            <li>The right to access, update, or delete the information we have on you.</li>
                            <li>The right to object to our processing of your personal information.</li>
                            <li>The right to data portability.</li>
                            <li>The right to withdraw consent at any time.</li>
                        </ul>
                        <p>You can exercise these rights by accessing your account settings or contacting us directly.</p>

                        <h2>6. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

                        <h2>7. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

                        <h2>Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('support'); }}>contact us</a>.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;