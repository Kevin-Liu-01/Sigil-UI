"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Label,
  Switch,
  Checkbox,
  Slider,
  Progress,
  Avatar,
  AvatarGroup,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Separator,
  RadioGroup,
  RadioGroupItem,
  KPI,
  Meter,
  Stepper,
  NumberField,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Pagination,
  SplitButton,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Breadcrumb,
  Skeleton,
  Alert,
  AlertTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  LoadingSpinner,
  Textarea,
  Calendar as SigilCalendar,
  DatePicker,
  DateRangePicker,
  Kbd,
  RatingGroup,
  type DateRange,
  SparkLine,
  AreaChart,
  CommitGrid,
} from "@sigil-ui/components";

import {
  Rocket,
  GitBranch,
  GitCommitHorizontal,
  CircleCheck,
  Clock,
  Palette,
  Moon,
  Layers,
  BarChart3,
  CalendarDays,
  Globe,
  FileText,
  ArrowUpRight,
  Building2,
  Mail,
  Plus,
  Sparkles,
  Crown,
  Check,
  Server,
  Eye,
  Radio,
  Shield,
  ChevronRight,
  CheckCircle2,
  Paintbrush,
  ArrowLeft,
  Archive,
  MoreHorizontal,
  Calendar,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Volume2,
  Bell,
  Wifi,
  Zap,
  Info,
  AudioLines,
  ArrowUp,
  RefreshCw,
  Link,
  AtSign,
  CircleCheckBig,
  Send,
  Loader2,
} from "@/components/icons";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function createDemoDate(): Date {
  return new Date(2026, 3, 24);
}

/* ================================================================ */
/*  Deploy cards                                                      */
/* ================================================================ */

function DeployCard() {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Rocket size={14} className="text-[var(--s-primary)]" />
            Deploy to Production
          </CardTitle>
          <Badge size="sm" className="gap-1"><Radio size={9} />Live</Badge>
        </div>
        <CardDescription className="text-[10px]">Select the target for this deployment.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <RadioGroup defaultValue="production" className="gap-1.5">
          {[
            { value: "production", label: "Production", desc: "Public-facing. Requires approval.", icon: <Globe size={12} className="text-[var(--s-text-muted)]" /> },
            { value: "staging", label: "Staging", desc: "Internal testing environment.", icon: <Eye size={12} className="text-[var(--s-text-muted)]" /> },
            { value: "preview", label: "Preview", desc: "Ephemeral per-PR deployment.", icon: <Server size={12} className="text-[var(--s-text-muted)]" /> },
          ].map((env) => (
            <label key={env.value} className="flex items-start gap-2.5 p-2 cursor-pointer" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
              <div className="flex-1">
                <span className="text-[11px] font-medium text-[var(--s-text)] flex items-center gap-1">{env.icon}{env.label}</span>
                <p className="text-[9px] text-[var(--s-text-muted)] mt-0.5 ml-4">{env.desc}</p>
              </div>
              <RadioGroupItem value={env.value} className="mt-0.5" />
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function BuildStatus() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-3">
        <Input defaultValue="main" className="h-8 text-xs font-mono" iconLeft={<GitBranch size={13} className="text-[var(--s-text-muted)]" />} />
        <div className="flex items-center gap-2 px-2 py-1.5 text-[9px] font-mono text-[var(--s-text-muted)]" style={{ border: "1px solid var(--s-border-muted)", borderRadius: "var(--s-radius-md, 6px)" }}>
          <GitCommitHorizontal size={12} className="shrink-0" />
          <span className="truncate">a3f9c2d — fix: token compiler edge case</span>
        </div>
        <div className="flex items-center gap-3">
          {["Types", "Lint", "Tests"].map((c) => (
            <span key={c} className="flex items-center gap-1 text-[10px] text-[var(--s-text)]">
              <CircleCheck size={11} className="text-[var(--s-success)]" />{c}
            </span>
          ))}
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] text-[var(--s-text)]">Build complete</span>
            <span className="text-[10px] text-[var(--s-success)]">100%</span>
          </div>
          <Progress value={100} className="h-1" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 text-xs"><Rocket size={13} />Deploy Now</Button>
          <Button size="sm" variant="outline" className="text-xs">Cancel</Button>
        </div>
        <p className="text-[9px] text-[var(--s-text-muted)] flex items-center gap-1"><Clock size={9} />Last deployed 4m ago</p>
      </CardContent>
    </Card>
  );
}

/* ================================================================ */
/*  Token cards                                                       */
/* ================================================================ */

function TokenEditorCard() {
  const [radius, setRadius] = useState(8);
  const [spacing, setSpacing] = useState(4);

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Palette size={14} className="text-[var(--s-primary)]" />
            Edit Tokens
          </CardTitle>
          <Badge size="sm" variant="secondary" className="font-mono text-[8px]">sigil.tokens.md</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-[10px]">Primary Color</Label>
          <div className="relative">
            <Input defaultValue="oklch(0.65 0.18 275)" className="h-8 text-[11px] font-mono pl-7" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: "var(--s-primary)", border: "1px solid var(--s-border)" }} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[10px]">Display Font</Label>
          <Select defaultValue="monument">
            <SelectTrigger className="h-8 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="monument" className="text-[11px]">Monument Grotesk</SelectItem>
              <SelectItem value="inter" className="text-[11px]">Inter</SelectItem>
              <SelectItem value="geist" className="text-[11px]">Geist</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <Label className="text-[10px]">Card Radius</Label>
            <Badge size="sm" variant="outline" className="text-[8px] font-mono tabular-nums">{radius}px</Badge>
          </div>
          <Slider defaultValue={[8]} min={0} max={24} step={1} onValueChange={(v: number[]) => setRadius(v[0])} />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[10px]">Base Spacing</Label>
          <NumberField value={spacing} onValueChange={setSpacing} min={2} max={12} step={1} />
        </div>
      </CardContent>
    </Card>
  );
}

function TokenPreviewCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] flex items-center gap-1.5">
            <Moon size={12} className="text-[var(--s-text-muted)]" />
            Dark Mode
          </Label>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)", background: "var(--s-surface)" }}>
          <span className="text-[11px] font-medium text-[var(--s-text)] flex items-center gap-1.5">
            <Layers size={12} className="text-[var(--s-text-muted)]" />
            Preview
          </span>
          <p className="text-[9px] text-[var(--s-text-muted)] mt-1">Token-driven styling. Changes apply everywhere.</p>
        </div>
        <KPI label="Tokens compiled" value="519" change="All passing" trend="up" className="text-xs" />
      </CardContent>
    </Card>
  );
}

/* ================================================================ */
/*  Analytics cards                                                   */
/* ================================================================ */

function AnalyticsKPIs() {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <BarChart3 size={14} className="text-[var(--s-primary)]" />
            Project Analytics
          </CardTitle>
          <Badge size="sm" variant="outline" className="gap-1 text-[8px]"><CalendarDays size={9} />Last 7 days</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <KPI label="Visitors" value="12.4k" change="+14%" trend="up" className="text-xs" />
          <KPI label="Conversion" value="3.2%" change="+0.8%" trend="up" className="text-xs" />
        </div>
        <Meter value={7200} max={10000} label="API Usage" className="text-xs" />
        <p className="text-[9px] text-[var(--s-text-muted)] -mt-1">7,200 / 10,000 requests this cycle.</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsTable() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--s-text-muted)]" style={{ borderBottom: "1px solid var(--s-border-muted)", background: "var(--s-surface)" }}>
        <span>Page</span><span className="text-right">Views</span><span className="text-right">Bounce</span>
      </div>
      {[
        { page: "/", views: "4,821", bounce: "32%" },
        { page: "/docs", views: "3,104", bounce: "18%" },
        { page: "/pricing", views: "1,247", bounce: "45%" },
      ].map((row) => (
        <div key={row.page} className="grid grid-cols-3 px-3 py-1.5 text-[10px]" style={{ borderBottom: "1px solid var(--s-border-muted)" }}>
          <span className="font-mono text-[var(--s-text)]">{row.page}</span>
          <span className="text-right tabular-nums text-[var(--s-text)]">{row.views}</span>
          <span className="text-right tabular-nums text-[var(--s-text-muted)]">{row.bounce}</span>
        </div>
      ))}
    </Card>
  );
}

