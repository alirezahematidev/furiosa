import { Auth } from '@furiosa/auth';

const auth = new Auth({
  authorize: () => {
    return new Promise((resolve) => {
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.-57UFf_pKmgNdM4kVaPt_Ab68UJXHxwrycuxtYTHGkg';

      resolve({ accessToken, refreshToken: 'refresh_token 123' });
    });
  },

  onAfterSignIn(payload) {
    console.log('onAfterSignIn', payload);
  },
  onAfterSignOut() {
    console.log('onAfterSignOut');
  },
  persistOptions: {
    key: 'TOKEN',
    scope: 'intrack',
  },
});

export { auth };
