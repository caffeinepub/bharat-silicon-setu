import { useState } from 'react';
import { useGetUserProjects } from '../hooks/useProjects';
import { useSendContactRequest } from '../hooks/useContactRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Users, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

// Mock applicant data
const mockApplicants = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    skills: ['VLSI Design', 'RTL', 'Verilog'],
    matchPercentage: 92,
    projectId: 'all',
    principal: 'aaaaa-aa'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    skills: ['Embedded Systems', 'FPGA', 'SystemVerilog'],
    matchPercentage: 88,
    projectId: 'all',
    principal: 'aaaaa-aa'
  },
  {
    id: '3',
    name: 'Amit Patel',
    skills: ['Digital Design', 'ASIC', 'VLSI'],
    matchPercentage: 85,
    projectId: 'all',
    principal: 'aaaaa-aa'
  }
];

export default function Applicants() {
  const { data: projects = [] } = useGetUserProjects();
  const sendMessageMutation = useSendContactRequest();
  
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<typeof mockApplicants[0] | null>(null);
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredApplicants = mockApplicants.filter(applicant => 
    selectedProject === 'all' || applicant.projectId === selectedProject
  );

  const handleSendMessage = async () => {
    if (!selectedApplicant || !message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        to: Principal.fromText(selectedApplicant.principal),
        message: message
      });
      
      toast.success('Message sent successfully!');
      setMessage('');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Applicants</h1>
            <p className="text-white">Review and connect with potential candidates</p>
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64 text-white">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <p className="text-white text-sm">
              <strong>Note:</strong> Applicant tracking will be connected to the backend in future iterations. 
              Currently showing sample data for demonstration.
            </p>
          </CardContent>
        </Card>

        {filteredApplicants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-white">No applicants found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant) => (
              <Card key={applicant.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{applicant.name}</CardTitle>
                    <Badge variant="default" className="text-white">
                      {applicant.matchPercentage}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-white">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-white">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Dialog open={isDialogOpen && selectedApplicant?.id === applicant.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedApplicant(applicant)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-white">Send Message to {applicant.name}</DialogTitle>
                        <DialogDescription className="text-white">
                          Reach out to discuss the opportunity
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-white">Message</Label>
                          <Textarea
                            id="message"
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
                          {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
