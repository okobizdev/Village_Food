import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { Leaf, Droplet, Heart, Award, Sprout, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Village Food | About Us - Farm Fresh Organic Products",
  description: "Discover Village Food - Your trusted source for 100% organic products including fresh oils, fruits, vegetables, and more. Farm to table goodness.",
};

const page = async () => {
  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-green-50">

      {/* Hero Section */}
      <section className="relative py-20 mt-16 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Leaf className="w-4 h-4" />
              100% Organic & Natural
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Welcome to <span className="text-green-600">Village Food</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From our village farms to your table — Pure, organic, and full of life
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Image Section */}
            <div className="relative w-full lg:w-1/2">
              <div className="relative aspect-square rounded-md overflow-hidden shadow-md">
                <Image
                  src="/assets/logo/logo.png"
                  alt="Village Food - Organic products from farm to table"
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-700 cursor-pointer"
                  priority
                />
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-md shadow-md">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Certified</p>
                      <p className="text-sm font-black text-green-600">100% Organic</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-500 rounded-full opacity-20 blur-xl"></div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-md p-8 lg:p-10 shadow-md border-2 border-green-100">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                  Our Story 🌾
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  Village Food started with a simple belief: <strong className="text-green-600">everyone deserves access to pure, organic food</strong> just like our ancestors enjoyed. We connect local village farmers directly with health-conscious families across Bangladesh.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Every bottle of oil, every piece of fruit, and every vegetable we offer is grown without harmful chemicals, pesticides, or artificial additives. Just nature's goodness, carefully harvested and delivered fresh to your doorstep.
                </p>

                {/* Values Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <Sprout className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Farm Fresh</h3>
                      <p className="text-sm text-gray-600">Direct from village farms</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                    <Sun className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Natural</h3>
                      <p className="text-sm text-gray-600">Zero chemicals</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <Droplet className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Pure</h3>
                      <p className="text-sm text-gray-600">No additives</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                    <Heart className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Healthy</h3>
                      <p className="text-sm text-gray-600">Full of nutrients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What We Offer 🌿
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pure organic products grown with love in village farms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Category Cards */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-md p-8 hover:shadow-md transition-all duration-500 border-2 border-green-200">
              <div className=" w-32 h-32 relative rounded-md overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/about/oil.webp"
                  alt="Organic Oil"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3"> Oils</h3>
              <p className="text-gray-700 mb-4">
                Pure mustard oil, coconut oil, and more — extracted traditionally without any chemicals or processing.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Cold-pressed mustard oil
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Virgin coconut oil
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Sesame & groundnut oil
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-md p-8 hover:shadow-md transition-all duration-500  border-2 border-orange-200">
              <div className=" w-32 h-32 relative rounded-md overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/about/fruits.webp"
                  alt="Organic Fruits"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Fresh Fruits</h3>
              <p className="text-gray-700 mb-4">
                Seasonal organic fruits picked at peak ripeness, naturally sweet and nutritious.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  Mangoes & bananas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  Papayas & guavas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  Seasonal specialties
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-md p-8 hover:shadow-md transition-all duration-500  border-2 border-emerald-200">
              <div className=" w-32 h-32 relative rounded-md overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/about/spices.webp"
                  alt="Organic Spices"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Spices</h3>
              <p className="text-gray-700 mb-4">
                Pure, aromatic village-grown spices — naturally sun-dried and stone-ground
                to preserve authentic flavor, color, and nutrients.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Turmeric & red chili powder
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Cumin, coriander & black pepper
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Garam masala & mixed spice blends
                </li>
              </ul>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose Village Food? 💚
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just organic — it's about trust, quality, and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Certified Organic</h3>
                  <p className="text-gray-600">All products are grown without pesticides, chemicals, or GMOs</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Direct from Farms</h3>
                  <p className="text-gray-600">We work directly with village farmers, no middlemen</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Fresh Delivery</h3>
                  <p className="text-gray-600">Harvested today, delivered tomorrow — maximum freshness guaranteed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Affordable Prices</h3>
                  <p className="text-gray-600">Fair prices for farmers, great value for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Experience True Organic? 🌱
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-green-50">
            Join thousands of families enjoying pure, healthy, village-fresh organic products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              <Leaf className="w-5 h-5" />
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-green-800 transition-all duration-300 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;