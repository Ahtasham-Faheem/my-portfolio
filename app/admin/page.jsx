'use client';
import { useState, useRef } from 'react';
import { database } from '../lib/firebase';
import { ref, set } from 'firebase/database';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import Link from 'next/link';

// Predefined options for dropdowns
const TECHNOLOGY_OPTIONS = [
    'React', 'Next.js', 'Node.js', 'Express', 'MongoDB',
    'Firebase', 'Tailwind CSS', 'TypeScript', 'JavaScript',
    'Python', 'Django', 'Flask', 'GraphQL', 'REST API',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub'
];

const CATEGORY_OPTIONS = [
    'Web Application', 'Mobile App', 'SaaS', 'Dashboard',
    'E-commerce', 'Portfolio', 'Blog', 'API', 'CMS'
];

export default function AdminPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUploadMethod, setImageUploadMethod] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        image: '',
        tags: [],
        overview: '',
        features: [],
        challenges: '',
        client: '',
        date: '',
        category: '',
        url: '',
        github: '',
        gallery: []
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically upload to a storage service
            // For now, we'll just use a placeholder
            setFormData(prev => ({
                ...prev,
                image: URL.createObjectURL(file)
            }));
            setImageModalOpen(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, title, description, image, tags } = formData;

        if (!id || !title || !description || !image || tags.length === 0) {
            setMessage({ text: 'Please fill in all required fields.', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        try {
            await set(ref(database, `projects/${id}`), {
                title,
                description,
                image,
                tags,
                createdAt: new Date().toISOString(),
                details: {
                    overview: formData.overview,
                    features: formData.features,
                    challenges: formData.challenges.split('|').map(pair => {
                        const [problem, solution] = pair.split('=>');
                        return { problem: problem.trim(), solution: solution?.trim() || '' };
                    }),
                    client: formData.client,
                    date: formData.date,
                    category: formData.category,
                    url: formData.url,
                    github: formData.github,
                    gallery: formData.gallery,
                }
            });
            setMessage({ text: 'Project added successfully!', type: 'success' });
            setActiveTab('basic')
            setFormData({
                id: '', title: '', description: '', image: '', tags: [],
                overview: '', features: [], challenges: '', client: '',
                date: '', category: '', url: '', github: '', gallery: []
            });
        } catch (error) {
            console.error('Error adding project:', error);
            setMessage({ text: 'Error adding project. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }

        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const requiredFields = [
        { label: 'Unique ID (kebab-case)', name: 'id', placeholder: 'ecommerce-platform', type: 'text' },
        { label: 'Project Title', name: 'title', placeholder: 'E-commerce Platform', type: 'text' },
        { label: 'Description', name: 'description', placeholder: 'Short summary of the project', type: 'textarea' },
        { label: 'Main Image', name: 'image', type: 'image' },
        { label: 'Technologies', name: 'tags', type: 'multiselect', options: TECHNOLOGY_OPTIONS }
    ];

    const additionalFields = [
        { label: 'Overview', name: 'overview', type: 'textarea', placeholder: 'Detailed overview of the project' },
        { label: 'Key Features', name: 'features', type: 'multiline-tags', placeholder: 'Add key features' },
        { label: 'Challenges (problem=>solution, separate by |)', name: 'challenges', type: 'textarea', placeholder: 'API scaling issue=>Used caching\nSEO=>Used SSR' },
        { label: 'Client', name: 'client', type: 'text', placeholder: 'Confidential / Company Name' },
        { label: 'Date', name: 'date', type: 'date', placeholder: '' },
        { label: 'Category', name: 'category', type: 'select', options: CATEGORY_OPTIONS },
        { label: 'Live Demo URL', name: 'url', type: 'url', placeholder: 'https://yourproject.com' },
        { label: 'GitHub Repo URL', name: 'github', type: 'url', placeholder: 'https://github.com/...' },
        { label: 'Gallery Images', name: 'gallery', type: 'gallery' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            {/* Image Upload Modal */}
            {imageModalOpen && (
                <div style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="fixed inset-0 bg-opacity-50 bg-black flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Upload Image</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setImageUploadMethod('upload');
                                    fileInputRef.current.click();
                                }}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Upload from Computer
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => setImageUploadMethod('url')}
                                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Enter Image URL
                            </button>
                        </div>
                        {imageUploadMethod === 'url' && (
                            <div className="mt-4">
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.image}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, image: e.target.value }));
                                        setImageModalOpen(false);
                                    }}
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setImageModalOpen(false)}
                            className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Link href="/">
                <motion.div
                    className='ml-[2vw] flex items-center group mb-8'
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="mr-2 group-hover:bg-gray-200 p-1 rounded-full"
                        whileHover={{ rotate: -360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                            className="text-gray-800"
                        >
                            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </motion.div>
                    <p className='text-lg font-semibold cursor-pointer text-gray-800 hover:text-gray-600 w-max transition-colors'>
                        Back to Home
                    </p>
                </motion.div>
            </Link>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
                    <p className="text-gray-600">Add new projects to your portfolio</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                >
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} border-b ${message.type === 'success' ? 'border-green-200' : 'border-red-200'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>{message.text}</span>
                            </div>
                        </motion.div>
                    )}

                    <div className="p-8 sm:p-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Project</h2>

                        {/* Tab Navigation */}
                        <div className="flex mb-6 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setActiveTab('basic')}
                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Basic Info
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Additional Details
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info Tab */}
                            {activeTab === 'basic' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {requiredFields.map(({ label, name, placeholder, type, options }) => (
                                        <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                                                {label} {['id', 'title', 'description', 'image', 'tags'].includes(name) && <span className="text-red-500">*</span>}
                                            </label>

                                            {type === 'textarea' ? (
                                                <textarea
                                                    id={name}
                                                    name={name}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    placeholder={placeholder}
                                                    rows="3"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required={['id', 'title', 'description', 'image', 'tags'].includes(name)}
                                                />
                                            ) : type === 'multiselect' ? (
                                                <div className="relative">
                                                    <Select
                                                        isMulti
                                                        name={name}
                                                        styles={{borderRadius: '12px'}}
                                                        options={options.map(option => ({ value: option, label: option }))}
                                                        value={formData[name]?.map(tag => ({ value: tag, label: tag })) || []}
                                                        onChange={(selectedOptions) => {
                                                            const selectedValues = selectedOptions.map(option => option.value);
                                                            handleArrayChange(name, selectedValues);
                                                        }}
                                                        className="react-select-container"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select technologies..."
                                                    />

                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {formData[name]?.map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : type === 'image' ? (
                                                <div>
                                                    {formData.image ? (
                                                        <div className="relative group">
                                                            <img
                                                                src={formData.image}
                                                                alt="Project preview"
                                                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setImageModalOpen(true)}
                                                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                                            >
                                                                <span className="text-white font-medium">Change Image</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageModalOpen(true)}
                                                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                                                        >
                                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span className="mt-2 text-sm font-medium text-gray-600">Upload Project Image</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <input
                                                    id={name}
                                                    name={name}
                                                    type={type}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required={['id', 'title', 'description', 'image', 'tags'].includes(name)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Additional Details Tab */}
                            {activeTab === 'details' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {additionalFields.map(({ label, name, placeholder, type, options }) => (
                                        <div key={name} className={type === 'textarea' || type === 'gallery' || type === 'multiline-tags' ? 'md:col-span-2' : ''}>
                                            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                                                {label}
                                            </label>

                                            {type === 'textarea' ? (
                                                <textarea
                                                    id={name}
                                                    name={name}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    placeholder={placeholder}
                                                    rows={name === 'challenges' ? 4 : 3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                />
                                            ) : type === 'select' ? (
                                                <select
                                                    id={name}
                                                    name={name}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                >
                                                    <option value="">Select {label.toLowerCase()}</option>
                                                    {options.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : type === 'multiline-tags' ? (
                                                <div>
                                                    <textarea
                                                        id={name}
                                                        name={name}
                                                        value={formData[name].join('\n')}
                                                        onChange={(e) => {
                                                            const features = e.target.value.split('\n').filter(f => f.trim());
                                                            handleArrayChange(name, features);
                                                        }}
                                                        placeholder="Add one feature per line"
                                                        rows="3"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    />
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {formData[name]?.map((feature, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : type === 'gallery' ? (
                                                <div>
                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        {formData.gallery?.map((url, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={url}
                                                                    alt={`Gallery ${index + 1}`}
                                                                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = [...formData.gallery];
                                                                        updated.splice(index, 1);
                                                                        handleArrayChange('gallery', updated);
                                                                    }}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="url"
                                                            placeholder="https://example.com/image.jpg"
                                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && e.target.value) {
                                                                    handleArrayChange('gallery', [...formData.gallery, e.target.value]);
                                                                    e.target.value = '';
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[type="url"][placeholder="https://example.com/image.jpg"]');
                                                                if (input.value) {
                                                                    handleArrayChange('gallery', [...formData.gallery, input.value]);
                                                                    input.value = '';
                                                                }
                                                            }}
                                                            className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    id={name}
                                                    name={name}
                                                    type={type}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                />
                                            )}
                                            {name === 'challenges' && (
                                                <p className="mt-1 text-xs text-gray-500">Format: problem = solution (one per line)</p>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                        </form>
                        <div className="flex justify-between pt-4">
                            {activeTab === 'details' && (
                                <motion.button
                                    type="button"
                                    onClick={() => setActiveTab('basic')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    ← Back to Basic Info
                                </motion.button>
                            )}

                            <div className="ml-auto">
                                {activeTab === 'basic' ? (
                                    <motion.button
                                        type="button"
                                        onClick={() => setActiveTab('details')}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-2 bg-indigo-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Continue to Details →
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            'Submit Project'
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}