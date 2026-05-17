import React, { useState, useEffect } from "react";
import axios from "axios"; 

export default function AdminPanel() {
  const [students, setStudents] = useState([]); 
  const [name, setName] = useState("");
  const [score, setScore] = useState("");

  // 1. Sahifa yuklanganda bazadan ma'lumotlarni olish
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tests/all-results");
      
      // Tekshiruv: Ma'lumot massiv bo'lib kelsa set qilamiz, aks holda bo'sh massiv
      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (res.data && Array.isArray(res.data.results)) {
        setStudents(res.data.results);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Ma'lumot olishda xato:", err);
      setStudents([]); // Xato bo'lsa ham .map xato bermasligi uchun
    }
  };

  // 2. Yangi ma'lumot qo'shish
  const handleAdd = async () => {
    if (name && score) {
      try {
        await axios.post("http://localhost:5000/api/tests/save-result", {
          studentName: name, 
          testScore: Number(score),
          timeSpent: 15 
        });
        fetchResults(); // Jadvalni yangilash
        setName("");
        setScore("");
      } catch (err) {
        alert("Saqlashda xato yuz berdi!");
      }
    } else {
      alert("Iltimos, ism va natijani kiriting!");
    }
  };

  // 3. O'chirish funksiyasi (Bonus)
  const handleDelete = async (id) => {
    if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tests/result/${id}`);
        fetchResults();
      } catch (err) {
        alert("O'chirishda xatolik!");
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Input bo'limi */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-600 rounded-full"></span> Yangi natija qo'shish
        </h3>
        <div className="flex flex-wrap gap-4">
          <input 
            className="flex-1 min-w-[250px] p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-400 text-slate-700" 
            placeholder="Talaba ismi" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            className="w-32 p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-400 text-slate-700" 
            type="number" 
            placeholder="%" 
            value={score} 
            onChange={e => setScore(e.target.value)} 
          />
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-10 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            SAQLASH +
          </button>
        </div>
      </div>

      {/* Jadval bo'limi */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">F.I.SH</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Sarflangan vaqt</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Natija</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.isArray(students) && students.length > 0 ? (
              students.map(s => (
                <tr key={s._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-6 font-bold text-slate-800">{s.studentId?.name || s.studentName || "Noma'lum"}</td>
                  <td className="p-6 text-slate-500">{s.timeSpent || 0} daqiqa</td>
                  <td className="p-6">
                    <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black">{s.testScore}%</span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-xl transition-all font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 font-medium">
                  Ma'lumotlar topilmadi...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}