function ActivityFeed() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-3">
        {[
          { src: "/avatars/kevin.png", name: "Kevin", text: "Kevin pushed 3 commits to main", time: "2m ago" },
          { src: "/avatars/ci.png", name: "CI", text: "Build #847 deployed to production", time: "5m ago" },
        ].map((item) => (
          <div key={item.text} className="flex items-start gap-2">
            <Avatar src={item.src} name={item.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--s-text)] leading-snug">{item.text}</p>
              <span className="text-[9px] text-[var(--s-text-muted)]">{item.time}</span>
            </div>
          </div>
        ))}
        <Button size="sm" variant="outline" className="w-full text-[10px] gap-1">
          <FileText size={12} />View Full Report<ArrowUpRight size={10} className="text-[var(--s-text-muted)] ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );
}

/* ================================================================ */
/*  Onboarding cards                                                  */
/* ================================================================ */

function OnboardingStepper() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-3">
        <Stepper
          steps={[
            { label: "Account", description: "Created" },
            { label: "Workspace", description: "Configure" },
            { label: "Invite", description: "Team" },
          ]}
          currentStep={1}
          orientation="horizontal"
          className="text-[9px]"
        />
        <div className="flex flex-col gap-1">
          <Label className="text-[10px]">Workspace Name</Label>
          <Input defaultValue="acme-design" className="h-8 text-[11px] font-mono" iconLeft={<Building2 size={13} className="text-[var(--s-text-muted)]" />} />
          <p className="text-[9px] text-[var(--s-text-muted)]">This will be your team URL slug.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PlanSelector() {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xs">Plan</CardTitle>
        <CardDescription className="text-[9px]">Choose the plan that fits your needs.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="flex flex-col items-start p-2.5 text-left cursor-pointer bg-transparent" style={{ border: "1px solid var(--s-border-muted)", borderRadius: "var(--s-radius-md, 6px)" }}>
            <span className="text-[11px] font-medium text-[var(--s-text)]">Free</span>
            <span className="text-[9px] text-[var(--s-text-muted)]">5 components</span>
          </button>
          <button type="button" className="flex flex-col items-start p-2.5 text-left cursor-pointer bg-transparent relative" style={{ border: "2px solid var(--s-primary)", borderRadius: "var(--s-radius-md, 6px)" }}>
            <Badge size="sm" className="absolute -top-2 right-1.5 text-[7px] gap-0.5 px-1"><Crown size={7} />Rec</Badge>
            <span className="text-[11px] font-medium text-[var(--s-text)] flex items-center gap-1"><Sparkles size={11} className="text-[var(--s-primary)]" />Pro</span>
            <span className="text-[9px] text-[var(--s-text-muted)]">Unlimited everything</span>
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <Checkbox label="Unlimited components" defaultChecked />
          <Checkbox label="Custom presets" defaultChecked />
          <Checkbox label="Priority support" />
        </div>
      </CardContent>
    </Card>
  );
}

function InviteCard() {
  return (
    <Card className="w-full" style={{ "--avatar-group-ring": "var(--s-surface, var(--s-background))" } as React.CSSProperties}>
      <CardContent className="p-4 flex flex-col gap-3">
        <Label className="text-[10px]">Invite Teammates</Label>
        <div className="flex gap-2">
          <Input placeholder="colleague@company.com" className="h-8 text-[11px] flex-1" iconLeft={<Mail size={12} className="text-[var(--s-text-muted)]" />} />
          <Button size="sm" variant="outline" className="text-[10px] h-8 shrink-0"><Plus size={13} />Add</Button>
        </div>
        <div className="flex items-center gap-2">
          <AvatarGroup>
            <Avatar src="https://github.com/shadcn.png" name="shadcn" size="sm" />
            <Avatar src="https://github.com/leerob.png" name="Lee Robinson" size="sm" />
            <Avatar src="https://github.com/rauchg.png" name="Guillermo Rauch" size="sm" />
          </AvatarGroup>
          <span className="text-[9px] text-[var(--s-text-muted)]">+2 more invited</span>
        </div>
        <Button size="sm" className="w-full text-xs"><Check size={13} />Complete Setup</Button>
        <p className="text-[9px] text-[var(--s-text-muted)] text-center">You can change these settings later.</p>
      </CardContent>
    </Card>
  );
}

/* ================================================================ */
/*  Standalone micro-components (no card wrapper)                     */
/* ================================================================ */

function ToolbarRow() {
  return (
    <Toolbar className="w-full">
      <ToolbarButton aria-label="Go back"><ArrowLeft size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton className="text-[11px]">Archive</ToolbarButton>
      <ToolbarButton className="text-[11px]">Report</ToolbarButton>
      <ToolbarButton className="text-[11px]">Snooze</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="More"><MoreHorizontal size={14} /></ToolbarButton>
    </Toolbar>
  );
}

function ToggleGroupRow() {
  return (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="bold" size="sm"><Bold size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="italic" size="sm"><Italic size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="underline" size="sm"><Underline size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="left" size="sm"><AlignLeft size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="center" size="sm"><AlignCenter size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="right" size="sm"><AlignRight size={14} /></ToggleGroupItem>
    </ToggleGroup>
  );
}

function BadgeRow() {
  return (
    <div className="flex flex-wrap gap-1.5 p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <Badge size="sm">Stable</Badge>
      <Badge size="sm" variant="secondary">Beta</Badge>
      <Badge size="sm" variant="outline">v2.4.1</Badge>
      <Badge size="sm" variant="destructive">Breaking</Badge>
    </div>
  );
}

function SliderRow() {
  const [vol, setVol] = useState(72);
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
          <Volume2 size={13} className="text-[var(--s-text-muted)]" />
          Volume
        </span>
        <span className="text-[10px] tabular-nums text-[var(--s-text-muted)]">{vol}%</span>
      </div>
      <Slider defaultValue={[72]} onValueChange={(v: number[]) => setVol(v[0])} />
    </div>
  );
}

function VerifiedRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <CheckCircle2 size={13} className="text-[var(--s-success)]" />
        Your profile has been verified.
      </span>
      <ChevronRight size={13} className="text-[var(--s-text-muted)]" />
    </div>
  );
}

function CheckboxRow() {
  return (
    <div className="p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <Checkbox label="I agree to the terms and conditions" defaultChecked />
    </div>
  );
}

function TabsRow() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="h-7 p-0.5 w-full">
        <TabsTrigger value="overview" className="text-[10px] px-2 py-0.5 h-6 flex-1">Overview</TabsTrigger>
        <TabsTrigger value="analytics" className="text-[10px] px-2 py-0.5 h-6 flex-1">Analytics</TabsTrigger>
        <TabsTrigger value="reports" className="text-[10px] px-2 py-0.5 h-6 flex-1">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center gap-2">
        <Skeleton variant="avatar" className="h-7 w-7" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    </div>
  );
}

function TwoFactorRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Shield size={13} className="text-[var(--s-text-muted)]" />
        Two-factor authentication
      </span>
      <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">Enable</Button>
    </div>
  );
}

