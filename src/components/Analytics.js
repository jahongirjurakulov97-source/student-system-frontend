import React from "react";

export default function Analytics({ students }) {

  // HISOBLASHLAR (siznikini saqladim)
  const avg =
    students.length
      ? (
          students.reduce(
            (a, b) => a + b.score,
            0
          ) / students.length
        ).toFixed(1)
      : 0;

  const best =
    students.length
      ? Math.max(
          ...students.map(s => s.score)
        )
      : 0;

  const low =
    students.filter(
      s => s.score < 50
    ).length;

  const high =
    students.filter(
      s => s.score >= 80
    ).length;

  return (

    <div className="space-y-8 animate-slideUp">

      {/* TOP STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* AVERAGE */}

        <div className="bg-gradient-to-br 
        from-indigo-600 to-violet-700 
        p-8 rounded-[2rem] 
        text-white shadow-xl">

          <p className="opacity-80 
          font-bold uppercase 
          tracking-widest text-sm mb-2">

            O'rtacha natija

          </p>

          <p className="text-5xl font-[900]">

            {avg}

            <span className="text-xl text-indigo-200">

              %

            </span>

          </p>

        </div>


        {/* BEST */}

        <div className="bg-white 
        p-8 rounded-[2rem] 
        border border-slate-100 
        shadow">

          <p className="text-slate-400 
          font-bold uppercase 
          tracking-widest text-sm mb-2">

            Eng yuqori

          </p>

          <p className="text-4xl 
          font-[900] text-slate-800">

            {best}%

          </p>

        </div>


        {/* HIGH */}

        <div className="bg-white 
        p-8 rounded-[2rem] 
        shadow border">

          <p className="text-green-500 
          font-bold text-sm mb-2">

            Yuqori natija

          </p>

          <p className="text-4xl 
          font-[900] text-green-600">

            {high}

          </p>

        </div>


        {/* LOW */}

        <div className="bg-white 
        p-8 rounded-[2rem] 
        shadow border">

          <p className="text-red-500 
          font-bold text-sm mb-2">

            Past natija

          </p>

          <p className="text-4xl 
          font-[900] text-red-600">

            {low}

          </p>

        </div>

      </div>


      {/* PROGRESS SECTION */}

      <div className="bg-white 
      p-8 rounded-[2rem] 
      shadow border">

        <h2 className="text-xl 
        font-bold text-slate-700 
        mb-6">

          📊 O'zlashtirish tahlili

        </h2>

        {/* AVERAGE BAR */}

        <div className="space-y-4">

          <div>

            <div className="flex justify-between text-sm mb-1">

              <span>O'rtacha natija</span>

              <span>{avg}%</span>

            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">

              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{
                  width: `${avg}%`
                }}
              />

            </div>

          </div>


          {/* BEST BAR */}

          <div>

            <div className="flex justify-between text-sm mb-1">

              <span>Eng yaxshi natija</span>

              <span>{best}%</span>

            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">

              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{
                  width: `${best}%`
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* STUDENT DISTRIBUTION */}

      <div className="bg-white 
      p-8 rounded-[2rem] 
      shadow border">

        <h2 className="text-xl 
        font-bold text-slate-700 
        mb-6">

          📚 Natijalar taqsimoti

        </h2>

        <div className="grid grid-cols-3 gap-6 text-center">

          <div>

            <p className="text-3xl font-bold text-blue-600">

              {students.length}

            </p>

            <p className="text-slate-400 text-sm">

              Jami talabalar

            </p>

          </div>


          <div>

            <p className="text-3xl font-bold text-green-600">

              {high}

            </p>

            <p className="text-slate-400 text-sm">

              Yuqori natija

            </p>

          </div>


          <div>

            <p className="text-3xl font-bold text-red-600">

              {low}

            </p>

            <p className="text-slate-400 text-sm">

              Past natija

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}