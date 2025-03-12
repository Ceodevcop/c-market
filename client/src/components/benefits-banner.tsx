export default function BenefitsBanner() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Central-M?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to making buying and selling easier, safer, and more accessible for everyone.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Secure Transactions */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
            <p className="text-gray-600 text-sm">
              Our platform ensures your payments and personal information are always protected.
            </p>
          </div>
          
          {/* Easy to Use */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M12 22v-5" />
                <path d="M9 8V2H5a2 2 0 0 0-2 2v4" />
                <path d="M14 8h5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
                <rect width="8" height="8" x="3" y="8" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple and intuitive platform makes buying and selling a breeze for everyone.
            </p>
          </div>
          
          {/* 24/7 Support */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Our customer service team is always available to help with any questions or issues.
            </p>
          </div>
          
          {/* Global Community */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-primary mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" x2="22" y1="12" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Global Community</h3>
            <p className="text-gray-600 text-sm">
              Join millions of users worldwide who trust our platform for their buying and selling needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
