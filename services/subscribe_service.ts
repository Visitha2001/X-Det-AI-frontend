import http from './http_service';

interface EmailData {
  subject: string;
  body: string;
}

export interface Subscriber {
  username: string;
  email: string;
}

export async function subscribeUser(username: string, email: string) {
  try {
    const res = await http.post('/subscribe', {
      username,
      email,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function sendCustomEmailToAll(emailData: EmailData) {
  try {
    const response = await http.post('/send-newsletter', emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const response = await http.get('/subscribers');
    return response.data.subscribers;
  } catch (error) {
    throw error;
  }
}