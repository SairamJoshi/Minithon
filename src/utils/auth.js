// Authentication and LocalStorage helpers
export const AUTH = {
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem('ino_users') || '[]');
    } catch {
      return [];
    }
  },
  saveUsers: (users) => {
    localStorage.setItem('ino_users', JSON.stringify(users));
  },
  getSession: () => {
    try {
      return JSON.parse(localStorage.getItem('ino_session'));
    } catch {
      return null;
    }
  },
  setSession: (user) => {
    localStorage.setItem('ino_session', JSON.stringify({ ...user, ts: Date.now() }));
  },
  clearSession: () => {
    localStorage.removeItem('ino_session');
  },
  getUserData: () => {
    try {
      return JSON.parse(localStorage.getItem('ino_userdata') || '{}');
    } catch {
      return {};
    }
  },
  saveUserData: (data) => {
    localStorage.setItem('ino_userdata', JSON.stringify(data));
  },
};
