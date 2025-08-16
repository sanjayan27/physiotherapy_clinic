// pages/about.js or app/about/page.js (depending on your Next.js version)
"use client"

import Image from 'next/image'
import Head from 'next/head'
import images from '@/app/assets/pic1.png'
export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - Global Dentistry</title>
        <meta name="description" content="Our team has only one mission: Make you smile" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-white  to-teal-100 font-sans ">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={images}
                    alt="Happy patient receiving dental treatment"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                {/* Bottom left image */}
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={images}
                    alt="Dental team providing care"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Bottom right image */}
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={images}
                    alt="Professional dental consultation"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-40 blur-2xl"></div>
            </div>
            
            {/* Right side - Content */}
            <div className="space-y-8">
              {/* About Us Badge */}
              <div className="inline-block">
                <span className="bg-white text-teal-700  px-4 py-2 rounded-full text-lg font-bold shadow-md border border-purple-100">
                  About Us
                </span>
              </div>
              
              {/* Main Heading */}
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  Our team has only one mission:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-800">
                    Make you smile
                  </span>
                </h1>
                
                <p className="text-md text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
                  maecenas viverra at quis nibh. Tortor, quis aenean vitae, enim, 
                  magna tortor. Sed vivamus porttitor tempus
                </p>
                
                <p className="mt-6 text-lg text-gray-600 leading-relaxed ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
                  maecenas viverra at quis nibh. Tortor, quis aenean vitae, enim, 
                  magna tortor. Sed vivamus porttitor tempus
                </p>
              </div>
              
              {/* Team Member Card */}
              
              
              {/* Stats or additional info */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold global-text-color-teal mb-2">500+</div>
                  <div className="text-sm text-gray-600">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-700 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold global-text-color-teal mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// If you're using Next.js 13+ with app directory, use this instead:
/*
// app/about/page.js
import Image from 'next/image'

export const metadata = {
  title: 'About Us - Global Dentistry',
  description: 'Our team has only one mission: Make you smile',
}

export default function AboutPage() {
  // Same component code as above, but without the Head component
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      // ... rest of the component
    </div>
  )
}
*/