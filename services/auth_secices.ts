// auth_service.ts
import http from './http_service';

export async function registerUser(
  username: string,
  email: string,
  full_name: string,
  password: string
) {
  const payload = { username, email, full_name, password };
  return http.post('/register', payload);
}

export async function loginUser(username: string, password: string) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return http.post('/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}