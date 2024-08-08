import { auth } from './config';

const style = { padding: 8, color: 'white', border: 'none', outline: 'none', cursor: 'pointer' };

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: 24, width: 100 }}>
      <button style={{ background: 'green', ...style }} onClick={() => auth.signIn({ sub: 'test' })}>
        sign in
      </button>
      <button style={{ background: 'red', ...style }} onClick={() => auth.signOut()}>
        sign out
      </button>

      <button
        style={{ background: 'blue', ...style }}
        onClick={async () => {
          const user = await auth.getUser();
          console.log('result', user);
        }}
      >
        get user
      </button>
    </div>
  );
}

export default App;
