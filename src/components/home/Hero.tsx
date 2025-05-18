import React from "react";

// Adjust the padding-top so the hero content is always visible below the navbar on all screen sizes.
// If your navbar is 56px on mobile and 64px on desktop, use Tailwind's pt-14 (56px) and sm:pt-16 (64px).
// If your navbar is a different height, adjust the pt-* values accordingly.

const Hero: React.FC = () => {
  return (
    <section className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center bg-gradient-to-b from-white via-umat-green/10 to-transparent
      pt-14 sm:pt-16 px-4">
      <h1 className="text-3xl sm:text-5xl font-bold text-umat-green mb-4">
        Welcome to AMS-UMAT
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-2xl">
        The Academic Management System for UMAT. Manage your courses, results, and communication effectively, all in one place.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/register"
          className="bg-umat-green hover:bg-umat-green-dark text-white px-6 py-3 rounded shadow transition-colors font-semibold"
        >
          Get Started
        </a>
        <a
          href="/about"
          className="bg-white border border-umat-green text-umat-green hover:bg-umat-green hover:text-white px-6 py-3 rounded shadow transition-colors font-semibold"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default Hero;
