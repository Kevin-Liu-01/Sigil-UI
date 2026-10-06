"use client";

import { useState } from "react";
import {
  AnnouncementBar,
  PricingTiers,
  UnitPricing,
  CostCalculator,
  BlogGrid,
  BlogHeader,
  FeatureGrid,
  SocialIcons,
  CTA,
  Terminal,
  Button,
  ComparisonTable,
  ArchitectureDiagram,
} from "@sigil-ui/components";
import {
  Cpu, HardDrive, Zap, Shield, Globe,
  ExternalLink, Package,
} from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Announcement Bar                                                     */
/* ------------------------------------------------------------------ */

function DemoAnnouncementBar() {
  return (
    <AnnouncementBar
      badge="New"
      message="From Today to A2A: Crossing the Imagination Chasm"
      href="#"
      icon={
        <span
          className="text-[11px] font-bold font-[family:var(--s-font-mono)] px-1.5 py-0.5"
          style={{ background: "var(--s-error)", color: "#fff", borderRadius: 2 }}
        >
          Y
        </span>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Pricing Tiers                                                        */
/* ------------------------------------------------------------------ */

function DemoPricingTiers() {
  return (
    <PricingTiers
      tiers={[
        {
          icon: <Zap size={16} />,
          name: "Hobby",
          price: "$0",
          period: "/mo",
          description: "$20 one-time sign-up credit.",
          features: [
            { label: "vCPU / Sandbox", value: "Up to 2" },
            { label: "RAM / Sandbox", value: "4 GiB" },
            { label: "Storage", value: "10 GB" },
            { label: "Machines", value: "Up to 5" },
            { label: "Compute", value: "Up to 50 hrs/mo" },
          ],
          cta: (
            <Button variant="outline" className="w-full">
              Start for free
            </Button>
          ),
        },
        {
          icon: <Shield size={16} />,
          name: "Pro",
          price: "$20",
          period: "/mo",
          badge: "Popular",
          highlighted: true,
          description: "$20 of compute included every month.",
          features: [
            { label: "vCPU / Sandbox", value: "Up to 4" },
            { label: "RAM / Sandbox", value: "Up to 8 GiB" },
            { label: "Storage", value: "20 GB (expandable)" },
            { label: "Machines", value: "Up to 25" },
            { label: "Compute", value: "Unlimited" },
          ],
          cta: (
            <Button variant="primary" className="w-full">
              Get started
            </Button>
          ),
        },
        {
          icon: <Globe size={16} />,
          name: "Enterprise",
          price: "Custom",
          description: "Fleet-level control for teams that need dedicated infrastructure.",
          features: [
            { label: "vCPU / Sandbox", value: "Custom" },
            { label: "RAM / Sandbox", value: "Custom" },
            { label: "Storage", value: "Custom" },
            { label: "Machines", value: "Unlimited" },
            { label: "Compute", value: "Unlimited" },
          ],
          cta: (
            <Button variant="outline" className="w-full">
              Contact sales
            </Button>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Unit Pricing                                                         */
/* ------------------------------------------------------------------ */

function DemoUnitPricing() {
  const [unit, setUnit] = useState<"second" | "hour">("hour");

  return (
    <UnitPricing
      toggle={
        <div
          style={{
            display: "inline-flex",
            border: "1px solid var(--s-border)",
            borderStyle: "var(--s-border-style, solid)" as any,
          }}
        >
          {(["second", "hour"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className="text-[12px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)] px-5 py-2 cursor-pointer"
              style={{
                color: unit === u ? "var(--s-text)" : "var(--s-text-muted)",
                background: unit === u ? "var(--s-surface-elevated)" : "transparent",
                border: "none",
                transition: "all var(--s-duration-fast, 150ms)",
              }}
            >
              Per {u}
            </button>
          ))}
        </div>
      }
      units={[
        {
          icon: <Cpu size={16} />,
          category: "vCPU",
          price: unit === "hour" ? "$0.04536" : "$0.0000126",
          unit: `per vCPU · ${unit}`,
          footnote: unit === "hour" ? "≈ $33.11 if running 24/7" : undefined,
        },
        {
          icon: <Cpu size={16} />,
          category: "Memory",
          price: unit === "hour" ? "$0.01458" : "$0.00000405",
          unit: `per GiB · ${unit}`,
          footnote: unit === "hour" ? "≈ $10.64 if running 24/7" : undefined,
        },
        {
          icon: <HardDrive size={16} />,
          category: "Storage",
          price: "$0.08",
          unit: "per GB · month",
          badge: "Monthly",
          footnote: "Persists through sleep/wake cycles.",
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Cost Calculator                                                      */
/* ------------------------------------------------------------------ */

function DemoCostCalculator() {
  const [vcpu, setVcpu] = useState(2);
  const [memory, setMemory] = useState(8);
  const [storage, setStorage] = useState(20);
  const [active, setActive] = useState(150);
  const idle = 744 - active;

  const brandCost = (vcpu * 0.04536 + memory * 0.01458) * active + storage * 0.08;
  const competitorCost = (vcpu * 0.04536 + memory * 0.01458) * 744 + storage * 0.08;

  return (
    <CostCalculator
      sliders={[
        { label: "vCPU", value: vcpu, unit: "cores", min: 1, max: 8, step: 1, onChange: setVcpu },
        { label: "Memory", value: memory, unit: "GiB", min: 1, max: 32, step: 1, onChange: setMemory },
        { label: "Storage", value: storage, unit: "GB", min: 5, max: 100, step: 5, onChange: setStorage },
        { label: "Active hrs", value: active, unit: "hrs", min: 10, max: 744, step: 10, onChange: setActive },
        { label: "Idle hrs", value: idle, unit: "hrs" },
      ]}
      estimate={{
        brandName: "Sigil Cloud",
        brandCost,
        competitorName: "Typical competitor",
        competitorCost,
        savingsNote: `Competitors charge ~$${((vcpu * 0.04536 + memory * 0.01458) * idle).toFixed(2)}/mo for idle time. You pay $0.`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Feature Grid with diagrams                                           */
/* ------------------------------------------------------------------ */

function DemoFeatureGrid() {
  return (
    <FeatureGrid
      rows={[
        {
          heading: "Machines that start in <50ms",
          bullets: [
            "Full filesystem + memory preserved across sessions",
            "0 cold starts. No waiting.",
          ],
          visual: (
            <div className="w-full flex flex-col gap-4 font-[family:var(--s-font-mono)] text-[12px]">
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: "var(--s-text-muted)" }}>Traditional Sandbox</span>
                  <span className="tabular-nums" style={{ color: "var(--s-text-subtle)" }}>2.5s</span>
                </div>
                <div className="flex gap-0.5 h-6">
                  {["Pull Image", "Start runtime", "Install deps", "Ready"].map((s) => (
                    <div key={s} className="flex-1 flex items-center justify-center text-[9px]" style={{ background: "var(--s-primary)", color: "var(--s-primary-contrast, #fff)" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: "var(--s-text)", fontWeight: 600 }}>Sigil Machines</span>
                  <span className="tabular-nums font-bold" style={{ color: "var(--s-primary)" }}>50ms</span>
                </div>
                <div className="h-6 w-1/6" style={{ background: "var(--s-primary)" }} />
              </div>
              <div
                className="text-center py-1 px-3 self-center text-[11px] font-semibold"
                style={{ color: "var(--s-success)", background: "color-mix(in oklch, var(--s-success) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--s-success) 20%, transparent)" }}
              >
                ~50x faster
              </div>
            </div>
          ),
        },
        {
          heading: "Full Linux. Maximum flexibility.",
          bullets: ["Install anything: apt, pip, npm, cargo"],
          quote: "Other sandboxes trade flexibility for fast startup time. Sigil Machines give you both.",
          visual: (
            <div className="w-full flex flex-col gap-3 font-[family:var(--s-font-mono)] text-[11px]">
              {[
                { label: "Runtimes", items: ["Python", "Node.js", "Rust", "Go", "Java", "Ruby"] },
                { label: "Packages", items: ["apt", "pip", "npm", "cargo", "brew"] },
                { label: "System", items: ["Root access", "GPU / CUDA", "Docker", "500 GB disk"] },
              ].map((group) => (
                <div key={group.label}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--s-text-muted)" }}>{group.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5"
                        style={{ background: "var(--s-surface-elevated)", border: "1px solid var(--s-border)", color: "var(--s-text-secondary)" }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: "VM-level isolation. Safe for untrusted code.",
          bullets: [
            "Full kernel, memory, and filesystem isolation",
            "Root access inside every sandbox",
            "Stronger boundaries than Docker or V8 isolates",
          ],
          visual: (
            <div className="w-full">
              <ArchitectureDiagram
                layers={[
                  { label: "Hardware", children: [] },
                  { label: "Kernel", children: [] },
                  { label: "VM", children: [] },
                  { label: "Agent", children: [], hatched: true },
                ]}
              />
              <div className="mt-4">
                <ComparisonTable
                  features={[
                    { name: "Full isolation", values: { "Sigil VM": true, "Docker": false, "V8": false } },
                    { name: "Root access", values: { "Sigil VM": true, "Docker": false, "V8": false } },
                    { name: "GPU support", values: { "Sigil VM": true, "Docker": true, "V8": false } },
                    { name: "Custom kernel", values: { "Sigil VM": true, "Docker": false, "V8": false } },
                  ]}
                  columns={["Sigil VM", "Docker", "V8"]}
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Blog Section                                                         */
/* ------------------------------------------------------------------ */

function DemoBlog() {
  const [category, setCategory] = useState("All");

  return (
    <div className="flex flex-col gap-8">
      <BlogHeader
        title="Ideas, experiments, and playbooks,"
        accent="midflight"
        categories={["All", "MCP", "Engineering", "Interviews", "Research", "Company"]}
        activeCategory={category}
        onCategoryChange={setCategory}
      />
      <BlogGrid
        variant="featured"
        posts={[
          {
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
            category: "Research",
            title: "From Today to A2A: Crossing the Imagination Chasm",
            excerpt: "99% of the most useful agents have not been built yet. Not because the tech isn't ready, but because the world still can't imagine what an agent-native future looks like.",
            author: "Cathy Di",
            date: "Mar 25, 2026",
          },
          {
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
            category: "Engineering",
            title: "What is an Agent?",
            excerpt: "Everyone is building agents. But what does that actually mean?",
            author: "Cathy Di",
            date: "Mar 11, 2026",
          },
          {
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
            category: "Company",
            title: "Introducing External URL Support",
            excerpt: "Now, you can connect MCP servers deployed on Sigil to any agent.",
            author: "Shengming Liang",
            date: "Feb 28, 2026",
          },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA + Terminal                                                       */
/* ------------------------------------------------------------------ */

function DemoCTA() {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <span
        className="text-[11px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)]"
        style={{ color: "var(--s-primary)" }}
      >
        Ready to ship?
      </span>
      <h2
        style={{
          fontFamily: "var(--s-font-display)",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--s-text)",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        <span style={{ color: "var(--s-primary)" }}>&lt;50ms</span> away from production
      </h2>
      <p className="text-sm" style={{ color: "var(--s-text-muted)" }}>No credit card required.</p>

      <Terminal
        lines={[
          "$ sigil machines create --vcpu 2 --memory-mib 4096",
          "Machine sm-7f3a created · status: running · 250ms",
          "$ sigil ssh sm-7f3a",
          "root@sm-7f3a:~#",
        ]}
        className="max-w-lg w-full text-left"
      />

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button variant="primary" size="lg">
          Join the waitlist &rarr;
        </Button>
        <Button variant="outline" size="lg">
          Read the Docs
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo Footer                                                          */
/* ------------------------------------------------------------------ */

function DemoFooter() {
  return (
    <div
      className="flex flex-col gap-8"
      style={{ borderTop: "1px solid var(--s-border-muted)", paddingTop: 48 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} style={{ color: "var(--s-primary)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--s-text)" }}>Sigil Labs</span>
          </div>
          <p className="text-[12px] mb-4" style={{ color: "var(--s-text-muted)", lineHeight: 1.6 }}>
            The fastest persistent sandboxes for AI agents. Host long-running, stateful agents in &lt;50ms.
          </p>
          <SocialIcons
            size="sm"
            links={[
              { icon: <ExternalLink size={14} />, href: "#", label: "GitHub" },
              { icon: <ExternalLink size={14} />, href: "#", label: "Twitter" },
              { icon: <ExternalLink size={14} />, href: "#", label: "LinkedIn" },
              { icon: <ExternalLink size={14} />, href: "#", label: "Discord" },
            ]}
          />
        </div>
        {[
          { title: "Product", links: ["Pricing", "Marketplace", "API", "Docs"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Community", links: ["Startups", "Creators", "Ambassadors", "Merch"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
        ].map((col) => (
          <div key={col.title}>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider font-[family:var(--s-font-mono)] block mb-3"
              style={{ color: "var(--s-text-muted)" }}
            >
              {col.title}
            </span>
            <div className="flex flex-col gap-2">
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[13px] no-underline"
                  style={{ color: "var(--s-text-secondary)", transition: "color var(--s-duration-fast, 150ms)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--s-text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--s-text-secondary)"; }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex justify-between items-center text-[11px] font-[family:var(--s-font-mono)] pt-4"
        style={{ borderTop: "1px solid var(--s-border-muted)", color: "var(--s-text-subtle)" }}
      >
        <span>&copy; 2026 Sigil Labs. All rights reserved.</span>
        <span>San Francisco, CA</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export                                                                */
/* ------------------------------------------------------------------ */

export function ProductDemo() {
  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      {/* Section label */}
      <div style={{ marginBottom: 32 }}>
        <span className="s-label" style={{ display: "block", marginBottom: 12 }}>
          / Product Components
        </span>
        <h2
          style={{
            fontFamily: "var(--s-font-display)",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--s-text)",
            margin: "0 0 12px 0",
          }}
        >
          Everything you need to ship a product site.
        </h2>
        <p className="s-mono" style={{ fontSize: 14, color: "var(--s-text-muted)", margin: 0, maxWidth: 560 }}>
          Pricing tables, cost calculators, blog grids, feature comparisons, architecture diagrams, CTAs — all token-driven.
        </p>
      </div>

      {/* Announcement Bar */}
      <DemoAnnouncementBar />

      {/* Feature Grid */}
      <div style={{ marginTop: 48 }}>
        <span className="s-fig" style={{ display: "block", marginBottom: 8 }}>
          Feature sections — alternating layout
        </span>
        <DemoFeatureGrid />
      </div>

      {/* Pricing */}
      <div style={{ marginTop: 48 }}>
        <span className="s-fig" style={{ display: "block", marginBottom: 8 }}>
          Pricing tiers
        </span>
        <DemoPricingTiers />
      </div>

      {/* Unit Pricing */}
      <div style={{ marginTop: 48 }}>
        <span className="s-fig" style={{ display: "block", marginBottom: 8 }}>
          Metered unit pricing with toggle
        </span>
        <DemoUnitPricing />
      </div>

      {/* Cost Calculator */}
      <div style={{ marginTop: 48 }}>
        <span className="s-fig" style={{ display: "block", marginBottom: 8 }}>
          Interactive cost calculator
        </span>
        <DemoCostCalculator />
      </div>

      {/* Blog */}
      <div style={{ marginTop: 64 }}>
        <DemoBlog />
      </div>

      {/* CTA */}
      <div style={{ marginTop: 64, marginBottom: 32 }}>
        <DemoCTA />
      </div>

      {/* Footer */}
      <DemoFooter />
    </div>
  );
}
