"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CloudUpload,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "@/components/icons";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  CommitGrid,
  Input,
  KPI,
  Label,
  Meter,
  Progress,
  Slider,
  SparkLine,
  Stepper,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@sigil-ui/components";
import { SIGIL_PRODUCT_STATS } from "../lib/product-stats";

const commitData = [
  0, 2, 1, 5, 3, 0, 4, 7, 2, 6, 8, 3, 1, 0, 5, 9, 4, 6, 2, 7, 3,
  8, 5, 1, 4, 9, 6, 3, 7, 2, 8, 4, 6, 10, 5, 3, 9, 7, 4, 8, 6, 2,
].map((count, index) => ({
  date: new Date(Date.UTC(2026, 5, index + 1)).toISOString().slice(0, 10),
  count,
}));

interface GalleryCardProps {
  title: string;
  description: string;
  href: string;
  index: string;
  children: ReactNode;
  wide?: boolean;
}

function GalleryCard({
  title,
  description,
  href,
  index,
  children,
  wide = false,
}: GalleryCardProps) {
  return (
    <article className="sigil-docs-gallery-card" data-wide={wide || undefined}>
      <div className="sigil-docs-gallery-stage">{children}</div>
      <div className="sigil-docs-gallery-caption">
        <span className="sigil-docs-gallery-index">{index}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <Link href={href} aria-label={`Open ${title} documentation`}>
          <ArrowUpRight aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function DeploymentStudy() {
  const [deployed, setDeployed] = useState(false);

  return (
    <div className="sigil-docs-demo-panel sigil-docs-demo-deploy">
      <div className="sigil-docs-demo-row">
        <span className="sigil-docs-demo-icon">
          {deployed ? <Check aria-hidden /> : <CloudUpload aria-hidden />}
        </span>
        <div>
          <strong>{deployed ? "Deployment ready" : "Deploy token update"}</strong>
          <p>{deployed ? "Production is on the latest spec." : "14 component changes detected."}</p>
        </div>
        <Badge variant={deployed ? "success" : "outline"}>
          {deployed ? "Live" : "Preview"}
        </Badge>
      </div>
      <Progress value={deployed ? 100 : 64} />
      <div className="sigil-docs-demo-actions">
        <Button onClick={() => setDeployed(true)} disabled={deployed}>
          {deployed ? "Deployed" : "Deploy now"}
          {!deployed && <ArrowRight aria-hidden />}
        </Button>
        <Button variant="outline" size="icon" onClick={() => setDeployed(false)} aria-label="Reset deployment">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function SettingsStudy() {
  const [updates, setUpdates] = useState(true);
  const [density, setDensity] = useState([62]);
  const [mode, setMode] = useState("system");

  return (
    <div className="sigil-docs-demo-panel sigil-docs-demo-settings">
      <div className="sigil-docs-demo-heading">
        <div>
          <Badge variant="outline">Workspace</Badge>
          <strong>Interface settings</strong>
        </div>
        <ShieldCheck aria-hidden />
      </div>
      <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as string)}>
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      </ToggleGroup>
      <div className="sigil-docs-demo-control">
        <div className="sigil-docs-demo-row sigil-docs-demo-row--compact">
          <Label htmlFor="docs-density">Canvas density</Label>
          <span>{density[0]}%</span>
        </div>
        <Slider id="docs-density" value={density} onValueChange={setDensity} aria-label="Canvas density" />
      </div>
      <Switch checked={updates} onCheckedChange={setUpdates} label="Automatic token sync" />
    </div>
  );
}

function AnalyticsStudy() {
  return (
    <div className="sigil-docs-demo-analytics">
      <KPI label="Component adoption" value="82.4%" change="12.8% this month" trend="up" />
      <div className="sigil-docs-demo-chart">
        <div className="sigil-docs-demo-row sigil-docs-demo-row--compact">
          <div>
            <span>Token compilations</span>
            <strong>12,840</strong>
          </div>
          <SparkLine data={[8, 11, 9, 14, 13, 19, 17, 25, 22, 29, 27, 34]} width={180} height={56} />
        </div>
        <Meter label="Monthly capacity" value={68} />
      </div>
    </div>
  );
}

function StepperStudy() {
  const [step, setStep] = useState(1);
  const steps = [
    { label: "Spec", description: "Read DESIGN.md" },
    { label: "Compile", description: "Generate tokens" },
    { label: "Ship", description: "Publish UI" },
  ];

  return (
    <div className="sigil-docs-demo-panel sigil-docs-demo-stepper">
      <Stepper steps={steps} currentStep={step} />
      <div className="sigil-docs-demo-actions sigil-docs-demo-actions--split">
        <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setStep((value) => (value >= steps.length - 1 ? 0 : value + 1))}>
          {step >= steps.length - 1 ? "Start over" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function WorkspaceStudy() {
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState(false);

  return (
    <div className="sigil-docs-demo-panel sigil-docs-demo-workspace">
      <div className="sigil-docs-demo-row">
        <AvatarGroup max={4} size="md">
          <Avatar name="Mara Vale" fallback="MV" />
          <Avatar name="Noah Chen" fallback="NC" />
          <Avatar name="Inez Park" fallback="IP" />
          <Avatar name="Theo Moss" fallback="TM" />
          <Avatar name="Ari Bell" fallback="AB" />
        </AvatarGroup>
        <div>
          <strong>Design systems</strong>
          <p>5 collaborators</p>
        </div>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="sigil-docs-demo-invite">
        <Input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setInvited(false);
          }}
          placeholder="name@company.com"
          iconLeft={<Mail aria-hidden />}
          aria-label="Collaborator email"
        />
        <Button
          variant={invited ? "success" : "primary"}
          onClick={() => email.trim() && setInvited(true)}
          disabled={!email.trim()}
        >
          {invited ? "Invited" : "Invite"}
        </Button>
      </div>
      <p className="sigil-docs-demo-note">
        {invited ? `Invitation sent to ${email}.` : "Invite teammates to edit the same token source."}
      </p>
    </div>
  );
}

function CalendarStudy() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 6, 14));

  return (
    <div className="sigil-docs-demo-calendar-wrap">
      <Calendar
        mode="single"
        captionLayout="label"
        defaultMonth={new Date(2026, 6, 1)}
        selected={date}
        onSelect={setDate}
        className="sigil-docs-demo-calendar"
      />
      <div className="sigil-docs-demo-calendar-note">
        <span>Selected review</span>
        <strong>{date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Choose a date"}</strong>
      </div>
    </div>
  );
}

