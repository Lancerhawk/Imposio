const steps = [
  {
    number: "01",
    title: "Upload PDF",
    description: "Drag and drop or browse to select any PDF from your device.",
  },
  {
    number: "02",
    title: "Imposio Calculates",
    description:
      "The booklet layout is computed automatically — pages are reordered using the booklet imposition algorithm.",
  },
  {
    number: "03",
    title: "Download",
    description:
      "Get your print-ready booklet PDF instantly, directly in your browser.",
  },
  {
    number: "04",
    title: "Print, Fold & Bind",
    description:
      "Print duplex, fold the sheets, and you have a perfectly ordered booklet.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-stone-50 border-y border-stone-200" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-3">How It Works</h2>
          <p className="text-stone-500">Four simple steps to your printed booklet.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+32px)] right-[-50%] h-px bg-stone-300 z-0" />
              )}

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow-md">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
