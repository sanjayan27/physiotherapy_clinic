import { Phone, Mail, MapPin } from 'lucide-react';

export default function GetInTouch() {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto font-sans">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help you on your journey to better health
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 font-sans">
          {/* Phone */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Phone
            </h3>
            <p className="text-gray-600 text-lg">
              +91 1234567890
            </p>
          </div>

          {/* Email */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Email
            </h3>
            <p className="text-gray-600 text-lg">
              info@clinic.com
            </p>
          </div>

          {/* Location */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Location
            </h3>
            <p className="text-gray-600 text-lg">
              123 Health Street, Medical District
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}