import { jwtDecode } from 'jwt-decode';
import { Role, User } from '../types';

interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
}

export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const getCurrentUser = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      createdAt: '',
      updatedAt: ''
    };
  } catch {
    removeToken();
    return null;
  }
};

export const hasPermission = (requiredRole: Role[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.role === 'MANAGER') return true;
  return requiredRole.includes(user.role);
};