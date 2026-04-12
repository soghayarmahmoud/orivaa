import React from 'react';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = '',
  fullWidth = false,
}: SectionWrapperProps) {
  const containerClass = fullWidth
    ? 'w-full'
    : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className={containerClass}>{children}</div>
    </section>
  );
}