function ActivityStudy() {
  return (
    <div className="sigil-docs-demo-panel sigil-docs-demo-activity">
      <div className="sigil-docs-demo-heading">
        <div>
          <span>Design activity</span>
          <strong>184 token changes</strong>
        </div>
        <Badge variant="outline">Last 6 weeks</Badge>
      </div>
      <div className="sigil-docs-demo-commit-scroll">
        <CommitGrid data={commitData} weeks={6} endDate="2026-07-12" cellSize={16} gap={4} />
      </div>
      <div className="sigil-docs-demo-row sigil-docs-demo-row--compact">
        <span>Quieter</span>
        <div className="sigil-docs-demo-intensity" aria-hidden>
          <i /><i /><i /><i />
        </div>
        <span>More active</span>
      </div>
    </div>
  );
}

function PatternStudy() {
  return (
    <Tabs defaultValue="tokens" className="sigil-docs-demo-panel sigil-docs-demo-tabs">
      <TabsList>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="presets">Presets</TabsTrigger>
        <TabsTrigger value="output">Output</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens">
        <div className="sigil-docs-demo-code">
          <span>colors.primary</span><strong>oklch(0.55 0.18 275)</strong>
          <span>radius.card</span><strong>var(--s-radius-md)</strong>
          <span>motion.fast</span><strong>150ms</strong>
        </div>
      </TabsContent>
      <TabsContent value="presets">
        <div className="sigil-docs-demo-swatches" aria-label="Preset color swatches">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
      </TabsContent>
      <TabsContent value="output">
        <div className="sigil-docs-demo-output">
          <Sparkles aria-hidden />
          <div><strong>Three targets compiled</strong><p>CSS · Tailwind v4 · W3C JSON</p></div>
          <Badge variant="success">Ready</Badge>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function DocsGallery() {
  return (
    <section className="sigil-docs-gallery" aria-labelledby="docs-gallery-title">
      <header className="sigil-docs-gallery-header">
        <div>
          <span className="sigil-docs-eyebrow">Live component studies</span>
          <h2 id="docs-gallery-title">Build with the system, not around it.</h2>
        </div>
        <p>
          Every study below uses the published components and your active token preset.
          Change the system and the entire gallery changes with it.
        </p>
      </header>

      <div className="sigil-docs-gallery-stats" aria-label="Library statistics">
        <span><strong>{SIGIL_PRODUCT_STATS.componentCountLabel}</strong> components</span>
        <span><strong>{SIGIL_PRODUCT_STATS.tokenCount}</strong> tokens</span>
        <span><strong>{SIGIL_PRODUCT_STATS.presetCount}</strong> presets</span>
        <Link href="/docs/installation">Install Sigil <ArrowRight aria-hidden /></Link>
      </div>

      <div className="sigil-docs-gallery-grid">
        <GalleryCard index="01" title="Deployment control" description="Actions, status, feedback, and progress composed as one workflow." href="/docs/components/button">
          <DeploymentStudy />
        </GalleryCard>
        <GalleryCard index="02" title="Interface settings" description="Token-driven selection, range, and binary controls." href="/docs/components/slider">
          <SettingsStudy />
        </GalleryCard>
        <GalleryCard index="03" title="Analytics cluster" description="Metrics and data display that inherit the active preset." href="/docs/components/kpi">
          <AnalyticsStudy />
        </GalleryCard>
        <GalleryCard index="04" title="Guided workflow" description="A complete multi-step flow with real state transitions." href="/docs/components/stepper">
          <StepperStudy />
        </GalleryCard>
        <GalleryCard index="05" title="Team workspace" description="Identity, input, status, and invitation behavior together." href="/docs/components/avatar">
          <WorkspaceStudy />
        </GalleryCard>
        <GalleryCard index="06" title="Date selection" description="An accessible calendar with a clear selection state." href="/docs/components/calendar">
          <CalendarStudy />
        </GalleryCard>
        <GalleryCard index="07" title="Activity field" description="Dense contribution data with readable hierarchy and detail." href="/docs/diagrams/commit-grid">
          <ActivityStudy />
        </GalleryCard>
        <GalleryCard index="08" title="Token compiler" description="One interface for source tokens, presets, and compiled output." href="/docs/components/tabs">
          <PatternStudy />
        </GalleryCard>
      </div>
    </section>
  );
}
