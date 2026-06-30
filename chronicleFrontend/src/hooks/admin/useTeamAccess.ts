import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [roles, users] = await Promise.all([getRoles(), getUsers()]);
        if (!isMounted) return;
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
      } catch (loadError) {
        if (isMounted) setError(loadError instanceof Error ? loadError.message : 'Failed to load team settings.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { availableRoles, teamMembers, setTeamMembers, loading, error, setError };
}
