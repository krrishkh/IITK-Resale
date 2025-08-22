import React from 'react';
import { Linkedin, Github, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Developer data array with the updated image link
const developers = [
  {
    name: 'Krrish Khandelwal',
    role: 'Architect & Full Stack Engineer',
    bio: 'Crafting seamless digital experiences with a passion for clean code and intuitive design. Turning ideas into reality, one line of code at a time.',
    // --- THIS IS THE UPDATED IMAGE LINK ---
    image: 'https://lh3.googleusercontent.com/d/1UFLzjZ3LbfbV6PBAgJIj7MY56Uk6j3oV',
    email: 'krrishk22@iitk.ac.in',
    linkedin: 'https://www.linkedin.com/in/krrish-khandelwal-9abb271bb/',
    github: 'https://github.com/krrishkh',
  },
];

// Social Link Component for cleaner code
const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-3 bg-white/10 rounded-full text-gray-200 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110"
  >
    <Icon size={20} />
  </a>
);

// Main Component
export default function MeetTheDevelopers() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1029] via-[#0f172a] to-[#1e293b] -z-10"></div>
      
      {/* Animated Glowing Shapes */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-blob opacity-70"></div>
      <div className="absolute bottom-10 -right-20 w-72 h-72 bg-green-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                The Architect Behind The Platform
            </h1>
            <p className="mt-4 text-lg text-gray-300">Meet the developer who brought IITKReSale to life.</p>
        </div>

        {/* Developer Card */}
        <div className="flex flex-wrap justify-center gap-12">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="group relative w-80 animate-fade-in-up"
            >
              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              {/* Glassmorphism Card */}
              <div className="relative bg-slate-800/80 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-8 text-center transition-all duration-300 group-hover:scale-105">
                <div className="relative w-32 h-32 mx-auto mb-5">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover rounded-full ring-4 ring-slate-700"
                    // Fallback in case the image link fails to load
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/E2E8F0/4A5568?text=KK&font=sans'; }}
                  />
                   {/* Gradient Ring */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-green-500 opacity-0 group-hover:opacity-100 transition duration-500 animate-spin-slow"></div>
                </div>

                <h3 className="text-2xl font-bold text-white">{dev.name}</h3>
                <p className="mt-1 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">{dev.role}</p>
                <p className="text-gray-400 text-sm mt-4 italic">"{dev.bio}"</p>
                
                <div className="border-t border-white/10 my-6"></div>
                
                <div className="flex justify-center items-center gap-4">
                    <SocialLink href={`mailto:${dev.email}`} icon={Mail} label="Email" />
                    <SocialLink href={dev.linkedin} icon={Linkedin} label="LinkedIn" />
                    <SocialLink href={dev.github} icon={Github} label="GitHub" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-gray-200 px-6 py-3 rounded-full hover:bg-white/20 transition duration-300 shadow-lg"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
