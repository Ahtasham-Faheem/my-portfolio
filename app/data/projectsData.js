// export const projects = [
//   {
//     title: 'E-commerce Platform',
//     description: 'Full-featured online store with cart, payment integration, and admin dashboard.',
//     tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
//     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     details: {
//       overview: 'Developed a comprehensive e-commerce solution that handles thousands of daily transactions with 99.9% uptime. The platform includes product management, user authentication, payment processing, and analytics.',
//       client: 'Retail Solutions Inc.',
//       date: 'March 2022 - Present',
//       category: 'E-commerce',
//       url: 'https://example-ecommerce.com',
//       github: 'https://github.com/username/ecommerce-platform',
//       features: [
//         'Product catalog with advanced filtering',
//         'Secure checkout with Stripe integration',
//         'User account management',
//         'Order tracking system',
//         'Admin dashboard for inventory management',
//         'Responsive design for all devices'
//       ],
//       challenges: [
//         {
//           problem: 'Handling peak traffic during sales events',
//           solution: 'Implemented caching with Redis and optimized database queries to handle 10x normal traffic'
//         },
//         {
//           problem: 'Secure payment processing',
//           solution: 'Integrated Stripe with proper tokenization and PCI compliance measures'
//         }
//       ],
//       gallery: [
//         'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//         'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
//       ]
//     }
//   },
//   {
//     title: 'Project Management Tool',
//     description: 'Collaborative platform with real-time updates and task management.',
//     tags: ['Next.js', 'TypeScript', 'Firebase'],
//     image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
//     details: {
//       overview: 'Built a real-time project management application that helps teams collaborate more effectively with task assignments, progress tracking, and file sharing.',
//       client: 'Internal Project',
//       date: 'January 2023',
//       category: 'Productivity',
//       github: 'https://github.com/username/project-management-tool',
//       features: [
//         'Real-time updates with WebSockets',
//         'Drag-and-drop task management',
//         'Team collaboration features',
//         'File attachments and comments',
//         'Project timeline visualization'
//       ]
//     }
//   },
//   {
//     title: 'Healthcare Analytics Dashboard',
//     description: 'Data visualization platform for healthcare metrics and reporting.',
//     tags: ['React', 'D3.js', 'Express', 'MongoDB'],
//     image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//     details: {
//       overview: 'Created a HIPAA-compliant dashboard for healthcare providers to visualize patient data, track key metrics, and generate reports for stakeholders.',
//       client: 'HealthCare Analytics LLC',
//       date: 'September 2021 - December 2022',
//       category: 'Healthcare',
//       features: [
//         'Interactive data visualizations with D3.js',
//         'Role-based access control',
//         'Data export functionality',
//         'Custom report generation',
//         'Secure authentication'
//       ],
//       gallery: [
//         'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
//         'https://images.unsplash.com/photo-1581093450021-4a7360e9a9e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
//       ]
//     }
//   }
// ];

import { ref, get } from 'firebase/database';
import { database } from '../lib/firebase';

export async function getProjectById(id) {
  const snapshot = await get(ref(database, `projects/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}