function ProgressRow() {
  return (
    <div className="flex flex-col gap-1.5 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] text-[var(--s-text)]">Uploading assets...</span>
        <span className="text-[10px] tabular-nums text-[var(--s-text-muted)]">68%</span>
      </div>
      <Progress value={68} className="h-1.5" />
    </div>
  );
}

function PaginationRow() {
  return (
    <div className="flex flex-col gap-3">
      <Pagination currentPage={1} totalPages={3} siblingCount={1} />
      <SplitButton icon={<Calendar size={13} />}>Copilot</SplitButton>
    </div>
  );
}

function AvatarStackRow() {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--s-background)]" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <AvatarGroup max={4}>
        <Avatar src="https://github.com/shadcn.png" name="shadcn" size="sm" />
        <Avatar src="https://github.com/rauchg.png" name="Guillermo Rauch" size="sm" />
        <Avatar src="https://github.com/leerob.png" name="Lee Robinson" size="sm" />
        <Avatar src="https://github.com/t3dotgg.png" name="Theo" size="sm" />
        <Avatar src="https://github.com/kentcdodds.png" name="Kent C. Dodds" size="sm" />
        <Avatar src="https://github.com/gaearon.png" name="Dan Abramov" size="sm" />
      </AvatarGroup>
      <span className="text-[9px] text-[var(--s-text-muted)]">6 online</span>
    </div>
  );
}

function BreadcrumbRow() {
  return (
    <div className="p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <Breadcrumb items={[{ label: "Docs", href: "/docs" }, { label: "Theming", href: "/docs/theming" }, { label: "Tokens" }]} />
    </div>
  );
}

function SearchRow() {
  return (
    <Input
      placeholder="Search components..."
      className="h-8 text-[11px]"
      iconLeft={<Search size={13} className="text-[var(--s-text-muted)]" />}
    />
  );
}

function GPUCounterRow() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[11px] font-medium text-[var(--s-text)]">Number of GPUs</span>
        <p className="text-[9px] text-[var(--s-text-muted)] mt-0.5">You can add more later.</p>
      </div>
      <NumberField value={8} min={1} max={64} />
    </div>
  );
}

function TintingRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div>
        <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
          <Paintbrush size={13} className="text-[var(--s-text-muted)]" />
          Wallpaper Tinting
        </span>
        <p className="text-[9px] text-[var(--s-text-muted)] mt-0.5 ml-[21px]">Allow the wallpaper to be tinted.</p>
      </div>
      <Switch defaultChecked />
    </div>
  );
}

function NotificationsRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Bell size={13} className="text-[var(--s-text-muted)]" />
        Push notifications
      </span>
      <Switch defaultChecked />
    </div>
  );
}

function WifiRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Wifi size={13} className="text-[var(--s-text-muted)]" />
        Auto-connect to Wi-Fi
      </span>
      <Switch />
    </div>
  );
}

function AlertRow() {
  return (
    <Alert variant="info" className="p-2.5 [&>svg~*]:pl-0 [&:has(svg)]:pl-2.5">
      <AlertTitle className="text-[10px] flex items-center gap-1.5 mb-0">
        <Info size={12} />
        New deployment pipeline available.
      </AlertTitle>
    </Alert>
  );
}

function ButtonRow() {
  return (
    <div className="flex gap-1.5">
      <Button size="sm" className="flex-1 text-[10px]">Save</Button>
      <Button size="sm" variant="outline" className="flex-1 text-[10px]">Discard</Button>
      <Button size="sm" variant="ghost" className="text-[10px]">Reset</Button>
    </div>
  );
}

function StarRatingRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)]">Rate this component</span>
      <RatingGroup defaultValue={4} size="sm" />
    </div>
  );
}

const SHOWCASE_SPINNERS: { variant: string; label: string }[] = [
  { variant: "braille", label: "braille" },
  { variant: "dots2", label: "dots2" },
  { variant: "arc", label: "arc" },
  { variant: "triangle", label: "triangle" },
  { variant: "snake", label: "snake" },
  { variant: "wave", label: "wave" },
  { variant: "noise", label: "noise" },
  { variant: "sparkle", label: "sparkle" },
  { variant: "moon", label: "moon" },
  { variant: "clock", label: "clock" },
  { variant: "grow_horizontal", label: "grow" },
  { variant: "circle_halves", label: "halves" },
  { variant: "rain", label: "rain" },
  { variant: "bar", label: "bar" },
  { variant: "helix", label: "helix" },
  { variant: "square_corners", label: "square" },
];

