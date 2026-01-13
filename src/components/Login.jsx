import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "./Firebase";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle redirect result for Google login
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          setUser(result.user);
        }
      })
      .catch((err) => setError(err.message));
  }, [setUser]);

  // Email/password login
  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login using redirect
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="p-6 border w-80">
        <h2 className="text-xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white w-full py-2 mb-2">
            Login
          </button>
        </form>

        <button onClick={googleLogin} className="bg-red-500 text-white w-full py-2">
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
