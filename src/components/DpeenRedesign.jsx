import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, HeartPulse, Trophy, GraduationCap, ArrowRight, Activity, Hammer, Monitor, CheckCircle2, X, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- HELPER ---
const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- GLASSMORPHIC MODAL COMPONENT ---

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* 1. The Backdrop: Heavy blur, dark overlay, no "glowing" colors */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* 2. The Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', 
          }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            {/* Header - Baron Font */}
            <div className="text-center mb-8">
              <h3 className="font-baron text-3xl tracking-wide text-gray-900 mb-2">
                JOIN THE CAUSE
              </h3>
              {/* Subheader - Carousel Font */}
              <p className="font-carousel text-lg text-gray-600 leading-tight">
                "Transforming lives and communities through collaborative partnerships."
              </p>
            </div>

            {/* The Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-dpeen-red/50 focus:border-transparent transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-dpeen-red/50 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-dpeen-red/50 transition-all"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">I want to...</label>
                <select className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-dpeen-red/50 transition-all text-gray-700">
                  <option>Make a Donation</option>
                  <option>Partner as a Hub</option>
                  <option>Volunteer (Rehabilitation)</option>
                  <option>Request Help</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full bg-dpeen-red text-white font-baron text-lg tracking-wide py-3 rounded-lg shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>PROCEED</span>
                  <ArrowRight size={18} />
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 font-carousel">
                  Your support creates a healthy and harmonious environment.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};



// --- HERO SECTION with typewriter + fire effect ---

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.5,
    },
  },
};

const HeroSection = ({ setIsModalOpen }) => {
  const [isBurning, setIsBurning] = useState(false);

  const part1 = 'SAY ';
  const part3 = ' TO DRUGS';

  const handleTypingDone = () => {
    setIsBurning(true);
    setTimeout(() => setIsBurning(false), 3000);
  };

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Faded community background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="red" className="mb-4 px-4 py-1 text-sm font-medium">
              EST. 2026 NGO
            </Badge>
          </motion.div>

          {/* Typewriter headline */}
          <motion.h1
            className="font-baron text-5xl sm:text-7xl lg:text-9xl tracking-tighter text-primary relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={handleTypingDone}
          >
            {/* SAY  */}
            {part1.split('').map((char, i) => (
              <motion.span key={`p1-${i}`} variants={letterVariants}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}

            {/* NO — full letter burns then settles */}
            <span className="relative inline-block">
              <span className={isBurning ? 'burning-text' : 'text-dpeen-red'}>
                NO
              </span>
              {isBurning && (
                <>
                  <span className="smoke-particle" style={{ animationDelay: '0s',   left: '15%' }} />
                  <span className="smoke-particle" style={{ animationDelay: '0.7s', left: '50%' }} />
                  <span className="smoke-particle" style={{ animationDelay: '1.4s', left: '78%' }} />
                </>
              )}
            </span>

            {/* TO DRUGS */}
            {part3.split('').map((char, i) => (
              <motion.span key={`p3-${i}`} variants={letterVariants}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.8 }}
            className="font-carousel text-xl md:text-3xl text-muted-foreground max-w-[800px] leading-relaxed italic"
          >
            "To create a healthy and harmonious environment that supports growth, innovation and productivity."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.1 }}
            className="flex gap-4 pt-4"
          >
            <Button size="lg" variant="red" className="font-bold text-md px-8 rounded-full" onClick={() => setIsModalOpen(true)}>
              Join The Network
            </Button>
            <Button size="lg" variant="outline" className="font-bold text-md px-8 rounded-full border-2">
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:14px_24px]" />
    </section>
  );
};

// --- TRUSTEES & PARTNERS SECTION ---