function SpinnersShowcase() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[var(--s-text)]">Animated Spinners</span>
        <span className="text-[9px] text-[var(--s-text-muted)]">55+ variants</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {SHOWCASE_SPINNERS.map((s) => (
          <div key={s.variant} className="flex flex-col items-center gap-1 py-1.5" style={{ background: "var(--s-surface-sunken, var(--s-background))", borderRadius: "var(--s-radius-sm, 4px)" }}>
            <span className="inline-block text-base leading-none text-[var(--s-primary)]" aria-hidden>
              <AnimatedSpinnerFrame variant={s.variant} />
            </span>
            <span className="font-mono text-[7px] text-[var(--s-text-muted)] leading-none">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedSpinnerFrame({ variant }: { variant: string }) {
  const [frame, setFrame] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [ms, setMs] = useState(80);

  useEffect(() => {
    const SPINNERS: Record<string, { frames: string[]; interval: number }> = {
      braille:   { frames: ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"], interval: 80 },
      dots2:     { frames: ["⣾","⣽","⣻","⢿","⡿","⣟","⣯","⣷"], interval: 80 },
      arc:       { frames: ["◜","◠","◝","◞","◡","◟"], interval: 100 },
      triangle:  { frames: ["◢","◣","◤","◥"], interval: 50 },
      snake:     { frames: ["⠏","⠛","⠹","⢸","⣰","⣤","⣆","⡇"], interval: 80 },
      wave:      { frames: ["⠁⠂⠄⡀","⠂⠄⡀⢀","⠄⡀⢀⠠","⡀⢀⠠⠐","⢀⠠⠐⠈","⠠⠐⠈⠁","⠐⠈⠁⠂","⠈⠁⠂⠄"], interval: 100 },
      noise:     { frames: ["▓","▒","░","▒"], interval: 100 },
      sparkle:   { frames: ["✶","✷","✸","✹","✺","✹","✷"], interval: 120 },
      moon:      { frames: ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"], interval: 150 },
      clock:     { frames: ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛"], interval: 100 },
      grow_horizontal: { frames: ["▏","▎","▍","▌","▋","▊","▉","█","▉","▊","▋","▌","▍","▎"], interval: 80 },
      circle_halves:   { frames: ["◐","◓","◑","◒"], interval: 120 },
      rain:      { frames: ["⠁","⠂","⠄","⡀","⡈","⡐","⡠","⣀","⣁","⣂","⣄","⣌","⣔","⣤","⣥","⣦","⣮","⣶","⣷","⣿","⡿","⠿","⢟","⠟","⠏","⠇","⠃","⠁"], interval: 50 },
      bar:       { frames: ["|","/","—","\\"], interval: 100 },
      helix:     { frames: ["⠋⠁","⠙⠂","⠹⠄","⢸⡀","⣰⢀","⣤⠠","⣆⠐","⡇⠈"], interval: 80 },
      square_corners: { frames: ["◰","◳","◲","◱"], interval: 120 },
    };
    const s = SPINNERS[variant] ?? SPINNERS.braille;
    setFrames(s.frames);
    setMs(s.interval);
  }, [variant]);

  useEffect(() => {
    if (frames.length === 0) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), ms);
    return () => clearInterval(id);
  }, [frames, ms]);

  if (frames.length === 0) return null;
  return <>{frames[frame % frames.length]}</>;
}

function StatusBadgesRow() {
  return (
    <div className="flex gap-1.5">
      <Badge size="sm" className="gap-1 text-[10px]"><Loader2 size={10} className="animate-spin" />Syncing</Badge>
      <Badge size="sm" variant="outline" className="gap-1 text-[10px]"><RefreshCw size={10} />Updating</Badge>
      <Badge size="sm" variant="outline" className="gap-1 text-[10px]"><Loader2 size={10} className="animate-spin" />Indexing</Badge>
    </div>
  );
}

function ChatInputRow() {
  const [draft, setDraft] = useState("");
  const [attached, setAttached] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recDuration, setRecDuration] = useState(0);
  const [sentFlash, setSentFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) {
      setRecDuration(0);
      return;
    }
    const start = performance.now();
    const id = window.setInterval(() => {
      setRecDuration(Math.floor((performance.now() - start) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [recording]);

  const hasText = draft.trim().length > 0;
  const hasContent = hasText || attached;
  const submitMode = hasContent || recording;

  const send = () => {
    if (!submitMode) return;
    setRecording(false);
    setDraft("");
    setAttached(false);
    setSentFlash(true);
    window.setTimeout(() => setSentFlash(false), 1200);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="flex items-center gap-2 p-1.5 pl-1 cursor-text transition-colors duration-[var(--s-duration-fast,150ms)] focus-within:border-[var(--s-primary)]"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
      }}
      onClick={() => !recording && inputRef.current?.focus()}
    >
      {/* Local keyframes for the recording pulse + waveform bars. */}
      <style>{`
        @keyframes hsr-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes hsr-wave {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
      `}</style>
      <button
        type="button"
        aria-label={attached ? "Remove attachment" : "Add attachment"}
        onClick={(e) => {
          e.stopPropagation();
          if (recording) return;
          setAttached((p) => !p);
        }}
        disabled={recording}
        className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-all duration-[var(--s-duration-fast,150ms)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--s-surface-elevated)]"
        style={{
          border: "1px solid var(--s-border)",
          color: attached ? "var(--s-primary)" : "var(--s-text-muted)",
          background: attached
            ? "color-mix(in oklch, var(--s-primary) 12%, transparent)"
            : "transparent",
        }}
      >
        <Plus
          size={14}
          style={{
            transform: attached ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform var(--s-duration-fast, 150ms) ease-out",
          }}
        />
      </button>

      {recording ? (
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: "var(--s-error, oklch(0.62 0.22 22))",
              animation: "hsr-pulse-dot 1.2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[10px] font-[family-name:var(--s-font-mono)] tabular-nums shrink-0"
            style={{ color: "var(--s-text)" }}
          >
            {formatDuration(recDuration)}
          </span>
          <div
            className="flex-1 flex items-center justify-center gap-[2px]"
            style={{ height: 14 }}
            aria-hidden
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="block flex-1 rounded-full"
                style={{
                  height: "100%",
                  maxWidth: 2,
                  background: "color-mix(in oklch, var(--s-error, oklch(0.62 0.22 22)) 70%, transparent)",
                  transformOrigin: "center",
                  animation: `hsr-wave ${0.6 + (i % 5) * 0.12}s ease-in-out ${i * -0.07}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ) : sentFlash ? (
        <span
          className="flex-1 text-[11px] flex items-center gap-1.5"
          style={{ color: "var(--s-success)" }}
        >
          <span aria-hidden>✓</span>
          Sent
        </span>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={attached ? "1 file attached — add a note" : "Send a message..."}
          className="flex-1 min-w-0 bg-transparent outline-none text-[11px] text-[var(--s-text)] placeholder:text-[var(--s-text-muted)]"
          aria-label="Send a message"
        />
      )}

      <button
        type="button"
        aria-label={
          recording
            ? "Stop recording and send"
            : submitMode
              ? "Send message"
              : "Start voice recording"
        }
        onClick={(e) => {
          e.stopPropagation();
          if (submitMode) send();
          else setRecording(true);
        }}
        className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full transition-all duration-[var(--s-duration-fast,150ms)] cursor-pointer"
        style={{
          background: submitMode
            ? recording
              ? "var(--s-error, oklch(0.62 0.22 22))"
              : "var(--s-text)"
            : "transparent",
          color: submitMode ? "var(--s-background)" : "var(--s-text-muted)",
        }}
      >
        {submitMode ? <ArrowUp size={14} /> : <AudioLines size={14} />}
      </button>
    </div>
  );
}

function PriceRangeRow() {
  const [range, setRange] = useState([200, 800]);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-[11px] font-semibold text-[var(--s-text)]">Price Range</span>
        <p className="text-[9px] text-[var(--s-text-muted)] mt-0.5">Set your budget range (${range[0]} – ${range[1]}).</p>
      </div>
      <Slider defaultValue={[200, 800]} min={0} max={1000} step={50} onValueChange={(v: number[]) => setRange(v)} />
    </div>
  );
}

// Static index of fake "components" the search input filters over. Twelve
// items so the empty-query state still reads "12 results".
const SEARCH_INDEX = [
  "Button", "Card", "Input", "Select", "Switch", "Tabs",
  "Avatar", "Badge", "Tooltip", "Dialog", "Slider", "Calendar",
];

function SearchCountRow() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = query.trim()
    ? SEARCH_INDEX.filter((name) => name.toLowerCase().includes(query.toLowerCase().trim()))
    : SEARCH_INDEX;
  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="flex items-center gap-2 h-9 px-3 cursor-text transition-colors duration-[var(--s-duration-fast,150ms)] focus-within:border-[var(--s-primary)]"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <Search size={13} className="text-[var(--s-text-muted)] shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1 min-w-0 bg-transparent outline-none text-[11px] text-[var(--s-text)] placeholder:text-[var(--s-text-muted)]"
        aria-label="Search components"
      />
      {hasQuery && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={(e) => {
            e.stopPropagation();
            setQuery("");
            inputRef.current?.focus();
          }}
          className="inline-flex items-center justify-center w-4 h-4 shrink-0 rounded-[var(--s-radius-sm,2px)] text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_10%,transparent)] cursor-pointer transition-colors duration-[var(--s-duration-fast,150ms)]"
        >
          <span aria-hidden style={{ fontSize: 11, lineHeight: 1 }}>×</span>
        </button>
      )}
      <span
        className="text-[10px] tabular-nums shrink-0 transition-colors duration-[var(--s-duration-fast,150ms)]"
        style={{
          color:
            hasQuery && matches.length === 0
              ? "var(--s-warning)"
              : "var(--s-text-muted)",
        }}
        aria-live="polite"
      >
        {matches.length === 0 ? "no matches" : `${matches.length} ${matches.length === 1 ? "result" : "results"}`}
      </span>
    </div>
  );
}

function UrlInputRow() {
  return (
    <div className="flex items-center gap-2 h-9 px-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text-muted)] shrink-0">https://</span>
      <span className="flex-1 text-[11px] text-[var(--s-text)]">example.com</span>
      <Link size={13} className="text-[var(--s-text-muted)] shrink-0" />
    </div>
  );
}

const AI_MODELS = ["Auto", "GPT-5", "Claude", "Gemini"] as const;
const AI_MAX_CHARS = 1200;

function AiChatRow() {
  const [draft, setDraft] = useState("");
  const [modelIdx, setModelIdx] = useState(0);
  const [attached, setAttached] = useState<string | null>(null);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = draft.trim().length > 0;
  // Token meter: combine the prompt length with a notional cost for any
  // attachment so the bar reacts to both inputs.
  const usedChars = draft.length + (attached ? 320 : 0);
  const usedPct = Math.min(100, Math.round((usedChars / AI_MAX_CHARS) * 100));
  const overLimit = usedPct >= 95;

  const send = () => {
    if (!hasContent) return;
    setLastSent(draft.trim());
    setDraft("");
    setAttached(null);
    // Auto-clear the "sent" toast after a moment so the demo cycles back.
    window.setTimeout(() => setLastSent(null), 1800);
    textareaRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter or plain Enter (without shift) submits.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
        overflow: "hidden",
      }}
    >
      <div className="p-2.5 pb-3">
        {lastSent ? (
          <div
            className="text-[10px] flex items-center gap-1.5"
            style={{ color: "var(--s-success)" }}
          >
            <span aria-hidden>✓</span>
            <span className="truncate">Sent: "{lastSent}"</span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, AI_MAX_CHARS))}
            onKeyDown={onKeyDown}
            placeholder="Ask, Search or Chat..."
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-[11px] text-[var(--s-text)] placeholder:text-[var(--s-text-muted)] leading-tight"
            style={{ minHeight: 16, maxHeight: 60 }}
            aria-label="Compose message"
          />
        )}
        {attached && (
          <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 font-[family-name:var(--s-font-mono)]"
            style={{
              color: "var(--s-text)",
              background: "color-mix(in oklch, var(--s-primary) 10%, transparent)",
              border: "1px solid color-mix(in oklch, var(--s-primary) 30%, transparent)",
              borderRadius: "var(--s-radius-sm, 3px)",
            }}
          >
            <span>📎</span>
            <span className="truncate max-w-[120px]">{attached}</span>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={() => setAttached(null)}
              className="ml-0.5 cursor-pointer text-[var(--s-text-muted)] hover:text-[var(--s-text)]"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-2.5 pb-2">
        <button
          type="button"
          aria-label="Attach file"
          onClick={() =>
            setAttached((prev) =>
              prev
                ? null
                : `screenshot-${Math.floor(Math.random() * 99) + 1}.png`,
            )
          }
          className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full cursor-pointer transition-colors duration-[var(--s-duration-fast,150ms)] hover:bg-[color-mix(in_oklch,var(--s-text)_8%,transparent)]"
          style={{
            border: "1px solid var(--s-border)",
            color: attached ? "var(--s-primary)" : "var(--s-text-muted)",
            background: attached
              ? "color-mix(in oklch, var(--s-primary) 12%, transparent)"
              : "transparent",
          }}
        >
          <Plus
            size={12}
            style={{
              transform: attached ? "rotate(45deg)" : "rotate(0deg)",
              transition:
                "transform var(--s-duration-fast, 150ms) ease-out",
            }}
          />
        </button>
        <button
          type="button"
          onClick={() => setModelIdx((i) => (i + 1) % AI_MODELS.length)}
          aria-label={`Model: ${AI_MODELS[modelIdx]}. Click to change.`}
          className="cursor-pointer"
        >
          <Badge size="sm" variant="outline" className="text-[9px]">
            {AI_MODELS[modelIdx]}
          </Badge>
        </button>
        <span className="flex-1" />
        <span
          className="text-[9px] tabular-nums font-[family-name:var(--s-font-mono)] transition-colors duration-[var(--s-duration-fast,150ms)]"
          style={{
            color: overLimit ? "var(--s-warning)" : "var(--s-text-muted)",
          }}
        >
          {usedPct}% used
        </span>
        <button
          type="button"
          onClick={send}
          disabled={!hasContent}
          aria-label="Send message"
          className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full cursor-pointer transition-all duration-[var(--s-duration-fast,150ms)] disabled:cursor-not-allowed"
          style={{
            background: hasContent
              ? "var(--s-text)"
              : "color-mix(in oklch, var(--s-text) 22%, transparent)",
            color: hasContent
              ? "var(--s-background)"
              : "var(--s-text-muted)",
            transform: hasContent ? "scale(1)" : "scale(0.96)",
            opacity: hasContent ? 1 : 0.7,
          }}
        >
          <ArrowUp size={12} />
        </button>
      </div>
    </div>
  );
}

function MentionRow() {
  return (
    <div className="flex items-center gap-2 h-9 px-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <a href="https://x.com/kevskgs" className="flex-1 text-[11px] text-[var(--s-text)]">@kevskgs</a>
      <CircleCheckBig size={14} className="text-[var(--s-text)] shrink-0" />
    </div>
  );
}

function DateRangeRow() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      numberOfMonths={1}
      className="w-full h-8 text-[10px]"
    />
  );
}

function TagInputRow() {
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const value = raw.trim().toLowerCase().replace(/[^a-z0-9.+#-]/g, "");
    if (!value) return;
    setTags((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setDraft("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((t) => t !== value));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      // Familiar tag-input UX: backspace on an empty input pops the
      // most-recent tag.
      e.preventDefault();
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div
      className="flex items-center flex-wrap gap-1.5 min-h-9 px-2 py-1 cursor-text transition-colors duration-[var(--s-duration-fast,150ms)] focus-within:border-[var(--s-primary)]"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          size="sm"
          variant="secondary"
          className="text-[9px] gap-0.5 shrink-0 pr-0.5"
        >
          <span>{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="inline-flex items-center justify-center w-3 h-3 rounded-[var(--s-radius-sm,2px)] cursor-pointer text-[var(--s-text-muted)] hover:text-[var(--s-text)] hover:bg-[color-mix(in_oklch,var(--s-text)_12%,transparent)] transition-colors duration-[var(--s-duration-fast,150ms)]"
          >
            <span aria-hidden style={{ fontSize: 11, lineHeight: 1 }}>×</span>
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft && addTag(draft)}
        placeholder={tags.length === 0 ? "Add tag..." : "Add..."}
        className="flex-1 min-w-[60px] bg-transparent outline-none text-[10px] text-[var(--s-text)] placeholder:text-[var(--s-text-muted)] px-1"
        aria-label="Add tag"
      />
    </div>
  );
}

function KeyValueRow() {
  return (
    <div className="flex flex-col gap-1.5">
      {[
        { key: "Status", value: "Active" },
        { key: "Region", value: "us-east-1" },
        { key: "Latency", value: "12ms" },
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between text-[10px] px-2.5 py-1" style={{ borderBottom: "1px solid var(--s-border-muted)" }}>
          <span className="text-[var(--s-text-muted)]">{item.key}</span>
          <span className="font-mono tabular-nums text-[var(--s-text)]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function MeterRow() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <Meter value={82} max={100} label="Memory" className="text-xs" />
      <Meter value={34} max={100} label="CPU" className="text-xs" />
    </div>
  );
}

function CalendarCard() {
  const [selected, setSelected] = useState<Date | undefined>(() => createDemoDate());
  return (
    <SigilCalendar
      mode="single"
      selected={selected}
      onSelect={setSelected}
      captionLayout="dropdown"
      className="p-2 w-full [--cell-size:1.5rem] [&_table]:w-full [&_table]:text-[10px] [&_button]:text-[10px] [&_th]:text-[8px] [&_td]:p-0.5 [&_select]:text-[10px] [&_.rdp-dropdowns]:text-[10px] [&_.rdp-dropdown_root]:text-[10px] [&_.rdp-caption_label]:text-[10px]"
    />
  );
}

function DatePickerRow() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[10px] flex items-center gap-1.5">
        <CalendarDays size={12} className="text-[var(--s-text-muted)]" />
        Deploy Date
      </Label>
      <DatePicker value={date} onValueChange={setDate} className="w-full h-8 text-[10px]" />
    </div>
  );
}

function RatingRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)]">Design quality</span>
      <RatingGroup defaultValue={4} size="sm" />
    </div>
  );
}

function KbdShortcutRow() {
  return (
    <div className="flex items-center justify-between p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[10px] text-[var(--s-text-muted)]">Quick search</span>
      <div className="flex items-center gap-0.5"><Kbd className="text-[9px] h-5 min-w-[20px]">⌘</Kbd><Kbd className="text-[9px] h-5 min-w-[20px]">K</Kbd></div>
    </div>
  );
}

function UptimeRow() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[var(--s-text)]">Uptime — 30d</span>
        <span className="text-[9px] font-mono tabular-nums text-[var(--s-success)]">99.98%</span>
      </div>
      <div className="flex gap-px">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="flex-1 h-3 rounded-[1px]" style={{ background: i === 17 ? "var(--s-warning)" : "var(--s-success)", opacity: i === 17 ? 1 : 0.7 }} />
        ))}
      </div>
    </div>
  );
}

function LatencyRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Zap size={13} className="text-[var(--s-success)]" />
        p99 Latency
      </span>
      <span className="text-[10px] font-mono tabular-nums text-[var(--s-text)]">12ms</span>
    </div>
  );
}

function ErrorRateRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Shield size={13} className="text-[var(--s-text-muted)]" />
        Error rate
      </span>
      <span className="text-[10px] font-mono tabular-nums text-[var(--s-success)]">0.02%</span>
    </div>
  );
}

function CacheHitRow() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] text-[var(--s-text)]">Cache Hit Rate</span>
        <span className="text-[9px] font-mono tabular-nums text-[var(--s-success)]">94%</span>
      </div>
      <Progress value={94} className="h-1.5" />
    </div>
  );
}

function LatencyBuildRow() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col items-center justify-center p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
        <span className="text-[9px] text-[var(--s-text-muted)] flex items-center gap-1"><Zap size={10} />p99</span>
        <span className="text-sm font-mono tabular-nums font-semibold text-[var(--s-text)]">12ms</span>
      </div>
      <div className="flex flex-col items-center justify-center p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
        <span className="text-[9px] text-[var(--s-text-muted)] flex items-center gap-1"><Rocket size={10} />Builds</span>
        <span className="text-sm font-mono tabular-nums font-semibold text-[var(--s-text)]">47</span>
      </div>
    </div>
  );
}

function VoronoiRow() {
  return (
    <div className="w-full overflow-hidden flex-1 min-h-[100px]" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="grid grid-cols-5 grid-rows-3 gap-px h-full" style={{ background: "var(--s-border)" }}>
        <div className="col-span-2 row-span-3" style={{ background: "var(--s-primary)", opacity: 0.8 }} />
        <div className="col-span-2 row-span-2" style={{ background: "var(--s-surface)" }} />
        <div className="row-span-3" style={{ background: "color-mix(in oklch, var(--s-primary) 20%, var(--s-surface))" }} />
        <div style={{ background: "var(--s-surface)" }} />
        <div style={{ background: "color-mix(in oklch, var(--s-primary) 40%, var(--s-surface))" }} />
      </div>
    </div>
  );
}

function FontStackRow() {
  return (
    <div className="flex items-center justify-between p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[10px] text-[var(--s-text)] flex items-center gap-1.5">
        <Palette size={12} className="text-[var(--s-text-muted)]" />
        Font triad
      </span>
      <span className="text-[9px] font-mono text-[var(--s-text-muted)] truncate ml-2">Pangram · Mono · Display</span>
    </div>
  );
}

function ErrorActiveRow() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col items-center justify-center p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
        <span className="text-[9px] text-[var(--s-text-muted)] flex items-center gap-1"><Shield size={10} />Errors</span>
        <span className="text-sm font-mono tabular-nums font-semibold text-[var(--s-success)]">0.02%</span>
      </div>
      <div className="flex flex-col items-center justify-center p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
        <span className="text-[9px] text-[var(--s-text-muted)] flex items-center gap-1"><Eye size={10} />Active</span>
        <span className="text-sm font-mono tabular-nums font-semibold text-[var(--s-text)]">1,247</span>
      </div>
    </div>
  );
}

function SkeletonCardRow() {
  return (
    <div className="flex flex-col gap-2.5 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-5/6" />
    </div>
  );
}

function RadiusPreviewRow() {
  return (
    <div className="flex items-center gap-2 p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[9px] text-[var(--s-text-muted)]">Radius</span>
      {[0, 4, 8, 16, 9999].map((r) => (
        <div key={r} className="w-5 h-5 bg-[var(--s-primary)]" style={{ borderRadius: r, opacity: r === 8 ? 1 : 0.3 }} />
      ))}
      <span className="text-[8px] font-mono text-[var(--s-text-muted)] ml-auto">8px</span>
    </div>
  );
}

function SpacingScaleRow() {
  const tokens = [
    { name: "xs", value: 4 },
    { name: "sm", value: 8 },
    { name: "md", value: 12 },
    { name: "lg", value: 16 },
    { name: "xl", value: 24 },
    { name: "2xl", value: 32 },
  ] as const;
  const maxValue = tokens[tokens.length - 1].value;

  return (
    <div
      className="flex flex-col gap-2.5 p-3 flex-1"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-medium text-[var(--s-text)]">
          Spacing Scale
        </span>
        <span className="text-[7px] font-[family-name:var(--s-font-mono)] text-[var(--s-text-muted)] tracking-[0.16em] uppercase">
          px
        </span>
      </div>
      {/* Bars row — fixed pixel height so the visual proportions are
          predictable and the smallest token (4) still renders visibly. */}
      <div className="grid grid-cols-6 gap-1.5 items-end" style={{ height: 64 }}>
        {tokens.map((t) => {
          const heightPct = (t.value / maxValue) * 100;
          return (
            <div
              key={t.name}
              className="flex flex-col items-center justify-end gap-1 h-full min-w-0"
            >
              <span
                className="text-[8px] font-[family-name:var(--s-font-mono)] tabular-nums leading-none"
                style={{ color: "var(--s-text)" }}
              >
                {t.value}
              </span>
              <div
                className="w-full"
                style={{
                  height: `${heightPct}%`,
                  // Saturated cap on top fading to a softer body — each
                  // bar reads as a stacked token, not a flat block.
                  background:
                    "linear-gradient(180deg," +
                    " color-mix(in oklch, var(--s-primary) 78%, transparent) 0%," +
                    " color-mix(in oklch, var(--s-primary) 30%, transparent) 100%)",
                  borderTop: "1.5px solid var(--s-primary)",
                  borderRadius:
                    "var(--s-radius-sm, 2px) var(--s-radius-sm, 2px) 0 0",
                  boxShadow:
                    "inset 0 1px 0 color-mix(in oklch, var(--s-primary) 25%, transparent)",
                }}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
      {/* Baseline + token names. Token names sit BELOW the baseline so the
          bars rest on a single ruler line, like architectural drawings. */}
      <div className="relative grid grid-cols-6 gap-1.5">
        <div
          className="absolute left-0 right-0 -top-2 h-px"
          style={{ background: "var(--s-border)" }}
          aria-hidden
        />
        {tokens.map((t) => (
          <span
            key={t.name}
            className="text-[7px] font-[family-name:var(--s-font-mono)] uppercase tracking-[0.12em] leading-none text-center"
            style={{ color: "var(--s-text-muted)" }}
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SessionCountRow() {
  return (
    <div className="flex items-center justify-between p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[10px] text-[var(--s-text)] flex items-center gap-1.5">
        <Globe size={12} className="text-[var(--s-primary)]" />
        Sessions today
      </span>
      <span className="text-[10px] font-mono tabular-nums font-semibold text-[var(--s-text)]">3,842</span>
    </div>
  );
}

function RegionBadgesRow() {
  return (
    <div className="flex flex-wrap gap-1.5 p-2.5" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      {["us-east-1", "eu-west-1", "ap-south-1"].map((r) => (
        <Badge key={r} size="sm" variant="outline" className="text-[8px] font-mono gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--s-success)]" />{r}
        </Badge>
      ))}
    </div>
  );
}

function AlertSuccessRow() {
  return (
    <Alert variant="success" className="p-2.5 [&>svg~*]:pl-0 [&:has(svg)]:pl-2.5">
      <AlertTitle className="text-[10px] flex items-center gap-1.5 mb-0">
        <CircleCheck size={12} />
        All checks passed — ready to merge.
      </AlertTitle>
    </Alert>
  );
}

function AlertWarningRow() {
  return (
    <Alert variant="warning" fill="soft" className="p-2.5 [&>svg~*]:pl-0 [&:has(svg)]:pl-2.5">
      <AlertTitle className="text-[10px] flex items-center gap-1.5 mb-0">
        <Zap size={12} />
        Token cache expires in 2 hours.
      </AlertTitle>
    </Alert>
  );
}

function ConnectedRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--s-success)] animate-pulse" />
        Connected to production
      </span>
      <span className="text-[9px] font-mono tabular-nums text-[var(--s-text-muted)]">ws://</span>
    </div>
  );
}

function HotkeyRow() {
  return (
    <div className="flex flex-col justify-between gap-2 p-3 flex-1" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[10px] font-medium text-[var(--s-text)]">Keyboard Shortcuts</span>
      {[
        { keys: ["⌘", "K"], action: "Command palette" },
        { keys: ["⌘", "B"], action: "Toggle sidebar" },
        { keys: ["⌘", "⇧", "P"], action: "Deploy" },
      ].map((s) => (
        <div key={s.action} className="flex items-center justify-between">
          <span className="text-[9px] text-[var(--s-text-muted)]">{s.action}</span>
          <div className="flex gap-0.5">
            {s.keys.map((k) => (
              <span key={k} className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-[3px] text-[8px] font-mono text-[var(--s-text-muted)]" style={{ border: "1px solid var(--s-border)", background: "var(--s-surface)" }}>{k}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActionsRow() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <Button size="sm" variant="outline" className="text-[9px] h-7 gap-1"><Zap size={10} />Deploy</Button>
      <Button size="sm" variant="outline" className="text-[9px] h-7 gap-1"><Eye size={10} />Preview</Button>
      <Button size="sm" variant="outline" className="text-[9px] h-7 gap-1"><Globe size={10} />Visit</Button>
    </div>
  );
}

function TokenPreviewStrip() {
  const colors = [
    { label: "primary", color: "var(--s-primary)" },
    { label: "success", color: "var(--s-success)" },
    { label: "warning", color: "var(--s-warning)" },
    { label: "error", color: "var(--s-error)" },
    { label: "info", color: "var(--s-info)" },
  ];
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[var(--s-text)]">Color Tokens</span>
        <span className="text-[9px] text-[var(--s-text-muted)]">5 active</span>
      </div>
      <div className="flex gap-1.5">
        {colors.map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full h-5 rounded-sm" style={{ background: c.color }} />
            <span className="text-[7px] font-mono text-[var(--s-text-muted)] uppercase">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Catmull-Rom -> cubic Bezier path. Same helper as the hero chart but
 * inlined here so this component stays self-contained.
 */
function smoothPathFromPoints(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function MiniSparkline() {
  // Hand-shaped data: a slow climb with two false starts and a strong
  // finish so the "↑ 23%" trend reads visually.
  const data = [4, 6, 5, 8, 6, 9, 7, 10, 8, 12, 10, 14, 11, 15, 13, 17, 14, 18];

  // Chart geometry — viewBox coordinates. preserveAspectRatio="none"
  // stretches it to fit the container; `non-scaling-stroke` keeps the
  // line + dot crisp regardless of stretch.
  const W = 400;
  const H = 150;
  const padX = 14;
  const padTop = 12;
  const padBottom = 18;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;
  const baselineY = H - padBottom;

  const minV = Math.min(...data);
  const maxV = Math.max(...data);
  const range = Math.max(0.0001, maxV - minV);
  const valueToY = (v: number) =>
    padTop + plotH - ((v - minV) / range) * plotH;

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * plotW,
    y: valueToY(v),
  }));
  const lineD = smoothPathFromPoints(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  const areaD = `${lineD} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;

  // Three subtle horizontal guides at 25 / 50 / 75% of the plot.
  const guides = [0.25, 0.5, 0.75].map((t) => padTop + plotH * t);

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{
        border: "1px solid var(--s-border)",
        borderRadius: "var(--s-radius-md, 6px)",
      }}
    >
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <span className="text-[10px] font-medium text-[var(--s-text)]">
          Requests / min
        </span>
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] tabular-nums font-medium font-[family-name:var(--s-font-mono)]"
          style={{
            color: "var(--s-success)",
            background:
              "color-mix(in oklch, var(--s-success) 14%, transparent)",
            borderRadius: "var(--s-radius-sm, 3px)",
          }}
          aria-label="up 23 percent"
        >
          <span aria-hidden style={{ fontSize: 9, lineHeight: 1 }}>
            ↑
          </span>
          23%
        </span>
      </div>
      <div className="relative flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="ms-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--s-primary)"
                stopOpacity={0.34}
              />
              <stop
                offset="55%"
                stopColor="var(--s-primary)"
                stopOpacity={0.1}
              />
              <stop
                offset="100%"
                stopColor="var(--s-primary)"
                stopOpacity={0}
              />
            </linearGradient>
            <filter
              id="ms-glow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="0.9" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Dashed horizontal guides — barely there but give the chart
              a sense of grid without being noisy. */}
          {guides.map((y, i) => (
            <line
              key={i}
              x1={padX}
              x2={W - padX}
              y1={y}
              y2={y}
              stroke="var(--s-border)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
              opacity={0.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* Baseline */}
          <line
            x1={padX}
            x2={W - padX}
            y1={baselineY}
            y2={baselineY}
            stroke="var(--s-border)"
            strokeWidth={0.75}
            vectorEffect="non-scaling-stroke"
          />
          <path d={areaD} fill="url(#ms-fill)" />
          <path
            d={lineD}
            fill="none"
            stroke="var(--s-primary)"
            strokeWidth={1.6}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#ms-glow)"
            vectorEffect="non-scaling-stroke"
          />
          {/* Vertical drop line at the latest point — anchors the dot
              and reads as "this is now". */}
          <line
            x1={last.x}
            x2={last.x}
            y1={last.y}
            y2={baselineY}
            stroke="var(--s-primary)"
            strokeWidth={0.5}
            strokeDasharray="2 3"
            opacity={0.45}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={last.x}
            cy={last.y}
            r={5.5}
            fill="var(--s-primary)"
            fillOpacity={0.18}
          />
          <circle cx={last.x} cy={last.y} r={2.6} fill="var(--s-primary)" />
        </svg>
      </div>
      <div
        className="grid grid-cols-3 gap-2 px-3 py-2 border-t"
        style={{ borderColor: "var(--s-border)" }}
      >
        <MiniStat label="now" value="1.7K" />
        <MiniStat label="peak" value="2.1K" />
        <MiniStat label="p99" value="12ms" />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[7px] uppercase tracking-[0.08em] font-[family-name:var(--s-font-mono)] text-[var(--s-text-muted)]">
        {label}
      </span>
      <span className="text-[11px] tabular-nums font-medium text-[var(--s-text)] truncate">
        {value}
      </span>
    </div>
  );
}

const TRAFFIC_COMMIT_END_TIME = Date.UTC(2026, 3, 24);
const TRAFFIC_COMMIT_DAYS = Array.from({ length: 140 }, (_, index) => {
  const daysAgo = 139 - index;
  const date = new Date(TRAFFIC_COMMIT_END_TIME);
  date.setUTCDate(date.getUTCDate() - daysAgo);

  const wave = Math.round(4 + 4 * Math.sin(index / 6));
  const texture = (index * 7 + index * index * 3 + 11) % 8;

  return {
    date: date.toISOString().slice(0, 10),
    count: Math.max(0, wave + texture - 3),
  };
});

function TrafficCommitRow() {
  return (
    <div className="flex flex-col gap-2 p-3 overflow-hidden" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[var(--s-text)]">Traffic</span>
        <span className="text-[9px] tabular-nums text-[var(--s-text-muted)]">20 weeks</span>
      </div>
      <CommitGrid data={TRAFFIC_COMMIT_DAYS} weeks={20} cellSize={8} gap={2} showDayLabels={false} showMonthLabels={false} color="var(--s-primary)" />
    </div>
  );
}

function LatencyAreaRow() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-[10px] font-medium text-[var(--s-text)]">Latency (p95)</span>
        <span className="text-[9px] tabular-nums text-[var(--s-warning)]">↓ 8ms</span>
      </div>
      <AreaChart
        series={[{
          label: "p95",
          points: [
            { label: "Mon", value: 120 },
            { label: "Tue", value: 98 },
            { label: "Wed", value: 140 },
            { label: "Thu", value: 105 },
            { label: "Fri", value: 88 },
            { label: "Sat", value: 72 },
            { label: "Sun", value: 64 },
          ],
          color: "var(--s-warning)",
        }]}
        width={400}
        height={150}
        showGrid
        className="w-full h-full flex-1"
        style={{ display: "block" }}
      />
    </div>
  );
}

function EnvironmentRow() {
  return (
    <div className="flex items-center justify-between p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[11px] text-[var(--s-text)] flex items-center gap-1.5">
        <Layers size={13} className="text-[var(--s-text-muted)]" />
        Environment
      </span>
      <Select defaultValue="prod">
        <SelectTrigger className="h-6 text-[9px] w-24 px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
          <SelectItem value="prod" className="h-6 text-[10px] pl-6">Production</SelectItem>
          <SelectItem value="staging" className="h-6 text-[10px] pl-6">Staging</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function CommitMessageRow() {
  return (
    <div className="flex flex-col gap-1.5 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <Label className="text-[10px] flex items-center gap-1.5"><GitCommitHorizontal size={12} className="text-[var(--s-text-muted)]" />Commit Message</Label>
      <Textarea rows={3} placeholder="fix: resolve token compilation edge case when oklch values exceed gamut boundary" className="text-[10px] w-full" />
    </div>
  );
}

function DeployHistoryRow() {
  return (
    <div className="flex flex-col gap-1 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <span className="text-[10px] font-medium text-[var(--s-text)] mb-1">Recent Deploys</span>
      {[
        { hash: "a3f9c2d", env: "prod", time: "4m", ok: true },
        { hash: "e1b7f3a", env: "staging", time: "22m", ok: true },
        { hash: "7d2c91b", env: "preview", time: "1h", ok: false },
      ].map((d) => (
        <div key={d.hash} className="flex items-center justify-between text-[9px] py-1" style={{ borderBottom: "1px solid var(--s-border-muted)" }}>
          <span className="font-mono text-[var(--s-text-muted)]">{d.hash}</span>
          <div className="flex items-center gap-2">
            <Badge size="sm" variant="outline" className="text-[7px] px-1 py-0">{d.env}</Badge>
            <span className="text-[var(--s-text-muted)]">{d.time}</span>
            {d.ok ? <CircleCheck size={10} className="text-[var(--s-success)]" /> : <span className="text-[var(--s-error)] text-[8px]">✕</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function StorageMeterRow() {
  return (
    <div className="flex flex-col gap-2 p-3" style={{ border: "1px solid var(--s-border)", borderRadius: "var(--s-radius-md, 6px)" }}>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] text-[var(--s-text)]">Storage</span>
        <span className="text-[9px] tabular-nums text-[var(--s-text-muted)]">4.2 / 10 GB</span>
      </div>
      <Progress value={42} className="h-1.5" />
    </div>
  );
}

/* ================================================================ */
/*  Preset dots                                                       */
/* ================================================================ */

function PresetDots() {
  const dots = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  return (
    <div className="flex items-center justify-center gap-2.5 mt-6">
      {dots.map((color, i) => (
        <div key={i} className="rounded-full" style={{ width: 10, height: 10, background: color, opacity: i === 0 ? 1 : 0.4, transition: `opacity 300ms ${EASING}` }} />
      ))}
    </div>
  );
}

/* ================================================================ */
/*  Export — balanced 4-column component gallery                      */
/* ================================================================ */

function DeployColumn() {
  return (
    <div className="flex flex-col gap-3">
      <DeployCard />
      <ToolbarRow />
      <BuildStatus />
      <StatusBadgesRow />
      <ChatInputRow />
      <SliderRow />
      <BadgeRow />
      <VerifiedRow />
      <ToggleGroupRow />
      <MentionRow />
      <ConnectedRow />
      <MeterRow />
      <EnvironmentRow />
      <DatePickerRow />
      <CommitMessageRow />
      <UptimeRow />
      <LatencyBuildRow />
      <VoronoiRow />
      <TrafficCommitRow />
      <SessionCountRow />
      <QuickActionsRow />
    </div>
  );
}

function TokensColumn() {
  return (
    <div className="flex flex-col gap-3">
      <TokenEditorCard />
      <TokenPreviewCard />
      <GPUCounterRow />
      <TintingRow />
      <PriceRangeRow />
      <SpinnersShowcase />
      <BreadcrumbRow />
      <UrlInputRow />
      <CalendarCard />
      <AlertWarningRow />
      <FontStackRow />
      <RadiusPreviewRow />
      <TokenPreviewStrip />
      <SpacingScaleRow />
    </div>
  );
}

function AnalyticsColumn() {
  return (
    <div className="flex flex-col gap-3">
      <AnalyticsKPIs />
      <CheckboxRow />
      <TabsRow />
      <AnalyticsTable />
      <SearchCountRow />
      <SkeletonRow />
      <ActivityFeed />
      <TwoFactorRow />
      <ProgressRow />
      <TagInputRow />
      <SearchRow />
      <ButtonRow />
      <DeployHistoryRow />
      <RatingRow />
      <AlertSuccessRow />
      <KbdShortcutRow />
      <ErrorActiveRow />
      <SkeletonCardRow />
      <MiniSparkline />
    </div>
  );
}

function OnboardingColumn() {
  return (
    <div className="flex flex-col gap-3">
      <OnboardingStepper />
      <PlanSelector />
      <PaginationRow />
      <AiChatRow />
      <AvatarStackRow />
      <InviteCard />
      <NotificationsRow />
      <DateRangeRow />
      <AlertRow />
      <StarRatingRow />
      <KeyValueRow />
      <WifiRow />
      <StorageMeterRow />
      <RegionBadgesRow />
      <CacheHitRow />
      <HotkeyRow />
      <LatencyAreaRow />
    </div>
  );
}

export function HeroShowcase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <div className="hero-gallery">
        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DeployColumn />
          <TokensColumn />
          <AnalyticsColumn />
          <OnboardingColumn />
        </div>
      </div>
    </div>
  );
}
