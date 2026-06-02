import { Shield, Zap, Printer, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automatic Imposition",
    description:
      "Imposio calculates the exact booklet page order for any PDF length — no manual work needed.",
    accent: "red",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "All processing happens entirely in your browser. Your files are never uploaded to any server.",
    accent: "stone",
  },
  {
    icon: Printer,
    title: "Print Ready",
    description:
      "Output PDFs are formatted for duplex printing. Print, fold, and bind into a perfect booklet.",
    accent: "red",
  },
  {
    icon: Sparkles,
    title: "No Watermarks",
    description:
      "Generated PDFs are clean with no branding, watermarks, or added metadata.",
    accent: "stone",
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4" id="features">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-3">
            Why Imposio?
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            A focused tool that does one thing exceptionally well.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="group bg-white border border-stone-200 rounded-2xl p-6 hover:border-red-200 hover:shadow-md transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                  accent === "red"
                    ? "bg-red-100 group-hover:bg-red-200"
                    : "bg-stone-100 group-hover:bg-stone-200"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    accent === "red" ? "text-red-600" : "text-stone-600"
                  }`}
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
