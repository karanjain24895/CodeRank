export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content overflow-hidden">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20">

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-16 left-6 w-44 h-44 sm:w-60 sm:h-60 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 right-6 w-52 h-52 sm:w-72 sm:h-72 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl">

          <div className="inline-flex items-center gap-2 bg-base-100/70 backdrop-blur-md border border-base-300 rounded-full px-4 py-2 shadow-md mb-6">

            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>

            <span className="font-medium text-xs sm:text-sm">
              Practice coding smarter with CodeRank
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">

            Master Coding

            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-1 sm:mt-2">
              One Challenge at a Time
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Solve curated programming challenges, improve problem-solving skills,
            and track your progress with a beautiful and competitive coding platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

            <button
              className="btn btn-primary rounded-xl px-6 h-11 min-h-0 text-sm sm:text-base font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Get Started 🚀
            </button>

            <button
              className="btn btn-outline rounded-xl px-6 h-11 min-h-0 text-sm sm:text-base"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Choose CodeRank?
            </h2>

            <p className="mt-3 text-sm sm:text-base text-base-content/70 max-w-xl mx-auto">
              Everything you need to become better at coding and problem solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Card 1 */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4">
                💻
              </div>

              <h3 className="text-xl font-bold mb-2">
                Real Coding Challenges
              </h3>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Practice carefully designed coding questions covering algorithms,
                logic building, and real interview-style problems.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-2xl mb-4">
                📈
              </div>

              <h3 className="text-xl font-bold mb-2">
                Track Progress
              </h3>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Monitor solved problems, improve consistency, and build your coding
                confidence step by step.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>

              <h3 className="text-xl font-bold mb-2">
                Fast & Modern UI
              </h3>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Enjoy a smooth coding experience with a clean, responsive, and
                visually engaging interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">

        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">

          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Ready to Level Up Your Coding Skills?
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers practicing daily and improving their
            problem-solving abilities with CodeRank.
          </p>

          <button
            className="btn bg-white text-black hover:bg-base-200 border-none rounded-xl h-11 min-h-0 px-6 text-sm sm:text-base font-bold mt-6"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Start Coding Today 🚀
          </button>
        </div>
      </section>
    </div>
  );
}