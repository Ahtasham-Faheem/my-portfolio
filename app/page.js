'use client'

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import Link from 'next/link';
import { database } from './lib/firebase';
import { ref, onValue } from 'firebase/database';

const Portfolio = () => {
  // Refs for sections
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const workRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);
  const canvasRef = useRef(null);

  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  // Scroll function
  const scrollToSection = (ref, section) => {
    if (ref.current) {
      const headerHeight = 80;
      const elementPosition = ref.current.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(section);
    }
    setIsMenuOpen(false);
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = [
        { ref: homeRef, id: 'home' },
        { ref: aboutRef, id: 'about' },
        { ref: workRef, id: 'work' },
        { ref: experienceRef, id: 'experience' },
        { ref: contactRef, id: 'contact' }
      ];

      for (const section of sections) {
        if (section.ref.current && scrollPosition >= section.ref.current.offsetTop && 
            (section.ref.current.offsetTop + section.ref.current.offsetHeight > scrollPosition)) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual form submission logic
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  // Skills data - using chip style
  const skills = [
    'React.js', 'Next.js', 'React Native', 'JavaScript', 'TypeScript', 
    'HTML5', 'CSS3', 'SCSS', 'Tailwind CSS', 'Framer Motion', 'UI/UX Design', 
    'Node.js', 'Express.js', 'NestJS', 'GraphQL', 'REST APIs'
  ];

  // Work experience data
  const experiences = [
    {
      role: 'Frontend Developer',
      company: 'AccellionX',
      duration: '3 Months',
      description: 'Developed front-end solutions using ReactJS and other modern web technologies.'
    },
    {
      role: 'Frontend Web Developer',
      company: 'OneMoneyWay',
      duration: 'March 2024 - June 2025 (1 year 4 months)',
      description: 'Implemented multiple third-party integrations and specialized in website styling with Tailwind, CSS, and SCSS.'
    },
    {
      role: 'Software Engineer',
      company: 'AccellionX',
      duration: 'April 2022 - March 2024 (2 years)',
      description: 'Worked on building interactive and optimized web applications.'
    },
    {
      role: 'Web Developer',
      company: 'Markupsoft',
      duration: 'March 2021 - June 2022 (1 Year 3 Months)',
      description: 'Gained valuable experience in web development and improved social skills.'
    }
  ];

  // Resume download function with options
  const handleResumeAction = (type) => {
    const link = document.createElement('a');
    link.href = `/resume.${type}`;
    link.download = `Ahtasham_Faheem_Resume.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Three.js animation setup
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;

    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const loader = new THREE.TextureLoader();
    const circleTexture = loader.load('/circle.png');

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4f46e5, // Changed to indigo
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      map: circleTexture,
      alphaTest: 0.01,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [projects, setProjects] = useState([]);

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
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>Ahtasham Faheem - Front End Developer</title>
        <meta name="description" content="Professional portfolio of Ahtasham Faheem, Front End Developer specializing in React, Next.js, and modern web technologies." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        />

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
        >
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className='cursor-pointer flex items-center space-x-2'
              onClick={() => scrollToSection(homeRef, 'home')}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                AF
              </div>
              <span className="font-semibold text-gray-800">Ahtasham Faheem</span>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.ul className="hidden md:flex space-x-8">
              {[
                { name: 'Home', ref: homeRef, id: 'home' },
                { name: 'About', ref: aboutRef, id: 'about' },
                { name: 'Work', ref: workRef, id: 'work' },
                { name: 'Experience', ref: experienceRef, id: 'experience' },
                { name: 'Contact', ref: contactRef, id: 'contact' }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm font-medium uppercase tracking-wider cursor-pointer transition-colors ${activeSection === item.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                  onClick={() => scrollToSection(item.ref, item.id)}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div 
                      layoutId="navIndicator"
                      className="h-0.5 bg-indigo-600 mt-1"
                      initial={false}
                    />
                  )}
                </motion.li>
              ))}
            </motion.ul>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </motion.button>
          </div>

          {/* Mobile Dropdown Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white"
          >
            <motion.ul className="px-6 py-4 space-y-4">
              {[
                { name: 'Home', ref: homeRef, id: 'home' },
                { name: 'About', ref: aboutRef, id: 'about' },
                { name: 'Work', ref: workRef, id: 'work' },
                { name: 'Experience', ref: experienceRef, id: 'experience' },
                { name: 'Contact', ref: contactRef, id: 'contact' }
              ].map((item) => (
                <motion.li
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{
                    x: isMenuOpen ? 0 : -20,
                    opacity: isMenuOpen ? 1 : 0
                  }}
                  transition={{ delay: 0.1 }}
                  className={`text-gray-600 hover:text-indigo-600 transition-all font-medium text-sm uppercase tracking-wider cursor-pointer pb-2 ${activeSection === item.id ? 'text-indigo-600' : ''}`}
                  onClick={() => scrollToSection(item.ref, item.id)}
                >
                  {item.name}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.nav>

        {/* Hero Section */}
        <section ref={homeRef} className="min-h-screen flex items-center justify-center pt-24 pb-20 relative overflow-hidden">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center text-center md:text-left relative z-10 justify-around">
            <div className="md:order-2 md:ml-12 mb-12 md:mb-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-60 h-64 md:w-80 md:h-80 bg-gradient-to-br from-indigo-100 to-indigo-50 overflow-hidden border-8 border-white shadow-2xl mx-auto md:mx-0 flex items-center justify-center"
              >
                <img src="/avatar.png" alt="Ahtasham Avatar" className="" />
              </motion.div>
            </div>

            <div className="md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4"
              >
                Front End Developer
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter mb-6"
              >
                Hi, I'm <span className="text-indigo-600">Ahtasham</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl mx-auto md:mx-0"
              >
                <p className="text-xl md:text-2xl text-gray-600 font-light mb-8">
                  I build exceptional digital experiences with <span className="font-medium text-gray-800">React, Next.js, and modern web technologies</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(workRef, 'work')}
                  className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:bg-indigo-700"
                >
                  View My Work
                </motion.button>

                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(contactRef, 'contact')}
                  className="px-8 py-3.5 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:bg-indigo-50"
                >
                  Contact Me
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center md:justify-start space-x-6 pt-16"
              >
                <div className="text-xs uppercase tracking-widest text-gray-400 font-medium">Connect With Me</div>
                <div className="flex space-x-4">
                  {['LinkedIn', 'GitHub', 'Twitter'].map((social, index) => (
                    <motion.a
                      key={social}
                      href={social === 'LinkedIn' ? 'https://www.linkedin.com/in/ahtasham-faheem-987977248' : '#'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ y: -3 }}
                      className="text-gray-500 hover:text-indigo-600 transition-colors text-sm"
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-28 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4 inline-block"
              >
                About Me
              </motion.div>
              <motion.h2
                whileHover={{ scale: 1.02 }}
                className="text-4xl font-bold mb-6"
              >
                Technical Expertise
              </motion.h2>
              <motion.div
                whileHover={{ width: 100 }}
                className="w-20 h-1 bg-indigo-600 mx-auto"
              />
            </motion.div>

            <div className="flex flex-col lg:flex-row items-start gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2 w-full"
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Who I Am</h3>
                <motion.p
                  whileHover={{ x: 5 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  I'm Muhammad Ahtasham, a passionate Front-End Developer with 4+ years of experience creating modern, responsive web applications. I specialize in translating design concepts into efficient, high-performing code that delivers exceptional user experiences.
                </motion.p>
                <motion.p
                  whileHover={{ x: 5 }}
                  className="text-gray-600 mb-8 leading-relaxed"
                >
                  My approach combines technical expertise with an eye for design, ensuring that every project I work on is not only functional but also visually appealing and intuitive to use.
                </motion.p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Experience', value: '4+ Years' },
                    { title: 'Projects', value: '15+' },
                    { title: 'Technologies', value: '10+' },
                    { title: 'Education', value: 'BS CS' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="text-3xl font-bold text-indigo-600 mb-2">{item.value}</div>
                      <div className="text-sm uppercase tracking-widest text-gray-500">{item.title}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2 w-full"
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">My Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium border border-indigo-100"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section ref={workRef} className="py-28 bg-gray-50 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4 inline-block"
              >
                My Work
              </motion.div>
              <motion.h2
                whileHover={{ scale: 1.02 }}
                className="text-4xl font-bold mb-6"
              >
                Featured Projects
              </motion.h2>
              <motion.div
                whileHover={{ width: 100 }}
                className="w-20 h-1 bg-indigo-600 mx-auto"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all bg-white"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-widest text-indigo-600 mb-2">{project.tags.join(' • ')}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <button className="text-indigo-600 text-sm font-medium flex items-center space-x-1 hover:text-indigo-800 transition-colors">
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Link href="/projects">
                <button className="px-8 py-3.5 border border-gray-300 hover:border-indigo-600 rounded-lg font-medium text-sm uppercase tracking-wider transition-all flex items-center mx-auto space-x-2 hover:bg-indigo-50 text-indigo-600">
                  <span>View All Projects</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section ref={experienceRef} className="py-28 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4 inline-block"
              >
                My Journey
              </motion.div>
              <motion.h2
                whileHover={{ scale: 1.02 }}
                className="text-4xl font-bold mb-6"
              >
                Work Experience
              </motion.h2>
              <motion.div
                whileHover={{ width: 100 }}
                className="w-20 h-1 bg-indigo-600 mx-auto"
              />
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-8 relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
              
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-0 sm:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute sm:left-0 sm:top-1 left-2 top-3 w-4 h-4 rounded-full bg-indigo-600 border-4 border-indigo-100"></div>
                  
                  <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{exp.role}</h3>
                      <span className="text-gray-500 text-sm bg-indigo-50 px-3 py-1 rounded-full">{exp.duration}</span>
                    </div>
                    <h4 className="text-lg font-medium text-indigo-600 mb-4">{exp.company}</h4>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="inline-block relative group">
                <button
                  className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center mx-auto space-x-2 hover:bg-indigo-700"
                  onClick={() => {
                    window.open('/resume.pdf', '_blank');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Full Resume</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleResumeAction('pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={() => handleResumeAction('docx')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as Word
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-28 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-4 inline-block"
              >
                Get In Touch
              </motion.div>
              <motion.h2
                whileHover={{ scale: 1.02 }}
                className="text-4xl font-bold mb-6"
              >
                Let's Work Together
              </motion.h2>
              <motion.div
                whileHover={{ width: 100 }}
                className="w-20 h-1 bg-indigo-600 mx-auto"
              />
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form or directly via email.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1">Email</h4>
                      <a href="mailto:your.email@example.com" className="text-indigo-600 hover:text-indigo-800 transition-colors">ahtashamfaheem8@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1">Phone</h4>
                      <a href="tel:+1234567890" className="text-indigo-600 hover:text-indigo-800 transition-colors">+92 325 0250 486</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-1">Location</h4>
                      <p className="text-gray-600">Lahore, Pakistan</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-md ${submitMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {submitMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2 text-sm font-medium">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2 text-sm font-medium">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2 text-sm font-medium">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                      placeholder="Your message"
                    />
                  </div>
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:bg-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 mb-6 md:mb-0"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  AF
                </div>
                <span className="text-lg font-semibold tracking-tighter text-gray-800">Ahtasham Faheem</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex space-x-6"
              >
                {['LinkedIn', 'GitHub', 'Twitter'].map((social, index) => (
                  <motion.a
                    key={social}
                    href={social === 'LinkedIn' ? 'https://www.linkedin.com/in/ahtasham-faheem-987977248' : '#'}
                    whileHover={{ y: -3 }}
                    className="text-gray-500 hover:text-indigo-600 transition-colors text-sm"
                  >
                    {social}
                  </motion.a>
                ))}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm"
            >
              © {new Date().getFullYear()} Ahtasham Faheem. All rights reserved.
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Portfolio;