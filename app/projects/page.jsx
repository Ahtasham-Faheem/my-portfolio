'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    },
  },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.entries(data).map(([id, value]) => ({
          id,
          ...value
        }));
        setProjects(loadedProjects);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.tags.includes(filter));

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link href="/">
          <motion.div 
            className='flex items-center group mb-12'
            whileHover={{ x: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
                className="text-indigo-600"
              >
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </motion.div>
            <p className='text-lg font-medium cursor-pointer text-indigo-600 hover:text-indigo-800 w-max transition-colors'>
              Back to Home
            </p>
          </motion.div>
        </Link>

        {/* Page header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4 inline-block"
          >
            My Work
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Project Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of my professional work and creative experiments.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200 hover:border-gray-300'
            }`}
          >
            All Projects
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                filter === tag 
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm h-96 border border-gray-100"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    whileHover="hover"
                    layout
                    className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className="relative h-56 overflow-hidden group">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <motion.span 
                          className="text-white font-medium"
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          View Details →
                        </motion.span>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        {project.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-600/90 text-white shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.3 }}
                          className="text-indigo-600 font-medium text-sm"
                        >
                          Explore →
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4 text-gray-300">✖</div>
                <h3 className="text-2xl font-medium text-gray-700 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6">Try selecting a different filter</p>
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Show all projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}