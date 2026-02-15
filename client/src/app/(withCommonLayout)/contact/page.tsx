import ContactFrom from "@/components/pages/contact/ContactFrom";
import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Village Food | Contact Us - Get in Touch",
  description: "Contact Village Food for organic products, customer support, and inquiries. We're here to help!",
};

const Contact = async () => {
  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-green-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageCircle className="w-4 h-4" />
            We'd Love to Hear From You
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Get in Touch 💬
          </h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto">
            Have questions about our organic products? We're here to help!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Form */}
            <div className="bg-white rounded-md shadow-md p-8 lg:p-10 border-2 border-green-100">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Send us a Message 📝
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>
              <ContactFrom />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-white rounded-md shadow-md p-8 border-2 border-green-100">
                <h2 className="text-3xl font-black text-gray-900 mb-6">
                  Contact Information 📍
                </h2>

                {/* Address */}
                <div className="flex items-start gap-4 mb-6 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors duration-300">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-700">
                      62/B North Pirerbag 60ft Mirpur Dhaka-1216.
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors duration-300">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-1">Hotline</h3>
                    <a
                      href="tel:+8801714028279"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-semibold"
                    >
                      +88 01714-028-279
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4 mb-6 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors duration-300">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/8801714028279"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-600 transition-colors font-semibold"
                    >
                      +88 01714-028-279
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors duration-300">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 mb-1">Email</h3>
                    <a
                      href="mailto:yousufengineering2024@gmail.com"
                      className="text-gray-700 hover:text-orange-600 transition-colors font-semibold break-all"
                    >
                      yousufengineering2024@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-md shadow-md p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8" />
                  <h3 className="text-2xl font-black">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="font-semibold">Saturday - Thursday</span>
                    <span className="font-bold">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Friday</span>
                    <span className="font-bold">Closed</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <p className="text-sm text-green-50">
                    💚 We respond to all messages within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Optional) */}
      <div className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Visit Our Store 🏪
            </h2>
            <p className="text-xl text-gray-600">
              Come experience our organic products in person
            </p>
          </div>
          <div className="rounded-md overflow-hidden shadow-md border-4 border-green-100 h-[400px] bg-gray-100 flex items-center justify-center">
            {/* Replace with actual Google Maps embed */}
            <iframe
              className="w-full h-full border-none"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.34905776821876!2d90.36641156489274!3d23.790403631007976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0c89187b3bd%3A0x5949ab399ebc916!2sOrganon%20Homeo%20Hall!5e0!3m2!1sen!2sbd!4v1760260755416!5m2!1sen!2sbd"
              title="Yousuf Engineering location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

{/* <iframe
  className="h-[90px] w-full border-none"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.34905776821876!2d90.36641156489274!3d23.790403631007976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0c89187b3bd%3A0x5949ab399ebc916!2sOrganon%20Homeo%20Hall!5e0!3m2!1sen!2sbd!4v1760260755416!5m2!1sen!2sbd"
  title="Yousuf Engineering location"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe> */}