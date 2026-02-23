import { useState, useMemo } from 'react';
import { useProjectApplications, useGetUserProjects, useStudentProfile } from '../hooks/useProjects';
import { useSendContactRequest } from '../hooks/useContactRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Users, Mail, Award } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function Applicants() {
  const { data: applications = [], isLoading: applicationsLoading } = useProjectApplications();
  const { data: userProjects = [], isLoading: projectsLoading } = useGetUserProjects();
  const sendMessageMutation = useSendContactRequest();
  
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Principal | null>(null);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLoading = applicationsLoading || projectsLoading;

  const filteredApplications = useMemo(() => {
    if (projectFilter === 'all') return applications;
    return applications.filter(app => app.project.toString() === projectFilter);
  }, [applications, projectFilter]);

  const handleSendMessage = async () => {
    if (!selectedApplicant || !message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        to: selectedApplicant,
        message: message.trim()
      });
      
      toast.success('Message sent successfully!');
      setMessage('');
      setDialogOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading applicants...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Applicants</h1>
            <p className="text-white">Review and manage project applications</p>
          </div>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-64 text-white">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {userProjects.map((project, index) => (
                <SelectItem key={index} value={project.createdBy.toString()}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-white">
                {applications.length === 0 
                  ? 'No applicants yet. Create projects to start receiving applications!' 
                  : 'No applicants for the selected project'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredApplications.map((application, index) => {
              const applicantPrincipal = application.student;
              
              return (
                <ApplicantCard
                  key={index}
                  application={application}
                  applicantPrincipal={applicantPrincipal}
                  userProjects={userProjects}
                  onContactClick={() => {
                    setSelectedApplicant(applicantPrincipal);
                    setDialogOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">Contact Applicant</DialogTitle>
              <DialogDescription className="text-white">
                Send a message to the applicant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-white">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="text-white"
                />
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={sendMessageMutation.isPending}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ApplicantCard({ 
  application, 
  applicantPrincipal, 
  userProjects,
  onContactClick 
}: { 
  application: any;
  applicantPrincipal: Principal;
  userProjects: any[];
  onContactClick: () => void;
}) {
  const { data: studentProfile } = useStudentProfile(applicantPrincipal);
  
  const project = userProjects.find(p => p.createdBy.toString() === application.project.toString());
  
  const studentSkills = (studentProfile as any)?.skills || [];
  const projectSkills = project?.skillsRequired || [];
  
  const matchingSkills = studentSkills.filter((skill: string) => 
    projectSkills.includes(skill)
  );
  
  const skillMatchPercentage = projectSkills.length > 0 
    ? Math.round((matchingSkills.length / projectSkills.length) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">
              {studentProfile?.name || 'Applicant'}
            </CardTitle>
            <CardDescription className="text-white text-xs mt-1">
              {applicantPrincipal.toString().slice(0, 20)}...
            </CardDescription>
          </div>
          <Badge variant={skillMatchPercentage >= 70 ? 'default' : 'secondary'} className="text-white">
            {skillMatchPercentage}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 text-white">Applied For:</p>
          <p className="text-white">{project?.title || 'Unknown Project'}</p>
        </div>
        
        {studentSkills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-white">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {studentSkills.slice(0, 5).map((skill: string) => (
                <Badge 
                  key={skill} 
                  variant={matchingSkills.includes(skill) ? 'default' : 'outline'}
                  className="text-white"
                >
                  {skill}
                </Badge>
              ))}
              {studentSkills.length > 5 && (
                <Badge variant="outline" className="text-white">
                  +{studentSkills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium mb-1 text-white">Status:</p>
          <Badge variant="outline" className="text-white">{application.status}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onContactClick} className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
