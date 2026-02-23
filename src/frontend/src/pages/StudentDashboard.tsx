import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, Briefcase, MessageSquare, LogOut, TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetApprovedProjects } from '../hooks/useProjects';
import { useGetContactRequests } from '../hooks/useContactRequests';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();
  const { data: projects = [], isLoading: projectsLoading } = useGetApprovedProjects();
  const { data: messages = [], isLoading: messagesLoading } = useGetContactRequests();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const mockSkills = ['VLSI Design', 'Verilog', 'SystemVerilog', 'Digital Design', 'ASIC Design'];
  const profileCompletion = 75;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-display font-bold text-white">Student Portal</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
            <Target className="h-5 w-5" />
            <span className="text-white">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <Briefcase className="h-5 w-5" />
            <span>Projects</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <BookOpen className="h-5 w-5" />
            <span>My Skills</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-white">
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </button>
        </nav>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Welcome Back!</h1>
            <p className="text-white">Continue your semiconductor journey</p>
          </div>

          {/* Profile Completion Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Profile Completion</CardTitle>
              <CardDescription className="text-white">Complete your profile to unlock more opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white">
                  <span>Progress</span>
                  <span className="font-semibold">{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
              <TabsTrigger value="projects" className="text-white">Available Projects</TabsTrigger>
              <TabsTrigger value="applied" className="text-white">Applied Projects</TabsTrigger>
              <TabsTrigger value="messages" className="text-white">Messages</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Skills Mapped</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockSkills.length}</div>
                    <p className="text-xs text-white mt-1">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Projects Applied</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">3</div>
                    <p className="text-xs text-white mt-1">2 pending review</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Match Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">87%</div>
                    <p className="text-xs text-white mt-1">Above average</p>
                  </CardContent>
                </Card>
              </div>

              {/* My Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">My Skills</CardTitle>
                  <CardDescription className="text-white">Your semiconductor expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              {projectsLoading ? (
                <div className="text-center py-12 text-white">Loading projects...</div>
              ) : projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-white">No projects available at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-white">{project.title}</CardTitle>
                        <CardDescription className="text-white">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2 text-white">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skillsRequired.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-white">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Applied Projects Tab */}
            <TabsContent value="applied" className="space-y-6">
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white">You haven't applied to any projects yet</p>
                  <Button className="mt-4" onClick={() => document.querySelector('[value="projects"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                    Browse Projects
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              {messagesLoading ? (
                <div className="text-center py-12 text-white">Loading messages...</div>
              ) : messages.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-white">No messages yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm text-white">From: {msg.from.toString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white">{msg.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
