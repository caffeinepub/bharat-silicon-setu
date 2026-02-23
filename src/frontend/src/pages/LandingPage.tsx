import { Link } from '@tanstack/react-router';
import { Cpu, Users, Briefcase, Building2, TrendingUp, CheckCircle, ArrowRight, Zap, Target, Award, Heart } from 'lucide-react';
import { SiLinkedin, SiX, SiGithub } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRoleBasedRedirect } from '../hooks/useRoleBasedRedirect';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'bharat-silicon-setu');
  const { login, identity, loginStatus } = useInternetIdentity();
  const { dashboardPath, isLoading: roleLoading } = useRoleBasedRedirect();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    if (isAuthenticated) {
      // Navigate to appropriate dashboard
      navigate({ to: dashboardPath });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-8 w-8 text-primary" />
              <span className="text-xl font-display font-bold">Bharat Silicon Setu</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#stakeholders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For You</a>
              <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
              <Link to="/ai-skill-mapping" className="text-sm text-primary hover:text-primary/80 transition-colors">AI Skill Mapping</Link>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn || roleLoading}
                className="ml-2"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : isAuthenticated ? (
                  'Go to Dashboard'
                ) : (
                  'Login'
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
              Semiconductor Execution Ecosystem
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Bharat Silicon Setu
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">
              Bridging Talent to Semiconductor Execution
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect students, semiconductor companies, startups, and institutions in a unified execution ecosystem powered by AI-driven skill mapping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="lg"
                className="shadow-lg hover:shadow-glow"
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link 
                to="/ai-skill-mapping"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border"
              >
                Try AI Skill Mapping
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Challenge</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Skill Gap Crisis</h3>
                <p className="text-muted-foreground">
                  The semiconductor industry faces a critical shortage of skilled professionals, with academic curricula often misaligned with industry needs.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Talent Discovery</h3>
                <p className="text-muted-foreground">
                  Companies struggle to identify and validate candidates with the right semiconductor expertise, leading to lengthy hiring cycles.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="h-12 w-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Execution Gap</h3>
                <p className="text-muted-foreground">
                  Students lack access to real-world semiconductor projects, limiting their ability to gain practical execution experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered platform streamlines the journey from skill assessment to project execution
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-8 space-y-4 h-full">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-display font-bold">AI Skill Mapping</h3>
                <p className="text-muted-foreground">
                  Upload your resume and let our AI analyze your semiconductor skills, identifying strengths and areas for growth with precision.
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Automated skill extraction</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Competency level assessment</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Gap analysis & recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-8 space-y-4 h-full">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-display font-bold">Project Matching</h3>
                <p className="text-muted-foreground">
                  Get matched with industry projects that align with your skills and career goals, powered by intelligent algorithms.
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Smart project recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Skill-based compatibility scoring</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Direct company connections</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-8 space-y-4 h-full">
                <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-display font-bold">Execution & Validation</h3>
                <p className="text-muted-foreground">
                  Work on real semiconductor projects, build your portfolio, and earn validated credentials recognized by the industry.
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Hands-on project experience</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Industry mentor guidance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Verified skill certifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Section */}
      <section id="stakeholders" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Built for Everyone</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive ecosystem serving all stakeholders in the semiconductor industry
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold">Students</h3>
              <p className="text-muted-foreground text-sm">
                Access real-world semiconductor projects, build your skills with AI-powered guidance, and connect directly with industry leaders.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>AI skill assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Project opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Industry mentorship</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold">Industry</h3>
              <p className="text-muted-foreground text-sm">
                Find pre-vetted semiconductor talent, post projects, and build your talent pipeline with data-driven insights.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Verified talent pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Skill-based matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Reduced hiring time</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold">Startups</h3>
              <p className="text-muted-foreground text-sm">
                Access skilled semiconductor talent on-demand, collaborate on innovative projects, and scale your team efficiently.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Flexible talent access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Cost-effective hiring</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Innovation partnerships</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold">Institutions</h3>
              <p className="text-muted-foreground text-sm">
                Bridge the academia-industry gap, provide students with real-world experience, and enhance curriculum relevance.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Industry partnerships</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Student placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  <span>Curriculum alignment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Building India's semiconductor workforce, one connection at a time
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-display font-bold text-primary">10K+</div>
              <div className="text-lg font-semibold">Students Connected</div>
              <p className="text-sm text-muted-foreground">Skilled professionals ready for semiconductor industry</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-display font-bold text-primary">500+</div>
              <div className="text-lg font-semibold">Industry Partners</div>
              <p className="text-sm text-muted-foreground">Leading companies and startups in the ecosystem</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-display font-bold text-primary">2K+</div>
              <div className="text-lg font-semibold">Projects Completed</div>
              <p className="text-sm text-muted-foreground">Real-world semiconductor execution experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" />
                <span className="font-display font-bold">Bharat Silicon Setu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bridging talent to semiconductor execution through AI-powered skill mapping and industry connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link to="/ai-skill-mapping" className="hover:text-foreground transition-colors">AI Skill Mapping</Link></li>
                <li><a href="#stakeholders" className="hover:text-foreground transition-colors">For Students</a></li>
                <li><a href="#stakeholders" className="hover:text-foreground transition-colors">For Industry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiLinkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© {currentYear} Bharat Silicon Setu. All rights reserved.</div>
            <div className="flex items-center gap-2">
              Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
