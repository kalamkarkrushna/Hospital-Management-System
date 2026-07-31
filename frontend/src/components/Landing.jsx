import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BorderBeam } from "./ui/border-beam";
import LiquidEther from "./LiquidEther";
import ShinyText from "./ShinyText";
import FadeContent from "./FadeContent";
import Magnet from "./Magnet";
import { ModeToggle } from "./mode-toggle";
import {
  Stethoscope,
  CalendarCheck,
  Users,
  Shield,
  Building2,
  Sparkles,
  ChevronRight,
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  DollarSign,
  Pill,
  FileText,
  Clock,
  Video,
  Package,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const features = [
  { icon: Users, title: "Patient Management", desc: "Register and manage patient records with demographics, medical history, and contact information." },
  { icon: Stethoscope, title: "Doctor Directory", desc: "Maintain a comprehensive directory of doctors with specializations, schedules, and contact details." },
  { icon: CalendarCheck, title: "Appointment Booking", desc: "Schedule appointments with real-time availability checks to avoid double-booking." },
  { icon: Shield, title: "Role-Based Access", desc: "Admin and staff roles with granular permissions to keep your data secure." },
  { icon: Building2, title: "Multi-Tenant", desc: "Each hospital gets its own isolated workspace with separate patient and staff data." },
  { icon: Sparkles, title: "AI-Powered Insights", desc: "Leverage intelligent analytics to improve patient care and operational efficiency." },
  { icon: DollarSign, title: "Billing & Invoicing", desc: "Generate invoices, process payments, and manage insurance claims all in one place." },
  { icon: Pill, title: "Pharmacy Management", desc: "Track prescriptions, manage inventory, and streamline medication dispensing." },
  { icon: FileText, title: "Lab Reports & Records", desc: "Store and access lab results, imaging reports, and patient history digitally." },
  { icon: Clock, title: "Staff Scheduling", desc: "Create shift schedules, manage time-off requests, and track attendance." },
  { icon: Video, title: "Telemedicine", desc: "Conduct virtual consultations with built-in video calling and prescription tools." },
  { icon: Package, title: "Inventory Management", desc: "Track medical supplies, automate reordering, and reduce waste." },
];

const steps = [
  { num: "01", title: "Set Up Your Hospital", desc: "Create your hospital profile, invite staff, and configure your workspace in minutes." },
  { num: "02", title: "Add Patients & Doctors", desc: "Easily register patients and doctors with comprehensive profiles and specializations." },
  { num: "03", title: "Manage Appointments", desc: "Book, reschedule, and track appointments with real-time availability and notifications." },
];

const plans = [
  {
    name: "Starter", price: "Free", desc: "Perfect for small clinics getting started.",
    features: ["Up to 50 patients", "Up to 5 staff users", "Basic appointment booking", "Email support"],
    cta: "Get Started", href: "/register", popular: false,
  },
  {
    name: "Professional", price: "$29", period: "/month", desc: "For growing hospitals with more needs.",
    features: ["Unlimited patients", "Up to 25 staff users", "Advanced appointment management", "Priority support", "Analytics dashboard", "Custom branding"],
    cta: "Start Free Trial", href: "/register", popular: true,
  },
  {
    name: "Enterprise", price: "$99", period: "/month", desc: "For large hospitals and healthcare networks.",
    features: ["Unlimited everything", "Unlimited staff users", "API access", "Dedicated support", "SLA guarantee", "On-premise option", "Custom integrations"],
    cta: "Contact Sales", href: "#", popular: false,
  },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Cardiologist", handle: "@drsarachen", text: "This platform transformed our clinic operations. Patient management has never been easier." },
  { name: "James Rodriguez", role: "Hospital Admin", handle: "@jrodriguez", text: "We reduced appointment no-shows by 40%. The scheduling system is a game-changer." },
  { name: "Dr. Emily Watson", role: "Pediatrician", handle: "@drwatson", text: "The multi-tenant setup allows our network of clinics to work seamlessly together." },
  { name: "Michael Park", role: "Practice Manager", handle: "@mpark", text: "Onboarded our entire staff in under an hour. The UI is intuitive and modern." },
  { name: "Dr. Lisa Kim", role: "Neurologist", handle: "@drlisakim", text: "Finally, a system that understands healthcare workflows. Highly recommend it." },
  { name: "Robert Taylor", role: "IT Director", handle: "@rtaylor", text: "Security and compliance were our top concerns. This platform exceeded our expectations." },
  { name: "Dr. Anaya Patel", role: "Family Medicine", handle: "@drapatel", text: "The role-based access control lets me give staff exactly what they need." },
  { name: "Sarah Mitchell", role: "Clinic Owner", handle: "@smitchell", text: "Started with the free plan, upgraded to Professional within a month. Worth every penny." },
  { name: "Dr. David Park", role: "Orthopedic Surgeon", handle: "@drpark", text: "Appointment analytics helped us optimize our schedule and reduce wait times." },
];

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Support: ["Help Center", "Documentation", "API Reference", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowNav(current <= lastScrollY.current);
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          colors={["#5227FF","#FF9FFC","#B497CF"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-transform duration-300 ${showNav ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-heading font-bold tracking-tight text-foreground">
            HMS
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started</Button></Link>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground cursor-pointer">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-muted/50 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <div className="flex gap-2 pt-2 border-t border-border/50">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1"><Button variant="ghost" size="sm" className="w-full">Sign In</Button></Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1"><Button size="sm" className="w-full">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <FadeContent threshold={0.1} duration={800}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 dark:border-white/20 bg-white/15 dark:bg-white/10 backdrop-blur-sm text-primary text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Hospital Management System
              </div>
            </FadeContent>
            <FadeContent threshold={0.1} duration={1000} delay={200}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-tight">
                Manage Your Hospital{" "}
                <span className="text-primary">
                  <ShinyText text="with Ease" speed={3} shineColor="#a78bfa" />
                </span>
              </h1>
            </FadeContent>
            <FadeContent threshold={0.1} duration={1000} delay={400}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                A lightweight, multi-tenant SaaS platform built for clinics and small hospitals.
                Manage patients, doctors, and appointments effortlessly.
              </p>
            </FadeContent>
            <FadeContent threshold={0.1} duration={1000} delay={600}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Magnet padding={50} magnetStrength={4}>
                    <div className="relative overflow-hidden rounded-md">
                      <Button size="lg" className="gap-1.5 w-full sm:w-auto">Start Free <ArrowRight className="w-4 h-4" /></Button>
                      <BorderBeam size={150} duration={4} borderWidth={2} colorFrom="#8b5cf6" colorTo="#6366f1" />
                    </div>
                  </Magnet>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Magnet padding={50} magnetStrength={4}>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">Learn More</Button>
                  </Magnet>
                </a>
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="py-10 sm:py-12 ">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeContent threshold={0.1} duration={800}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">Trusted by healthcare professionals worldwide</p>
            </FadeContent>
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 text-muted-foreground/40">
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">HOSPITAL</span>
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">CLINIC</span>
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">MEDICAL</span>
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">HEALTHCARE</span>
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">PRACTICE</span>
              <span className="text-base sm:text-lg font-heading font-bold text-muted-foreground/20">PHARMA</span>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <FadeContent threshold={0.1} duration={800}>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Features</p>
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground px-2">
                  Everything You Need to <span className="text-primary">Run Your Hospital</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                  From patient records to appointment scheduling, we've got you covered.
                </p>
              </div>
            </FadeContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <FadeContent key={f.title} threshold={0.1} duration={600} delay={i * 100}>
                    <div className="group relative rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-5 sm:p-6 hover:border-white/40 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1.5">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </FadeContent>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <FadeContent threshold={0.1} duration={800}>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">The Process</p>
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground">
                  Get Started in <span className="text-primary">3 Simple Steps</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                  Set up your hospital management system quickly and start seeing results.
                </p>
              </div>
            </FadeContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-8">
              {steps.map((s, i) => (
                <FadeContent key={s.num} threshold={0.1} duration={600} delay={i * 150}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
                      <span className="text-lg font-heading font-bold text-primary">{s.num}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <FadeContent threshold={0.1} duration={800}>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Pricing</p>
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground">
                  Plans That <span className="text-primary">Fit Your Practice</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                  Start free, upgrade when you grow. No credit card required.
                </p>
              </div>
            </FadeContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <FadeContent key={p.name} threshold={0.1} duration={600} delay={i * 150}>
                  <div className={`relative rounded-xl border p-6 flex flex-col backdrop-blur-xl ${
                    p.popular ? "border-white/30 dark:border-white/20 bg-white/15 dark:bg-white/10 shadow-xl ring-1 ring-white/20" : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5"
                  }`}>
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/30 dark:bg-white/20 backdrop-blur-md text-foreground text-xs font-medium rounded-full z-10 border border-white/30 dark:border-white/20">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="font-heading font-semibold text-foreground mb-1">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-3xl font-heading font-bold text-foreground">{p.price}</span>
                        {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to={p.href}>
                      <Button variant={p.popular ? "default" : "outline"} className="w-full">
                        {p.cta}
                      </Button>
                    </Link>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <FadeContent threshold={0.1} duration={800}>
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Testimonials</p>
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground">
                  Trusted by <span className="text-primary">Healthcare Professionals</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                  See what our users have to say about HMS.
                </p>
              </div>
            </FadeContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <FadeContent key={t.handle} threshold={0.1} duration={500} delay={i * 80}>
                  <div className="rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} &middot; {t.handle}</p>
                  </div>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <FadeContent threshold={0.1} duration={1000}>
              <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-xl p-8 sm:p-14 shadow-xl">
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground mb-4 px-2">
                  Ready to Transform Your <span className="text-primary">Hospital Management?</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto px-2">
                  Join thousands of healthcare professionals who trust HMS to run their practice. Start free, no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link to="/register" className="w-full sm:w-auto"><Magnet padding={50} magnetStrength={4}><Button size="lg" className="gap-1.5 w-full sm:w-auto">Get Started Free <ChevronRight className="w-4 h-4" /></Button></Magnet></Link>
                  <Link to="/login" className="w-full sm:w-auto"><Magnet padding={50} magnetStrength={4}><Button variant="outline" size="lg" className="w-full sm:w-auto">Sign In</Button></Magnet></Link>
                </div>
              </div>
            </FadeContent>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/20 dark:border-white/10 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-10">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <Link to="/" className="text-xl font-heading font-bold tracking-tight text-foreground">HMS</Link>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
                A lightweight hospital management SaaS platform for clinics and small hospitals.
              </p>
            </div>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-foreground mb-3">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} HMS. All rights reserved.</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><span className="text-xs">Twitter</span></a>
              <a href="https://github.com/kalamkarkrushna/Hospital-Management-System" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><span className="text-xs">GitHub</span></a>
              <a href="#" className="hover:text-foreground transition-colors"><span className="text-xs">LinkedIn</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
