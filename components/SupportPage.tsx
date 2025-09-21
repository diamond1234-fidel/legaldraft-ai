import React from 'react';

const SupportPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">Support & Help Center</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Find answers to common questions or get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem
              question="Is this platform a law firm?"
              answer="No. We are a software tool designed to assist with document drafting and review. We do not provide legal advice, and all documents should be reviewed by a licensed attorney in your jurisdiction."
            />
            <FAQItem
              question="How accurate is the AI?"
              answer="Our AI is trained on a vast corpus of legal documents and is designed to be highly accurate. However, AI is not infallible. It is a powerful assistant, but not a substitute for professional legal review."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes. We take data security very seriously. All data is encrypted in transit and at rest. We do not use your contract data to train our models."
            />
            <FAQItem
              question="How do I cancel my subscription?"
              answer="You can manage your subscription, including cancellation, from the Billing page at any time. Your access will continue until the end of the current billing period."
            />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Your Name</label>
                <input type="text" id="name" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Your Email</label>
                <input type="email" id="email" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md"></textarea>
              </div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <details className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer group">
    <summary className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center list-none">
        {question}
        <div className="ml-4 transition-transform transform group-open:rotate-180">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
    </summary>
    <p className="text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{answer}</p>
  </details>
);

export default SupportPage;