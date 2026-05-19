import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, LogOut, ShieldCheck, GraduationCap, 
  Users, BookOpen, FileText, ClipboardCheck, BrainCircuit, Upload, PlusCircle, Timer, FolderPlus, Trash2 
} from 'lucide-react';

import AdminPanel from "./components/AdminPanel";

// Renderdagi Backend API manzili
const API_URL = "https://student-system-backend-3.onrender.com";

// --- 1. ADMIN UCHUN KOMPONENTLAR ---

const Lessons = () => {
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingLessons, setExistingLessons] = useState([]); // Eski ma'ruzalarni saqlash uchun
  const fileInputRef = useRef(null);

  // Bazadagi ma'ruzalarni yuklab olish funksiyasi
  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/lessons`);
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
      const response = await axios.post(`${API_URL}/api/lessons/upload`, formData, {
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
        await axios.delete(`${API_URL}/api/lessons/${id}`);
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
      const res = await axios.get(`${API_URL}/api/lessons`);
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
      await axios.post(`${API_URL}/api/lessons/upload`, formData, {
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
        await axios.delete(`${API_URL}/api/lessons/${id}`);
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
      const res = await axios.get(`${API_URL}/api/tests`);
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
      await axios.post(`${API_URL}/api/tests/create`, testData);
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
        await axios.delete(`${API_URL}/api/tests/${id}`);
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
      axios.get(`${API_URL}/api/tests/all-results`)
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
          await axios.delete(`${API_URL}/api/tests/result/${id}`);
          alert("Talaba natijasi muvaffaqiyatli o'chirildi! ✅");
          fetchResults(); 
        } catch (err) {
          console.error(err);
          alert("Xatolik: Natijani o'chirib bo'lmadi.");
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
        axios.get(`${API_URL}/api/lessons`)
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
                        <a href={`${API_URL}/uploads/${lesson.fileUrl}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">O'QISH (PDF)</a>
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
    const [lessons, setLessons] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({}); 
    const [uploadingStatus, setUploadingStatus] = useState({}); 

    const savedUser = JSON.parse(localStorage.getItem("user")) || {}; 
    const studentId = savedUser._id || savedUser.id || "664b3c2e1f4a2b3c4d5e6f7a"; 
    const studentName = savedUser.name || savedUser.username || "Talaba";

    useEffect(() => {
        axios.get(`${API_URL}/api/lessons`)
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

        const finalTestScore = typeof score !== "undefined" ? score : (savedUser.testScore || 0);
        const finalTimeSpent = typeof timeSpent !== "undefined" ? timeSpent : (savedUser.timeSpent || 0);

        const formData = new FormData();
        formData.append("file", file); 
        formData.append("lessonId", lessonId);
        formData.append("lessonTitle", practice.title);
        formData.append("studentId", studentId); 
        formData.append("studentName", studentName);       
        formData.append("testScore", String(finalTestScore)); 
        formData.append("timeSpent", String(finalTimeSpent)); 

        try {
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Yuborilmoqda..." }));
            
            const response = await axios.post(`${API_URL}/api/tests/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (response.data.success) {
                setUploadingStatus(prev => ({ ...prev, [lessonId]: "Muvaffaqiyatli yuborildi! ✅" }));
                alert("Vazifa muvaffaqiyatli topshirildi va bazaga saqlandi! 🎉");
                
                setSelectedFiles(prev => {
                    const updated = { ...prev };
                    delete updated[lessonId];
                    return updated;
                });
            }
        } catch (err) {
            console.error("Yuborishda xatolik yuz berdi:", err);
            
            if (err.response && err.response.data) {
                alert(`Xatolik: ${err.response.data.error || "Serverda ichki xato yuz berdi"}`);
            } else {
                alert("Server bilan ulanishda xatolik yuz berdi. Server ishlayotganini tekshiring.");
            }
            
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Xatolik yuz berdi. Qayta urining." }));
        }
    };
   
  // Diqqat: API_URL yuqorida e'lon qilingani uchun bu yerda to'g'ridan-to'g'ri ishlatiladi:
// const API_URL = "https://student-system-backend-3.onrender.com";

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

StudentMonitoring = () => {
    const [students, setStudents] = useState([]);
    
    const fetchResults = () => {
      axios.get(`${API_URL}/api/tests/all-results`)
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
          await axios.delete(`${API_URL}/api/tests/result/${id}`);
          alert("Talaba natijasi muvaffaqiyatli o'chirildi! ✅");
          fetchResults(); 
        } catch (err) {
          console.error(err);
          alert("Xatolik: Natijani o'chirib bo'lmadi.");
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
 StudentLessons = () => {
    const [lessons, setLessons] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/api/lessons`)
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
                        <a href={`${API_URL}/uploads/${lesson.fileUrl}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">O'QISH (PDF)</a>
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
    const [lessons, setLessons] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({}); 
    const [uploadingStatus, setUploadingStatus] = useState({}); 

    const savedUser = JSON.parse(localStorage.getItem("user")) || {}; 
    const studentId = savedUser._id || savedUser.id || "664b3c2e1f4a2b3c4d5e6f7a"; 
    const studentName = savedUser.name || savedUser.username || "Talaba";

    useEffect(() => {
        axios.get(`${API_URL}/api/lessons`)
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

        const finalTestScore = typeof score !== "undefined" ? score : (savedUser.testScore || 0);
        const finalTimeSpent = typeof timeSpent !== "undefined" ? timeSpent : (savedUser.timeSpent || 0);

        const formData = new FormData();
        formData.append("file", file); 
        formData.append("lessonId", lessonId);
        formData.append("lessonTitle", practice.title);
        formData.append("studentId", studentId); 
        formData.append("studentName", studentName);       
        formData.append("testScore", String(finalTestScore)); 
        formData.append("timeSpent", String(finalTimeSpent)); 

        try {
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Yuborilmoqda..." }));
            
            const response = await axios.post(`${API_URL}/api/tests/submit`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (response.data.success) {
                setUploadingStatus(prev => ({ ...prev, [lessonId]: "Muvaffaqiyatli yuborildi! ✅" }));
                alert("Vazifa muvaffaqiyatli topshirildi va bazaga saqlandi! 🎉");
                
                setSelectedFiles(prev => {
                    const updated = { ...prev };
                    delete updated[lessonId];
                    return updated;
                });
            }
        } catch (err) {
            console.error("Yuborishda xatolik yuz berdi:", err);
            
            if (err.response && err.response.data) {
                alert(`Xatolik: ${err.response.data.error || "Serverda ichki xato yuz berdi"}`);
            } else {
                alert("Server bilan ulanishda xatolik yuz berdi. Server ishlayotganini tekshiring.");
            }
            
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Xatolik yuz berdi. Qayta urining." }));
        }
    };
