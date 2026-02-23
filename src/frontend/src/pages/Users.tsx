import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Users as UsersIcon } from 'lucide-react';

// Mock user data
const mockUsers = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Student', registrationDate: '2024-01-15', status: 'Active' },
  { id: '2', name: 'TechCorp Industries', email: 'contact@techcorp.com', role: 'Industry Partner', registrationDate: '2024-01-10', status: 'Active' },
  { id: '3', name: 'Priya Sharma', email: 'priya@example.com', role: 'Student', registrationDate: '2024-02-01', status: 'Active' },
  { id: '4', name: 'SemiCon Solutions', email: 'info@semicon.com', role: 'Industry Partner', registrationDate: '2024-01-20', status: 'Active' },
  { id: '5', name: 'Admin User', email: 'admin@platform.com', role: 'Admin', registrationDate: '2024-01-01', status: 'Active' }
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase().replace(' ', '-') === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin': return 'default';
      case 'Industry Partner': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Users</h1>
          <p className="text-white">Manage platform users and permissions</p>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <p className="text-white text-sm">
              <strong>Note:</strong> User management backend integration is pending. Currently showing sample data.
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-white"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="industry-partner">Industry Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">User List</CardTitle>
            <CardDescription className="text-white">{filteredUsers.length} users found</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Registration Date</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-white font-medium">{user.name}</TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-white">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{user.registrationDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-white">{user.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
