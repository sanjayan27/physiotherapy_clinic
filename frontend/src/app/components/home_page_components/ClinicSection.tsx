"use client";

import { CheckCircle, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClinicSection() {
  const router = useRouter();

  const navigate = () => {
    router.push("/book-appointment");
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div>
            <h2 className="text-4xl font-bold font-sans text-gray-900 mb-12">
              Why Choose Our Clinic?
            </h2>

            <div className="space-y-8">
              {/* Expert Physiotherapists */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 global-bg-color  rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-sans font-semibold text-gray-900 mb-2">
                    Expert Physiotherapists
                  </h3>
                  <p className="text-gray-600">
                    Certified professionals with years of specialized experience
                  </p>
                </div>
              </div>

              {/* Flexible Scheduling */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 global-bg-color  rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">
                    Flexible Scheduling
                  </h3>
                  <p className="text-gray-600">
                    Easy online booking with convenient time slots
                  </p>
                </div>
              </div>

              {/* Personalized Care */}
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 global-bg-color  rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">
                    Personalized Care
                  </h3>
                  <p className="text-gray-600">
                    Treatment plans tailored to your specific condition and
                    goals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="bg-gradient-to-t from-teal-100 to-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-semibold font-sans text-2xl text-gray-600 mb-4">
              Ready to Start Your Recovery?
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Book your consultation today and take the first step towards a
              pain-free life.
            </p>
            <button
              onClick={navigate}
              className="w-full global-bg-color  hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 font-sans cursor-pointer"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
