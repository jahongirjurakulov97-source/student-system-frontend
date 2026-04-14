import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (user && pass) onLoginSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-3xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">Tizimga Kirish</h2>
        <input className="w-full mb-3 p-3 border rounded-xl outline-none focus:border-indigo-400" placeholder="Login" onChange={e => setUser(e.target.value)} />
        <input className="w-full mb-6 p-3 border rounded-xl outline-none focus:border-indigo-400" type="password" placeholder="Parol" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700">KIRISH</button>
      </form>
    </div>
  );
}