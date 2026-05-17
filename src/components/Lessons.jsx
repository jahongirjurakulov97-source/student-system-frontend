// components/Lessons.jsx
import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function Lessons() {
  const [lessonName, setLessonName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (lessonName && file) {
      alert(`${lessonName} ma'ruzasi muvaffaqiyatli yuklandi!`);
      // Bu yerda backendga axios.post orqali faylni yuborish kerak (FormData bilan)
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <FileText className="text-blue-600" /> Ma'ruza Yuklash
      </h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-slate-500 font-bold mb-2">Ma'ruza mavzusi</label>
          <input 
            type="text" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-400"
            placeholder="Masalan: Sun'iy intellekt asoslari"
            onChange={(e) => setLessonName(e.target.value)}
          />
        </div>
        <div className="border-4 border-dashed border-slate-100 p-10 rounded-[2rem] text-center hover:border-blue-200 transition-all cursor-pointer bg-slate-50/50">
          <input type="file" id="fileInput" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="fileInput" className="cursor-pointer">
            <Upload size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">{file ? file.name : "Faylni tanlang (PDF, DOCX)"}</p>
          </label>
        </div>
        <button onClick={handleUpload} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
          TIZIMGA YUKLASH
        </button>
      </div>
    </div>
  );
}