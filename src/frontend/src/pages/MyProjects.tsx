import { useGetUserProjects } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Briefcase, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useState } from 'react';

export default function MyProjects() {
  const { data: projects = [], isLoading } = useGetUserProjects();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock status for demonstration since backend doesn't track application status
  const getProjectStatus = (index: number) => {
    const statuses = ['Applied', 'In Progress', 'Completed'];
    return statuses[index % statuses.length];
  };

  const filteredProjects = projects.filter(project => {
    if (statusFilter === 'all') return true;
    const status = getProjectStatus(projects.indexOf(project));
    return status.toLowerCase().replace(' ', '-') === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading your projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">My Projects</h1>
            <p className="text-white">Track your project applications and progress</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
              const status = getProjectStatus(projects.indexOf(project));
              const statusVariant = status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline';
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{project.title}</CardTitle>
                      <Badge variant={statusVariant} className="text-white">
                        {status}
                      </Badge>
                    </div>
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
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date().toLocaleDateString()}</span>
                    </div>
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
