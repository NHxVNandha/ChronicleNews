import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { queryKeys } from '../../lib/queryKeys';
import { getRoles, getUsers, type RoleRecord } from '../../services';

export type TeamMemberRecord = {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Author' | 'Reviewer';
  roleId?: string;
  email: string;
  status: 'Active' | 'Invited' | 'Disabled';
  lastLoginAt?: string | null;
};

export function useTeamAccess() {
  const [availableRoles, setAvailableRoles] = useState<RoleRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [error, setError] = useState('');

  const teamAccessQuery = useQuery({
    queryKey: queryKeys.team.access,
    queryFn: async () => {
      const [roles, users] = await Promise.all([getRoles(), getUsers()]);
      return { roles, users };
    },
  });

  useEffect(() => {
    if (!teamAccessQuery.data) {
      return;
    }

    const { roles, users } = teamAccessQuery.data;
    setAvailableRoles(roles);
    setTeamMembers(users.map((user) => ({
          id: user.id,
          name: user.fullName,
          role: user.role as TeamMemberRecord['role'],
          roleId: roles.find((role) => role.name === user.role)?.id,
          email: user.email,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
        })));
  }, [teamAccessQuery.data]);

  useEffect(() => {
    if (teamAccessQuery.error) {
      setError(teamAccessQuery.error instanceof Error ? teamAccessQuery.error.message : 'Failed to load team settings.');
    }
  }, [teamAccessQuery.error]);

  return { availableRoles, teamMembers, setTeamMembers, loading: teamAccessQuery.isLoading, error, setError };
}
