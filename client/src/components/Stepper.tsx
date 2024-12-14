import React from 'react';
import { useLocation } from 'react-router-dom';

const Stepper = () => {
  const location = useLocation();

  // Determine the active step based on the current path
  const currentPath = location.pathname;
  const steps = [
    { path: '/reservation-info', label: 'Reservation Info' },
    { path: '/book-a-room', label: 'Book a Room' },
    { path: '/payment', label: 'Payment' },
    { path: '/receipt', label: 'Receipt' },
  ];

  return (
    <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:text-base sm:p-6 sm:space-x-4 justify-center">
      {steps.map((step, index) => {
        const isActive = currentPath === step.path; // Highlight the current step
        const isCompleted = steps.findIndex((s) => s.path === currentPath) > index; // Steps before the current one

        return (
          <li
            key={step.path}
            className={`flex items-center ${isActive ? 'text-yellow-600' : isCompleted ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs ${
                isActive
                  ? 'border border-yellow-600'
                  : 'border border-gray-500'
              } rounded-full shrink-0`}
            >
              {isCompleted ? '✔' : ''}
            </span>
            {step.label}
            {index < steps.length - 1 && (
              <svg
                className={`w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180 ${
                  isActive ? 'text-yellow-600' : 'text-gray-500'
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
