import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-8">
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white/50">
        <Construction className="h-16 w-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">{title}</h2>
        <p className="text-slate-500 text-center max-w-md mb-6">{description}</p>
        <div className="text-sm text-slate-400">
          Continue prompting to add content to this page
        </div>
      </div>
    </div>
  );
}
