import { useState } from 'react';
import { useGetApprovedProjects, useSaveProject } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Briefcase, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProjects() {
  const { data: approvedProjects = [], isLoading } = useGetApprovedProjects();
  const saveProjectMutation = useSaveProject();
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock pending and rejected projects for demonstration
  const mockPendingProjects = [
    {
      title: 'FPGA Development Internship',
      description: 'Work on FPGA-based projects',
      skillsRequired: ['FPGA', 'Verilog'],
      createdBy: 'aaaaa-aa',
      approved: false,
      status: 'Pending'
    }
  ];

  const allProjects = [
    ...approvedProjects.map(p => ({ ...p, status: 'Approved' })),
    ...mockPendingProjects
  ];

  const filteredProjects = allProjects.filter(project => {
    if (statusFilter === 'all') return true;
    return project.status.toLowerCase() === statusFilter;
  });

  const handleApprove = async (project: any) => {
    try {
      await saveProjectMutation.mutateAsync({
        ...project,
        approved: true
      });
      toast.success('Project approved successfully!');
    } catch (error) {
      toast.error('Failed to approve project');
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (project: any) => {
    toast.info('Project rejection functionality will be implemented');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Projects</h1>
            <p className="text-white">Review and moderate platform projects</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <p className="text-white text-sm">
              <strong>Note:</strong> Backend only returns approved projects. Pending/rejected projects shown are mock data for demonstration.
            </p>
          </CardContent>
        </Card>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-white">No projects found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => {
              const statusVariant = project.status === 'Approved' ? 'default' : 
                                   project.status === 'Pending' ? 'secondary' : 'destructive';
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{project.title}</CardTitle>
                      <Badge variant={statusVariant} className="text-white">
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-white">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-white">Company:</p>
                      <p className="text-sm text-white">{project.createdBy.toString().slice(0, 20)}...</p>
                    </div>
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
                    <div>
                      <p className="text-sm text-white">
                        Applications: {Math.floor(Math.random() * 30) + 5}
                      </p>
                    </div>
                    {project.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove(project)}
                          disabled={saveProjectMutation.isPending}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(project)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
