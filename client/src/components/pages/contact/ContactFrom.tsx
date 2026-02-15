"use client";

import { ContactPosting } from "@/services/contact";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send, Loader2 } from "lucide-react";

type FormFields = "name" | "email" | "phone" | "subject" | "message";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactFrom = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id in formData) {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await ContactPosting(formData);

      if (result) {
        toast.success("🎉 Your message has been sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("❌ Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("⚠️ An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="form-group">
          <label
            className="block text-gray-800 font-bold mb-2 text-sm"
            htmlFor="name"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300"
            placeholder="Enter your name"
          />
        </div>

        {/* Email & Phone in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              className="block text-gray-800 font-bold mb-2 text-sm"
              htmlFor="email"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label
              className="block text-gray-800 font-bold mb-2 text-sm"
              htmlFor="phone"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
        </div>

        {/* Subject Field */}
        <div className="form-group">
          <label
            className="block text-gray-800 font-bold mb-2 text-sm"
            htmlFor="subject"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300"
            placeholder="What is this about?"
          />
        </div>

        {/* Message Field */}
        <div className="form-group">
          <label
            className="block text-gray-800 font-bold mb-2 text-sm"
            htmlFor="message"
          >
            Message *
          </label>
          <textarea
            id="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300 resize-none"
            placeholder="Tell us how we can help you..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-101 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center gap-3 overflow-hidden cursor-pointer "
        >
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>

          {/* Button content */}
          <span className="relative flex items-center gap-3">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                Send Message
              </>
            )}
          </span>
        </button>

        {/* Helper Text */}
        <p className="text-sm text-gray-500 text-center">
          We'll respond within 24 hours 💚
        </p>
      </form>

      {/* Toast Container with Custom Styling */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />

      {/* Custom Toast Styles */}
      <style jsx global>{`
        .Toastify__toast--success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          font-weight: 600;
        }
        
        .Toastify__toast--error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 12px;
          font-weight: 600;
        }
        
        .Toastify__progress-bar--success {
          background: #ffffff;
        }
        
        .Toastify__progress-bar--error {
          background: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default ContactFrom;