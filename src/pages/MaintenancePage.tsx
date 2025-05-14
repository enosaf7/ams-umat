
import React from 'react';
import { Construction } from 'lucide-react'; // Using a relevant icon

const MaintenancePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
    <Construction className="w-24 h-24 text-umat-gold mb-6" />
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Site Under Maintenance</h1>
    <p className="text-lg text-gray-600 mb-8 max-w-md">
      We are currently performing scheduled maintenance to improve your experience.
      The site will be back online shortly.
    </p>
    <p className="text-gray-500">Thank you for your patience.</p>
  </div>
);

export default MaintenancePage;
