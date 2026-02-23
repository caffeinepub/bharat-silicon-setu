import { useState } from 'react';
import { Upload, Zap, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export default function AISkillMapping() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const mockSkills = [
    { name: 'VLSI Design', strength: 85 },
    { name: 'Verilog', strength: 90 },
    { name: 'SystemVerilog', strength: 75 },
    { name: 'Digital Design', strength: 80 },
    { name: 'ASIC Design', strength: 70 }
  ];

  const mockProjects = [
    {
      title: 'ASIC Design Engineer',
      company: 'TechCorp',
      match: 92,
      skills: ['VLSI Design', 'Verilog', 'ASIC Design']
    },
    {
      title: 'Digital Design Specialist',
      company: 'SemiTech',
      match: 88,
      skills: ['Digital Design', 'SystemVerilog']
    }
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <Link to="/student-dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
              <Zap className="h-4 w-4" />
              AI-Powered Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              AI Skill Mapping
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Upload your resume and let our AI analyze your semiconductor skills with precision
            </p>
          </div>

          {!analysisComplete ? (
            <>
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Upload Your Resume</CardTitle>
                  <CardDescription className="text-white">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80 font-semibold">
                          Click to upload
                        </span>
                        <span className="text-white"> or drag and drop</span>
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                    {file && (
                      <div className="text-sm text-white">
                        Selected: {file.name}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white">1. Upload</h3>
                      <p className="text-sm text-white">
                        Upload your resume in PDF or DOC format
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white">2. Analyze</h3>
                      <p className="text-sm text-white">
                        Our AI extracts and evaluates your semiconductor skills
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white">3. Match</h3>
                      <p className="text-sm text-white">
                        Get matched with relevant projects and opportunities
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Award className="h-6 w-6 text-primary" />
                    Your Skill Profile
                  </CardTitle>
                  <CardDescription className="text-white">
                    AI-extracted skills from your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockSkills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{skill.name}</span>
                        <span className="text-sm text-white">{skill.strength}%</span>
                      </div>
                      <Progress value={skill.strength} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommended Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Recommended Projects
                  </CardTitle>
                  <CardDescription className="text-white">
                    Projects that match your skill profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProjects.map((project, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                            <p className="text-sm text-white">{project.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{project.match}%</div>
                            <p className="text-xs text-white">Match</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-white">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full">Apply Now</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Development Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Skill Development Recommendations</CardTitle>
                  <CardDescription className="text-white">
                    Areas to focus on for career growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-primary font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Advanced ASIC Design</p>
                        <p className="text-sm text-white">
                          Strengthen your ASIC design skills to increase project matches by 15%
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-primary font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">SystemVerilog Proficiency</p>
                        <p className="text-sm text-white">
                          Improve your SystemVerilog skills to qualify for senior positions
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setAnalysisComplete(false);
                  }}
                  className="flex-1"
                >
                  Analyze Another Resume
                </Button>
                <Link to="/student-dashboard" className="flex-1">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
