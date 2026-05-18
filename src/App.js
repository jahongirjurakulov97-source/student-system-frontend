import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, LogOut, ShieldCheck, GraduationCap, 
  Users, BookOpen, FileText, ClipboardCheck, BrainCircuit, Upload, PlusCircle, Timer, FolderPlus, Trash2 
} from 'lucide-react';

import AdminPanel from "./components/AdminPanel";

// 🌍 RENDER JONLI BACKEND URL MANZILI
const BACKEND_URL = "https://student-system-backend.onrender.com";

// --- 1. ADMIN UCHUN KOMPONENTLAR ---

const Lessons = () => {
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingLessons, setExistingLessons] = useState([]); 
  const fileInputRef = useRef(null);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons`);
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
      const response = await axios.post(`${BACKEND_URL}/api/lessons/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert(`"${topic}" ma'ruzasi muvaffaqiyatli yuklandi! ✅`);
        setTopic("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchLessons(); 
      }
    } catch (err) {
      alert("Xatolik: Faylni yuklab bo'lmadi.");
    }
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu ma'ruzani o'chirmoqchimisiz? ⚠️")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/lessons/${id}`);
        alert("Ma'ruza muvaffaqiyatli o'chirildi! ✅");
        fetchLessons(); 
      } catch (err) {
        alert("Xatolik: Ma'ruzani o'chirib bo'lmadi.");
      }
    }
  };

  return (
    <div className="space-y-8">
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
  const [existingPractices, setExistingPractices] = useState([]); 
  const fileInputRef = useRef(null);

  const fetchPractices = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons`);
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
      await axios.post(`${BACKEND_URL}/api/lessons/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("Amaliy mashg'ulot muvaffaqiyatli yuborildi! ✅");
      setTitle("");
      setDesc("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPractices(); 
    } catch (err) {
      console.error(err);
      alert("Xatolik: Amaliyotni saqlab bo'lmadi.");
    }
  };

  const handleDeletePractice = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu amaliy topshiriqni o'chirmoqchimisiz? ⚠️")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/lessons/${id}`);
        alert("Amaliy topshiriq muvaffaqiyatli o'chirildi! ✅");
        fetchPractices(); 
      } catch (err) {
        alert("Xatolik: Amaliyotni o'chirib bo'lmadi.");
      }
    }
  };

  return (
    <div className="space-y-8">
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
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Upload size={24} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-orange-700 font-bold text-sm">
                {selectedFile ? `Tanlandi: ${selectedFile.name}` : "Fayl biriktirish uchun bosing"}
              </p>
            </div>
          </div>

          <button onClick={handleSend} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all text-lg uppercase shadow-xl shadow-orange-100">
            Talabalarga yuborish
          </button>
        </div>
      </div>

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
      const res = await axios.get(`${BACKEND_URL}/api/tests`);
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
      await axios.post(`${BACKEND_URL}/api/tests/create`, testData);
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
        await axios.delete(`${BACKEND_URL}/api/tests/${id}`);
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
      axios.get(`${BACKEND_URL}/api/tests/all-results`)
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
          await axios.delete(`${BACKEND_URL}/api/tests/result/${id}`);
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
        axios.get(`${BACKEND_URL}/api/lessons`)
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
                        <a href={`${BACKEND_URL}/uploads/${lesson.fileUrl}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">O'QISH (PDF)</a>
                      )}
                  </div>
                ))
              )}
          </div>
        </div>
    );
};

// --- 3. TALABA OYNASI: AMALIY ISHLAR BO'LIMI (TIKLANGAN VA ULANGAN QISMI) ---
const StudentPracticals = ({ score, timeSpent }) => { 
    const [lessons, setLessons] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({}); 
    const [uploadingStatus, setUploadingStatus] = useState({}); 

    const savedUser = JSON.parse(localStorage.getItem("user")) || {}; 
    const studentId = savedUser._id || savedUser.id || "664b3c2e1f4a2b3c4d5e6f7a"; 
    const studentName = savedUser.name || savedUser.username || "Talaba";

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/lessons`)
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
            
            const response = await axios.post(`${BACKEND_URL}/api/tests/submit`, formData, {
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
            alert("Server bilan ulanishda xatolik yuz berdi.");
            setUploadingStatus(prev => ({ ...prev, [lessonId]: "Xatolik yuz berdi." }));
        }
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
          <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"><FileText className="text-orange-600" /> Amaliy Mashg'ulotlar</h2>
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
                            <a href={`${BACKEND_URL}/uploads/${practice.fileUrl}`} target="_blank" rel="noreferrer" className="inline-block px-5 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition">
                              Biriktirilgan fayl
                            </a>
                          )}

                          <div className="flex items-center gap-2 bg-white p-1.5 pl-4 border border-slate-200 rounded-xl max-w-md w-full sm:w-auto">
                            <span className="text-xs text-slate-500 truncate max-w-[150px]">
                              {selectedFiles[lessonId] ? selectedFiles[lessonId].name : "Fayl tanlanmagan"}
                            </span>
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition ml-auto">
                              Fayl tanlash
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleFileChange(lessonId, e.target.files[0])}
                              />
                            </label>
                          </div>

                          <button 
                            onClick={() => handleUploadHomework(practice)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                          >
                            {uploadingStatus[lessonId] || "Vazifani topshirish"}
                          </button>
                        </div>
                    </div>
                  );
                })
              )}
          </div>
        </div>
    );
};

