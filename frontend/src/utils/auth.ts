import { User, userId } from '../types/users';
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const setUser = (user: User): void => {
  localStorage.setItem('current_user', JSON.stringify(user));
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, password: string) {
  const user = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const response = await user.json();
  return response;
}

export async function register({ firstname, lastname, email, password }: User) {
  const user = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstname, lastname, email, password }),
  });
  const res = await user.json();
  return res;
}

export async function logout() {
  localStorage.removeItem('token');
}

export async function getOnlineUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/online-users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const users = await response.json();
  return users;
}

export async function getUserMessages(user1: userId, user2: userId) {
  const response = await fetch(`${API_URL}/messages/${user1}/${user2}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const messages = await response.json();
  return messages;
}
