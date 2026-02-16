import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, HeartPulse, Trophy, GraduationCap, ArrowRight, Activity, Hammer, Monitor, CheckCircle2, X } from 'lucide-react';
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
      <section className="relative overflow-hidden py-24 lg:py-32">
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

            {/* Typography Strategy: Baron for Impact */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-baron text-5xl sm:text-7xl lg:text-9xl tracking-tighter text-primary"
            >
              SAY <span className="text-dpeen-red">NO</span> TO DRUGS
            </motion.h1>

            {/* Typography Strategy: Carousel for Elegance */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-carousel text-xl md:text-3xl text-muted-foreground max-w-[800px] leading-relaxed italic"
            >
              "To create a healthy and harmonious environment that supports growth, innovation and productivity."
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
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
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:14px_24px]"></div>
      </section>

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
              <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-xl border shadow-lg overflow-hidden flex flex-col items-center justify-center gap-6 p-8">
                {/* Faint red circle backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white" />
                <img
                  src="/dpeen-logo.svg"
                  alt="DPEEN emblem"
                  className="relative z-10 w-48 h-48 object-contain opacity-90"
                />
                <div className="relative z-10 text-center">
                  <h3 className="font-baron text-4xl">100%</h3>
                  <p className="font-carousel text-lg text-gray-600">Dedication to Humanity</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large Card */}
            <div className="md:col-span-2 bg-zinc-900 rounded-xl p-8 border border-zinc-800 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Monitor size={120} />
              </div>
              <h3 className="font-baron text-2xl mb-4 text-dpeen-red">ICT & TECH HUBS</h3>
              <p className="text-gray-400 max-w-md relative z-10">
                Establishment of training hubs in every zone. We equip youths with modern digital skills to ensure they are competitive in the global market.
              </p>
            </div>

            {/* Small Cards */}
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col justify-center">
              <Hammer className="mb-4 text-white" size={32} />
              <h3 className="font-bold text-lg mb-2">Crafts & Furniture</h3>
              <p className="text-sm text-gray-500">Building practical skills for immediate employment.</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 flex flex-col justify-center">
              <Activity className="mb-4 text-white" size={32} />
              <h3 className="font-bold text-lg mb-2">Soap Making & Cooking</h3>
              <p className="text-sm text-gray-500">Vocational training for self-reliance.</p>
            </div>

             <div className="md:col-span-2 bg-dpeen-red rounded-xl p-8 flex items-center justify-between">
               <div>
                  <h3 className="font-baron text-2xl text-white mb-1">SCHOLARSHIP PLACEMENTS</h3>
                  <p className="text-red-100 text-sm">For those qualified and eager to continue schooling.</p>
               </div>
               <ArrowRight className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/dpeen-logo.svg" alt="DPEEN Logo" className="h-8 w-8 object-contain" />
            <span className="font-baron text-lg">DPEEN</span>
          </div>
          <p className="text-sm text-muted-foreground font-carousel italic">
            "Transforming lives, one community at a time."
          </p>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DPEEN. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
