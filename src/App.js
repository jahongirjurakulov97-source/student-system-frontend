import React, { useState } from "react";

// ==========================================
// AUTH - CHIROYLI LOGIN
// ==========================================
const Auth = ({ onAuthSuccess }) => {
  const [user, setUser] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center 
    bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">

      {/* BACKGROUND EFFECT */}
      <div className="absolute w-96 h-96 bg-blue-500/30 blur-[120px] rounded-full"></div>

      {/* LOGIN CARD */}
      <div className="relative w-[400px] p-10 
      bg-white/10 backdrop-blur-xl 
      border border-white/20 
      rounded-[2rem] shadow-2xl text-center">

        {/* ICON */}
        <div className="text-5xl mb-4">
          🎓
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">
          LMS Tizimga Kirish
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAuthSuccess(user);
          }}
          className="space-y-6"
        >

          <input
            className="w-full bg-white/10 
            border border-white/20 
            p-3 rounded-xl 
            text-white outline-none 
            focus:border-blue-400
            placeholder:text-white/50"

            placeholder="Login"
            onChange={(e) => setUser(e.target.value)}
            required
          />

          <input
            className="w-full bg-white/10 
            border border-white/20 
            p-3 rounded-xl 
            text-white outline-none 
            focus:border-blue-400
            placeholder:text-white/50"

            placeholder="Parol"
            type="password"
            required
          />

          <button
            className="w-full py-3 
            bg-blue-600 text-white 
            rounded-xl font-bold 
            hover:bg-blue-700 
            transition-all 
            active:scale-95"
          >
            KIRISH
          </button>

        </form>

        <p className="text-white/60 text-sm mt-6">
          Talabalar baholash tizimi
        </p>

      </div>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {

  const [user, setUser] = useState(null);

  const [list, setList] = useState([
    { id: 1, name: "Azizbek Rahmonov", score: 95 },
    { id: 2, name: "Sardor Ikromov", score: 72 },
    { id: 3, name: "Madina Aliyeva", score: 48 }
  ]);

  if (!user)
    return <Auth onAuthSuccess={(u) => setUser(u)} />;

  return (

    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-3xl font-black text-slate-800">
              🎓 LMS Dashboard
            </h1>

            <p className="text-slate-500 text-sm">
              Talabalarni baholash tizimi
            </p>

          </div>

          <button
            onClick={() => setUser(null)}
            className="bg-red-500 
            text-white px-4 py-2 
            rounded-xl font-bold 
            hover:bg-red-600 transition"
          >
            Chiqish
          </button>

        </div>

        {/* INPUT SECTION */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 
        bg-white p-5 rounded-2xl shadow">

          <input
            id="inpName"
            className="flex-[3] 
            p-3 rounded-xl 
            border outline-none 
            focus:ring-2 focus:ring-blue-500"

            placeholder="Talaba ismi"
          />

          <input
            id="inpScore"
            className="flex-1 
            p-3 rounded-xl 
            border outline-none 
            text-center 
            focus:ring-2 focus:ring-blue-500"

            placeholder="Ball"
            type="number"
          />

          <button
            onClick={() => {

              const n =
                document.getElementById('inpName').value;

              const s =
                document.getElementById('inpScore').value;

              if (n && s) {

                setList([
                  ...list,
                  {
                    id: Date.now(),
                    name: n,
                    score: Number(s)
                  }
                ]);

                document.getElementById('inpName').value = '';
                document.getElementById('inpScore').value = '';

              }

            }}

            className="flex-1 
            bg-blue-600 text-white 
            p-3 rounded-xl 
            font-bold 
            hover:bg-blue-700 transition"
          >

            Qo‘shish

          </button>

        </div>

        {/* STUDENT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {list.map((s) => (

            <div
              key={s.id}

              className={`
              relative
              rounded-2xl
              p-6
              shadow-lg
              text-white
              transition-all
              hover:scale-105

              ${s.score >= 80
                ? 'bg-gradient-to-br from-blue-500 to-indigo-700'
                : s.score >= 50
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700'
                : 'bg-gradient-to-br from-rose-500 to-red-700'}
              `}
            >

              {/* DELETE */}
              <button
                onClick={() =>
                  setList(
                    list.filter(
                      x => x.id !== s.id
                    )
                  )
                }

                className="absolute top-3 right-4 
                text-xl font-bold opacity-70 
                hover:opacity-100"
              >
                ✕
              </button>

              {/* TITLE */}
              <h3 className="text-xl font-bold mb-2">
                {s.name}
              </h3>

              <p className="text-sm opacity-80 mb-6">
                ID: {s.id.toString().slice(-6)}
              </p>

              {/* SCORE */}
              <div className="flex justify-between items-end">

                <div>

                  <p className="text-sm opacity-70">
                    O‘zlashtirish
                  </p>

                  <p className="text-3xl font-black">
                    {s.score}%
                  </p>

                </div>

                <div className="text-3xl">
                  🎓
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}