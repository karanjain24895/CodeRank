export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-base-100/70 backdrop-blur-md border border-base-300 rounded-full px-5 py-2 shadow-lg mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="font-medium text-sm">
              Practice coding smarter with CodeRank
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Master Coding
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              One Challenge at a Time
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Solve curated programming challenges, improve problem-solving skills,
            and track your progress with a beautiful and competitive coding platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12">
            <button
              className="btn btn-primary rounded-2xl px-10 h-16 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Get Started 🚀
            </button>

            <button
              className="btn btn-outline rounded-2xl px-10 h-16 text-lg"
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
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose CodeRank?
            </h2>

            <p className="mt-5 text-lg text-base-content/70 max-w-2xl mx-auto">
              Everything you need to become better at coding and problem solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-6">
                💻
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Real Coding Challenges
              </h3>

              <p className="text-base-content/70 leading-relaxed">
                Practice carefully designed coding questions covering algorithms,
                logic building, and real interview-style problems.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl mb-6">
                📈
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Track Progress
              </h3>

              <p className="text-base-content/70 leading-relaxed">
                Monitor solved problems, improve consistency, and build your coding
                confidence step by step.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-base-100 border border-base-300 rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl mb-6">
                ⚡
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Fast & Modern UI
              </h3>

              <p className="text-base-content/70 leading-relaxed">
                Enjoy a smooth coding experience with a clean, responsive, and
                visually engaging interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-12 md:p-20 text-white text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Ready to Level Up Your Coding Skills?
          </h2>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers practicing daily and improving their
            problem-solving abilities with CodeRank.
          </p>

          <button
            className="btn bg-white text-black hover:bg-base-200 border-none rounded-2xl h-16 px-10 text-lg font-bold mt-10"
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
