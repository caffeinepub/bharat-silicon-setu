import { useState, useMemo } from 'react';
import { useAllProjects, useApproveProject, useRejectProject } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Briefcase, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function AdminProjects() {
  const { data: allProjects = [], isLoading, error } = useAllProjects();
  const approveProjectMutation = useApproveProject();
  const rejectProjectMutation = useRejectProject();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const projectsList = useMemo(() => {
    const projects: Array<{ creator: Principal; project: any; index: number }> = [];
    allProjects.forEach(([creator, projectArray]) => {
      projectArray.forEach((project, index) => {
        projects.push({ creator, project, index });
      });
    });
    return projects;
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return projectsList;
    if (statusFilter === 'approved') return projectsList.filter(p => p.project.approved);
    if (statusFilter === 'pending') return projectsList.filter(p => !p.project.approved);
    return projectsList;
  }, [projectsList, statusFilter]);

  const handleApprove = async (creator: Principal, index: number) => {
    try {
      await approveProjectMutation.mutateAsync({
        projectCreator: creator,
        projectIndex: BigInt(index)
      });
      toast.success('Project approved successfully!');
    } catch (error) {
      toast.error('Failed to approve project');
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (creator: Principal, index: number) => {
    try {
      await rejectProjectMutation.mutateAsync({
        projectCreator: creator,
        projectIndex: BigInt(index)
      });
      toast.success('Project rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject project');
      console.error('Reject error:', error);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-white">Failed to load projects. You may not have permission to view this page.</p>
            </CardContent>
          </Card>
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
            <p className="text-white">Review and manage all platform projects</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-white">
                {projectsList.length === 0 
                  ? 'No projects have been created yet' 
                  : 'No projects match the selected filter'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map(({ creator, project, index }, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{project.title}</CardTitle>
                    <Badge 
                      variant={project.approved ? 'default' : 'outline'} 
                      className="text-white"
                    >
                      {project.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <CardDescription className="text-white">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-white">Created By:</p>
                    <p className="text-xs text-muted-foreground break-all">
                      {creator.toString()}
                    </p>
                  </div>
                  
                  {project.skillsRequired.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 text-white">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-white">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    {!project.approved && (
                      <Button
                        onClick={() => handleApprove(creator, index)}
                        disabled={approveProjectMutation.isPending}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {project.approved && (
                      <Button
                        onClick={() => handleReject(creator, index)}
                        disabled={rejectProjectMutation.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
