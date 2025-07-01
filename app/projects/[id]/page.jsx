'use client'

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getProjectById } from '../../data/projectsData';
import Image from 'next/image';
import Link from 'next/link';

const ProjectDetails = ({ params }) => {
    const { id } = use(params);
    const router = useRouter();
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.id;

    // Find the project by ID
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const fetchedProject = await getProjectById(id);
            setProject(fetchedProject);
            setLoading(false);
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-black text-white rounded-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Project Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-end pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-white/90 text-black text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            {project.title}
                        </h1>
                        <p className="text-xl text-white/90 mb-8">
                            {project.description}
                        </p>
                        <Link
                            href="/projects"
                            className="inline-flex items-center text-white hover:text-white/80 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Projects
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Project Details Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="prose max-w-none"
                            >
                                <h2 className="text-3xl font-bold mb-8">Project Overview</h2>

                                {project.details?.overview ? (
                                    <p className="text-lg text-gray-700 mb-6">{project.details.overview}</p>
                                ) : (
                                    <>
                                        <p className="text-lg text-gray-700 mb-6">
                                            This project represents a significant achievement in my development career, showcasing my ability to create robust, user-friendly applications. Built with modern technologies, it demonstrates my expertise in full-stack development and problem-solving skills.
                                        </p>
                                        <p className="text-lg text-gray-700 mb-6">
                                            The application was designed with scalability in mind, allowing for future growth and additional features. I focused on creating an intuitive user interface while ensuring the backend was performant and secure.
                                        </p>
                                    </>
                                )}

                                <h3 className="text-2xl font-semibold mb-4 mt-10">Key Features</h3>
                                <ul className="space-y-3 mb-8">
                                    {project.details?.features ? (
                                        project.details.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Responsive design that works across all devices</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Secure authentication and authorization system</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">High performance with optimized database queries</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Comprehensive admin dashboard for content management</span>
                                            </li>
                                        </>
                                    )}
                                </ul>

                                {project.details?.challenges && (
                                    <>
                                        <h3 className="text-2xl font-semibold mb-4 mt-10">Challenges & Solutions</h3>
                                        <div className="space-y-4 mb-8">
                                            {project.details.challenges.map((challenge, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-2">{challenge.problem}</h4>
                                                    <p className="text-gray-700">{challenge.solution}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <h3 className="text-2xl font-semibold mb-4 mt-10">Technologies Used</h3>
                                <div className="flex flex-wrap gap-3 mb-12">
                                    {project.tags.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 p-8 rounded-xl sticky top-8"
                            >
                                <h3 className="text-xl font-bold mb-6">Project Details</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Client</h4>
                                        <p className="font-medium">
                                            {project.details?.client || 'Confidential'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Date</h4>
                                        <p className="font-medium">
                                            {project.details?.date || '2023'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Category</h4>
                                        <p className="font-medium">
                                            {project.details?.category || 'Web Application'}
                                        </p>
                                    </div>

                                    {project.details?.url && (
                                        <div>
                                            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Live Demo</h4>
                                            <a
                                                href={project.details.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                Visit Website
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}

                                    {project.details?.github && (
                                        <div>
                                            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Source Code</h4>
                                            <a
                                                href={project.details.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-gray-700 hover:text-black transition-colors"
                                            >
                                                View on GitHub
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Gallery Section */}
            {project.details?.gallery && project.details.gallery.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold mb-12 text-center"
                        >
                            Project Gallery
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.details.gallery.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <Image
                                        src={image}
                                        alt={`${project.title} screenshot ${index + 1}`}
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Have a similar project in mind?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                    >
                        Let's discuss how I can help bring your ideas to life with a custom solution.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/#contact"
                            className="inline-block px-8 py-4 bg-white text-black rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors"
                        >
                            Get in Touch
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetails;