import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import EventCard from '../../components/templates/eventCard/EventCard';
import CreateEventModal from '../../components/organisms/createEventModal/CreateEventModal';
import iconStep1 from '../../assets/icons/icon_step1.png';
import iconStep2 from '../../assets/icons/icon_step2.png';
import iconStep3 from '../../assets/icons/icon_step3.png';
import iconStep4 from '../../assets/icons/icon_step4.png';
import sectionHome2 from '../../assets/images/section2.svg';
import imageParty from '../../assets/images/img_fiesta.jpg';
import imgCarrousel1 from '../../assets/images/img_carrousel1.jpeg';
import imgCarrousel2 from '../../assets/images/img_carrousel2.jpg';
import imgCarrousel3 from '../../assets/images/img_carrousel3.jpg';
import { Link } from "react-router-dom";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = [
    imgCarrousel1,
    imgCarrousel2,
    imgCarrousel3
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia de imagen cada 3 segundos
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="space-y-12">
      {/* Sección principal con carrusel */}
      <section className="relative h-[500px] rounded-2xl overflow-hidden">
        {/* Imagen actual */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Desplaza las imágenes horizontalmente
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateX(${index * 100}%)`, // Posiciona cada imagen en su lugar
              }}
            >
              <img
                src={image}
                alt={`Event planning ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* Gradiente de fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        {/* Contenido sobre la imagen */}
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold max-w-2xl text-white">
            Create Unforgettable Events with Top Service Providers
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-xl">
            Connect with the best event service providers and plan your perfect event with ease.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg w-fit transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>
      </section>

      {/* Sección de eventos destacados */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Planners</h2>
          <Link
            to="/marketplace"
            className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            title="Tech Conference 2024"
            image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
            date="March 15, 2024"
            location="San Francisco, CA"
            category="Conference"
          />
          <EventCard
            title="Summer Music Festival"
            image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea"
            date="July 20, 2024"
            location="Austin, TX"
            category="Festival"
          />
          <EventCard
            title="Wedding Expo"
            image="https://images.unsplash.com/photo-1519225421980-715cb0215aed"
            date="April 5, 2024"
            location="New York, NY"
            category="Exhibition"
          />
        </div>
      </section>

      {/* Modal para crear evento */}
      {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} />}

      {/* Sección "About Us" */}
      <section className="py-12 px-8 rounded-2xl glass-effect text-center md:text-left flex flex-col md:flex-row items-center">
        <img
          src={imageParty}
          alt="Fiesta"
          className="w-full md:w-1/2 rounded-2xl mb-4 md:mb-0 md:mr-8"
        />
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">About Us</h2>
          <p className="text-lg text-[var(--text-secondary)]">
            We simplify the process of planning your event by connecting you with quality vendors for weddings, birthdays, parties, and more.
            Find the perfect venue, catering, decoration, and entertainment all in one place. Visit EventPlanner and start planning the event of your dreams today.
          </p>
        </div>
      </section>

      {/* Sección "How does EventPlanner work?" */}
      <div className="bg-[var(--secondary)] text-[var(--text)] mx-auto p-8 rounded-3xl shadow-2xl mt-14 mb-8 glass-effect">
  <h2 className="text-4xl font-bold mb-8 text-center text-primary drop-shadow-md">
    How does EventPlanner work?
  </h2>
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { icon: iconStep1, title: "Create your account", text: "Sign up to start planning your event." },
      { icon: iconStep2, title: "Explore services", text: "Find providers and services for your event." },
      { icon: iconStep3, title: "Customize your event", text: "Choose the options that fit your needs." },
      { icon: iconStep4, title: "Contact providers", text: "Discuss details and book services." },
    ].map((step, index) => (
      <div
        key={index}
        className="relative group bg-opacity-50 p-6 rounded-3xl flex flex-col items-center space-y-4 transition-all duration-300 hover:bg-opacity-80"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Ícono */}
        <div className="relative w-20 h-20 mb-4">
          <img
            src={step.icon}
            alt={`Step ${index + 1}`}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {/* Título */}
        <h3 className="text-lg font-semibold text-center text-[var(--text)] transition-colors duration-300 group-hover:text-primary">
          {step.title}
        </h3>
        {/* Descripción */}
        <p className="text-sm text-center text-[var(--text-secondary)]">
          {step.text}
        </p>
        {/* Efecto de hover */}
        <div
          className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        ></div>
      </div>
    ))}
  </section>
</div>
    </div>
  );
};

export default Home;