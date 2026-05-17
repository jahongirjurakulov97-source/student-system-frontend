import React, { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-[400px] bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg shadow-indigo-200 mb-4 transform rotate-12">
            💎
          </div>
          <h2 className="text-3xl font-[900] text-slate-800 tracking-tight uppercase italic">Welcome</h2>
          <p className="text-slate-400 font-medium">AI Assessment tizimiga kiring</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); if(user && pass) onLoginSuccess(); }} className="space-y-5">
          <input 
            className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold" 
            placeholder="Login" onChange={e => setUser(e.target.value)} 
          />
          <input 
            className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold" 
            type="password" placeholder="Parol" onChange={e => setPass(e.target.value)} 
          />
          <button className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
            KIRISH 🚀
          </button>
        </form>
      </div>
    </div>
  );
}