import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Upload, Zap, Cpu, TrendingUp, Target, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function AISkillMapping() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalyzed(false);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  const extractedSkills = [
    { name: 'VLSI Design', strength: 92, category: 'Core' },
    { name: 'RTL Design', strength: 88, category: 'Core' },
    { name: 'Verilog/SystemVerilog', strength: 85, category: 'Programming' },
    { name: 'FPGA Development', strength: 78, category: 'Hardware' },
    { name: 'Digital Circuit Design', strength: 82, category: 'Core' },
    { name: 'Embedded Systems', strength: 75, category: 'Systems' }
  ];

  const suggestedProjects = [
    { id: 1, title: 'RISC-V Processor Design', company: 'TechCore Semiconductors', match: 92 },
    { id: 2, title: 'SoC Verification Framework', company: 'ChipVerify Labs', match: 88 },
    { id: 3, title: 'Memory Controller Optimization', company: 'MemTech Solutions', match: 85 }
  ];

  const overallMatch = 82;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Cpu className="h-8 w-8 text-primary" />
              <span className="text-xl font-display font-bold">Bharat Silicon Setu</span>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
              <Zap className="h-4 w-4" />
              AI-Powered Skill Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              AI Skill Mapping
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and let our advanced AI analyze your semiconductor skills, identify strengths, and match you with perfect industry projects
            </p>
          </div>

          {/* Upload Section */}
          {!analyzed && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>Supported formats: PDF, DOC, DOCX (Max 5MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      {file ? (
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground">
                            Your resume will be analyzed securely
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!file || analyzing}
                    onClick={handleAnalyze}
                  >
                    {analyzing ? (
                      <>
                        <Zap className="h-5 w-5 mr-2 animate-pulse" />
                        Analyzing Skills...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Analyze Skills
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analyzed && (
            <div className="space-y-8 animate-fade-in">
              {/* Overall Match Score */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">AI Analysis Complete</CardTitle>
                      <CardDescription>Your semiconductor skill profile has been generated</CardDescription>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary mb-1">{overallMatch}%</div>
                      <p className="text-sm text-muted-foreground">Overall Match Score</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Extracted Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Extracted Skills
                  </CardTitle>
                  <CardDescription>AI-identified competencies from your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {extractedSkills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{skill.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                          <span className="text-sm font-bold text-primary">{skill.strength}%</span>
                        </div>
                        <Progress value={skill.strength} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Suggested Industry Projects
                  </CardTitle>
                  <CardDescription>Top project matches based on your skill profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suggestedProjects.map((project) => (
                      <div key={project.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.company}</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {project.match}% Match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Highly compatible with your skill set
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Link to="/student-dashboard" className="flex-1">
                      <Button className="w-full" size="lg">
                        View All Projects
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" onClick={() => setAnalyzed(false)}>
                      Analyze Another Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development Recommendations</CardTitle>
                  <CardDescription>Areas to focus on for career growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Advanced Verification Techniques</h4>
                        <p className="text-sm text-muted-foreground">
                          Consider learning UVM and formal verification to complement your RTL skills
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Low Power Design</h4>
                        <p className="text-sm text-muted-foreground">
                          High demand skill in the industry - would increase your project matches by 15%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
