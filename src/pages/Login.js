// src/pages/Login.js
import React, { useState } from "react";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { authorized, setAuthorized, username, passwordHash } = useAuth();
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const hash = (s) => {
    try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; }
  };

  const submitLogin = (e) => {
    e.preventDefault();
    setLoginErr("");
    if (!username || !passwordHash) {
      setLoginErr("No account found. Use your invite code first, then create a login in Profile.");
      return;
    }
    if (loginUser !== username || hash(loginPass) !== passwordHash) {
      setLoginErr("Invalid username or password.");
      return;
    }
    setAuthorized(true);
    navigate("/welcome");
  };

  if (authorized) {
    navigate("/welcome");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Section title="Log In" center tightTop compact>
        <form onSubmit={submitLogin} className="max-w-sm mx-auto space-y-4 text-left">
          <div className="rounded-2xl border-2 border-gold/40 bg-white p-4 shadow-sm">
            <label className="block text-black font-medium mb-2">Username</label>
            <input
              type="text"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              className="w-full rounded-xl border-2 border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold px-4 py-3 bg-white placeholder-black/50 caret-gold"
            />
            <p className="text-xs text-black/60 mt-2">Use the username you created on your Profile.</p>
            <div className="mt-4">
              <label className="block text-black font-medium mb-2">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full rounded-xl border-2 border-gold/40 focus:border-gold focus:ring-2 focus:ring-gold px-4 py-3 bg-white placeholder-black/50 caret-gold"
              />
              <p className="text-xs text-black/60 mt-2">Passwords are case‑sensitive.</p>
            </div>
            {loginErr && <p className="text-sm text-red-600 mt-2">{loginErr}</p>}
          </div>
          <button type="submit" className="w-full btn btn-primary">Log in</button>
          <Link to="/requestaccess" className="inline-block text-center w-full px-4 py-3 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95">Request Code</Link>
        </form>
      </Section>
    </div>
  );
};

export default Login;
