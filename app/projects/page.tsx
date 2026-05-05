'use client';

import HeroSection from '@/components/HeroSection';
import SectionWrapper from '@/components/SectionWrapper';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

interface Project {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  featured: boolean;
  tags: string[];
}

export default function Projects() {
  const { language } = useLanguage();
  const t = translations[language];
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  );

  const filteredProjects = selectedFilter
    ? projects.filter((p) => p.tags.includes(selectedFilter))
    : projects;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t.projects.hero.title}
        subtitle={t.projects.hero.subtitle}
      />

      {/* Featured Projects Section */}
      <SectionWrapper className="bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.projects.filterCategory}
          </h2>
          <p className="text-xl text-gray-600">
            {t.projects.openSource}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedFilter(null)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedFilter === null
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {t.projects.allProjects}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedFilter === tag
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                index={index}
                title={language === 'ar' ? project.titleAr : project.title}
                description={language === 'ar' ? project.descriptionAr : project.description}
                tags={project.technologies}
                link={project.githubUrl || project.liveUrl || '#'}
                images={project.images}
              />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </SectionWrapper>

      {/* Open Source Section */}
      <SectionWrapper className="bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.projects.wantContribute}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.projects.welcomeContributions}
          </p>
          <Button href="https://github.com" variant="primary" size="lg">
            {t.projects.viewGitHub}
          </Button>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}

