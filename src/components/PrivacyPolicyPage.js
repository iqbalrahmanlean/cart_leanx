// src/components/PrivacyPolicyPage.js
import React, { useEffect } from 'react';

function PrivacyPolicyPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-conditions">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: 01/05/2024</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy ("Policy") is provided by Payright Sdn Bhd ("Payright", "we," "our," or "us"), 
              and it explains how we collect, use, disclose, and safeguard your personal information when you use 
              our services on the Payright Online Store platform. By using our services, you acknowledge that you 
              have read, understood, and agreed to this Policy.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We may collect the following types of personal information from you when you use our services:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information:</h3>
                  <p className="text-gray-700">
                    We may collect your name, email address, phone number, and shipping address when you 
                    create an account or make a purchase.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information:</h3>
                  <p className="text-gray-700">
                    We do not collect payment card information directly. When you make a purchase through 
                    our platform, you will be redirected to a third-party payment card processor, such as 
                    Paypal and Paynet to complete the transaction. Please review the privacy policy of the 
                    third-party processor for information about how they collect, use, and protect your 
                    payment card information.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Information:</h3>
                  <p className="text-gray-700">
                    We may collect information about the products or services you order, including details 
                    about the items, prices, and quantities.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication:</h3>
                  <p className="text-gray-700">
                    We may collect information related to your communications with us, including customer 
                    support inquiries and feedback.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may use your personal information for the following purposes:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Providing Services:</h3>
                  <p className="text-gray-700">
                    To provide, maintain, and improve our services on the Payright Online Store platform.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication:</h3>
                  <p className="text-gray-700">
                    To communicate with you regarding your orders, inquiries, and feedback.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing:</h3>
                  <p className="text-gray-700">
                    To send you promotional materials, newsletters, and updates about our products and 
                    services. You may opt out of receiving marketing communications at any time.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Compliance:</h3>
                  <p className="text-gray-700">
                    To comply with applicable laws, regulations, and legal processes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclosure of Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may disclose your personal information to the following categories of recipients:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Service Providers:</h3>
                  <p className="text-gray-700">
                    We may share your information with third-party service providers who help us operate 
                    our services, including payment processors, shipping providers, and marketing partners.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Requirements:</h3>
                  <p className="text-gray-700">
                    We may disclose your information in response to legal requests or processes, such as 
                    court orders or subpoenas.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We take reasonable measures to protect your personal information from unauthorized access, 
                disclosure, alteration, or destruction. However, please be aware that no method of 
                transmission over the internet or electronic storage is entirely secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Choices</h2>
              <p className="text-gray-700 mb-4">
                You can access, update, or delete your account information by logging into your account settings.
              </p>
              <p className="text-gray-700">
                You may opt out of receiving marketing communications from us by following the unsubscribe 
                instructions provided in those communications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Updates to this Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or 
                for other operational, legal, or regulatory reasons. The updated Policy will be posted on 
                this page with an updated effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please contact us at{' '}
                <a 
                  href="mailto:support@payright.my" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  support@payright.my
                </a>
                .
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-600 text-sm">
                By using our Payright Online Store services, you acknowledge that you have read, understood, 
                and agreed to these Terms and Conditions. This Agreement constitutes the entire understanding 
                between you and Payright services regarding your use of our services on the Payright Online Store platform.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Effective Date: 01/05/2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;