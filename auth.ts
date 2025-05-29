// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import http from '@/services/http_service'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { name, email } = user;
        
        try {
          // First try to login with Google credentials
          const response = await http.post('/login', {
            username: email,  // Using email as username
            password: account.providerAccountId  // Using providerAccountId as password
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          // Store the token in the account object for JWT callback
          account.access_token = response.data.access_token;
          return true;
        } catch (loginError) {
          // If login fails, register the user
          try {
            const registerResponse = await http.post('/register', {
              username: email,
              email: email,
              full_name: name || '',
              password: account.providerAccountId  // Using providerAccountId as initial password
            });

            // After registration, try to login again
            const loginResponse = await http.post('/login', {
              username: email,
              password: account.providerAccountId
            }, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });

            account.access_token = loginResponse.data.access_token;
            return true;
          } catch (registerError) {
            console.error('Google authentication failed:', registerError);
            return false;
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Forward the access token to the session
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to auth-callback after successful authentication
      return `${baseUrl}/auth-callback`;
    }
  }
});