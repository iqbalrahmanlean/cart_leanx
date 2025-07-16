// src/components/RefundPolicyPage.js
import React, { useEffect } from 'react';

function RefundPolicyPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-conditions">Return and Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: 01/05/2024</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Thank you for shopping with Payright Sdn Bhd on the Payright Online Store platform. Your 
              satisfaction is important to us. Please read this policy carefully to understand your rights 
              and obligations when making a purchase from our store.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Defective or Damaged Items:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>
                      If you receive a defective or damaged item, please contact our customer support 
                      team within <strong>7 days</strong> of receiving the product via{' '}
                      <a 
                        href="mailto:support@payright.my" 
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        support@payright.my
                      </a>
                    </li>
                    <li>
                      Provide clear photos or videos showing the issue to expedite the return process.
                    </li>
                    <li>
                      We will assess the issue and provide instructions for the return or exchange.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Non-Returnable Items:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>Perishable goods such as food, flowers, newspapers or magazines</li>
                    <li>Intimate or sanitary goods, hazardous materials, or flammable liquids or gases</li>
                    <li>Gift cards</li>
                    <li>Downloadable software products</li>
                    <li>Some health and personal care goods</li>
                    <li>and such other goods which may be reasonably added from time to time</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refunds</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Refund Process:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>
                      Once we receive your returned item and verify its condition, we will initiate the 
                      refund process via bank transfer.
                    </li>
                    <li>
                      To process the refund, you must provide us with the following information:
                      <ul className="mt-2 ml-4 space-y-1">
                        <li>• Bank Name</li>
                        <li>• Bank Account Holder Name</li>
                        <li>• Bank Account Number</li>
                        <li>• [Additional Bank Details as Required]</li>
                      </ul>
                    </li>
                    <li>
                      Refunds will be processed within <strong>7 business days</strong> upon receiving 
                      your bank information.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Partial Refunds:</h3>
                  <p className="text-gray-700 pl-4">
                    In some cases, we may offer partial refunds for items that are returned with missing 
                    parts or in a damaged or used condition.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">3. Non-Refundable Services/Situations:</h3>
                  <p className="text-gray-700 mb-3">
                    Notwithstanding the foregoing, the following are some non-refundable services/situations:
                  </p>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>The job / service is already completed.</li>
                    <li>
                      The job / service cancellation past the duration set in our refund policy which is 
                      not more than 7 days from the payment date.
                    </li>
                    <li>Change of mind.</li>
                    <li>Insisted on having a service provided in a particular way, against our advice.</li>
                    <li>Failed to clearly explain your needs to us.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellations</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Order Cancellations:</h3>
                <ul className="space-y-2 text-gray-700 pl-4">
                  <li>
                    If you wish to cancel your order, please contact us as soon as possible via{' '}
                    <a 
                      href="mailto:support@payright.my" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      support@payright.my
                    </a>
                  </li>
                  <li>
                    We will attempt to accommodate your request if the order has not yet been processed.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions or need assistance with returns, refunds, or cancellations, 
                please contact our customer support team at{' '}
                <a 
                  href="mailto:support@payright.my" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  support@payright.my
                </a>
                {' '}or{' '}
                <a 
                  href="tel:0103837694" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  0103837694
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-700">
                Payright Sdn Bhd reserves the right to modify or update this policy at any time without 
                prior notice. Any fraudulent activity or misuse of our return and refund policy may result 
                in the denial of a return or refund request.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-600 text-sm">
                Last Updated: 01/05/2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicyPage;