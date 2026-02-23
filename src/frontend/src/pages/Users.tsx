import { useState, useMemo } from 'react';
import { useAllUsers } from '../hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Users as UsersIcon, Search } from 'lucide-react';
import { AppUserRole } from '../backend';

export default function Users() {
  const { data: users = [], isLoading, error } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const getRoleBadgeVariant = (role: AppUserRole) => {
    switch (role) {
      case AppUserRole.admin:
        return 'destructive';
      case AppUserRole.industryPartner:
        return 'default';
      case AppUserRole.student:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: AppUserRole) => {
    switch (role) {
      case AppUserRole.admin:
        return 'Admin';
      case AppUserRole.industryPartner:
        return 'Industry Partner';
      case AppUserRole.student:
        return 'Student';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading users...</div>
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
              <p className="text-white">Failed to load users. You may not have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Users</h1>
          <p className="text-white">Manage platform users and their roles</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Search & Filter</CardTitle>
            <CardDescription className="text-white">Find users by name, email, or role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-white">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-filter" className="text-white">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter" className="text-white">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value={AppUserRole.student}>Student</SelectItem>
                    <SelectItem value={AppUserRole.industryPartner}>Industry Partner</SelectItem>
                    <SelectItem value={AppUserRole.admin}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">All Users ({filteredUsers.length})</CardTitle>
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">
                  {users.length === 0 ? 'No users found' : 'No users match your search criteria'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Role</TableHead>
                      <TableHead className="text-white">Registered</TableHead>
                      <TableHead className="text-white">Principal ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-white font-medium">{user.name}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-white">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(Number(user.registrationTimestamp) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white text-xs">
                          {user.principalId.toString().slice(0, 15)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
