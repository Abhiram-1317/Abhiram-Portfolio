import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Code2,
  Database,
  Palette,
  Shield,
  ExternalLink,
  Smartphone,
  Braces,
  Workflow,
} from 'lucide-react';
import * as THREE from 'three';

const Motion = motion;

const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    const octaGeometry = new THREE.OctahedronGeometry(1, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(3, -1, -2);
    scene.add(octahedron);

    const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-3, 1, -3);
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x06b6d4, 2);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    let animationFrameId;
    const animate = () => {
      const time = Date.now() * 0.001;
      starField.rotation.y = time * 0.05;
      octahedron.position.y = Math.sin(time * 0.6) * 0.5 - 1;
      octahedron.rotation.x = time * 0.2;
      sphere.position.y = Math.cos(time * 0.8) * 0.5 + 1;
      sphere.rotation.y = time * 0.4;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      starsGeometry.dispose();
      starsMaterial.dispose();
      octaGeometry.dispose();
      octaMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsPointer(window.getComputedStyle(e.target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
    />
  );
};

const SectionHeading = ({ title, subtitle, number }) => (
  <div className="mb-20 space-y-4">
    <div className="flex items-center gap-4">
      <span className="text-cyan-500 font-mono text-sm tracking-tighter opacity-50">{number}</span>
      <div className="h-px w-12 bg-cyan-500/20" />
    </div>
    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white/90">{title}</h2>
    <p className="text-xs tracking-[0.4em] uppercase text-cyan-500 font-bold">{subtitle}</p>
  </div>
);

const Hero = ({ onHireClick }) => {
  const titles = ['Full Stack Developer', 'Software Architect', 'Systems Engineer'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % titles.length), 3000);
    return () => clearInterval(timer);
  }, [titles.length]);

  return (
    <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 z-10"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-black tracking-[0.5em] uppercase text-cyan-400">
          Engineering Performance & Scalability
        </span>
        <h1 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter uppercase italic">
          Abhiram<span className="text-cyan-500">.</span>
        </h1>
        <div className="h-8 md:h-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-lg md:text-2xl font-light tracking-widest text-white/50 uppercase"
            >
              {titles[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-12">
          <a
            href="#projects"
            className="px-10 py-5 bg-white text-black text-[10px] font-black tracking-[0.3em] uppercase rounded-full hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer"
          >
            Explore Portfolio
          </a>
          <button
            onClick={onHireClick}
            className="px-10 py-5 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase rounded-full hover:border-white transition-all backdrop-blur-sm"
          >
            Hire Me
          </button>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const [imgSrc, setImgSrc] = useState('/IMG_20260122_235807_445.webp');
  const fallbackImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974';

  const skills = [
    { name: 'Software Development', level: 95 },
    { name: 'Systems Architecture', level: 92 },
    { name: 'Database Engineering', level: 90 },
    { name: 'UI/UX & Frontend Optm.', level: 88 },
  ];

  return (
    <section id="about" className="py-40 px-8 max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} className="relative group">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-xl">
            <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 overflow-hidden relative">
              <img
                src={imgSrc}
                alt="Abhiram"
                onError={() => setImgSrc(fallbackImg)}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-90 group-hover:brightness-100 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          <SectionHeading title="Identity" subtitle="Full-Stack Architect" number="01" />
          <p className="text-xl text-white/40 leading-relaxed font-light">
            I architect <span className="text-white">fast, scalable, and secure digital systems</span>.
            <br />
            <br />
            I’m Abhiram — a developer focused on engineering high-performance web applications with modern frontend precision and resilient backend logic. My approach combines clean architecture, intelligent system design, and security-driven thinking.
          </p>

          <div className="space-y-8">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase items-center">
                  <span className="flex items-center gap-2">{skill.name}</span>
                  <span className="text-cyan-500">{skill.level}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillsGrid = () => {
  const techs = [
    { icon: <Code2 />, name: 'Frontend Architecture', desc: 'Enterprise React, Next.js, and performance-first design systems.' },
    { icon: <Database />, name: 'Scalable Backend', desc: 'Node.js, Go, Python, and distributed microservices logic.' },
    { icon: <Palette />, name: 'Design Engineering', desc: 'Figma-to-code pipelines, high-fidelity interaction design.' },
    { icon: <Smartphone />, name: 'Mobile Strategy', desc: 'Cross-platform development with React Native and native UX.' },
    { icon: <Workflow />, name: 'API Management', desc: 'High-throughput RESTful, GraphQL, and gRPC architectures.' },
    { icon: <Braces />, name: 'Reliable Logic', desc: 'Clean code principles, data structures, and optimized algorithms.' },
  ];

  return (
    <section id="stack" className="py-40 px-8 max-w-[1400px] mx-auto">
      <SectionHeading title="Arsenal" subtitle="Technical Proficiency" number="02" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.map((tech, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-cyan-500/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 transition-transform">
              {tech.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tighter uppercase italic">{tech.name}</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light uppercase tracking-wider">{tech.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ProjectsGrid = () => {
  const projects = [
    {
      title: 'Bliss Bakes',
      tags: ['React', 'Firebase', 'Optimization'],
      desc: 'Architected a premium bakery e-commerce engine with complex order management and real-time synchronization.',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200',
      github: 'https://github.com/Abhiram-1317/Bliss-bakes.git',
      demo: '#',
    },
    {
      title: 'Material Supplier',
      tags: ['Node.js', 'MongoDB', 'Logistics'],
      desc: 'Developed an enterprise supply chain system designed to streamline procurement and inventory monitoring.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
      github: 'https://github.com/Abhiram-1317/Material-Supplier.git',
      demo: '#',
    },
  ];

  return (
    <section id="projects" className="py-40 px-8 max-w-[1400px] mx-auto">
      <SectionHeading title="Showcase" subtitle="Production Deployments" number="03" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {projects.map((p, i) => (
          <motion.div key={i} className="group relative rounded-[3rem] overflow-hidden bg-black/40 border border-white/5 flex flex-col h-full">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            <div className="p-10 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-black tracking-widest uppercase">
                      {t}
                    </span>
                  ))}
                </div>
                <h4 className="text-3xl font-black tracking-tighter uppercase italic mb-4">{p.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest mb-6">{p.desc}</p>
              </div>
              <div className="flex gap-6">
                <a href={p.demo} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                  Live View <ExternalLink size={12} />
                </a>
                <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  GitHub Source <Github size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FreelancerPage = () => {
  const services = [
    { title: 'Software Engineering', icon: <Code2 />, desc: 'Developing scalable, performant web applications with high maintainability.' },
    { title: 'UI/UX Engineering', icon: <Palette />, desc: 'Translating complex design systems into pixel-perfect, accessible code.' },
    { title: 'System Architecture', icon: <Database />, desc: 'Designing robust backend infrastructure and optimized data models.' },
    { title: 'Application Security', icon: <Shield />, desc: 'Implementing secure authentication and protecting enterprise data.' },
  ];

  return (
    <div className="pt-40 pb-20 px-8 max-w-[1400px] mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32 space-y-6">
        <h2 className="text-[10vw] font-black italic uppercase tracking-tighter leading-none">
          Solutions<span className="text-cyan-500">.</span>
        </h2>
        <p className="text-xl text-white/40 font-light max-w-2xl mx-auto uppercase tracking-widest">Enterprise-grade services for visionary products.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[400px] group transition-all"
          >
            <div>
              <div className="text-cyan-400 mb-8">{s.icon}</div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wider">{s.desc}</p>
            </div>
            <div className="space-y-6">
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Enquire Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center py-40 border-t border-white/5">
        <h3 className="text-6xl font-black italic uppercase tracking-tighter mb-12">
          Let's Build Something
          <br />
          Powerful.
        </h3>
        <button className="px-16 py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-transform text-xs shadow-[0_0_50px_rgba(6,182,212,0.4)]">
          Initiate Project
        </button>
      </div>
    </div>
  );
};

const Contact = () => (
  <section id="contact" className="py-40 px-8 max-w-[1400px] mx-auto">
    <div className="grid md:grid-cols-2 gap-20">
      <div className="space-y-12">
        <SectionHeading title="Connect" subtitle="Transmission" number="04" />
        <div className="space-y-6">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Mail size={20} />
            </div>
            <a href="mailto:shivarathriabhiram12@gmail.com" className="text-2xl font-light text-white/60 group-hover:text-white transition-colors">
              shivarathriabhiram12@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Linkedin size={20} />
            </div>
            <a
              href="https://www.linkedin.com/in/shivarathri-abhiram-0272273a4/"
              target="_blank"
              rel="noreferrer"
              className="text-2xl font-light text-white/60 group-hover:text-white transition-colors"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      <form className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 space-y-8 backdrop-blur-xl" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest uppercase opacity-40 ml-4">Identity</label>
          <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-colors text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest uppercase opacity-40 ml-4">Coordinate</label>
          <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-colors text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest uppercase opacity-40 ml-4">Intelligence</label>
          <textarea rows="4" placeholder="Brief Summary" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none text-white" />
        </div>
        <button className="w-full py-5 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] rounded-2xl hover:shadow-2xl transition-all text-[10px]">
          Transmit Message
        </button>
      </form>
    </div>
  </section>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('portfolio');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans">
      <CustomCursor />
      <ThreeBackground />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 z-[1000] origin-left" style={{ scaleX }} />

      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-2xl">
        <div className="flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
          <div onClick={() => { setCurrentPage('portfolio'); window.scrollTo(0, 0); }} className="text-sm font-black tracking-widest uppercase cursor-pointer">
            Abhiram<span className="text-cyan-500">.</span>
          </div>
          <div className="flex gap-8 text-[9px] font-black tracking-widest uppercase text-white/50">
            {currentPage === 'portfolio' ? (
              <>
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#projects" className="hover:text-white transition-colors">Works</a>
                <button onClick={() => { setCurrentPage('freelancer'); window.scrollTo(0, 0); }} className="text-cyan-400 hover:text-white transition-colors underline decoration-cyan-500/30 underline-offset-4">
                  Freelancer
                </button>
              </>
            ) : (
              <button onClick={() => setCurrentPage('portfolio')} className="hover:text-white transition-colors">
                Back to Portfolio
              </button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {currentPage === 'portfolio' ? (
          <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Hero onHireClick={() => { setCurrentPage('freelancer'); window.scrollTo(0, 0); }} />
            <About />
            <SkillsGrid />
            <ProjectsGrid />
            <Contact />
          </motion.div>
        ) : (
          <motion.div key="freelancer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
            <FreelancerPage />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-20 border-t border-white/5 px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 italic font-mono text-[9px] tracking-[0.4em] uppercase">
          <div>© 2024 ABHIRAM ARCHIVE — ALL SYSTEMS OPERATIONAL</div>
          <div className="flex gap-6">
            <a href="https://github.com/Abhiram-1317" target="_blank" rel="noreferrer">
              <Github size={14} className="hover:text-cyan-400 cursor-pointer" />
            </a>
            <a href="https://www.linkedin.com/in/shivarathri-abhiram-0272273a4/" target="_blank" rel="noreferrer">
              <Linkedin size={14} className="hover:text-cyan-400 cursor-pointer" />
            </a>
            <Globe size={14} className="hover:text-cyan-400 cursor-pointer" />
          </div>
          <div>Professional Engineering Standard</div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `,
        }}
      />
    </div>
  );
};

export default App;