const TrusteesSection = () => {
  const trustees = [
    {
      name: "Dr. Amara Okafor",
      role: "Chairperson",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Chief Emeka Nnadi",
      role: "Board Trustee",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Mrs. Ngozi Adeleke",
      role: "Secretary",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-dpeen-red font-bold tracking-widest text-xs uppercase mb-2 block">Our Guidance</span>
          <h2 className="font-baron text-4xl text-slate-900">LEADERSHIP & TRUSTEES</h2>
          <div className="w-20 h-1 bg-dpeen-red mx-auto rounded-full mt-4" />
        </div>

        {/* Trustee cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {trustees.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group text-center">
                <div className="aspect-square rounded-full max-w-[220px] mx-auto mb-6 overflow-hidden border-4 border-slate-50 shadow-xl group-hover:border-red-100 transition-colors duration-300">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="font-carousel text-2xl text-slate-900 mb-1">{t.name}</h3>
                <p className="text-dpeen-red text-xs font-bold tracking-widest uppercase">{t.role}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Partners strip */}
        <FadeIn delay={0.3}>
          <div className="border-t border-slate-100 pt-14">
            <p className="text-center font-baron text-sm text-slate-400 tracking-widest mb-8">IN PARTNERSHIP WITH</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
              <div className="flex items-center gap-2 font-bold text-slate-700"><Building2 size={20} /> GOVT OF IMO STATE</div>
              <div className="flex items-center gap-2 font-bold text-slate-700"><Shield size={20} /> NDLEA</div>
              <div className="flex items-center gap-2 font-bold text-slate-700"><Users size={20} /> YOUTH COUNCIL</div>
              <div className="flex items-center gap-2 font-bold text-slate-700"><HeartPulse size={20} /> HEALTH ORG</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function DpeenRedesign() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/dpeen-logo.svg" alt="DPEEN Logo" className="h-10 w-10 object-contain" />
            <span className="font-baron text-xl tracking-wider">DPEEN</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#mission" className="text-sm font-medium hover:text-dpeen-red transition-colors">Mission</a>
            <a href="#program" className="text-sm font-medium hover:text-dpeen-red transition-colors">Programs</a>
            <a href="#empowerment" className="text-sm font-medium hover:text-dpeen-red transition-colors">Empowerment</a>
          </div>
          <Button variant="outline" className="font-baron tracking-wide text-xs" onClick={() => setIsModalOpen(true)}>DONATE NOW</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection setIsModalOpen={setIsModalOpen} />

      {/* Value Statement - Elegant Typography Focus */}
      <section id="mission" className="py-20 bg-slate-50 border-y">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="space-y-6">
                 <h2 className="font-baron text-4xl tracking-wide text-dpeen-red">OUR MISSION</h2>
                 <p className="font-carousel text-2xl md:text-3xl leading-snug text-gray-800">
                   Transforming lives and communities by preventing drug use, treating addiction, and promoting recovery through collaborative partnerships.
                 </p>
                 <div className="space-y-4 pt-4">
                   {['Preventing drug use', 'Treating addiction', 'Promoting recovery', 'Collaborative partnerships'].map((item) => (
                     <div key={item} className="flex items-center gap-3">
                       <CheckCircle2 className="text-dpeen-red h-5 w-5" />
                       <span className="font-medium">{item}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="relative group">
                {/* Red accent block behind image */}
                <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1000&auto=format&fit=crop"
                    alt="Empowered African youth"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-baron text-lg tracking-wide">EMPOWERING THE NEXT GENERATION</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4 Stages - Using Shadcn Cards */}
      <section id="program" className="py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-baron text-4xl mb-4">THE 4-STAGE PROGRAM</h2>
            <p className="font-carousel text-xl text-muted-foreground">A systematic approach to restoration.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Education",
                icon: Shield,
                desc: "Educating children & youths on the danger of drugs.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                title: "Rehabilitation",
                icon: HeartPulse,
                desc: "Identifying addiction & connecting with professionals.",
                color: "text-dpeen-red",
                bg: "bg-red-50"
              },
              {
                title: "Recreation",
                icon: Trophy,
                desc: "Sporting facilities to create positive distractions.",
                color: "text-orange-600",
                bg: "bg-orange-50"
              },
              {
                title: "Empowerment",
                icon: GraduationCap,
                desc: "Skills training & scholarships for the future.",
                color: "text-green-600",
                bg: "bg-green-50"
              }
            ].map((stage, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-t-4 border-t-transparent hover:border-t-dpeen-red">
                  <CardHeader>
                    <div className={`w-12 h-12 ${stage.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <stage.icon className={`h-6 w-6 ${stage.color}`} />
                    </div>
                    <h3 className="font-baron text-xl tracking-wide">{stage.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {stage.desc}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Empowerment / Bento Grid Style */}
      <section id="empowerment" className="py-24 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-baron text-4xl md:text-5xl text-white mb-2">POVERTY ERADICATION</h2>
              <p className="font-carousel text-xl text-gray-400">Reliable income through verified skills.</p>
            </div>
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-black font-baron">
              Partner With Us
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[500px]">
            {/* Large Card: ICT — with photo */}
            <div className="md:col-span-2 rounded-2xl relative group overflow-hidden border border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
                alt="ICT training"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <Monitor className="text-red-500 mb-4" size={40} />
                <h3 className="font-baron text-2xl mb-3 text-red-400">ICT & TECH HUBS</h3>
                <p className="text-gray-300 max-w-md text-sm leading-relaxed">
                  Establishment of training hubs in every zone. We equip youths with modern digital skills to ensure steady and reliable income.
                </p>
              </div>
            </div>

            {/* Crafts — with photo */}
            <div className="rounded-2xl relative group overflow-hidden border border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop"
                alt="Crafts and furniture"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <Hammer className="mb-3 text-white" size={28} />
                <h3 className="font-bold text-lg">Crafts & Furniture</h3>
                <p className="text-sm text-gray-400 mt-1">Practical skills for immediate employment.</p>
              </div>
            </div>

            {/* Soap Making — with photo */}
            <div className="rounded-2xl relative group overflow-hidden border border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop"
                alt="Vocational training"
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <Activity className="mb-3 text-white" size={28} />
                <h3 className="font-bold text-lg">Soap Making & Cooking</h3>
                <p className="text-sm text-gray-400 mt-1">Vocational training for self-reliance.</p>
              </div>
            </div>

            {/* Scholarship strip */}
            <div className="md:col-span-2 bg-dpeen-red rounded-2xl p-8 flex items-center justify-between">
              <div>
                <h3 className="font-baron text-2xl text-white mb-1">SCHOLARSHIP PLACEMENTS</h3>
                <p className="text-red-100 text-sm">For those qualified and eager to continue schooling.</p>
              </div>
              <ArrowRight className="text-white flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Trustees & Partners */}
      <TrusteesSection />

      {/* Footer */}
      <footer className="py-16 border-t border-zinc-800 bg-zinc-950 text-zinc-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <img src="/dpeen-logo.svg" alt="DPEEN Logo" className="h-8 w-8 object-contain invert" />
                <span className="font-baron text-xl text-white tracking-widest">DPEEN</span>
              </div>
              <p className="text-sm font-carousel italic text-zinc-500 leading-relaxed">
                "Transforming lives and communities by preventing drug use, treating addiction, and promoting recovery."
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Program</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#program" className="hover:text-dpeen-red transition-colors">Prevention</a></li>
                  <li><a href="#program" className="hover:text-dpeen-red transition-colors">Rehabilitation</a></li>
                  <li><a href="#program" className="hover:text-dpeen-red transition-colors">Recreation</a></li>
                  <li><a href="#empowerment" className="hover:text-dpeen-red transition-colors">Empowerment</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Get Involved</h4>
                <ul className="space-y-3 text-sm">
                  <li><button onClick={() => setIsModalOpen(true)} className="hover:text-dpeen-red transition-colors text-left">Partner With Us</button></li>
                  <li><button onClick={() => setIsModalOpen(true)} className="hover:text-dpeen-red transition-colors text-left">Donate</button></li>
                  <li><button onClick={() => setIsModalOpen(true)} className="hover:text-dpeen-red transition-colors text-left">Volunteer</button></li>
                  <li><button onClick={() => setIsModalOpen(true)} className="hover:text-dpeen-red transition-colors text-left">Get Help</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-800 pt-8 text-xs text-center text-zinc-600">
            &copy; {new Date().getFullYear()} DPEEN. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