// --- 4. TALABA OYNASI: TEST TOPSHIRISH BO'LIMI ---
const StudentTests = ({ setScore, setTimeSpent }) => {
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/tests`)
      .then(res => setTests(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (currentTest && timer > 0 && !isFinished) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && currentTest && !isFinished) {
      handleFinishTest();
    }
  }, [currentTest, timer, isFinished]);

  const handleStartTest = (test) => {
    setCurrentTest(test);
    setTimer(test.duration * 60 || 1800);
    setAnswers({});
    setIsFinished(false);
  };

  const handleSelectOption = (qIdx, option) => {
    setAnswers({ ...answers, [qIdx]: option });
  };

  const handleFinishTest = () => {
    setIsFinished(true);
    let correctCount = 0;
    currentTest.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });

    const percent = Math.round((correctCount / currentTest.questions.length) * 100);
    if(setScore) setScore(percent);
    
    const timeUsed = (currentTest.duration * 60) - timer;
    if(setTimeSpent) setTimeSpent(timeUsed);

    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    const resultPayload = {
      studentId: savedUser._id || savedUser.id || "664b3c2e1f4a2b3c4d5e6f7a",
      studentName: savedUser.name || savedUser.username || "Talaba",
      lessonTitle: currentTest.lessonTitle,
      testScore: percent,
      timeSpent: timeUsed,
      status: "Tugallandi"
    };

    axios.post(`${BACKEND_URL}/api/tests/save-result`, resultPayload)
      .then(() => alert(`Test yakunlandi! Sizning natijangiz: ${percent}% ✅`))
      .catch(err => console.log("Natijani saqlashda xato:", err));
  };

  if (currentTest) {
    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-black text-slate-800">{currentTest.lessonTitle}</h2>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-black">
            <Timer size={18} />
            <span>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            {currentTest.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="font-bold text-slate-800 text-lg">{qIdx + 1}. {q.questionText}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button 
                      key={oIdx}
                      onClick={() => handleSelectOption(qIdx, opt)}
                      className={`p-4 rounded-xl font-medium text-left transition border-2 ${answers[qIdx] === opt ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'bg-white border-transparent hover:bg-slate-100 text-slate-600'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleFinishTest} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-lg hover:bg-emerald-700 transition">
              Testni Yakunlash
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex bg-emerald-100 text-emerald-700 p-4 rounded-full">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Test Muvaffaqiyatli Yakunlandi!</h3>
            <button onClick={() => setCurrentTest(null)} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold">
              Ortga qaytish
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-fadeIn">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3"><BrainCircuit className="text-emerald-600" /> Bilimni Baholash (Testlar)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.length === 0 ? (
          <p className="text-slate-400 italic">Hozircha faol testlar mavjud emas.</p>
        ) : (
          tests.map((test, idx) => (
            <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-black text-slate-800 text-xl mb-2">{test.lessonTitle}</h3>
                <p className="text-slate-400 text-sm font-bold uppercase mb-4">Savollar: {test.questions?.length || 0} ta | Vaqt: {test.duration} daqiqa</p>
              </div>
              <button onClick={() => handleStartTest(test)} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition uppercase text-sm">
                Testni Boshlash
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- 5. ASOSIY DASHBOARD VA STRUKTURA ---
const DashboardLayout = ({ children, role, onLogout }) => {
  const location = useLocation();
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentName = savedUser.name || savedUser.username || (role === "admin" ? "Administrator" : "Talaba");

  const adminMenu = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/lessons", label: "Ma'ruzalar", icon: Upload },
    { path: "/admin/practicals", label: "Amaliy Mashg'ulot", icon: PlusCircle },
    { path: "/admin/tests", label: "Test Yaratish", icon: ClipboardCheck },
    { path: "/admin/monitoring", label: "Monitoring", icon: Users },
  ];

  const studentMenu = [
    { path: "/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/lessons", label: "Ma'ruzalarim", icon: BookOpen },
    { path: "/student/practicals", label: "Amaliy Ishlar", icon: FileText },
    { path: "/student/tests", label: "Imtihon (Test)", icon: BrainCircuit },
  ];

  const menuItems = role === "admin" ? adminMenu : studentMenu;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-500 selection:text-white">
      <aside className="w-80 bg-slate-900 text-slate-400 p-8 flex flex-col justify-between fixed h-full shadow-2xl z-10 rounded-r-[3rem]">
        <div className="space-y-12">
          <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-white font-black tracking-tight text-lg leading-tight">STUDENT</h1>
              <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">{role} SYSTEM</span>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foydalanuvchi</p>
            <p className="text-white font-black mt-1 truncate">{currentName}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl font-bold transition-all uppercase text-xs tracking-wider">
            <LogOut size={16} /> Tizimdan Chiqish
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight capitalize">{location.pathname.split("/")[2] || "Bosh sahifa"}</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">Tizim holati: Barqaror Jonli ✅</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

// --- 6. ASOSIY APP KIRISH NUGTASI (LOGIN VA YO'NALTIRISHLAR) ---
export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Iltimos, barcha maydonlarni to'ldiring!");

    if (username === "admin" && password === "admin123") {
      const adminUser = { role: "admin", name: "Administrator" };
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
    } else {
      const studentUser = { role: "student", name: username, _id: "664b3c2e1f4a2b3c4d5e6f7a" };
      localStorage.setItem("user", JSON.stringify(studentUser));
      setUser(studentUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-500/20 mb-2">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tizimga Kirish</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">LMS Student Monitoring</p>
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Foydalanuvchi nomi..." 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none transition"
            />
            <input 
              type="password" 
              placeholder="Parol..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none transition"
            />
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-wider hover:bg-blue-700 transition shadow-xl shadow-blue-100">
            Tizimga xavfsiz kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {user.role === "admin" ? (
          <>
            <Route path="/admin" element={<DashboardLayout role="admin" onLogout={handleLogout}><AdminPanel /></DashboardLayout>} />
            <Route path="/admin/lessons" element={<DashboardLayout role="admin" onLogout={handleLogout}><Lessons /></DashboardLayout>} />
            <Route path="/admin/practicals" element={<DashboardLayout role="admin" onLogout={handleLogout}><PracticeCreator /></DashboardLayout>} />
            <Route path="/admin/tests" element={<DashboardLayout role="admin" onLogout={handleLogout}><TestCreator /></DashboardLayout>} />
            <Route path="/admin/monitoring" element={<DashboardLayout role="admin" onLogout={handleLogout}><StudentMonitoring /></DashboardLayout>} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route path="/student" element={<DashboardLayout role="student" onLogout={handleLogout}><div className="bg-white p-10 rounded-[3rem] border border-slate-100 font-black text-2xl text-slate-700">Xush kelibsiz, Talaba! O'quv jarayonini boshlash uchun menyudan foydalaning.</div></DashboardLayout>} />
            <Route path="/student/lessons" element={<DashboardLayout role="student" onLogout={handleLogout}><StudentLessons /></DashboardLayout>} />
            <Route path="/student/practicals" element={<DashboardLayout role="student" onLogout={handleLogout}><StudentPracticals score={score} timeSpent={timeSpent} /></DashboardLayout>} />
            <Route path="/student/tests" element={<DashboardLayout role="student" onLogout={handleLogout}><StudentTests setScore={setScore} setTimeSpent={setTimeSpent} /></DashboardLayout>} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
