import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tuners-R-Us | High-Performance Auto Shop" },
    { name: "description", content: "Professional auto tuning and performance upgrades by certified mechanics" },
  ];
};

export default function Index() {
  const [animate, setAnimate] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  useEffect(() => {
    setAnimate(true);
    const interval = setInterval(() => {
      setAnimate(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: "Engine Tuning", icon: "🏎️", color: "bg-red-500" },
    { name: "Turbo Installation", icon: "💨", color: "bg-blue-500" },
    { name: "ECU Remapping", icon: "💻", color: "bg-green-500" },
    { name: "Suspension Mods", icon: "🔧", color: "bg-yellow-500" },
    { name: "Custom Exhaust", icon: "🔊", color: "bg-purple-500" },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-x-hidden">
        <div className="absolute w-full overflow-hidden h-40 top-0 left-0 flex justify-between z-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
              <div
                  key={i}
                  className={`w-12 transition-all duration-1000 ease-in-out ${animate ? 'skew-x-12' : 'skew-x-[-12deg]'}`}
              >
                <div className={`h-60 w-full rounded-b-full origin-top animate-wave ${
                    ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500'][i % 5]}`}
                ></div>
              </div>
          ))}
        </div>

        <header className="pt-24 pb-16 px-6 relative">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 animate-pulse">
              <span className="text-red-500">T</span>
              <span className="text-blue-500">U</span>
              <span className="text-green-500">N</span>
              <span className="text-yellow-400">E</span>
              <span className="text-purple-500">R</span>
              <span className="text-red-500">S</span>
              <span>-</span>
              <span className="text-blue-500">R</span>
              <span>-</span>
              <span className="text-green-500">U</span>
              <span className="text-yellow-400">S</span>
            </h1>
            <p className="text-2xl md:text-4xl mb-10 font-light">Where Your Car's Performance Goes WILD!</p>

            <div className="relative">
              <div className={`h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 w-full mb-12 ${animate ? 'scale-x-100' : 'scale-x-95'} transition-transform duration-1000`}></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Link className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-transform"
                    to="/signup">
                Sign Up Now!
              </Link>
              <Link
                  to="/signin"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-transform">
                Login
              </Link>
            </div>
          </div>
        </header>

        <section className="py-16 px-6 relative">
          <h2 className="text-4xl font-bold text-center mb-16">OUR SERVICES</h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, index) => (
                <div
                    key={index}
                    className={`${service.color} rounded-lg p-6 text-center transform transition-all duration-300 cursor-pointer relative ${hoveredService === index ? 'scale-110' : 'hover:scale-105'}`}
                    onMouseEnter={() => setHoveredService(index)}
                    onMouseLeave={() => setHoveredService(null)}
                    style={{
                      animation: hoveredService === index ? 'bounce 0.5s infinite alternate' : 'none'
                    }}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 relative">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-blue-600 rounded-xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">UNLEASH YOUR CAR'S POTENTIAL!</h2>
            <p className="text-xl mb-8">Join our thousands of satisfied customers who've experienced the Tuners-R-Us difference!</p>
            <Link
                to="/signup"
                className="inline-block bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-transform"
            >
              GET STARTED TODAY
            </Link>
          </div>
        </section>

        {/* Bottom Tube Men */}
        <div className="fixed w-full bottom-0 left-0 flex justify-around z-10 pointer-events-none">
          {[...Array(7)].map((_, i) => (
              <div
                  key={i}
                  className={`w-8 transition-all duration-700 ease-in-out ${animate ? 'skew-x-12' : 'skew-x-[-12deg]'}`}
              >
                <div className={`h-40 w-full rounded-t-full origin-bottom animate-wave-reverse ${
                    ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500'][i % 5]}`}
                ></div>
              </div>
          ))}
        </div>

        <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(-10deg) scaleY(0.9); }
          50% { transform: rotate(15deg) scaleY(1.1); }
          100% { transform: rotate(-10deg) scaleY(0.9); }
        }
        @keyframes wave-reverse {
          0% { transform: rotate(10deg) scaleY(0.9); }
          50% { transform: rotate(-15deg) scaleY(1.1); }
          100% { transform: rotate(10deg) scaleY(0.9); }
        }
        .animate-wave {
          animation: wave 1s infinite alternate-reverse ease-in-out;
        }
        .animate-wave-reverse {
          animation: wave-reverse 1.2s infinite alternate ease-in-out;
        }
        @keyframes bounce {
          0% { transform: translateY(0) scale(1.1); }
          100% { transform: translateY(-10px) scale(1.1); }
        }
      `}</style>
      </div>
  );
}