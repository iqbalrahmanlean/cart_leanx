// src/components/TermsConditionsPage.js
import React, { useEffect } from 'react';

function TermsConditionsPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-conditions">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              These Terms and Conditions ("Agreement") are entered into between Payright Sdn Bhd ("Payright," 
              "we," "us," or "our") and users ("Customer," "you," or "your") of our Payright Online Store 
              platform ("Platform").
            </p>
            
            <p className="text-gray-700 mb-8">
              By using the services provided by Payright Sdn Bhd, you agree to comply with and be bound by 
              the terms and conditions outlined in this Agreement. If you do not agree with these terms, 
              please do not use our services.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products and Services</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Product Listings:</h3>
                  <p className="text-gray-700 pl-4">
                    Payright have the right to list and advertise our products or services on the Platform.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Product Information:</h3>
                  <p className="text-gray-700 pl-4">
                    Payright is responsible for providing accurate and up-to-date information about our 
                    products, including pricing and availability.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders and Payment</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Order Acceptance:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>Payright reserve the right to accept or decline orders at our discretion.</li>
                    <li>
                      For new international customers, order verification will take place <strong>7-9 days</strong> from the 
                      ordering date to ensure compliance with the shipment policy based on the receiving 
                      country, manage stock availability, and verify transactions.
                    </li>
                    <li>
                      For new local customers, order verification will take <strong>3-4 days</strong> if the shipment is 
                      more than RM2500.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Pricing and Payment:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>Prices for products or services are as listed on the Payright Online Store Platform.</li>
                    <li>Payment methods and processing will be outlined in our payment policy (Section 3).</li>
                    <li>
                      Customers using an international credit card for the first time will be subject to an 
                      additional <strong>6-7 days</strong> for payment verification. This extended period is necessary to 
                      ensure the legitimacy of the payment and to mitigate potential risks associated with 
                      disputes, fraud, and unauthorized transactions. This precautionary measure helps us 
                      protect both our customers and our business from fraudulent activities and ensures 
                      that all payments are thoroughly validated before order processing.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Policy</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Payment Methods:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>We use Payright as payment facility.</li>
                    <li>
                      By making a purchase, you agree to the terms and conditions of the payment provider.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Billing Information</h2>
              <p className="text-gray-700">
                Customers must provide accurate billing and payment information when making a purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refunds and Returns</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Refunds and Returns Policy:</h3>
                <ul className="space-y-2 text-gray-700 pl-4">
                  <li>Our refund and return policy for products or services will be outlined on our store page.</li>
                  <li>
                    Customers are responsible for reviewing and adhering to our refund and return policy.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">1. Delivery Provider:</h3>
                  <p className="text-gray-700 pl-4">
                    The choice of a delivery provider for your order will be made by the respective merchant. 
                    Merchants will select delivery providers they deem appropriate based on their knowledge 
                    or experience and geographical availability.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">2. Shipping and Delivery Information:</h3>
                  <ul className="space-y-2 text-gray-700 pl-4">
                    <li>
                      Merchants are responsible for providing clear information about shipping methods, 
                      delivery times, and any associated fees on their store page.
                    </li>
                    <li>
                      Customers should review the provided shipping and delivery information for each 
                      merchant before making a purchase.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">3. Delivery Charges:</h3>
                  <p className="text-gray-700 pl-4">
                    Merchants may apply delivery charges depending on the selected delivery provider and 
                    the destination of the order. Customers should be aware of any applicable charges and 
                    review them before completing a purchase.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Responsibilities</h2>
              <ul className="space-y-2 text-gray-700 pl-4">
                <li>
                  Customers are responsible for providing accurate and up-to-date information when making purchases.
                </li>
                <li>
                  Customers must adhere to our store's terms, including refund and return policies.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Termination of Service:</h3>
                <p className="text-gray-700 pl-4">
                  We reserve the right to terminate or suspend our services to customers for any violation 
                  of these terms or other reasons at our discretion.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liability</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Limitation of Liability:</h3>
                <p className="text-gray-700 pl-4">
                  We shall not be held liable for any disputes, damages, losses, or claims arising from 
                  transactions between us and customers. Customers are encouraged to contact us for 
                  dispute resolution.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Amendments:</h3>
                <p className="text-gray-700 pl-4">
                  We reserve the right to amend or modify these Terms and Conditions at any time. 
                  Any changes will be effective immediately upon posting on our store page.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">1. Contact Us:</h3>
                <p className="text-gray-700 pl-4">
                  For questions or concerns related to these Terms and Conditions, please contact us at{' '}
                  <a 
                    href="mailto:support@payright.my" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    support@payright.my
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditionsPage;