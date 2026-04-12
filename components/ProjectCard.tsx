'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  link = '#',
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(198, 40, 40, 0.15)' }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-red-600 transition-all duration-300"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Link */}
      {link && (
        <motion.a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm mt-4 transition-colors"
          whileHover={{ x: 4 }}
        >
          View Project
          <span>→</span>
        </motion.a>
      )}
    </motion.div>
  );
}

