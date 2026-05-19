import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, FileText, CheckCircle } from "lucide-react";

// Backend API jonli havolasi
const API_URL = "https://student-system-backend-3.onrender.com";

export default function Lessons() {
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // 1. Validatsiya: Ma'lumotlar to'liqligini tekshirish
    if (!topic || !selectedFile) {
      return alert("Iltimos, avval mavzuni yozing va faylni tanlang!");
    }

    setLoading(true);

    // 2. FormData yaratish (Faylni yuborish uchun shart)
    const formData = new FormData();
    formData.append("title", topic); // Backend Lesson modelidagi 'title'
    formData.append("file", selectedFile); // Backend upload.single("file")
    formData.append("teacher", "Admin"); // Standart qiymat

    try {
      // 3. Backendga yuborish (Yangi jonli URL bilan)
      const response = await axios.post(`${API_URL}/api/lessons/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert(`"${topic}" mavzusidagi ma'ruza muvaffaqiyatli yuklandi! ✅`);
        
        // Formani tozalash
        setTopic("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Yuklashda xato:", err);
      alert("Xatolik: Faylni yuklab bo'lmadi. Backend ishlayotganini tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <FileText className="text-blue-600" /> Ma'ruza Yuklash
        </h2>
        {selectedFile && (
          <span className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
            <CheckCircle size={16} /> Fayl tanlandi
          </span>
        )}
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Mavzu kiritish */}
        <div>
          <label className="block text-slate-500 font-bold mb-2 ml-2 text-sm uppercase">Ma'ruza mavzusi</label>
          <input 
            type="text" 
            value={topic}
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-400 font-bold transition-all"
            placeholder="Mavzu nomini kiriting..."
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Fayl tanlash maydoni */}
        <div 
          onClick={() => fileInputRef.current.click()}
          className={`border-4 border-dashed p-10 rounded-[2rem] text-center transition-all cursor-pointer 
            ${selectedFile ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-blue-200'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <Upload size={48} className={`mx-auto mb-4 ${selectedFile ? 'text-emerald-400' : 'text-slate-300'}`} />
          <p className={`font-bold ${selectedFile ? 'text-emerald-600' : 'text-slate-500'}`}>
            {selectedFile ? selectedFile.name : "Faylni tanlang (PDF, DOCX, MP4)"}
          </p>
          {!selectedFile && <p className="text-slate-400 text-xs mt-2">Maksimal hajm: 50MB</p>}
        </div>

        {/* Yuklash tugmasi */}
        <button 
          onClick={handleUpload} 
          disabled={loading}
          className={`w-full py-5 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 uppercase tracking-wider
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
        >
          {loading ? "YUKLANMOQDA..." : "TIZIMGA NASHR QILISH"}
        </button>
      </div>
    </div>
  );
}
