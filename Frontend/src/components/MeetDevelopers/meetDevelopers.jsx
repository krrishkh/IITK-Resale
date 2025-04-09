import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { TfiEmail } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';

const developers = [
  {
    name: 'Krrish Khandelwal',
    role: 'Full Stack Developer',
    image: '/krrish_image.jpg',
    email: 'krrishk22@iitk.ac.in',
    linkedin: 'https://www.linkedin.com/in/krrish-khandelwal-9abb271bb/',
    github: 'https://github.com/krrishkh',
  },
  {
    name: 'Ananya',
    role: 'Backend Developer',
    image: '/images/ananya.jpg',
    email: 'ananyak22@iitk.ac.in',
    linkedin: 'https://linkedin.com/in/ananya',
    github: 'https://github.com/ananya',
  },
];

export default function MeetTheDevelopers() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-20 px-4">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">
        Meet the Developers
      </h2>

      <div className="flex flex-wrap justify-center gap-12 max-w-6xl mx-auto">
        {developers.map((dev, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 w-80 text-center p-6"
          >
            <div className="w-36 h-36 mx-auto mb-4">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-full h-full object-cover rounded-full border-4 border-blue-200"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{dev.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{dev.role}</p>
            <div className="flex items-center justify-center text-gray-600 gap-2 mb-3">
              <TfiEmail />
              <span className="text-sm">{dev.email}</span>
            </div>
            <div className="flex justify-center gap-4 text-gray-600 mt-2">
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <FaLinkedin size={22} />
              </a>
              <a href={dev.github} target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <FaGithub size={22} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
        >
          ⬅ Back to Home
        </button>
      </div>
    </section>
  );
}
