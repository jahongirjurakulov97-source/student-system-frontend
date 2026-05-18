import React, { useState, useEffect, useRef } from "react"; 
const API = "https://dashboard.render.com";

function App() {

}
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, LogOut, ShieldCheck, GraduationCap, 
  Users, BookOpen, FileText, ClipboardCheck, BrainCircuit, Upload, PlusCircle, Timer, FolderPlus, Trash2 
} from 'lucide-react';

import AdminPanel from "./components/AdminPanel";

// --- 1. ADMIN UCHUN KOMPONENTLAR ---

const Lessons = () => {
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingLessons, setExistingLessons] = useState([]); // Eski ma'ruzalarni saqlash uchun
  const fileInputRef = useRef(null);

  // Bazadagi ma'ruzalarni yuklab olish funksiyasi
  const fetchLessons = async () => {
    try {
      const res = ;axios.get("https://YOUR-BACKEND.onrender.com/api/lessons")
      setExistingLessons(res.data.filter(l => l.type === "maruza"));
    } catch (err) {
      console.log("Ma'ruzalarni yuklashda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!topic || !selectedFile) {
      return alert("Iltimos, avval mavzuni yozing va faylni tanlang!");
    }

    const formData = new FormData();
    formData.append("title", topic); 
    formData.append("file", selectedFile);
    formData.append("type", "maruza"); 
    formData.append("teacher", "Admin");

    try {
      const response = await axios.post("https://YOUR-BACKEND.onrender.com/api/lessons/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert(`"${topic}" ma'ruzasi muvaffaqiyatli yuklandi! ✅`);
        setTopic("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchLessons(); // Ro'yxatni yangilash
      }
    } catch (err) {
      alert("Xatolik: Faylni yuklab bo'lmadi.");
    }
  };

  // Eski ma'ruzani o'chirish funksiyasi
  const handleDeleteLesson = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu ma'ruzani o'chirmoqchimisiz? ⚠️")) {
      try {
        await axios.delete("https://YOUR-BACKEND.onrender.com/api/lessons/${id}`);
        alert("Ma'ruza muvaffaqiyatli o'chirildi! ✅");
        fetchLessons(); // Ro'yxatni yangilash
      } catch (err) {
        alert("Xatolik: Ma'ruzani o'chirib bo'lmadi.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Yuklash formasi */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <Upload className="text-blue-600" /> Ma'ruza Yuklash
        </h2>
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Ma'ruza Mavzusi</label>
            <input 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              type="text" 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-400 transition-all font-bold" 
              placeholder="Mavzu nomini kiriting..." 
            />
          </div>
          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Faylni yuklang (PDF, DOCX, MP4)</label>
            <div 
              onClick={() => fileInputRef.current.click()} 
              className="w-full p-10 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform">
                <FolderPlus size={32} className="text-blue-600" />
              </div>
              <p className="text-blue-700 font-black text-center">
                {selectedFile ? `Tanlandi: ${selectedFile.name}` : "Kompyuterdan faylni tanlash uchun bosing"}
              </p>
            </div>
          </div>
          <button onClick={handleUpload} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all text-lg uppercase shadow-xl shadow-blue-100">
            Ma'ruzani Nashr Qilish
          </button>
        </div>
      </div>

      {/* Mavjud ma'ruzalar ro'yxati va o'chirish */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Trash2 className="text-rose-600" /> Yuklangan Ma'ruzalar (Eskisini o'chirish)
        </h2>
        <div className="space-y-4 max-w-4xl">
          {existingLessons.length === 0 ? (
            <p className="text-slate-400 italic">Hozircha bazada ma'ruzalar mavjud emas.</p>
          ) : (
            existingLessons.map((l, idx) => (
              <div key={l._id || idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <span className="font-black text-slate-700 text-lg block">{idx + 1}. {l.title}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Turi: Ma'ruza</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteLesson(l._id)}
                  className="px-5 py-3 bg-rose-100 text-rose-600 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-2 uppercase text-sm"
                >
                  <Trash2 size={16} /> O'chirish
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const PracticeCreator = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingPractices, setExistingPractices] = useState([]); // Eski amaliyotlarni saqlash uchun
  const fileInputRef = useRef(null);

  // Bazadagi amaliyotlarni yuklab olish funksiyasi
  const fetchPractices = async () => {
    try {
      const res = await axios.get("https://dashboard.render.com/api/lessons");
      setExistingPractices(res.data.filter(l => l.type === "amaliyot"));
    } catch (err) {
      console.log("Amaliyotlarni yuklashda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchPractices();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!title || !desc) return alert("Iltimos, barcha maydonlarni to'ldiring!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", desc); 
    formData.append("type", "amaliyot");
    formData.append("teacher", "Admin");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.post(/"https://dashboard.render.com/api/lessons/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("Amaliy mashg'ulot muvaffaqiyatli yuborildi! ✅");
      
      setTitle("");
      setDesc("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPractices(); // Ro'yxatni yangilash
    } catch (err) {
      console.error(err);
      alert("Xatolik: Amaliyotni saqlab bo'lmadi.");
    }
  };

  // Eski amaliyotni o'chirish funksiyasi
  const handleDeletePractice = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu amaliy topshiriqni o'chirmoqchimisiz? ⚠️")) {
      try {
        await axios.delete(`/"https://dashboard.render.com/api/lessons/${id}`);
        alert("Amaliy topshiriq muvaffaqiyatli o'chirildi! ✅");
        fetchPractices(); // Ro'yxatni yangilash
      } catch (err) {
        alert("Xatolik: Amaliyotni o'chirib bo'lmadi.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Yaratish formasi */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <FolderPlus className="text-orange-600" /> Amaliy Mashg'ulot Yaratish
        </h2>
        
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Amaliyot Nomi</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              type="text" 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-400 font-bold" 
              placeholder="Mavzu nomini kiriting..." 
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Topshiriq matni</label>
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-orange-400 h-32 font-medium" 
              placeholder="Batafsil ko'rsatmalar..."
            ></textarea>
          </div>

          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Qo'shimcha fayl (ixtiyoriy)</label>
            <div 
              onClick={() => fileInputRef.current.click()} 
              className="w-full p-6 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <Upload size={24} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-orange-700 font-bold text-sm">
                {selectedFile ? `Tanlandi: ${selectedFile.name}` : "Fayl biriktirish uchun bosing"}
              </p>
            </div>
          </div>

          <button 
            onClick={handleSend} 
            className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all text-lg uppercase shadow-xl shadow-orange-100"
          >
            Talabalarga yuborish
          </button>
        </div>
      </div>

      {/* Mavjud amaliyotlar ro'yxati va o'chirish */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Trash2 className="text-rose-600" /> Mavjud Amaliyotlar (Eskisini o'chirish)
        </h2>
        <div className="space-y-4 max-w-4xl">
          {existingPractices.length === 0 ? (
            <p className="text-slate-400 italic">Hozircha bazada amaliy topshiriqlar muvjud emas.</p>
          ) : (
            existingPractices.map((p, idx) => (
              <div key={p._id || idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <span className="font-black text-slate-700 text-lg block">{idx + 1}. {p.title}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Turi: Amaliy ish</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePractice(p._id)}
                  className="px-5 py-3 bg-rose-100 text-rose-600 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-2 uppercase text-sm"
                >
                  <Trash2 size={16} /> O'chirish
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TestCreator = () => {
  const [testTitle, setTestTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correct, setCorrect] = useState("a");
  const [existingTests, setExistingTests] = useState([]); 
  const [questionsList, setQuestionsList] = useState([]);

  const fetchTests = async () => {
    try {
      const res = await axios.get("https://dashboard.render.com/api/tests");
      setExistingTests(res.data);
    } catch (err) {
      console.log("Testlarni yuklashda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const addQuestionToMemory = () => {
    if (!testTitle.trim()) return alert("Iltimos, avval Test Sarlavhasini kiriting! ⚠️");
    if (!question.trim() || !options.a.trim() || !options.b.trim()) {
      return alert("Iltimos, savol matni va kamida A va B javoblarni to'ldiring! ⚠️");
    }

    const newQuestion = {
      questionText: question,
      options: [options.a, options.b, options.c, options.d].filter(opt => opt.trim() !== ""),
      correctAnswer: options[correct]
    };

    setQuestionsList([...questionsList, newQuestion]);

    setQuestion("");
    setOptions({ a: "", b: "", c: "", d: "" });
    setCorrect("a");
    alert(`Savol ro'yxatga qo'shildi! Hozirgi savollar soni: ${questionsList.length + 1} ta. ✅`);
  };

  const saveEntireTestToDB = async () => {
    if (questionsList.length === 0) {
      return alert("Iltimos, avval kamida bitta savol qo'shing va ro'yxatga kiriting! ⚠️");
    }

    const testData = {
      lessonTitle: testTitle,
      questions: questionsList,
      duration: 30
    };

    try {
      await axios.post(/"https://dashboard.render.com/api/tests/create", testData);
      alert(`"${testTitle}" testi jami ${questionsList.length}ta savol bilan muvaffaqiyatli bazaga saqlandi! 🚀✅`);
      
      setTestTitle("");
      setQuestionsList([]);
      fetchTests(); 
    } catch (err) {
      alert("Xatolik: Test paketini bazaga saqlab bo'lmadi.");
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu testni o'chirmoqchimisiz? ⚠️")) {
      try {
        await axios.delete(`https://dashboard.render.com/api/tests/${id}`);
        alert("Test muvaffaqiyatli o'chirildi! ✅");
        fetchTests(); 
      } catch (err) {
        alert("Xatolik: Testni o'chirib bo'lmadi.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"><ClipboardCheck className="text-emerald-600" /> Test Yaratish</h2>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Mavzu / Test Sarlavhasi</label>
            <input 
              disabled={questionsList.length > 0} 
              value={testTitle} 
              onChange={(e) => setTestTitle(e.target.value)} 
              placeholder="Masalan: React Asoslari" 
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-400 outline-none font-bold disabled:opacity-60" 
            />
            {questionsList.length > 0 && <p className="text-xs text-orange-500 font-bold mt-1">* Savollar qo'shilayotgan paytda sarlavha qulflanadi.</p>}
          </div>
          
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-black uppercase">Savol tafsilotlari</span>
            <div>
              <label className="text-slate-400 font-bold ml-2 mb-2 block text-sm uppercase">Savol Matni</label>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-emerald-400 outline-none font-bold shadow-sm" placeholder="Savol matnini kiriting..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <input key={opt} value={options[opt]} onChange={(e) => setOptions({...options, [opt]: e.target.value})} placeholder={`${opt.toUpperCase()} javob`} className="p-4 bg-white rounded-xl border-2 border-transparent focus:border-emerald-300 outline-none font-medium shadow-sm" />
              ))}
            </div>
            <div className="flex items-center gap-4 py-2">
              <span className="font-bold text-slate-600">To'g'ri javobni belgilang:</span>
              <select value={correct} onChange={(e) => setCorrect(e.target.value)} className="p-2 bg-emerald-50 rounded-lg font-bold outline-none text-emerald-700">
                <option value="a">A javob</option>
                <option value="b">B javob</option>
                <option value="c">C javob</option>
                <option value="d">D javob</option>
              </select>
            </div>
            
            <button type="button" onClick={addQuestionToMemory} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase shadow-md hover:bg-blue-700 transition">
              + SAVOLNI RO'YXATGA QO'SHISH
            </button>
          </div>

          {questionsList.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <p className="font-bold text-orange-800">Hozirgi to'plangan savollar soni: <span className="font-black text-lg">{questionsList.length}</span> ta</p>
              <ul className="text-xs text-slate-600 list-disc ml-4 mt-2">
                {questionsList.map((q, i) => <li key={i} className="font-medium">{i+1}. {q.questionText}</li>)}
              </ul>
            </div>
          )}

          <button type="button" onClick={saveEntireTestToDB} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg uppercase shadow-lg hover:bg-emerald-700 transition block">
            ✅ UMUMIY TESTNI BAZAGA SAQLASH ({questionsList.length} ta savol)
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Trash2 className="text-rose-600" /> Mavjud Testlar (Eskisini o'chirish)
        </h2>
        <div className="space-y-4 max-w-4xl">
          {existingTests.length === 0 ? (
            <p className="text-slate-400 italic">Hozircha bazada testlar mavjud emas.</p>
          ) : (
            existingTests.map((t, idx) => (
              <div key={t._id || idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <span className="font-black text-slate-700 text-lg block">{t.title || t.lessonTitle}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Savollar soni: {t.questions?.length || 0} ta</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTest(t._id)}
                  className="px-5 py-3 bg-rose-100 text-rose-600 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition flex items-center gap-2 uppercase text-sm"
                >
                  <Trash2 size={16} /> O'chirish
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StudentMonitoring = () => {
    const [students, setStudents] = useState([]);
    
    const fetchResults = () => {
      axios.get("https://dashboard.render.com/api/tests/all-results")
        .then(res => setStudents(res.data.results || res.data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDeleteResult = async (e, id) => {
      if (e) e.stopPropagation(); 
      
      if (!id) {
        return alert("Xatolik: Natija ID si topilmadi!");
      }

      if (window.confirm("Haqiqatan ham ushbu talaba natijasini ro'yxatdan o'chirmoqchimisiz? ⚠️")) {
        try {
          await axios.delete(`https://dashboard.render.com/api/tests/result/${id}`);
          alert("Talaba natijasi muvaffaqiyatli o'chirildi! ✅");
          fetchResults(); 
        } catch (err) {
          console.error(err);
          alert("Xatolik: Natijani o'chirib bo'lmadi. Backend yo'li noto'g'ri bo'lishi mumkin.");
        }
      }
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"><Users className="text-indigo-600" /> Talabalar Monitoringi</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="p-4">F.I.SH</th>
                        <th className="p-4">Mavzu</th>
                        <th className="p-4">Natija</th>
                        <th className="p-4">Holat</th>
                        <th className="p-4 text-center">Harakat</th>
                      </tr>
                  </thead>
                  <tbody>
                      {students.map((s, idx) => (
                          <tr key={s._id || idx} className="border-t hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-slate-700">{s.studentName}</td>
                            <td className="p-4 font-medium text-slate-500">{s.lessonTitle}</td>
                            <td className="p-4 text-emerald-600 font-black italic">{s.testScore}%</td>
                            <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{s.status || "Tugallandi"}</span></td>
                            <td className="p-4 text-center">
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteResult(e, s._id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition inline-flex items-center justify-center"
                                title="Natijani o'chirish"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
    );
};

// --- 2. TALABA OYNASI: MA'RUZALARIM BO'LIMI ---
const StudentLessons = () => {
    const [lessons, setLessons] = useState([]);
    useEffect(() => {
        axios.get"https://dashboard.render.com/api/lessons")
          .then(res => setLessons(res.data))
          .catch(err => console.log(err));
    }, []);

    const maruzalar = lessons.filter(l => l.type === "maruza");

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"><BookOpen className="text-blue-600" /> Ma'ruzalarim</h2>
          <div className="space-y-4">
              {maruzalar.length === 0 ? (
                <p className="text-slate-400 italic p-4">Hozircha ma'ruzalar yuklanmagan.</p>
              ) : (
                maruzalar.map((lesson, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
                      <span className="font-black text-slate-700 italic text-lg tracking-tight">{idx+1}. {lesson.title}</span>
                      {lesson.fileUrl && (
                        <a href={`https://dashboard.render.com/uploads/${lesson.fileUrl}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">O'QISH (PDF)</a>
                      )}
                  </div>
                ))
              )}
          </div>
        </div>
    );
};


// --- 3. TALABA OYNASI: AMALIY ISHLAR BO'LIMI ---
const StudentPracticals = ({ score, timeSpent }) => { 
    // Agarda test balli va taymer ota-komponentdan (Props orqali) kelsa, yuqoridagi kabi qabul qilinadi.
    
    const [lessons, setLessons] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({}); 
    const [uploadingStatus, setUploadingStatus] = useState({}); 

    // =====================================================================
    // ⭐ XAVFSIZ USER VA ID OLISH
    // =====================================================================
    const savedUser = JSON.parse(localStorage.getItem("user")) || {}; 
    
    const studentId = savedUser._id || savedUser.id || "664b3c2e1f4a2b3c4d5e6f7a"; 
    
    // 1. TALABA ISMI: "Talaba" so'zi o'rniga localStorage'dan real ism olinadi
    const studentName = savedUser.name || savedUser.username || "Talaba";

    useEffect(() => {
        axios.get("https://dashboard.render.com/api/lessons")
          .then(res => setLessons(res.data))
          .catch(err => console.log("Darslarni yuklashda xato:", err));
    }, []);

    const amaliyotlar = lessons.filter(l => l.type === "amaliyot");

    const handleFileChange = (lessonId, file) => {
        setSelectedFiles(prev => ({ ...prev, [lessonId]: file }));
    };

    const handleUploadHomework = async (practice) => {
        const lessonId = practice._id;
        const file = selectedFiles[lessonId];
        
        if (!file) {
            alert("Iltimos, avval topshirish uchun fayl tanlang!");
            return;
        }

        if (!savedUser._id && !savedUser.id) {
            alert("Diqqat! Tizimga talaba sifatida kirmagansiz yoki profil ma'lumotlari topilmadi. LocalStorage-ni tekshiring!");
        }

        // 2. BALL VA TAYMER: Statelardan yoki localStorage ichidan real qiymatlarni qidiradi
        const finalTestScore = typeof score !== "undefined" ? score : (savedUser.testScore || 0);
        const finalTimeSpent = typeof timeSpent !== "undefined" ? timeSpent : (savedUser.timeSpent || 0);

        // ⭐ FormData yaratish va barcha qiymatlarni matn ko'rinishida yuborish
        const formData = new FormData();
        formData.append("file", file); 
        formData.append("lessonId", lessonId);
        formData.append("lessonTitle", practice.title);
        formData.append("studentId", studentId); 
        
        // ADMINGA BORADIGAN REAL MA'LUMOTLAR:
        formData.append("studentName", studentName);       // Real talaba ismi
        formData.append("testScore", String(finalTestScore)); // Real to'plagan balli
        formData.append("timeSpent", String(finalTimeSpent)); // Real sarflagan vaqti

        try {
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Yuborilmoqda..." }));
            
            const response = await axios.post("https://dashboard.render.com/api/tests/submit", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (response.data.success) {
                setUploadingStatus(prev => ({ ...prev, [lessonId]: "Muvaffaqiyatli yuborildi! ✅" }));
                alert("Vazifa muvaffaqiyatli topshirildi va bazaga saqlandi! 🎉");
                
                // Yuklangan faylni inputdan tozalash
                setSelectedFiles(prev => {
                    const updated = { ...prev };
                    delete updated[lessonId];
                    return updated;
                });
            }
        } catch (err) {
            console.error("Yuborishda xatolik yuz berdi:", err);
            
            if (err.response && err.response.data) {
                console.log("Backend qaytargan aniq xato xabari:", err.response.data);
                alert(`Xatolik: ${err.response.data.error || "Serverda ichki xato yuz berdi"}`);
            } else {
                alert("Server bilan ulanishda xatolik yuz berdi. Server ishlayotganini tekshiring.");
            }
            
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Xatolik yuz berdi. Qayta urining." }));
        }
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"> Amaliy Mashg'ulotlar</h2>
          <div className="space-y-6">
              {amaliyotlar.length === 0 ? (
                <p className="text-slate-400 italic p-4">Hozircha amaliy topshiriqlar yuborilmagan.</p>
              ) : (
                amaliyotlar.map((practice, idx) => {
                  const lessonId = practice._id || idx;
                  return (
                    <div key={lessonId} className="p-6 bg-orange-50/30 rounded-3xl border border-orange-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-slate-800 text-xl">{idx+1}. {practice.title}</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold uppercase">Amaliyot</span>
                        </div>
                        
                        {practice.content && (
                          <p className="bg-white p-4 rounded-2xl text-slate-600 text-sm border border-slate-100 whitespace-pre-line">{practice.content}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dashed border-orange-100">
                          {practice.fileUrl && (
                            <a href={`https://dashboard.render.com/uploads/${practice.fileUrl}`} target="_blank" rel="noreferrer" className="inline-block px-5 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition">
                              Biriktirilgan fayl
                            </a>
                          )}

                          <div className="flex items-center gap-2 bg-white p-1.5 pl-4 border border-slate-200 rounded-xl max-w-md w-full sm:w-auto">
                            <span className="text-xs text-slate-500 truncate max-w-[150px]">
                              {selectedFiles[lessonId] ? selectedFiles[lessonId].name : "Fayl tanlanmagan"}
                            </span>
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition ml-auto">
                              Explorer
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleFileChange(lessonId, e.target.files[0])}
                              />
                            </label>
                          </div>

                          <button 
                            onClick={() => handleUploadHomework(practice)} 
                            disabled={!selectedFiles[lessonId]}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                              selectedFiles[lessonId] 
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            Vazifani topshirish
                          </button>
                        </div>

                        {uploadingStatus[lessonId] && (
                          <p className="text-xs font-semibold text-slate-500 animate-pulse pl-2">
                            {uploadingStatus[lessonId]}
                          </p>
                        )}
                    </div>
                  );
                })
              )}
          </div>
        </div>
    );
};


// --- 4. TALABA OYNASI: TEST TOPSHIRISH BO'LIMI ---
const StudentTests = ({ user }) => {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testTimeSpent, setTestTimeSpent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get("/https://dashboard.render.comapi/tests") 
      .then(res => {
        if(res.data && res.data.length > 0) {
          setTests(res.data);
        } else {
          axios.get("https://dashboard.render.com/api/lessons").then(lessonRes => {
            if(lessonRes.data.length > 0) {
              const structureTests = lessonRes.data.map((l, i) => ({
                 _id: l._id,
                 title: l.title,
                 questions: [
                   { questionText: `${l.title} mavzusining asosiy maqsadi nima?`, options: ["Bilim olish", "Amaliyot qilish", "Tizimni o'rganish", "Hammasi to'g'ri"], correctAnswer: "Hammasi to'g'ri" }
                 ]
              }));
              setTests(structureTests);
            }
          });
        }
      })
      .catch(err => {
         console.log("Test yuklashda xato, muqobil yuklanmoqda...", err);
      });
  }, []);

  useEffect(() => {
    if (activeTest) {
      timerRef.current = setInterval(() => {
        setTestTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setTestTimeSpent(0);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTest]);

  const handleSelectAnswer = (qIdx, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: option });
  };

  const handleSubmitTest = async () => {
    if (!activeTest || !activeTest.questions || activeTest.questions.length === 0) {
      alert("Bu testda savollar mavjud emas!");
      setActiveTest(null);
      return;
    }
    
    let correctCount = 0;
    const totalQuestions = activeTest.questions.length;

    activeTest.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const payload = {
      studentId: user._id || user.id,
      studentName: user.username,
      lessonTitle: activeTest.title || activeTest.lessonTitle,
      timeSpent: testTimeSpent,
      testScore: scorePercentage
    };

    try {
      await axios.post("/https://dashboard.render.comapi/tests/submit", payload);
      alert(`Test yakunlandi! Natijangiz: ${scorePercentage}%. Tahlil muvaffaqiyatli saqlandi! ✅`);
      setActiveTest(null);
      setSelectedAnswers({});
    } catch (err) {
      console.error(err);
      alert("Natijani saqlashda xatolik yuz berdi.");
    }
  };

  if (activeTest) {
    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-emerald-600" /> {activeTest.title || activeTest.lessonTitle}
          </h2>
          <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-mono font-bold flex items-center gap-2">
            <Timer size={18} className="text-emerald-400 animate-pulse" />
            {Math.floor(testTimeSpent / 60)}:{(testTimeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="space-y-8">
          {activeTest.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">{qIdx + 1}. {q.questionText}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(qIdx, opt)}
                    className={`p-4 rounded-2xl font-medium text-left border-2 transition-all ${
                      selectedAnswers[qIdx] === opt
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                        : "bg-white border-transparent hover:border-slate-200 text-slate-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmitTest}
          className="w-full mt-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition"
        >
          Testni Yakunlash va Yuborish
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <ClipboardCheck className="text-emerald-600" /> Bilimni Sinash (Testlar)
      </h2>
      <div className="space-y-4">
        {tests.length === 0 ? (
          <p className="text-slate-400 italic p-4">Hozircha testlar mavjud emas.</p>
        ) : (
          tests.map((test, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition">
              <span className="font-black text-slate-700 text-lg">{test.title || test.lessonTitle}</span>
              <button
                type="button"
                onClick={() => setActiveTest(test)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                TESTNI BOSHLASH
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg translate-x-2' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <Icon size={20}/> <span className="font-bold">{label}</span>
    </Link>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (type) => {
    if (!formData.username.trim() || !formData.password) {
      return alert("Iltimos, barcha maydonlarni to'ldiring! ⚠️");
    }

    try {
      const res = await axios.post(`https://dashboard.render.com/api/auth/${type}`, {
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role
      });

      const data = res.data.user || res.data;
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      
      alert(`${type === 'login' ? 'Tizimga muvaffaqiyatli kirildi' : "Ro'yxatdan muvaffaqiyatli o'tildi"}! ✅`);
    } catch (err) { 
      const serverError = err.response?.data?.error || err.response?.data?.message || "Xatolik yuz berdi!";
      alert(`Xatolik: ${serverError} ❌`); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-800 p-10 rounded-[3rem] w-full max-w-md border border-slate-700 shadow-2xl">
          <div className="flex bg-slate-900 p-1.5 rounded-2xl mb-8 border border-slate-700">
            <button type="button" onClick={() => setFormData({...formData, role: 'student'})} className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Talaba</button>
            <button type="button" onClick={() => setFormData({...formData, role: 'teacher'})} className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'teacher' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500'}`}>Admin</button>
          </div>
          
          <h1 className="text-2xl font-black text-white text-center mb-8 tracking-widest italic uppercase">
            {isRegisterMode ? "RO'YXATDAN O'TISH" : "SMART AI LMS"}
          </h1>

          <div className="space-y-4">
            <input type="text" value={formData.username} placeholder="Username" className="w-full p-4 bg-slate-700 rounded-2xl text-white outline-none border border-transparent focus:border-blue-500 font-bold" onChange={(e) => setFormData({...formData, username: e.target.value})}/>
            <input type="password" value={formData.password} placeholder="Parol" className="w-full p-4 bg-slate-700 rounded-2xl text-white outline-none border border-transparent focus:border-blue-500 font-bold" onChange={(e) => setFormData({...formData, password: e.target.value})}/>
            
            <div className="pt-4 space-y-3">
              <button 
                type="button"
                onClick={() => handleAuth(isRegisterMode ? 'register' : 'login')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-blue-700 transition"
              >
                {isRegisterMode ? "Ro'yxatdan o'tish" : "Tizimga Kirish"}
              </button>
              
              <button 
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="w-full text-center text-sm font-bold text-slate-400 hover:text-white transition pt-2"
              >
                {isRegisterMode ? "Sizda akkaunt bormi? Kirish" : "Yangi akkaunt yaratish (Ro'yxatdan o'tish)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ASOSIY TIZIM LAYOUTI (Router kelgusi ogohlantirish flaglari bilan sozlangan) ---
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen bg-slate-100 font-sans">
        {/* Yon menyu / Sidebar */}
        <aside className="w-80 bg-slate-900 p-6 flex flex-col justify-between text-white border-r border-slate-800 shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-800 pb-6">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
                <BrainCircuit size={24} className="text-white animate-pulse" />
              </div>
              <div>
                <h1 className="font-black text-lg leading-tight uppercase tracking-wider">AI LMS</h1>
                <span className="text-xs font-bold text-slate-500 uppercase">{user.role === 'teacher' ? 'O\'qituvchi (Admin)' : 'Talaba'}</span>
              </div>
            </div>

            <nav className="space-y-2">
              {user.role === 'teacher' ? (
                <>
                  <NavItem to="/admin" icon={LayoutDashboard} label="Asosiy Panel" />
                  <NavItem to="/admin/lessons" icon={Upload} label="Ma'ruza Yuklash" />
                  <NavItem to="/admin/practicals" icon={FolderPlus} label="Amaliyot Yaratish" />
                  <NavItem to="/admin/tests" icon={ClipboardCheck} label="Test Tuzuvchi" />
                  <NavItem to="/admin/monitoring" icon={Users} label="Talabalar Bahosi" />
                </>
              ) : (
                <>
                  <NavItem to="/student/lessons" icon={BookOpen} label="Ma'ruzalarim" />
                  <NavItem to="/student/practicals" icon={BrainCircuit} label="Amaliy Topshiriqlar" />
                  <NavItem to="/student/tests" icon={ClipboardCheck} label="Test Topshirish" />
                </>
              )}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="bg-slate-800/50 p-4 rounded-2xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center font-black uppercase text-blue-400">
                {user.username?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user.username}</p>
                <p className="text-xs text-slate-500 font-medium truncate">Online</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 p-4 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-2xl transition-all font-bold uppercase text-sm tracking-wider"
            >
              <LogOut size={18}/> Chiqish
            </button>
          </div>
        </aside>

        {/* Asosiy kontent oynasi */}
        <main className="flex-1 p-10 overflow-y-auto max-h-screen">
          <Routes>
            {user.role === 'teacher' ? (
              <>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/lessons" element={<Lessons />} />
                <Route path="/admin/practicals" element={<PracticeCreator />} />
                <Route path="/admin/tests" element={<TestCreator />} />
                <Route path="/admin/monitoring" element={<StudentMonitoring />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </>
            ) : (
              <>
                <Route path="/student/lessons" element={<StudentLessons />} />
                <Route path="/student/practicals" element={<StudentPracticals />} />
                <Route path="/student/tests" element={<StudentTests user={user} />} />
                <Route path="*" element={<Navigate to="/student/lessons" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}                  
