import { BrandLogo, type BrandName } from "@/components/brand-logo";
import { Layers } from "@/components/icons";

const STACK: Array<{ name: BrandName; label: string }> = [
  { name: "react", label: "React" },
  { name: "nextdotjs", label: "Next.js" },
  { name: "typescript", label: "TypeScript" },
  { name: "tailwindcss", label: "Tailwind" },
];

export function HeroStack({ enlarged }: { enlarged: boolean }) {
  return <div className="sigil-hero-stack" data-enlarged={enlarged}>
    <div className="sigil-hero-cell-label"><Layers /> Your stack</div>
    <div className="sigil-hero-stack-grid">
      {STACK.map(({ name, label }) => <div key={name}>
        <BrandLogo name={name} /><span>{label}</span>
      </div>)}
    </div>
  </div>;
}
