"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Button, Badge, Input, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Checkbox, Switch, Slider, Progress,
  Toggle, ToggleGroup, ToggleGroupItem,
  Avatar, AvatarGroup, KPI, Alert, AlertTitle, AlertDescription,
  Skeleton, LoadingSpinner, Textarea, NumberField, Label, Separator,
  Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter,
  Stack, Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Collapsible, CollapsibleTrigger, CollapsibleContent,
  ScrollArea, AspectRatio, CodeBlock, Terminal,
  Breadcrumb, Pagination, Toolbar, ToolbarButton, ToolbarSeparator, SplitButton,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, DataTable,
  Timeline, Stepper, Meter, DatePicker, DateRangePicker, Calendar,
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
  RadioGroup, RadioGroupItem, CheckboxGroup, CheckboxGroupItem, Combobox,
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator,
  Field, Fieldset, FieldLabel, FieldDescription,
  Diamond, Hexagon, Triangle, Diagonal, Shape, Cross,
  VoronoiBento, Tessellation, Pattern,
  Box, Container, Flex, SimpleGrid, Center, Spacer, AppShell, Main, Aside, Header as SigilHeader, Banner,
  Box3D, Card3D, FloatingUI, IsometricView,
  Diagram, FlowDiagram, ComparisonTable, ExplodedView, ArchitectureDiagram,
  DiagramNode, DiagramConnector, DiagramLabel, CrossHatch, PipelineDiagram,
  StackDiagram, HubSpokeDiagram, BeforeAfterDiagram, EcosystemDiagram,
  HubRouteDiagram, GlobeDiagram, OrbitDiagram, StreamFlowDiagram,
  IsometricStackDiagram, PlatformHubDiagram, FeatureMiniDiagram, SankeyDiagram,
  IsometricPrism, IsometricCylinder, IsometricScene, Box3DGrid,
  Hero, CTA, Pricing, FeatureGrid, LogoBar, PricingTiers, CostCalculator,
  TestimonialCard, AnnouncementBar, BlogGrid,
  LargeTextSection, FeatureShowcaseSection, InstallSection, GradientBannerSection,
  FeatureFrame, UnitPricing, BlogHeader,
  Navbar, NavbarLogo, NavbarLinks, NavbarActions,
  Footer as SigilFooter, Sidebar, SidebarHeader, SidebarContent, SidebarItem,
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink,
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, SocialIcons,
  MagneticNav, MagneticNavItem, MagneticNavLink,
  ProximityGlow, ProximityGlowCard,
  Divider, HRule,
  AnimateOnScroll,
  FadeIn, SlideIn, ScaleIn, BlurFade, Stagger, AnimateOnMount,
  TextReveal, LetterPullUp, WordRotate, TypeWriter, NumberTicker, GradientText,
  ScrollProgress, ParallaxLayer,
  Marquee, Ripple, Pulse,
  WaterfallChart, CapabilityGrid, IsolationStack, StatePersistence,
  RadarChart, TreeDiagram, GanttChart, FunnelChart, MatrixDiagram,
  DependencyGraph, DonutChart, NetworkGraph, HeatmapGrid, VennDiagram,
  PricingTable, ChangelogTable, StatusTable, SpecTable, LeaderboardTable,
  BarChart, PieChart, LineChart, AreaChart, CommitGrid, SparkLine,
  UsageGauge, BillingChart, ProgressRing, MetricCard, ActivityFeed, MiniBarList,
  MermaidDiagram,
  FeatureFrameSection, BlueprintGridSection,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
  Popover, PopoverTrigger, PopoverContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  Command, CommandInput,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
  toast, Toaster,
  Kbd, Empty, NativeSelect, Clipboard, Tooltip, TooltipProvider,
  TagsInput, ColorPicker, Editable, RatingGroup,
  TreeView, ButtonGroup,
  InputGroup, InputGroupAddon, InputGroupInput,
  FileUpload, SignaturePad,
  Item, Sonner, sonnerToast,
  Panel, PanelHead, BrailleSpinner, GrainGradient, PageShell,
  AccessibleIcon, VisuallyHidden,
  SegmentedControl, SegmentedControlItem, CircularProgress, PasswordInput,
  SectionHeading, HeroSection, FeatureSection, CTASection,
  FAQSection, StatsSection, BentoSection,
  TestimonialsSection, LogoCloudSection, ComparisonSection,
  CodeShowcaseSection, TeamSection, TimelineSection, NewsletterSection, FooterSection,
  H1, H2, H3, H4, Lead, Muted, InlineCode, Blockquote,
  ResizablePanelGroup, ResizablePanel as ResizablePanelComp, ResizableHandle,
  PreviewCard, PreviewCardTrigger, PreviewCardContent,
  GapPixelGrid, GapPixelCell, MonoLabel, BorderStack, AccentCTA, TabularValue, DensityText, FrostedPanel, CardCell,
  Modal, ConfirmDialog, PromptDialog, ResponsiveDialog, Lightbox, ImagePreview,
  Spotlight, CommandMenu, ActionMenu, OverflowMenu, MegaMenu, ContextPanel,
  PopoverForm, FloatingPanel, TooltipGroup, Tour, TourStep, Coachmark,
  HotkeyProvider, ShortcutRecorder,
  SearchInput, CurrencyInput, PhoneInput, TimePicker, DateTimePicker, DateRangeField,
  MultiSelect, Autocomplete, CreatableSelect, AsyncSelect, SegmentedTabs,
  RangeSlider, DualRangeSlider, FileDropzone, ImageUpload, AvatarUpload, ColorField,
  ComboboxField, CheckboxCard, RadioCard, SwitchField, SliderField, StepperField,
  TagsField, CopyInput,
  StatusBadge, StatusDot, StatusPill, OnlineIndicator, PresenceAvatar,
  Notification, NotificationList, InlineAlert, Callout, BannerAlert, ErrorState,
  LoadingState, SuccessState, ProgressSteps, TimelineProgress, ToastAction,
  ToastPromise, SkeletonCard, SkeletonTable, SpinnerOverlay,
  DescriptionList, KeyValue, PropertyList, StatCard, MetricGrid, Trend, SparkArea,
  SparkBar, DataList, DataListItem, DataGrid, DataToolbar, DataFilters,
  DataPagination, ColumnVisibility, BulkActions, EmptyTable, Listbox, VirtualList,
  TreeTable,
  ContainerQuery, SplitPane, Dock, TopBar, BottomBar, MobileNav, SidebarNav,
  AppHeader, PageHeader, SectionHeader, ContentTabs, AnchorNav, TableOfContents,
  ScrollSpy, MasonryGrid, MediaCard, ResourceCard, FeatureCard, PricingCard,
  TestimonialCarousel,
  CodeTabs, CodePreview, CopyButton, TokenPreview, ThemeSwatch, ThemeSwitcher,
  PromptInput, ChatMessage, ChatThread, MessageComposer, ActivityTimeline, AuditLog,
  Changelog, VersionBadge, KeyboardKey,
} from "@sigil-ui/components";
import { ComponentCatalog } from "./component-catalog";
import { FooterLogo } from "./hero-logo-field";
import {
  Search, Star, Heart, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Layers, ArrowRight, Zap, Shield, Globe, Cpu, Code,
  Calendar as CalendarIcon, ChevronDown, Upload, Folder, File,
} from "@/components/icons";

type ComponentCell = {
  name: string;
  category: string;
  variants?: number;
  docPath?: string | null;
  /** Number of grid columns to span. @default 1 */
  span?: number;
  render: () => ReactNode;
};

function createDemoDate(): Date {
  return new Date(2026, 3, 24);
}

const DOC_SECTION_BY_CATEGORY: Record<string, string> = {
  "3D": "components",
  Animation: "animation",
  Diagrams: "components",
  Layout: "components",
  Marketing: "components",
  Navigation: "components",
  Overlays: "components",
  Patterns: "patterns",
  Playbook: "playbook",
  Pretext: "components",
  Sections: "components",
  Shapes: "components",
  UI: "components",
  Data: "components",
  Forms: "components",
  Feedback: "components",
  Developer: "components",
};

const DOC_PATH_OVERRIDES: Record<string, string | null> = {
  AccessibleIcon: "/docs/components/accessible-icon",
  AccentCTA: null,
  AppShell: "/docs/components/app-shell",
  ArchitectureDiagram: "/docs/diagrams/architecture-diagram",
  AspectRatio: "/docs/components/aspect-ratio",
  ActivityFeed: null,
  AreaChart: null,
  AvatarGroup: "/docs/components/avatar",
  BarChart: null,
  BillingChart: null,
  BlogGrid: null,
  BlogHeader: null,
  Blockquote: null,
  BorderStack: null,
  Box3D: "/docs/components/box-3d",
  Box3DGrid: null,
  BlueprintGridSection: null,
  ButtonGroup: "/docs/components/button-group",
  CapabilityGrid: "/docs/diagrams/capability-grid",
  Card3D: "/docs/3d/card3d",
  CardCell: null,
  ChartContainer: "/docs/components/chart",
  CodeBlock: "/docs/components/code-block",
  CommitGrid: null,
  ChangelogTable: null,
  ComparisonTable: "/docs/diagrams/comparison-table",
  Cross: "/docs/patterns/cross",
  CrossHatch: null,
  Diagonal: "/docs/shapes/diagonal",
  DatePicker: "/docs/components/date-picker",
  DateRangePicker: "/docs/components/date-picker",
  DensityText: null,
  DependencyGraph: null,
  DonutChart: null,
  DiagramLabel: null,
  DiagramConnector: "/docs/components/diagram-connector",
  DiagramNode: "/docs/components/diagram-node",
  Divider: "/docs/layout/divider",
  ExplodedView: "/docs/diagrams/exploded-view",
  FeatureFrame: "/docs/marketing/feature-frame",
  FeatureFrameSection: null,
  FeatureMiniDiagram: null,
  FlowDiagram: "/docs/diagrams/flow-diagram",
  Footer: null,
  FloatingUI: "/docs/3d/floating-ui",
  FunnelChart: null,
  FrostedPanel: null,
  GapPixelGrid: null,
  GrainGradient: "/docs/patterns/grain-gradient",
  GanttChart: null,
  HeatmapGrid: null,
  HRule: "/docs/layout/h-rule",
  Hexagon: "/docs/shapes/hexagon",
  InputGroup: "/docs/components/input-group",
  InputOTP: "/docs/components/input-otp",
  IsolationStack: "/docs/diagrams/isolation-stack",
  IsometricView: "/docs/3d/isometric-view",
  LeaderboardTable: null,
  LineChart: null,
  LoadingSpinner: "/docs/components/loading-spinner",
  MagneticNav: "/docs/navigation/magnetic-nav",
  MatrixDiagram: null,
  MermaidDiagram: null,
  MetricCard: null,
  MiniBarList: null,
  MonoLabel: null,
  NativeSelect: "/docs/components/native-select",
  NetworkGraph: null,
  Navbar: null,
  NumberField: "/docs/components/number-field",
  PieChart: null,
  PricingTable: null,
  PricingTiers: null,
  PlatformHubDiagram: null,
  PipelineDiagram: "/docs/components/pipeline-diagram",
  PageShell: "/docs/layout/page-shell",
  "Page Shell": "/docs/layout/page-shell",
  ProgressRing: null,
  ProximityGlow: "/docs/effects/proximity-glow",
  RadioGroup: "/docs/components/radio-group",
  RadarChart: null,
  ScrollArea: "/docs/components/scroll-area",
  SegmentedControl: "/docs/components/segmented-control",
  SocialIcons: null,
  SimpleGrid: "/docs/components/simple-grid",
  Stack: "/docs/layout/stack",
  StackDiagram: "/docs/components/stack-diagram",
  SparkLine: null,
  StatusTable: null,
  StatePersistence: "/docs/diagrams/state-persistence",
  SpecTable: null,
  WaterfallChart: "/docs/diagrams/waterfall-chart",
  TabularValue: null,
  TagsInput: "/docs/components/tags-input",
  Timeline: "/docs/diagrams/timeline",
  ToggleGroup: "/docs/components/toggle-group",
  TreeView: "/docs/components/tree-view",
  TreeDiagram: null,
  Triangle: "/docs/shapes/triangle",
  TypeWriter: "/docs/animation/typewriter",
  UnitPricing: null,
  UsageGauge: null,
  VennDiagram: null,
  VoronoiBento: "/docs/layout/voronoi-bento",
};

function componentSlug(name: string) {
  return name
    .replace(/3D/g, "3-d")
    .replace(/OTP/g, "-otp")
    .replace(/CTA/g, "-cta")
    .replace(/KPI/g, "kpi")
    .replace(/UI/g, "-ui")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/^-/, "")
    .toLowerCase();
}

function getDocsHref(cell: ComponentCell) {
  if (cell.docPath !== undefined) return cell.docPath;
  if (cell.name in DOC_PATH_OVERRIDES) return DOC_PATH_OVERRIDES[cell.name];
  const section = DOC_SECTION_BY_CATEGORY[cell.category] ?? "components";
  return `/docs/${section}/${componentSlug(cell.name)}`;
}

function SidebarPreview() {
  const [active, setActive] = useState("Overview");
  return (
    <div className="flex w-full justify-start">
      <Sidebar className="sigil-catalog-sidebar-preview" aria-label="Example workspace navigation">
        <SidebarHeader><Folder /><strong className="sigil-preview-sidebar-title">Fieldwork</strong></SidebarHeader>
        <SidebarContent>
          {[
            { label: "Overview", icon: <Layers /> },
            { label: "Projects", icon: <Folder /> },
            { label: "Settings", icon: <Code /> },
          ].map(item => <SidebarItem key={item.label} icon={item.icon} active={active === item.label} aria-label={item.label} onClick={() => setActive(item.label)}>{item.label}</SidebarItem>)}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(3);
  return <Pagination currentPage={page} totalPages={10} siblingCount={0} onPageChange={setPage} className="flex-wrap justify-center" />;
}

function ControlledCombobox() {
  const [framework, setFramework] = useState("react");
  return (
    <Combobox
      options={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
        { value: "solid", label: "SolidJS" },
      ]}
      value={framework}
      onValueChange={setFramework}
      placeholder="Search frameworks..."
      className="w-full"
    />
  );
}

function ReplayPreview({
  children,
  interval = 2600,
}: {
  children: (cycle: number) => ReactNode;
  interval?: number;
}) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setCycle((current) => current + 1), interval);
    return () => window.clearInterval(timer);
  }, [interval]);

  return (
    <div key={cycle} className="flex h-full w-full items-center justify-center">
      {children(cycle)}
    </div>
  );
}

function AnimatedScrollProgressPreview() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 92 ? 12 : current + 16));
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative h-8 w-full overflow-hidden rounded-[var(--s-radius-sm,2px)] border border-[var(--s-border)]">
      <ScrollProgress fixed={false} value={progress} className="!absolute" />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[var(--s-text-muted)]">
        {progress}% scrolled
      </div>
    </div>
  );
}

function SpotlightDemo({ command = false }: { command?: boolean }) {
  const [open, setOpen] = useState(false);
  const Palette = command ? CommandMenu : Spotlight;
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open
      </Button>
      <KeyboardKey>{command ? "⌘P" : "⌘K"}</KeyboardKey>
      <Palette
        open={open}
        onOpenChange={setOpen}
        items={[
          { value: "components", label: "Components", description: "Open the component catalog" },
          { value: "docs", label: "Docs", description: "Search documentation" },
        ]}
      />
    </div>
  );
}

function TourDemo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  return (
    <Tour
      open={open}
      onOpenChange={setOpen}
      step={step}
      onStepChange={setStep}
      trigger={<Button size="sm" variant="outline">Start Tour</Button>}
      steps={[
        { title: "Inspect", description: "Review the component preview." },
        { title: "Install", description: "Copy the CLI command from docs." },
      ]}
    />
  );
}

function HotkeyProviderDemo() {
  const [count, setCount] = useState(0);
  return (
    <HotkeyProvider hotkeys={[{ keys: ["meta", "k"], onTrigger: () => setCount((value) => value + 1) }]}>
      <div className="flex items-center gap-2">
        <KeyboardKey>⌘K</KeyboardKey>
        <span className="text-xs text-[var(--s-text-muted)]">{count} triggers</span>
      </div>
    </HotkeyProvider>
  );
}

const CELLS: ComponentCell[] = [
  /* ================================================================ */
  /* UI                                                                */
  /* ================================================================ */
  { name: "Button", category: "UI", variants: 6, render: () => (
    <div className="flex gap-2 flex-wrap items-center">
      <Button size="sm">Primary</Button>
      <Button size="sm" variant="outline">Outline</Button>
      <Button size="sm" variant="ghost">Ghost</Button>
    </div>
  )},
  { name: "Badge", category: "UI", variants: 4, render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )},
  { name: "Input", category: "UI", variants: 4, render: () => (
    <Input placeholder="Search components..." className="h-9 text-xs w-full" iconLeft={<Search size={14} />} />
  )},
  { name: "Textarea", category: "UI", variants: 1, render: () => (
    <Textarea rows={3} placeholder="Write a message..." className="text-xs w-full" />
  )},
  { name: "Select", category: "UI", variants: 2, render: () => (
    <Select defaultValue="react">
      <SelectTrigger className="h-9 text-xs w-full">
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="svelte">Svelte</SelectItem>
        <SelectItem value="angular">Angular</SelectItem>
      </SelectContent>
    </Select>
  )},
  { name: "Checkbox", category: "UI", variants: 2, render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Accept terms" defaultChecked />
      <Checkbox label="Subscribe to updates" />
    </div>
  )},
  { name: "Switch", category: "UI", variants: 2, render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><Switch defaultChecked /><Label className="text-xs">Dark mode</Label></div>
      <div className="flex items-center gap-2"><Switch /><Label className="text-xs">Notifications</Label></div>
    </div>
  )},
  { name: "Slider", category: "UI", variants: 3, render: () => <Slider defaultValue={[65]} className="w-full" /> },
  { name: "Progress", category: "UI", variants: 2, render: () => (
    <div className="flex flex-col gap-3 w-full">
      <Progress value={72} size="lg" className="w-full" />
      <Progress value={35} size="md" className="w-full" />
    </div>
  )},
  { name: "Toggle", category: "UI", variants: 3, render: () => (
    <div className="flex gap-1">
      <Toggle size="sm" defaultPressed><Bold size={14} /></Toggle>
      <Toggle size="sm"><Italic size={14} /></Toggle>
      <Toggle size="sm" variant="outline"><Underline size={14} /></Toggle>
    </div>
  )},
  { name: "ToggleGroup", category: "UI", variants: 2, render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" size="sm"><AlignLeft size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="center" size="sm"><AlignCenter size={14} /></ToggleGroupItem>
      <ToggleGroupItem value="right" size="sm"><AlignRight size={14} /></ToggleGroupItem>
    </ToggleGroup>
  )},
  { name: "Avatar", category: "UI", variants: 3, render: () => (
    <div className="flex gap-2">
      <Avatar src="/avatars/kevin.png" name="Kevin Liu" size="md" />
      <Avatar src="https://github.com/shadcn.png" name="shadcn" size="md" />
      <Avatar src="https://github.com/rauchg.png" name="Guillermo Rauch" size="md" />
    </div>
  )},
  { name: "AvatarGroup", category: "UI", variants: 1, render: () => (
    <AvatarGroup max={3} size="md">
      <Avatar src="https://github.com/shadcn.png" name="shadcn" size="md" />
      <Avatar src="https://github.com/leerob.png" name="Lee Robinson" size="md" />
      <Avatar src="https://github.com/rauchg.png" name="Guillermo Rauch" size="md" />
      <Avatar src="https://github.com/t3dotgg.png" name="Theo" size="md" />
      <Avatar src="https://github.com/gaearon.png" name="Dan Abramov" size="md" />
    </AvatarGroup>
  )},
  { name: "KPI", category: "UI", variants: 2, render: () => (
    <KPI label="Revenue" value="$4.2k" change="+8%" trend="up" className="p-2 text-xs border-0 w-full" />
  )},
  { name: "Alert", category: "UI", variants: 4, render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Alert variant="info" className="p-2 w-full"><AlertTitle className="text-[10px]">Info</AlertTitle></Alert>
      <Alert variant="warning" className="p-2 w-full"><AlertTitle className="text-[10px]">Warning</AlertTitle></Alert>
    </div>
  )},
  { name: "Skeleton", category: "UI", variants: 3, render: () => (
    <div className="flex flex-col gap-3 w-full">
      <Skeleton className="h-4 w-full rounded-[var(--s-radius-sm,4px)]" />
      <Skeleton className="h-4 w-3/4 rounded-[var(--s-radius-sm,4px)]" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3 w-full rounded-[var(--s-radius-sm,4px)]" />
          <Skeleton className="h-3 w-2/3 rounded-[var(--s-radius-sm,4px)]" />
        </div>
      </div>
    </div>
  )},
  { name: "LoadingSpinner", category: "UI", variants: 5, render: () => (
    <div className="flex gap-6 items-center">
      <LoadingSpinner variant="dots2" size="sm" />
      <LoadingSpinner variant="dots2" size="md" />
      <LoadingSpinner variant="dots2" size="lg" />
    </div>
  )},
  { name: "BrailleSpinner", category: "UI", variants: 6, render: () => (
    <BrailleSpinner name="orbit" label="Loading" className="text-2xl text-[var(--s-primary)]" />
  )},
  { name: "CircularProgress", category: "UI", variants: 3, render: () => (
    <CircularProgress value={68} size={56} />
  )},
  { name: "NumberField", category: "UI", variants: 1, render: () => (
    <div className="w-full max-w-[160px]">
      <NumberField value={8} min={0} max={100} />
    </div>
  )},
  { name: "Label", category: "UI", variants: 1, render: () => (
    <div className="flex flex-col gap-1.5 w-full">
      <Label className="text-xs">Email address</Label>
      <Input placeholder="you@example.com" className="h-8 text-xs" />
    </div>
  )},
  { name: "Separator", category: "UI", variants: 2, render: () => (
    <div className="flex w-full items-center gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-xs text-[var(--s-text)]">Account</div>
        <Separator />
        <div className="text-xs text-[var(--s-text-muted)]">Settings</div>
      </div>
      <Separator orientation="vertical" className="h-12" />
      <div className="text-xs text-[var(--s-text-muted)]">Plain line</div>
    </div>
  )},
  { name: "Tooltip", category: "UI", variants: 1, render: () => (
    <Tooltip content="This is a tooltip" side="top">
      <Button size="sm" variant="outline" className="text-xs">Hover me</Button>
    </Tooltip>
  )},
  { name: "ScrollArea", category: "UI", variants: 1, render: () => (
    <ScrollArea className="h-[90px] w-full border border-[var(--s-border-muted)] rounded-[var(--s-radius-md,6px)] p-3">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="text-xs py-1 text-[var(--s-text-muted)]">Item {i + 1}</div>
      ))}
    </ScrollArea>
  )},
  { name: "CodeBlock", category: "UI", variants: 1, span: 2, render: () => (
    <div className="w-full [&_pre]:!p-2 [&_pre]:!text-[10px] [&_pre]:!leading-relaxed [&_button]:!top-1 [&_button]:!right-1 [&_button]:!h-5 [&_button]:!px-1.5 [&_button]:!text-[9px]">
      <CodeBlock language="tsx" code={'<Button variant="primary">\n  Click me\n</Button>'} />
    </div>
  )},
  { name: "Terminal", category: "UI", variants: 1, span: 2, render: () => (
    <div className="w-full [&>div]:!text-[10px] [&_pre]:!text-[10px] [&_pre]:!p-2 [&_pre]:!leading-relaxed [&>div>div:first-child]:!py-1 [&>div>div:first-child]:!px-2 [&>div>div:first-child]:!text-[9px]">
      <Terminal lines={["$ npx @sigil-ui/cli convert", "✓ Done in 1.2s"]} title="zsh" />
    </div>
  )},
  { name: "Kbd", category: "UI", variants: 1, render: () => (
    <div className="flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></div>
  )},
  { name: "Empty", category: "UI", variants: 1, render: () => (
    <Empty title="No results" description="Try a different search term" className="py-2 [&_h3]:text-xs [&_p]:text-[10px]" />
  )},
  { name: "NativeSelect", category: "UI", variants: 1, render: () => (
    <NativeSelect defaultValue="react" className="text-xs w-full">
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="svelte">Svelte</option>
    </NativeSelect>
  )},
  { name: "Clipboard", category: "UI", variants: 1, render: () => (
    <Clipboard value="npx @sigil-ui/cli convert" />
  )},
  { name: "Item", category: "UI", variants: 1, render: () => (
    <Item
      media={<div className="w-8 h-8 rounded-[var(--s-radius-md,0px)] bg-[var(--s-surface)] flex items-center justify-center"><File size={14} className="text-[var(--s-text-muted)]" /></div>}
      title="document.pdf"
      description="2.4 MB · Uploaded today"
      className="w-full"
    />
  )},

  /* ================================================================ */
  /* Layout                                                            */
  /* ================================================================ */
  { name: "Card", category: "Layout", variants: 3, render: () => (
    <Card className="w-full">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs">Dashboard</CardTitle>
        <CardDescription className="text-[10px]">Manage settings</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Button size="sm" className="w-full text-xs">Open</Button>
      </CardContent>
    </Card>
  )},
  { name: "Stack", category: "Layout", variants: 2, render: () => (
    <Stack gap={8} className="w-full">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-[var(--s-radius-sm,4px)]" style={{ height: 20, background: `color-mix(in oklch, var(--s-primary) ${20 + n * 20}%, var(--s-surface))` }} />
      ))}
    </Stack>
  )},
  { name: "Accordion", category: "Layout", variants: 1, render: () => (
    <Accordion type="single" collapsible defaultValue="a" className="w-full">
      <AccordionItem value="a">
        <AccordionTrigger className="text-xs py-1.5">What is Sigil?</AccordionTrigger>
        <AccordionContent className="text-[10px]">A token-driven design system.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger className="text-xs py-1.5">How many presets?</AccordionTrigger>
        <AccordionContent className="text-[10px]">44 curated presets.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )},
  { name: "Tabs", category: "Layout", variants: 2, render: () => (
    <Tabs defaultValue="code" className="w-full">
      <TabsList className="h-8">
        <TabsTrigger value="code" className="text-xs px-3">Code</TabsTrigger>
        <TabsTrigger value="preview" className="text-xs px-3">Preview</TabsTrigger>
        <TabsTrigger value="docs" className="text-xs px-3">Docs</TabsTrigger>
      </TabsList>
      <TabsContent value="code" className="text-xs text-[var(--s-text-muted)] mt-2 p-3 border border-[var(--s-border-muted)] rounded-[var(--s-radius-sm,4px)] font-mono">
        {'<Button>Click</Button>'}
      </TabsContent>
      <TabsContent value="preview" className="mt-2 p-3"><Button size="sm">Click</Button></TabsContent>
      <TabsContent value="docs" className="text-xs text-[var(--s-text-muted)] mt-2 p-3">Button documentation</TabsContent>
    </Tabs>
  )},
  { name: "Collapsible", category: "Layout", variants: 1, render: () => (
    <Collapsible defaultOpen className="w-full">
      <CollapsibleTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full text-xs justify-between">Toggle details <ArrowRight size={12} /></Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-2 mt-1 text-[10px] rounded-[var(--s-radius-sm,4px)] border border-[var(--s-border-muted)] text-[var(--s-text-muted)]">Hidden content is now visible. Click to collapse.</div>
      </CollapsibleContent>
    </Collapsible>
  )},
  { name: "AspectRatio", category: "Layout", variants: 1, render: () => (
    <div className="w-full overflow-hidden rounded-[var(--s-radius-md,6px)]">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full flex items-center justify-center bg-[var(--s-primary)] text-[var(--s-primary-contrast,#fff)]">
          <span className="font-mono text-xs font-semibold">16 : 9</span>
        </div>
      </AspectRatio>
    </div>
  )},
  { name: "Divider", category: "Layout", variants: 2, render: () => (
    <div className="flex w-full items-stretch gap-3">
      <div className="flex flex-1 flex-col gap-1">
        <Divider pattern="vertical" size="xs" />
        <Divider pattern="diagonal" size="xs" />
        <Divider pattern="vertical" size="xs" />
      </div>
      <Divider orientation="vertical" pattern="diagonal" size="sm" className="h-auto self-stretch" />
    </div>
  )},
  { name: "HRule", category: "Layout", variants: 1, render: () => (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] text-[var(--s-text-muted)]">Above</span>
      <HRule className="w-full" />
      <span className="text-[10px] text-[var(--s-text-muted)]">Below</span>
    </div>
  )},
  { name: "ButtonGroup", category: "Layout", variants: 1, render: () => (
    <ButtonGroup>
      <Button size="sm" variant="outline" className="text-xs">Left</Button>
      <Button size="sm" variant="outline" className="text-xs">Mid</Button>
      <Button size="sm" variant="outline" className="text-xs">Right</Button>
    </ButtonGroup>
  )},
  { name: "VoronoiBento", category: "Layout", variants: 1, render: () => (
    <VoronoiBento seeds={4} height={80} gap={4} className="w-full">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ background: `color-mix(in oklch, var(--s-primary) ${20 + i * 15}%, var(--s-surface))`, width: "100%", height: "100%" }} />
      ))}
    </VoronoiBento>
  )},
  { name: "Box", category: "Layout", variants: 1, render: () => (
    <Box bg="surface" p={16} style={{ border: "1px solid var(--s-border)" }}>
      <span className="text-xs text-[var(--s-text)]">Generic box</span>
    </Box>
  )},
  { name: "Container", category: "Layout", variants: 3, render: () => (
    <div className="w-full text-center">
      <Container className="text-[10px] text-[var(--s-text-muted)]" style={{ border: "1px dashed var(--s-border-muted)", padding: "8px" }}>
        max-width container
      </Container>
    </div>
  )},
  { name: "Flex", category: "Layout", variants: 1, render: () => (
    <Flex gap={8} align="center" className="w-full">
      <div className="w-8 h-8 bg-[var(--s-primary)] opacity-80" />
      <div className="w-8 h-12 bg-[var(--s-primary)] opacity-60" />
      <div className="w-8 h-6 bg-[var(--s-primary)] opacity-40" />
    </Flex>
  )},
  { name: "SimpleGrid", category: "Layout", variants: 1, render: () => (
    <SimpleGrid columns={3} gap={4} className="w-full">
      {[1,2,3,4,5,6].map(n => (
        <div key={n} className="h-8 bg-[var(--s-surface)] border border-[var(--s-border-muted)] flex items-center justify-center text-[9px] text-[var(--s-text-muted)]">{n}</div>
      ))}
    </SimpleGrid>
  )},
  { name: "Center", category: "Layout", variants: 1, render: () => (
    <Center className="w-full h-16 border border-dashed border-[var(--s-border-muted)]">
      <span className="text-xs text-[var(--s-text-muted)]">Centered</span>
    </Center>
  )},
  { name: "Spacer", category: "Layout", variants: 1, render: () => (
    <Flex direction="column" gap={0} className="w-full h-20">
      <div className="h-4 bg-[var(--s-primary)] opacity-60 w-full" />
      <Spacer />
      <div className="h-4 bg-[var(--s-primary)] opacity-60 w-full" />
    </Flex>
  )},
  { name: "AppShell", category: "Layout", variants: 1, span: 2, render: () => (
    <div className="w-full h-20 border border-[var(--s-border-muted)] overflow-hidden text-[9px]">
      <div className="h-4 border-b border-[var(--s-border-muted)] bg-[var(--s-surface)] flex items-center px-2 text-[var(--s-text-muted)]">Header</div>
      <div className="flex h-16">
        <div className="w-12 border-r border-[var(--s-border-muted)] bg-[var(--s-surface)] flex items-center justify-center text-[var(--s-text-muted)]">Side</div>
        <div className="flex-1 flex items-center justify-center text-[var(--s-text-muted)]">Main</div>
      </div>
    </div>
  )},
  { name: "Banner", category: "Layout", variants: 4, render: () => (
    <div className="flex flex-col gap-1 w-full">
      <Banner variant="info" className="text-[10px] py-1 px-2">Info banner</Banner>
      <Banner variant="success" className="text-[10px] py-1 px-2">Success</Banner>
    </div>
  )},
  { name: "Page Shell", category: "Layout", variants: 2, span: 2, render: () => (
    <div className="w-full text-[9px] border border-[var(--s-border-muted)] overflow-hidden" style={{ height: 48 }}>
      <div className="mx-auto w-4/5 h-full flex items-center justify-center text-[var(--s-text-muted)]">
        centered content
      </div>
    </div>
  )},

  /* ================================================================ */
  /* Navigation                                                        */
  /* ================================================================ */
  { name: "Breadcrumb", category: "Navigation", variants: 1, render: () => (
    <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Components", href: "#" }, { label: "Button" }]} />
  )},
  { name: "Pagination", category: "Navigation", variants: 1, render: () => (
    <PaginationPreview />
  )},
  { name: "Toolbar", category: "Navigation", variants: 1, render: () => (
    <Toolbar>
      <ToolbarButton><Bold size={14} /></ToolbarButton>
      <ToolbarButton><Italic size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton><Code size={14} /></ToolbarButton>
    </Toolbar>
  )},
  { name: "SplitButton", category: "Navigation", variants: 1, render: () => (
    <SplitButton icon={<CalendarIcon size={13} />}>Copilot</SplitButton>
  )},
  { name: "Navbar", category: "Navigation", variants: 1, render: () => (
    <div className="flex items-center justify-between w-full px-2 py-1 border-b border-[var(--s-border-muted)]">
      <span className="text-[10px] font-bold text-[var(--s-text)]">Logo</span>
      <div className="flex gap-3 text-[9px] text-[var(--s-text-muted)]"><span>Home</span><span>About</span></div>
    </div>
  )},
  { name: "Footer", category: "Navigation", variants: 1, render: () => (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 text-[9px]">
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Product</div><div className="text-[var(--s-text-muted)]">Docs</div></div>
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Company</div><div className="text-[var(--s-text-muted)]">About</div></div>
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Legal</div><div className="text-[var(--s-text-muted)]">Privacy</div></div>
      </div>
    </div>
  )},
  { name: "Sidebar", category: "Navigation", variants: 1, render: () => <SidebarPreview /> },
  { name: "SocialIcons", category: "Navigation", variants: 1, render: () => (
    <div className="flex gap-3 items-center">
      <Globe size={14} className="text-[var(--s-text-muted)]" />
      <Code size={14} className="text-[var(--s-text-muted)]" />
      <Cpu size={14} className="text-[var(--s-text-muted)]" />
    </div>
  )},
  { name: "NavigationMenu", category: "Navigation", variants: 1, render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="text-[10px] text-[var(--s-text)]">Docs</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="text-[10px] text-[var(--s-text-muted)]">Components</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )},
  { name: "Menubar", category: "Navigation", variants: 1, render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="text-[10px]">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem className="text-xs">New</MenubarItem>
          <MenubarItem className="text-xs">Export</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )},

  { name: "MagneticNav", category: "Navigation", variants: 1, span: 2, render: () => (
    <MagneticNav className="[&_ul]:flex-wrap">
      <MagneticNavItem><MagneticNavLink href="#" active>Home</MagneticNavLink></MagneticNavItem>
      <MagneticNavItem><MagneticNavLink href="#">Docs</MagneticNavLink></MagneticNavItem>
      <MagneticNavItem><MagneticNavLink href="#">Components</MagneticNavLink></MagneticNavItem>
      <MagneticNavItem><MagneticNavLink href="#">Presets</MagneticNavLink></MagneticNavItem>
    </MagneticNav>
  )},
  { name: "ProximityGlow", category: "Navigation", variants: 1, span: 2, render: () => (
    <ProximityGlow className="flex gap-3 w-full">
      <ProximityGlowCard className="flex-1 text-center">
        <div className="text-[10px] font-semibold text-[var(--s-text)]">Card A</div>
        <div className="text-[9px] text-[var(--s-text-muted)] mt-1">Hover near me</div>
      </ProximityGlowCard>
      <ProximityGlowCard className="flex-1 text-center">
        <div className="text-[10px] font-semibold text-[var(--s-text)]">Card B</div>
        <div className="text-[9px] text-[var(--s-text-muted)] mt-1">Glow border</div>
      </ProximityGlowCard>
    </ProximityGlow>
  )},

  /* ================================================================ */
  /* Overlays                                                          */
  /* ================================================================ */
  { name: "Dialog", category: "Overlays", variants: 2, span: 2, render: () => (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Dialog</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Confirm Action</DialogTitle><DialogDescription className="text-xs text-[var(--s-text-muted)]">Are you sure you want to proceed?</DialogDescription></DialogHeader></DialogContent>
    </Dialog>
  )},
  { name: "Drawer", category: "Overlays", variants: 2, render: () => (
    <Drawer>
      <DrawerTrigger render={<Button size="sm" variant="outline" className="text-xs" />}>Open Drawer</DrawerTrigger>
      <DrawerContent><DrawerHeader><DrawerTitle>Drawer</DrawerTitle></DrawerHeader></DrawerContent>
    </Drawer>
  )},
  { name: "Sheet", category: "Overlays", variants: 2, render: () => (
    <Sheet>
      <SheetTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Sheet</Button></SheetTrigger>
      <SheetContent side="right"><SheetHeader><SheetTitle>Settings</SheetTitle></SheetHeader></SheetContent>
    </Sheet>
  )},
  { name: "Popover", category: "Overlays", variants: 1, render: () => (
    <Popover>
      <PopoverTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Popover</Button></PopoverTrigger>
      <PopoverContent className="w-48 p-3"><p className="text-[10px]" style={{ color: "var(--s-text-muted)" }}>Popover content here</p></PopoverContent>
    </Popover>
  )},
  { name: "HoverCard", category: "Overlays", variants: 1, render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button size="sm" variant="ghost" className="text-xs underline">Hover me</Button></HoverCardTrigger>
      <HoverCardContent className="w-48 p-3"><p className="text-[10px]" style={{ color: "var(--s-text-muted)" }}>Rich preview on hover</p></HoverCardContent>
    </HoverCard>
  )},
  { name: "DropdownMenu", category: "Overlays", variants: 3, render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="sm" variant="outline" className="text-xs">Menu <ChevronDown size={12} /></Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )},
  { name: "ContextMenu", category: "Overlays", variants: 2, render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center justify-center h-16 w-full border-2 border-dashed border-[var(--s-border)] rounded-[var(--s-radius-md,6px)] text-[10px] text-[var(--s-text-muted)] bg-[var(--s-background)] cursor-context-menu">Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="text-xs">Cut</ContextMenuItem>
        <ContextMenuItem className="text-xs">Copy</ContextMenuItem>
        <ContextMenuItem className="text-xs">Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )},
  { name: "Command", category: "Overlays", variants: 2, span: 2, render: () => (
    <Command className="w-full border border-[var(--s-border)] rounded-[var(--s-radius-md,6px)]">
      <CommandInput placeholder="Type a command..." className="h-8 text-xs" />
    </Command>
  )},
  { name: "AlertDialog", category: "Overlays", variants: 1, render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="text-xs">Delete</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription className="text-xs">This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel><AlertDialogAction className="text-xs">Confirm</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )},
  { name: "Toast", category: "Overlays", variants: 4, render: () => (
    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Saved!", description: "Changes applied." })}>Show Toast</Button>
  )},
  { name: "Sonner", category: "Overlays", variants: 1, render: () => (
    <Button size="sm" variant="outline" className="text-xs" onClick={() => sonnerToast.success("Synced", { description: "Preset state saved." })}>Show Sonner</Button>
  )},

  /* ================================================================ */
  /* Data                                                              */
  /* ================================================================ */
  { name: "Table", category: "Data", variants: 1, span: 2, render: () => (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-[10px] p-1.5">Name</TableHead>
          <TableHead className="text-[10px] p-1.5">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell className="text-[10px] p-1.5">Button</TableCell><TableCell className="text-[10px] p-1.5"><Badge size="sm">Stable</Badge></TableCell></TableRow>
        <TableRow><TableCell className="text-[10px] p-1.5">Calendar</TableCell><TableCell className="text-[10px] p-1.5"><Badge size="sm" variant="outline">Beta</Badge></TableCell></TableRow>
      </TableBody>
    </Table>
  )},
  { name: "DataTable", category: "Data", variants: 1, span: 2, render: () => (
    <DataTable
      className="w-full [&_th]:text-[10px] [&_th]:p-1.5 [&_td]:text-[10px] [&_td]:p-1.5"
      columns={[
        { key: "component", header: "Component" },
        { key: "downloads", header: "Downloads", cell: (row) => <span className="tabular-nums">{row.downloads as string}</span> },
      ]}
      data={[
        { component: "Button", downloads: "12.4k" },
        { component: "Card", downloads: "9.1k" },
      ]}
    />
  )},
  { name: "Timeline", category: "Data", variants: 1, render: () => (
    <Timeline entries={[{ date: "Jan", title: "Created", description: "Project started" }, { date: "Feb", title: "Deployed", description: "v1.0 shipped" }]} />
  )},
  { name: "Stepper", category: "Data", variants: 1, span: 2, render: () => (
    <Stepper steps={[{ label: "Setup" }, { label: "Config" }, { label: "Deploy" }]} currentStep={1} />
  )},
  { name: "Meter", category: "Data", variants: 1, render: () => <Meter value={68} max={100} label="CPU Usage" /> },
  { name: "Calendar", category: "Data", variants: 1, span: 2, render: () => (
    <div className="w-full flex justify-center overflow-hidden">
      <Calendar mode="single" selected={createDemoDate()} className="p-0" />
    </div>
  )},
  { name: "DatePicker", category: "Data", variants: 1, render: () => (
    <div className="w-full flex flex-col gap-2 items-start">
      <DatePicker value={createDemoDate()} className="w-full" />
    </div>
  )},
  { name: "DateRangePicker", category: "Data", variants: 1, docPath: "/docs/components/date-picker", span: 2, render: () => (
    <div className="w-full flex flex-col gap-2 items-start">
      <DateRangePicker
        value={{ from: new Date(2026, 3, 20), to: new Date(2026, 3, 24) }}
        className="w-full text-[10px]"
      />
    </div>
  )},
  { name: "Carousel", category: "Data", variants: 1, span: 2, render: () => (
    <Carousel className="w-full px-8">
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>
            <div className="flex items-center justify-center h-20 rounded-[var(--s-radius-md,6px)] border border-[var(--s-border)] bg-[var(--s-background)] text-sm font-semibold text-[var(--s-text)]">
              Slide {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="h-6 w-6 left-0" />
      <CarouselNext className="h-6 w-6 right-0" />
    </Carousel>
  )},
  { name: "TreeView", category: "Data", variants: 1, render: () => (
    <TreeView
      data={[
        { id: "src", label: "src", icon: <Folder size={12} />, children: [
          { id: "app", label: "app.tsx", icon: <File size={12} /> },
          { id: "index", label: "index.ts", icon: <File size={12} /> },
        ]},
      ]}
      defaultExpanded={["src"]}
      className="w-full text-[10px]"
    />
  )},

  /* ================================================================ */
  /* Forms                                                             */
  /* ================================================================ */
  { name: "RadioGroup", category: "Forms", variants: 1, render: () => (
    <RadioGroup defaultValue="a" className="gap-2">
      <div className="flex items-center gap-2"><RadioGroupItem value="a" /><Label className="text-[10px]">React</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="b" /><Label className="text-[10px]">Vue</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="c" /><Label className="text-[10px]">Svelte</Label></div>
    </RadioGroup>
  )},
  { name: "CheckboxGroup", category: "Forms", variants: 1, render: () => (
    <CheckboxGroup>
      <CheckboxGroupItem value="ts" label="TypeScript" defaultChecked />
      <CheckboxGroupItem value="js" label="JavaScript" />
      <CheckboxGroupItem value="py" label="Python" />
    </CheckboxGroup>
  )},
  { name: "Combobox", category: "Forms", variants: 1, render: () => (
    <div className="w-full">
      <ControlledCombobox />
    </div>
  )},
  { name: "InputOTP", category: "Forms", variants: 1, render: () => (
    <div className="flex justify-center w-full">
      <InputOTP length={4}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )},
  { name: "Form", category: "Forms", variants: 1, span: 2, render: () => (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-[10px]">Email</Label>
      <Input placeholder="you@example.com" className="h-7 text-[10px]" />
      <Button size="sm" className="text-xs w-full">Submit</Button>
    </div>
  )},
  { name: "Field", category: "Forms", variants: 1, render: () => (
    <div className="flex flex-col gap-1 w-full">
      <FieldLabel className="text-[10px]">Username</FieldLabel>
      <Input className="h-7 text-[10px]" placeholder="kevinliu" />
      <FieldDescription className="text-[9px]">Your public display name</FieldDescription>
    </div>
  )},
  { name: "TagsInput", category: "Forms", variants: 1, render: () => (
    <TagsInput defaultValue={["React", "Sigil"]} className="w-full" />
  )},
  { name: "ColorPicker", category: "Forms", variants: 1, render: () => (
    <ColorPicker defaultValue="#3b82f6" swatches={["#ef4444", "#22c55e", "#3b82f6", "#8b5cf6"]} />
  )},
  { name: "Editable", category: "Forms", variants: 1, render: () => (
    <Editable defaultValue="Click to edit" />
  )},
  { name: "RatingGroup", category: "Forms", variants: 1, render: () => (
    <RatingGroup defaultValue={3} size="sm" />
  )},
  { name: "InputGroup", category: "Forms", variants: 1, span: 2, render: () => (
    <InputGroup className="w-full">
      <InputGroupAddon>$</InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
    </InputGroup>
  )},
  { name: "FileUpload", category: "Forms", variants: 1, render: () => (
    <FileUpload className="w-full [&>div]:py-4 [&>div]:px-3">
      <div className="flex flex-col items-center gap-1">
        <Upload size={14} style={{ color: "var(--s-text-muted)" }} />
        <span className="text-[10px]" style={{ color: "var(--s-text-muted)" }}>Drop files here</span>
      </div>
    </FileUpload>
  )},
  { name: "SignaturePad", category: "Forms", variants: 1, span: 2, render: () => (
    <SignaturePad width={160} height={60} className="w-full" />
  )},

  /* ================================================================ */
  /* Marketing                                                         */
  /* ================================================================ */
  { name: "Hero", category: "Marketing", variants: 2, render: () => (
    <div className="flex flex-col items-center gap-1 text-center w-full">
      <Badge size="sm" className="text-[9px]">New</Badge>
      <span className="text-xs font-bold" style={{ color: "var(--s-text)" }}>Ship faster</span>
      <span className="text-[9px]" style={{ color: "var(--s-text-muted)" }}>Token-driven design system</span>
    </div>
  )},
  { name: "CTA", category: "Marketing", variants: 2, render: () => (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className="text-xs font-semibold" style={{ color: "var(--s-text)" }}>Ready to start?</span>
      <Button size="sm" className="text-xs h-7">Get Started</Button>
    </div>
  )},
  { name: "Pricing", category: "Marketing", variants: 1, render: () => (
    <Pricing name="Pro" price="$19" period="/mo" features={["Unlimited", "Priority"]} className="w-full p-3 text-[10px] [&_h3]:text-[10px] [&_p]:text-xs [&_li]:text-[10px]" />
  )},
  { name: "PricingTiers", category: "Marketing", variants: 1, render: () => (
    <div className="flex gap-2 w-full">
      <div className="flex-1 rounded-[var(--s-radius-sm,4px)] border border-[var(--s-border-muted)] p-2 text-center">
        <div className="text-[9px] text-[var(--s-text-muted)]">Free</div>
        <div className="text-xs font-bold text-[var(--s-text)]">$0</div>
      </div>
      <div className="flex-1 rounded-[var(--s-radius-sm,4px)] border-2 border-[var(--s-primary)] p-2 text-center">
        <div className="text-[9px] text-[var(--s-text-muted)]">Pro</div>
        <div className="text-xs font-bold text-[var(--s-text)]">$19</div>
      </div>
      <div className="flex-1 rounded-[var(--s-radius-sm,4px)] border border-[var(--s-border-muted)] p-2 text-center">
        <div className="text-[9px] text-[var(--s-text-muted)]">Team</div>
        <div className="text-xs font-bold text-[var(--s-text)]">$49</div>
      </div>
    </div>
  )},
  { name: "FeatureGrid", category: "Marketing", variants: 1, span: 2, render: () => (
    <FeatureGrid rows={[
      { heading: "Fast", visual: <Zap size={16} style={{ color: "var(--s-primary)" }} /> },
      { heading: "Secure", visual: <Shield size={16} style={{ color: "var(--s-primary)" }} /> },
    ]} className="w-full [&_h3]:text-[10px] [&>div]:min-h-0 [&>div]:py-2" />
  )},
  { name: "ComparisonTable", category: "Marketing", variants: 1, span: 2, render: () => (
    <ComparisonTable
      columns={["Sigil", "Other"]}
      features={[
        { name: "Tokens", values: { Sigil: true, Other: false } },
        { name: "Presets", values: { Sigil: true, Other: false } },
      ]}
      className="w-full text-[10px] [&_th]:text-[10px] [&_th]:py-1 [&_th]:px-2 [&_td]:text-[10px] [&_td]:py-1 [&_td]:px-2"
    />
  )},
  { name: "TestimonialCard", category: "Marketing", variants: 1, span: 2, render: () => (
    <TestimonialCard
      quote="Sigil completely changed how we build."
      author="Maren Voss"
      role="CTO"
      className="w-full"
    />
  )},
  { name: "LogoBar", category: "Marketing", variants: 1, render: () => (
    <div className="flex items-center justify-center gap-4 w-full opacity-60">
      <Globe size={16} /><Cpu size={16} /><Code size={16} /><Zap size={16} />
    </div>
  )},
  { name: "AnnouncementBar", category: "Marketing", variants: 1, span: 2, render: () => (
    <AnnouncementBar message="New: Sigil v2.0 is here" badge="NEW" className="w-full" />
  )},
  { name: "BlogGrid", category: "Marketing", variants: 1, span: 2, render: () => (
    <BlogGrid
      posts={[{ title: "Getting Started with Sigil", date: "Apr 2026", excerpt: "A quick intro." }]}
      className="w-full [&_h3]:text-[10px] [&_p]:text-[9px] [&_span]:text-[9px]"
    />
  )},
  { name: "CostCalculator", category: "Marketing", variants: 1, render: () => (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between text-[10px]">
        <span className="text-[var(--s-text-muted)]">Users</span>
        <span className="font-semibold text-[var(--s-text)]">~1,000</span>
      </div>
      <Slider defaultValue={[40]} className="w-full" />
      <div className="text-right text-xs font-semibold text-[var(--s-text)]">$29/mo</div>
    </div>
  )},
  { name: "FeatureFrame", category: "Marketing", variants: 1, render: () => (
    <div className="flex items-start gap-2 w-full">
      <div className="w-8 h-8 rounded-[var(--s-radius-md,0px)] bg-[var(--s-primary-muted)] flex items-center justify-center"><Zap size={14} className="text-[var(--s-primary)]" /></div>
      <div><div className="text-[10px] font-semibold text-[var(--s-text)]">Fast</div><div className="text-[9px] text-[var(--s-text-muted)]">Sub-50ms builds</div></div>
    </div>
  )},
  { name: "UnitPricing", category: "Marketing", variants: 1, span: 2, render: () => (
    <div className="grid grid-cols-2 gap-2 w-full text-center">
      <div className="p-2 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border-muted)]"><div className="text-xs font-bold text-[var(--s-text)]">$0.01</div><div className="text-[9px] text-[var(--s-text-muted)]">per request</div></div>
      <div className="p-2 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border-muted)]"><div className="text-xs font-bold text-[var(--s-text)]">$0.10</div><div className="text-[9px] text-[var(--s-text-muted)]">per minute</div></div>
    </div>
  )},
  { name: "BlogHeader", category: "Marketing", variants: 1, render: () => (
    <div className="w-full text-center">
      <div className="text-xs font-bold text-[var(--s-text)]">Engineering Blog</div>
      <div className="flex gap-2 justify-center mt-1">
        <span className="text-[9px] text-[var(--s-primary)] font-medium">All</span>
        <span className="text-[9px] text-[var(--s-text-muted)]">Design</span>
        <span className="text-[9px] text-[var(--s-text-muted)]">Eng</span>
      </div>
    </div>
  )},

  /* ================================================================ */
  /* Sections                                                          */
  /* ================================================================ */
  { name: "SectionHeading", category: "Sections", variants: 2, render: () => (
    <div className="w-full">
      <SectionHeading label="Features" title="Built for speed" description="Every component reads from tokens." className="mb-0 [&_h2]:text-base [&_p]:text-[10px] [&_p]:mt-1" />
    </div>
  )},
  { name: "HeroSection", category: "Sections", variants: 3, render: () => (
    <div className="w-full text-center">
      <Badge className="text-[9px] mb-2">New</Badge>
      <div className="text-sm font-bold text-[var(--s-text)]">Ship 10x faster</div>
      <div className="text-[10px] text-[var(--s-text-muted)] mt-1">Token-driven components</div>
      <div className="flex gap-2 justify-center mt-3">
        <Button size="sm" className="text-[10px] h-6 px-3">Get Started</Button>
        <Button size="sm" variant="outline" className="text-[10px] h-6 px-3">Docs</Button>
      </div>
    </div>
  )},
  { name: "FeatureSection", category: "Sections", variants: 2, render: () => (
    <div className="grid grid-cols-2 gap-2 w-full">
      {[{ t: "Fast", d: "Sub-50ms" }, { t: "Tokens", d: "519 fields" }, { t: "Presets", d: "44 themes" }, { t: "CLI", d: "One command" }].map((f) => (
        <div key={f.t} className="p-2 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border-muted)] bg-[var(--s-background)]">
          <div className="text-[10px] font-semibold text-[var(--s-text)]">{f.t}</div>
          <div className="text-[9px] text-[var(--s-text-muted)]">{f.d}</div>
        </div>
      ))}
    </div>
  )},
  { name: "CTASection", category: "Sections", variants: 2, render: () => (
    <div className="w-full text-center">
      <div className="text-sm font-bold text-[var(--s-text)]">Ready to start?</div>
      <div className="text-[10px] text-[var(--s-text-muted)] mt-1">Deploy in under a minute.</div>
      <Button size="sm" className="text-[10px] h-6 mt-3">Get Started</Button>
    </div>
  )},
  { name: "FAQSection", category: "Sections", variants: 1, render: () => (
    <Accordion type="single" collapsible defaultValue="q0" className="w-full">
      <AccordionItem value="q0"><AccordionTrigger className="text-[10px] py-1">What is Sigil?</AccordionTrigger><AccordionContent className="text-[9px]">A token-driven design system.</AccordionContent></AccordionItem>
      <AccordionItem value="q1"><AccordionTrigger className="text-[10px] py-1">How many presets?</AccordionTrigger><AccordionContent className="text-[9px]">44 curated presets.</AccordionContent></AccordionItem>
    </Accordion>
  )},
  { name: "StatsSection", category: "Sections", variants: 3, render: () => (
    <div className="grid grid-cols-3 gap-2 w-full text-center">
      {[{ v: "350+", l: "Token-Driven Components" }, { v: "46", l: "Presets" }, { v: "519", l: "Tokens" }].map((s) => (
        <div key={s.l} className="py-2">
          <div className="text-base font-bold text-[var(--s-text)]">{s.v}</div>
          <div className="text-[9px] text-[var(--s-text-muted)]">{s.l}</div>
        </div>
      ))}
    </div>
  )},
  { name: "BentoSection", category: "Sections", variants: 1, render: () => (
    <div className="grid grid-cols-3 grid-rows-2 gap-1.5 w-full h-[80px]">
      <div className="col-span-2 rounded-[var(--s-radius-sm,0px)] bg-[var(--s-primary)] opacity-90" />
      <div className="rounded-[var(--s-radius-sm,0px)] bg-[var(--s-surface)] border border-[var(--s-border-muted)]" />
      <div className="rounded-[var(--s-radius-sm,0px)] bg-[var(--s-surface)] border border-[var(--s-border-muted)]" />
      <div className="col-span-2 rounded-[var(--s-radius-sm,0px)] bg-[var(--s-surface)] border border-[var(--s-border-muted)]" />
    </div>
  )},
  { name: "TestimonialsSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full">
      <div className="text-[10px] text-[var(--s-text-subtle)] mb-1">&ldquo;</div>
      <div className="text-[10px] text-[var(--s-text)] leading-relaxed">Sigil changed how we build UIs.</div>
      <div className="mt-2 text-[9px] font-medium text-[var(--s-text-muted)]">Maren V. &mdash; CTO</div>
    </div>
  )},
  { name: "LogoCloudSection", category: "Sections", variants: 1, render: () => (
    <div className="flex items-center justify-center gap-4 w-full opacity-50">
      <Globe size={14} /><Cpu size={14} /><Code size={14} /><Zap size={14} /><Shield size={14} />
    </div>
  )},
  { name: "ComparisonSection", category: "Sections", variants: 1, render: () => (
    <Table className="w-full">
      <TableHeader><TableRow><TableHead className="text-[9px] p-1">Feature</TableHead><TableHead className="text-[9px] p-1 text-center">Us</TableHead><TableHead className="text-[9px] p-1 text-center">Others</TableHead></TableRow></TableHeader>
      <TableBody>
        <TableRow><TableCell className="text-[9px] p-1">Tokens</TableCell><TableCell className="text-[9px] p-1 text-center text-[var(--s-success)]">✓</TableCell><TableCell className="text-[9px] p-1 text-center text-[var(--s-text-subtle)]">—</TableCell></TableRow>
        <TableRow><TableCell className="text-[9px] p-1">Presets</TableCell><TableCell className="text-[9px] p-1 text-center text-[var(--s-success)]">✓</TableCell><TableCell className="text-[9px] p-1 text-center text-[var(--s-text-subtle)]">—</TableCell></TableRow>
      </TableBody>
    </Table>
  )},
  { name: "CodeShowcaseSection", category: "Sections", variants: 1, span: 2, render: () => (
    <div className="w-full rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border)] overflow-hidden">
      <div className="flex border-b border-[var(--s-border)] bg-[var(--s-surface)]">
        <span className="px-2 py-1 text-[9px] font-mono text-[var(--s-text)] border-b-2 border-[var(--s-primary)]">TypeScript</span>
        <span className="px-2 py-1 text-[9px] font-mono text-[var(--s-text-muted)]">Python</span>
      </div>
      <pre className="p-2 text-[9px] font-mono text-[var(--s-text)] bg-[var(--s-background)]">{'import { Button } from "@sigil-ui/components"'}</pre>
    </div>
  )},
  { name: "TeamSection", category: "Sections", variants: 1, render: () => (
    <div className="flex gap-4 justify-center w-full">
      {["KL", "JD", "AR"].map((initials) => (
        <div key={initials} className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-[var(--s-radius-full,9999px)] bg-[var(--s-surface)] flex items-center justify-center text-[9px] font-semibold text-[var(--s-text-muted)]">{initials}</div>
          <div className="text-[9px] text-[var(--s-text-muted)]">Engineer</div>
        </div>
      ))}
    </div>
  )},
  { name: "TimelineSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-[var(--s-border)]" />
      {[{ d: "v2.0", t: "Sections" }, { d: "v1.5", t: "Presets" }, { d: "v1.0", t: "Launch" }].map((e) => (
        <div key={e.d} className="relative mb-3 last:mb-0">
          <div className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-[var(--s-primary)]" />
          <div className="text-[9px] font-mono text-[var(--s-text-muted)]">{e.d}</div>
          <div className="text-[10px] font-semibold text-[var(--s-text)]">{e.t}</div>
        </div>
      ))}
    </div>
  )},
  { name: "NewsletterSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full text-center">
      <div className="text-xs font-semibold text-[var(--s-text)]">Stay updated</div>
      <div className="flex gap-1.5 mt-2">
        <Input placeholder="you@email.com" className="h-7 text-[10px] flex-1" />
        <Button size="sm" className="text-[10px] h-7 px-3">Subscribe</Button>
      </div>
    </div>
  )},
  { name: "FooterSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2 text-[9px]">
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Product</div><div className="text-[var(--s-text-muted)]">Features</div><div className="text-[var(--s-text-muted)]">Pricing</div></div>
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Company</div><div className="text-[var(--s-text-muted)]">About</div><div className="text-[var(--s-text-muted)]">Blog</div></div>
        <div><div className="font-semibold text-[var(--s-text)] mb-1">Legal</div><div className="text-[var(--s-text-muted)]">Privacy</div><div className="text-[var(--s-text-muted)]">Terms</div></div>
      </div>
    </div>
  )},
  { name: "LargeTextSection", category: "Sections", variants: 1, render: () => (
    <div className="text-sm font-bold text-[var(--s-text)] leading-tight">
      A <em className="text-[var(--s-primary)] not-italic">new species</em> of design system.
    </div>
  )},
  { name: "FeatureShowcaseSection", category: "Sections", variants: 1, span: 2, render: () => (
    <div className="grid grid-cols-2 gap-2 w-full text-[9px]">
      <div className="text-[var(--s-text)]"><div className="font-semibold">Feature A</div><div className="text-[var(--s-text-muted)]">Description</div></div>
      <div className="h-10 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border-muted)] bg-[var(--s-background)]" />
    </div>
  )},
  { name: "InstallSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full">
      <div className="text-[10px] font-semibold text-[var(--s-text)] mb-1">Install</div>
      <div className="flex gap-1.5">
        <code className="text-[9px] font-mono px-2 py-1 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border)] bg-[var(--s-background)] text-[var(--s-text)]">$ npm install</code>
      </div>
    </div>
  )},
  { name: "GradientBannerSection", category: "Sections", variants: 1, render: () => (
    <div className="w-full h-12 rounded-[var(--s-radius-sm,0px)] flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--s-primary), var(--s-primary-muted))" }}>
      <span className="text-[10px] font-bold text-[var(--s-primary-contrast,#fff)]">Brand Banner</span>
    </div>
  )},

  /* ================================================================ */
  /* Shapes                                                            */
  /* ================================================================ */
  { name: "Diamond", category: "Shapes", variants: 2, render: () => <Diamond size="sm" className="!bg-[var(--s-primary)]" /> },
  { name: "Hexagon", category: "Shapes", variants: 2, render: () => <Hexagon size="sm" className="!bg-[var(--s-primary)]" /> },
  { name: "Triangle", category: "Shapes", variants: 2, render: () => <Triangle size="sm" className="!bg-[var(--s-primary)]" /> },
  { name: "Diagonal", category: "Shapes", variants: 1, render: () => <Diagonal height={48} fill="var(--s-primary)" className="w-20" /> },
  { name: "Shape", category: "Shapes", variants: 6, span: 2, render: () => (
    <div className="flex gap-3">
      <Shape variant="circle" size="sm" strokeWidth={1.5} />
      <Shape variant="diamond" size="sm" strokeWidth={1.5} />
      <Shape variant="cross" size="sm" strokeWidth={1.5} />
      <Shape variant="pill" size="sm" strokeWidth={1.5} />
    </div>
  )},
  { name: "Cross", category: "Shapes", variants: 1, span: 2, render: () => <Cross size={24} strokeWidth={1.5} /> },

  /* ================================================================ */
  /* New UI                                                            */
  /* ================================================================ */
  { name: "Panel", category: "UI", variants: 3, render: () => (
    <Panel compact className="w-full">
      <PanelHead>
        <span style={{ fontSize: "11px", fontWeight: 600 }}>Settings</span>
        <Badge variant="secondary">3</Badge>
      </PanelHead>
      <p style={{ fontSize: "11px", color: "var(--s-text-muted)", margin: 0 }}>Token-driven content panel</p>
    </Panel>
  )},
  { name: "Braille Spinner", category: "UI", variants: 6, render: () => (
    <div className="flex gap-3 items-center flex-wrap">
      <BrailleSpinner name="orbit" />
      <BrailleSpinner name="scan" />
      <BrailleSpinner name="breathe" />
      <BrailleSpinner name="helix" />
    </div>
  )},
  { name: "Accessible Icon", category: "UI", variants: 1, render: () => (
    <div className="flex items-center gap-2" style={{ fontSize: "12px" }}>
      <AccessibleIcon label="Favorite">
        <Heart size={16} />
      </AccessibleIcon>
      <span style={{ color: "var(--s-text-muted)", fontSize: "11px" }}>a11y wrapper</span>
    </div>
  )},
  { name: "Segmented Control", category: "UI", variants: 1, render: () => (
    <SegmentedControl value="grid" onValueChange={() => {}}>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="list">List</SegmentedControlItem>
    </SegmentedControl>
  )},
  { name: "Circular Progress", category: "UI", variants: 2, render: () => (
    <div className="flex gap-3 items-center">
      <CircularProgress value={25} size={28} strokeWidth={3} />
      <CircularProgress value={65} size={28} strokeWidth={3} />
      <CircularProgress size={28} strokeWidth={3} />
    </div>
  )},
  { name: "Password Input", category: "Forms", variants: 1, render: () => (
    <PasswordInput placeholder="Enter password..." className="h-9 text-xs w-full" />
  )},

  /* ================================================================ */
  /* Patterns                                                          */
  /* ================================================================ */
  { name: "Pattern", category: "Patterns", variants: 7, render: () => (
    <div className="grid grid-cols-3 gap-1 w-full">
      {(["dots", "hatch", "diagonal"] as const).map((v) => (
        <Pattern key={v} variant={v} className="h-8 w-full" style={{ opacity: 0.5 }} />
      ))}
    </div>
  )},
  { name: "Tessellation", category: "Patterns", variants: 7, span: 2, render: () => (
    <Tessellation variant="zigzag" className="w-full" style={{ height: 48 }} opacity={0.4} />
  )},
  { name: "GrainGradient", category: "Patterns", variants: 4, render: () => (
    <div className="relative overflow-hidden rounded-md w-full" style={{ height: 48, background: "var(--s-surface)" }}>
      <GrainGradient tint="accent" intensity="medium" />
    </div>
  )},

  /* ================================================================ */
  /* 3D                                                                */
  /* ================================================================ */
  { name: "Box3D", category: "3D", variants: 2, render: () => (
    <Box3D depth={24} tiltX={-12} tiltY={20} perspective={400} variant="card" className="w-[72px] h-[72px]">
      <div className="w-full h-full flex items-center justify-center font-mono" style={{ fontSize: 10, color: "var(--s-text-muted)" }}>3D</div>
    </Box3D>
  )},
  { name: "Card3D", category: "3D", variants: 1, render: () => (
    <Card3D className="w-[80px] h-[60px] rounded border border-[var(--s-border)] bg-[var(--s-surface)] flex items-center justify-center">
      <span className="font-mono text-[10px]" style={{ color: "var(--s-text-muted)" }}>Tilt me</span>
    </Card3D>
  )},
  { name: "FloatingUI", category: "3D", variants: 1, render: () => (
    <FloatingUI
      layers={[
        <div key="a" className="w-16 h-8 rounded bg-[var(--s-surface)] border border-[var(--s-border)] flex items-center justify-center text-[9px]" style={{ color: "var(--s-text-muted)" }}>A</div>,
        <div key="b" className="w-16 h-8 rounded bg-[var(--s-surface)] border border-[var(--s-border)] flex items-center justify-center text-[9px]" style={{ color: "var(--s-text-muted)" }}>B</div>,
      ]}
      offset={12}
      shadowDepth="sm"
      className="h-[60px]"
    />
  )},
  { name: "IsometricView", category: "3D", variants: 1, span: 2, render: () => (
    <IsometricView angle={25} className="w-[64px] h-[64px]">
      <div className="w-full h-full rounded bg-[var(--s-primary)] opacity-80 flex items-center justify-center text-white text-[10px]">ISO</div>
    </IsometricView>
  )},
  { name: "ExplodedView", category: "3D", variants: 1, span: 2, render: () => (
    <ExplodedView
      gap="0.5rem"
      layers={[
        { label: "UI", children: <div className="text-[9px] text-center" style={{ color: "var(--s-text-muted)" }}>Frontend</div> },
        { label: "API", children: <div className="text-[9px] text-center" style={{ color: "var(--s-text-muted)" }}>Backend</div>, hatched: true },
      ]}
      className="w-full [&>div>div]:p-2"
    />
  )},
  { name: "IsometricPrism", category: "3D", variants: 1, render: () => (
    <IsometricPrism width={50} height={40} depth={50} topColor="var(--s-primary)" />
  )},
  { name: "IsometricCylinder", category: "3D", variants: 1, render: () => (
    <IsometricCylinder radius={25} height={40} topColor="var(--s-primary)" />
  )},
  { name: "IsometricScene", category: "3D", variants: 1, span: 2, render: () => (
    <IsometricScene height={80} className="w-full">
      <IsometricPrism width={40} height={30} depth={40} topColor="var(--s-primary)" />
    </IsometricScene>
  )},
  { name: "Box3DGrid", category: "3D", variants: 1, render: () => (
    <Box3DGrid
      columns={3}
      gap={8}
      className="w-full max-w-[150px]"
      items={[1, 2, 3].map((n) => ({
        key: String(n),
        depth: 12,
        tiltX: -10,
        tiltY: 18,
        className: "h-10",
        children: <span className="text-[9px] font-mono text-[var(--s-text-muted)]">{n}</span>,
      }))}
    />
  )},

  /* ================================================================ */
  /* Diagrams                                                          */
  /* ================================================================ */
  { name: "Diagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <Diagram showGrid gridSize={16} className="w-full p-3" style={{ minHeight: 60 }}>
      <div className="flex items-center justify-center gap-2">
        {["A", "B", "C"].map((n) => (
          <div key={n} className="px-2 py-1 rounded border border-[var(--s-border)] bg-[var(--s-surface)] text-[9px] font-mono" style={{ color: "var(--s-text-muted)" }}>{n}</div>
        ))}
      </div>
    </Diagram>
  )},
  { name: "Sigil Diagram Mark", category: "Diagrams", variants: 12, docPath: null, render: () => (
    <div
      className="relative flex h-24 w-full items-center justify-center overflow-hidden"
      style={{
        border: "var(--s-border-thin,1px) var(--s-border-style,solid) var(--s-border)",
        borderRadius: "var(--s-radius-md,8px)",
        background:
          "linear-gradient(var(--s-border-muted) 1px, transparent 1px), linear-gradient(90deg, var(--s-border-muted) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="scale-[2.4]" style={{ color: "var(--s-primary)" }}>
        <FooterLogo />
      </div>
      <span
        className="absolute bottom-2 left-2 font-[family-name:var(--s-font-mono)] text-[9px] uppercase tracking-[0.08em]"
        style={{ color: "var(--s-text-muted)" }}
      >
        legacy rotating diagrams
      </span>
    </div>
  )},
  { name: "FlowDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <FlowDiagram
      nodes={[{ id: "1", label: "Start" }, { id: "2", label: "End" }]}
      connections={[{ from: "1", to: "2" }]}
      className="w-full text-[10px] [&_span]:text-[10px]"
    />
  )},
  { name: "ArchitectureDiagram", category: "Diagrams", variants: 1, render: () => (
    <ArchitectureDiagram
      gap="0.4rem"
      layers={[
        { label: "UI", children: <span className="text-[9px]">React</span> },
        { label: "API", children: <span className="text-[9px]">REST</span>, hatched: true },
      ]}
      className="w-full p-3 [&_h3]:text-[9px] [&_h3]:mb-2 [&>div>div>div>div]:p-1.5 [&_span]:text-[9px]"
    />
  )},
  { name: "AnimateOnScroll", category: "Animation", variants: 1, render: () => (
    <ReplayPreview interval={3000}>
      {() => (
        <AnimateOnScroll preset="fadeUp">
          <div className="text-xs font-semibold text-center" style={{ color: "var(--s-text)" }}>Fade up on scroll</div>
        </AnimateOnScroll>
      )}
    </ReplayPreview>
  )},
  { name: "DiagramNode", category: "Diagrams", variants: 4, render: () => (
    <div className="flex gap-2 items-center">
      <DiagramNode label="Default" size="sm" />
      <DiagramNode label="Accent" size="sm" variant="accent" />
      <DiagramNode label="Muted" size="sm" variant="muted" />
    </div>
  )},
  { name: "DiagramConnector", category: "Diagrams", variants: 3, render: () => (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-[var(--s-text-muted)]">A</span>
      <DiagramConnector variant="dashed-animated" direction="horizontal" length={80} />
      <span className="text-[10px] text-[var(--s-text-muted)]">B</span>
    </div>
  )},
  { name: "DiagramLabel", category: "Diagrams", variants: 3, render: () => (
    <div className="flex gap-4 items-end">
      <DiagramLabel text="Auth" variant="default" />
      <DiagramLabel text="Error" variant="warn" />
      <DiagramLabel text="API" variant="accent" />
    </div>
  )},
  { name: "CrossHatch", category: "Diagrams", variants: 1, render: () => (
    <div className="relative w-full h-16 rounded-[var(--s-radius-sm,0px)] border border-[var(--s-border-muted)] overflow-hidden">
      <CrossHatch className="w-full h-full" />
    </div>
  )},
  { name: "PipelineDiagram", category: "Diagrams", variants: 2, span: 2, render: () => (
    <PipelineDiagram
      steps={[{ label: "Auth" }, { label: "Route" }, { label: "Run" }]}
      connector="dashed-animated"
      showNumbers={false}
      className="scale-75 origin-center"
    />
  )},
  { name: "StackDiagram", category: "Diagrams", variants: 2, span: 2, render: () => (
    <StackDiagram
      layers={[{ label: "UI" }, { label: "API", hatched: true }, { label: "DB", accent: true }]}
      gap="0.25rem"
      className="w-full [&>div>div]:min-h-[32px]"
    />
  )},
  { name: "HubSpokeDiagram", category: "Diagrams", variants: 1, render: () => (
    <HubSpokeDiagram
      hub={{ label: "Core" }}
      spokes={[
        { id: "tokens", label: "Tokens", side: "left" },
        { id: "cli", label: "CLI", side: "left" },
        { id: "docs", label: "Docs", side: "right" },
        { id: "ui", label: "UI", side: "right" },
      ]}
      className="scale-75"
    />
  )},
  { name: "BeforeAfterDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <BeforeAfterDiagram
      before={<div className="text-[9px] text-[var(--s-text-muted)]">Messy</div>}
      after={<div className="text-[9px] text-[var(--s-text-muted)]">Clean</div>}
      className="[&>div]:p-2 w-full"
    />
  )},
  { name: "EcosystemDiagram", category: "Diagrams", variants: 1, render: () => (
    <EcosystemDiagram
      center={{ label: "Sigil" }}
      ring={[{ label: "Tokens" }, { label: "Presets" }, { label: "Docs" }, { label: "CLI" }]}
      size={150}
    />
  )},
  { name: "GlobeDiagram", category: "Diagrams", variants: 1, render: () => (
    <GlobeDiagram size={100} cities={[{ lat: 40.7, lon: -74, label: "NYC" }, { lat: 51.5, lon: 0, label: "LON" }]} />
  )},
  { name: "OrbitDiagram", category: "Diagrams", variants: 1, render: () => (
    <OrbitDiagram
      center={{ label: "Core" }}
      nodes={[{ label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }]}
      labels={["token", "ui"]}
      size={150}
    />
  )},
  { name: "StreamFlowDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <StreamFlowDiagram source={{ label: "LLM" }} tokens={["Hello", "World"]} className="w-full [&>div]:p-2 [&>div]:gap-2" />
  )},
  { name: "HubRouteDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <HubRouteDiagram
      source={{ label: "App" }}
      hub={{ label: "Sigil", layers: [{ label: "Tokens" }, { label: "UI" }] }}
      leftTargets={[{ label: "Docs" }]}
      rightTargets={[{ label: "CSS" }, { label: "React" }]}
      className="w-full p-3 [&_*]:text-[9px]"
    />
  )},
  { name: "PlatformHubDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <ScrollArea orientation="horizontal" type="auto" className="w-full">
      <PlatformHubDiagram
        left={[{ label: "Inputs", items: [{ label: "Tokens" }, { label: "Presets" }] }]}
        center={{ label: "Platform", items: [{ label: "CLI" }] }}
        right={[{ label: "Outputs", items: [{ label: "CSS" }, { label: "Components" }] }]}
        className="w-full min-w-[calc(8*var(--s-grid-cell))] p-3 [&_*]:text-[9px]"
      />
    </ScrollArea>
  )},
  { name: "IsometricStackDiagram", category: "Diagrams", variants: 1, render: () => (
    <IsometricStackDiagram layers={[{ label: "App" }, { label: "API", hatched: true }, { label: "Infra", color: "var(--s-primary)" }]} width={60} layerHeight={12} className="mx-auto" />
  )},
  { name: "FeatureMiniDiagram", category: "Diagrams", variants: 4, render: () => (
    <div className="grid grid-cols-2 gap-1">
      <FeatureMiniDiagram variant="timeline-bars" size={50} />
      <FeatureMiniDiagram variant="wave-state" size={50} />
      <FeatureMiniDiagram variant="layer-stack" size={50} />
      <FeatureMiniDiagram variant="hub-spoke" size={50} />
    </div>
  )},
  { name: "SankeyDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <SankeyDiagram
      sources={[{ label: "A", value: 30 }, { label: "B", value: 20 }]}
      targets={[{ label: "X", value: 25 }, { label: "Y", value: 25 }]}
      links={[{ source: 0, target: 0, value: 20 }, { source: 0, target: 1, value: 10 }, { source: 1, target: 0, value: 5 }, { source: 1, target: 1, value: 15 }]}
      width={200} height={100}
    />
  )},
  { name: "WaterfallChart", category: "Diagrams", variants: 1, span: 2, render: () => (
    <WaterfallChart
      rows={[
        { label: "Traditional", steps: [{ label: "Pull", duration: 500 }, { label: "Start", duration: 500 }, { label: "Install", duration: 1000 }] },
        { label: "Sigil", steps: [{ label: "Restore", duration: 50, color: "var(--s-primary)" }], accent: true },
      ]}
      badge="~40x faster"
    />
  )},
  { name: "CapabilityGrid", category: "Diagrams", variants: 1, render: () => (
    <CapabilityGrid
      categories={[
        { label: "Runtimes", items: [{ name: "Node" }, { name: "Python" }, { name: "Rust" }] },
        { label: "System", items: [{ name: "Root", color: "var(--s-success,#22c55e)" }, { name: "GPU", color: "var(--s-success,#22c55e)" }] },
      ]}
    />
  )},
  { name: "IsolationStack", category: "Diagrams", variants: 1, render: () => (
    <IsolationStack
      layers={[
        { label: "Hardware", width: "100%" },
        { label: "Kernel", width: "78%" },
        { label: "VM", width: "56%", accent: true },
      ]}
    />
  )},
  { name: "StatePersistence", category: "Diagrams", variants: 1, render: () => (
    <StatePersistence
      activeItem={{ label: "Active", value: "Free", variant: "success" }}
      competitors={[{ label: "competitor-a", value: "$0.09/hr", variant: "danger" }]}
    />
  )},
  { name: "MermaidDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <MermaidDiagram
      chart={"flowchart LR\n  A[Tokens] --> B[CSS]\n  B --> C[Components]"}
      className="max-h-[120px] p-2 text-[10px]"
    />
  )},
  { name: "BarChart", category: "Diagrams", variants: 1, render: () => (
    <BarChart groups={[{ label: "Q1", bars: [{ label: "UI", value: 42 }, { label: "Docs", value: 28 }] }]} maxBarSize={80} />
  )},
  { name: "PieChart", category: "Diagrams", variants: 1, render: () => (
    <PieChart slices={[{ label: "UI", value: 45 }, { label: "Docs", value: 35 }, { label: "CLI", value: 20 }]} width={160} height={120} />
  )},
  { name: "DonutChart", category: "Diagrams", variants: 1, render: () => (
    <DonutChart segments={[{ label: "Used", value: 68 }, { label: "Free", value: 32 }]} centerValue="68%" width={160} height={120} />
  )},
  { name: "LineChart", category: "Diagrams", variants: 1, render: () => (
    <LineChart series={[{ label: "Builds", points: [{ label: "Mon", value: 12 }, { label: "Tue", value: 18 }, { label: "Wed", value: 15 }, { label: "Thu", value: 28 }] }]} width={180} height={110} showYLabels={false} />
  )},
  { name: "AreaChart", category: "Diagrams", variants: 1, render: () => (
    <AreaChart series={[{ label: "Usage", points: [{ label: "Mon", value: 20 }, { label: "Tue", value: 32 }, { label: "Wed", value: 28 }, { label: "Thu", value: 44 }] }]} width={180} height={110} />
  )},
  { name: "RadarChart", category: "Diagrams", variants: 1, render: () => (
    <RadarChart axes={[{ label: "DX" }, { label: "A11y" }, { label: "Motion" }, { label: "Theme" }]} series={[{ label: "Sigil", values: [92, 84, 78, 96] }]} width={160} height={140} />
  )},
  { name: "FunnelChart", category: "Diagrams", variants: 1, render: () => (
    <FunnelChart steps={[{ label: "Visit", value: 1200 }, { label: "Install", value: 640 }, { label: "Ship", value: 320 }]} />
  )},
  { name: "HeatmapGrid", category: "Diagrams", variants: 1, render: () => (
    <HeatmapGrid
      data={[[{ value: 1 }, { value: 3 }, { value: 5 }], [{ value: 2 }, { value: 4 }, { value: 6 }]]}
      cellSize={28}
      xLabels={["A", "B", "C"]}
      yLabels={["1", "2"]}
    />
  )},
  { name: "MatrixDiagram", category: "Diagrams", variants: 1, render: () => (
    <MatrixDiagram
      cells={[[{ id: "a", label: "Fast" }, { id: "b", label: "Typed" }], [{ id: "c", label: "Token" }, { id: "d", label: "A11y" }]]}
      className="scale-75"
    />
  )},
  { name: "TreeDiagram", category: "Diagrams", variants: 1, span: 2, render: () => (
    <TreeDiagram
      compact
      root={{ id: "root", label: "Sigil", variant: "accent", children: [{ id: "tokens", label: "Tokens" }, { id: "components", label: "Components" }] }}
    />
  )},
  { name: "GanttChart", category: "Diagrams", variants: 1, span: 2, render: () => (
    <GanttChart
      totalUnits={4}
      unitLabels={["W1", "W2", "W3", "W4"]}
      groups={[{ label: "Build", tasks: [{ id: "docs", label: "Docs", start: 0, end: 2 }, { id: "ui", label: "UI", start: 1, end: 4, color: "var(--s-primary)" }] }]}
    />
  )},
  { name: "DependencyGraph", category: "Diagrams", variants: 1, render: () => (
    <DependencyGraph
      width={180}
      height={120}
      nodes={[{ id: "tokens", label: "Tokens", x: 40, y: 60 }, { id: "css", label: "CSS", x: 100, y: 35 }, { id: "ui", label: "UI", x: 145, y: 80 }]}
      edges={[{ from: "tokens", to: "css" }, { from: "css", to: "ui" }]}
    />
  )},
  { name: "NetworkGraph", category: "Diagrams", variants: 1, render: () => (
    <NetworkGraph
      width={180}
      height={120}
      nodes={[{ id: "a", label: "A", x: 40, y: 60 }, { id: "b", label: "B", x: 100, y: 35 }, { id: "c", label: "C", x: 145, y: 80 }]}
      edges={[{ source: "a", target: "b" }, { source: "b", target: "c" }]}
    />
  )},
  { name: "VennDiagram", category: "Diagrams", variants: 1, render: () => (
    <VennDiagram circles={[{ label: "Tokens" }, { label: "UI" }]} intersectionLabel="Sigil" width={170} height={120} />
  )},
  { name: "PricingTable", category: "Diagrams", variants: 1, span: 2, render: () => (
    <PricingTable
      columns={[{ name: "Free", price: "$0" }, { name: "Pro", price: "$19", highlighted: true }]}
      features={[{ name: "Tokens", values: { Free: true, Pro: true } }, { name: "Support", values: { Free: false, Pro: true } }]}
      className="w-full text-[10px]"
    />
  )},
  { name: "ChangelogTable", category: "Diagrams", variants: 1, span: 2, render: () => (
    <ChangelogTable releases={[{ version: "2.0", date: "Apr 2026", entries: [{ type: "added", description: "46 presets" }, { type: "fixed", description: "Docs links" }] }]} />
  )},
  { name: "StatusTable", category: "Diagrams", variants: 1, span: 2, render: () => (
    <StatusTable title="Status" services={[{ name: "API", status: "operational", uptime: "99.9%" }, { name: "Docs", status: "degraded", lastIncident: "1h ago" }]} />
  )},
  { name: "SpecTable", category: "Diagrams", variants: 1, span: 2, render: () => (
    <SpecTable title="Spec" rows={[{ label: "Tokens", value: "519" }, { label: "Presets", value: "46", highlight: true }]} />
  )},
  { name: "LeaderboardTable", category: "Diagrams", variants: 1, span: 2, render: () => (
    <LeaderboardTable title="Usage" rows={[{ label: "Button", value: 12400, highlight: true }, { label: "Card", value: 9100 }]} />
  )},
  { name: "CommitGrid", category: "Diagrams", variants: 1, span: 2, render: () => (
    <CommitGrid
      weeks={8}
      cellSize={8}
      data={Array.from({ length: 56 }, (_, i) => ({ date: `2026-04-${String((i % 28) + 1).padStart(2, "0")}`, count: i % 5 }))}
    />
  )},
  { name: "SparkLine", category: "Diagrams", variants: 1, render: () => (
    <SparkLine data={[3, 5, 4, 8, 7, 11, 14]} width={160} height={60} />
  )},
  { name: "UsageGauge", category: "Diagrams", variants: 1, render: () => (
    <UsageGauge value={72} label="Usage" width={160} height={100} />
  )},
  { name: "BillingChart", category: "Diagrams", variants: 1, render: () => (
    <BillingChart periods={[{ label: "Jan", segments: [{ label: "CPU", value: 24 }, { label: "Storage", value: 12 }] }, { label: "Feb", segments: [{ label: "CPU", value: 28 }, { label: "Storage", value: 16 }] }]} width={180} height={120} />
  )},
  { name: "ProgressRing", category: "Diagrams", variants: 1, render: () => (
    <ProgressRing tracks={[{ label: "CPU", value: 72 }, { label: "Mem", value: 48 }]} width={150} height={120} />
  )},
  { name: "MetricCard", category: "Diagrams", variants: 1, render: () => (
    <MetricCard label="Latency" value="42ms" delta="-12%" deltaLabel="week" sparkData={[8, 7, 6, 5, 4, 4, 3]} />
  )},
  { name: "ActivityFeed", category: "Diagrams", variants: 1, render: () => (
    <ActivityFeed maxEntries={2} entries={[{ id: "1", title: "Preset synced", timestamp: "now", variant: "success" }, { id: "2", title: "Docs rebuilt", timestamp: "1m", variant: "info" }]} />
  )},
  { name: "MiniBarList", category: "Diagrams", variants: 1, render: () => (
    <MiniBarList items={[{ label: "Button", value: 42 }, { label: "Card", value: 28 }, { label: "Input", value: 21 }]} />
  )},

  /* ================================================================ */
  /* Animation                                                         */
  /* ================================================================ */
  { name: "FadeIn", category: "Animation", variants: 5, render: () => (
    <ReplayPreview>
      {() => (
        <FadeIn trigger="mount" direction="up">
          <div className="text-xs font-semibold text-center" style={{ color: "var(--s-text)" }}>Fade up</div>
        </FadeIn>
      )}
    </ReplayPreview>
  )},
  { name: "SlideIn", category: "Animation", variants: 4, render: () => (
    <ReplayPreview>
      {() => (
        <SlideIn trigger="mount" direction="left" offset={40}>
          <div className="text-xs font-semibold text-center" style={{ color: "var(--s-text)" }}>Slide from left</div>
        </SlideIn>
      )}
    </ReplayPreview>
  )},
  { name: "ScaleIn", category: "Animation", variants: 1, render: () => (
    <ReplayPreview>
      {() => (
        <ScaleIn trigger="mount">
          <div className="px-3 py-2 border border-[var(--s-border)] rounded-[var(--s-radius-md,6px)] text-xs font-semibold" style={{ color: "var(--s-text)" }}>Scale in</div>
        </ScaleIn>
      )}
    </ReplayPreview>
  )},
  { name: "BlurFade", category: "Animation", variants: 1, render: () => (
    <ReplayPreview>
      {() => (
        <BlurFade trigger="mount">
          <div className="text-xs font-semibold text-center" style={{ color: "var(--s-text)" }}>Blur + fade</div>
        </BlurFade>
      )}
    </ReplayPreview>
  )},
  { name: "Stagger", category: "Animation", variants: 1, render: () => (
    <ReplayPreview interval={3000}>
      {() => (
        <Stagger trigger="mount" interval={100}>
          {["One", "Two", "Three"].map((t) => (
            <div key={t} className="px-2 py-1 border border-[var(--s-border)] text-[10px] font-mono mb-1" style={{ color: "var(--s-text)" }}>{t}</div>
          ))}
        </Stagger>
      )}
    </ReplayPreview>
  )},
  { name: "AnimateOnMount", category: "Animation", variants: 7, render: () => (
    <ReplayPreview interval={3000}>
      {() => (
        <AnimateOnMount preset="blurIn" duration={500}>
          <div className="text-xs font-semibold text-center" style={{ color: "var(--s-text)" }}>Blur in on mount</div>
        </AnimateOnMount>
      )}
    </ReplayPreview>
  )},
  { name: "TextReveal", category: "Animation", variants: 2, span: 2, render: () => (
    <ReplayPreview interval={3200}>
      {() => (
        <TextReveal text="Token-driven animation suite" by="word" trigger="mount" className="text-sm font-semibold text-center" style={{ color: "var(--s-text)" }} />
      )}
    </ReplayPreview>
  )},
  { name: "LetterPullUp", category: "Animation", variants: 1, render: () => (
    <ReplayPreview interval={3000}>
      {() => (
        <LetterPullUp text="Sigil UI" trigger="mount" className="text-lg font-bold text-center" style={{ color: "var(--s-text)" }} />
      )}
    </ReplayPreview>
  )},
  { name: "WordRotate", category: "Animation", variants: 1, render: () => (
    <div className="text-sm text-center" style={{ color: "var(--s-text)" }}>
      Build with <WordRotate words={["speed", "style", "tokens", "presets"]} duration={2000} className="font-bold text-[var(--s-primary)]" />
    </div>
  )},
  { name: "TypeWriter", category: "Animation", variants: 1, render: () => (
    <TypeWriter words={["npx @sigil-ui/cli convert", "sigil preset cobalt", "sigil add button"]} speed={50} className="font-mono text-xs" style={{ color: "var(--s-primary)" }} />
  )},
  { name: "NumberTicker", category: "Animation", variants: 1, render: () => (
    <ReplayPreview interval={3400}>
      {() => (
        <div className="text-center">
          <NumberTicker value={519} trigger="mount" className="text-3xl font-bold" style={{ color: "var(--s-text)" }} />
          <div className="text-[10px] font-mono mt-1" style={{ color: "var(--s-text-muted)" }}>tokens</div>
        </div>
      )}
    </ReplayPreview>
  )},
  { name: "GradientText", category: "Animation", variants: 1, render: () => (
    <GradientText className="text-lg font-bold">Sigil UI</GradientText>
  )},
  { name: "ScrollProgress", category: "Animation", variants: 1, render: () => (
    <AnimatedScrollProgressPreview />
  )},
  { name: "Marquee", category: "Animation", variants: 4, span: 2, render: () => (
    <Marquee duration={12} gap="1.5rem" className="py-1">
      {["React", "Tokens", "Presets", "OKLCH", "Tailwind", "Radix"].map((t) => (
        <span key={t} className="px-2 py-1 border border-[var(--s-border)] font-mono text-[10px] whitespace-nowrap" style={{ color: "var(--s-text-muted)" }}>{t}</span>
      ))}
    </Marquee>
  )},
  { name: "Ripple", category: "Animation", variants: 1, render: () => (
    <Ripple size={80} rings={3} duration={2} />
  )},
  { name: "Pulse", category: "Animation", variants: 1, render: () => (
    <Pulse duration={2} scale={1.06}>
      <div className="w-10 h-10 rounded-full bg-[var(--s-primary)] flex items-center justify-center">
        <Zap size={16} color="white" />
      </div>
    </Pulse>
  )},
  { name: "ParallaxLayer", category: "Animation", variants: 1, render: () => (
    <div className="relative h-16 w-full overflow-hidden rounded-[var(--s-radius-sm,4px)] border border-[var(--s-border)]">
      <ParallaxLayer speed={0.25} className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-[var(--s-radius-sm,4px)] bg-[var(--s-primary)] px-3 py-1 font-mono text-[10px] text-[var(--s-primary-contrast,#fff)]">
          Parallax
        </span>
      </ParallaxLayer>
    </div>
  )},

  /* ================================================================ */
  /* Pretext                                                           */
  /* ================================================================ */
  { name: "PretextMeasure", category: "Pretext", variants: 1, docPath: null, render: () => (
    <ReplayPreview interval={3200}>
      {() => (
        <div className="w-full space-y-2">
          <style>{`@keyframes sigil-pretext-fill { 0% { transform: translateX(-100%); } 45%, 65% { transform: translateX(0); } 100% { transform: translateX(100%); } }`}</style>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--s-text-muted)]">
            <span>measure()</span>
            <span>12.4ms</span>
          </div>
          <TextReveal
            text="Canvas-backed text metrics"
            by="word"
            trigger="mount"
            interval={70}
            className="text-center text-xs font-semibold text-[var(--s-text)]"
          />
          <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--s-border)]">
            <div
              className="h-full w-3/4 bg-[var(--s-primary)]"
              style={{ animation: "sigil-pretext-fill 1.4s var(--s-ease-default,ease-out) infinite" }}
            />
          </div>
        </div>
      )}
    </ReplayPreview>
  )},
  { name: "PretextLines", category: "Pretext", variants: 1, docPath: null, render: () => (
    <ReplayPreview interval={3400}>
      {() => (
        <div className="grid w-full grid-cols-3 gap-1.5">
          {["Token", "driven", "typeset"].map((word, index) => (
            <FadeIn key={word} trigger="mount" delay={index * 120} direction="up" offset={12}>
              <div className="border border-[var(--s-border)] px-2 py-2 text-center font-mono text-[10px] text-[var(--s-text-muted)]">
                {word}
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </ReplayPreview>
  )},
  { name: "PretextLayout", category: "Pretext", variants: 1, docPath: null, span: 2, render: () => (
    <ReplayPreview interval={3600}>
      {() => (
        <div className="w-full space-y-1.5">
          {["balanced rag", "line boxes", "no reflow"].map((line, index) => (
            <SlideIn key={line} trigger="mount" direction="left" offset={20} delay={index * 110}>
              <div
                className="h-6 border border-[var(--s-border)] bg-[var(--s-surface)] px-2 font-mono text-[10px] leading-6 text-[var(--s-text-muted)]"
                style={{ width: `${92 - index * 14}%` }}
              >
                {line}
              </div>
            </SlideIn>
          ))}
        </div>
      )}
    </ReplayPreview>
  )},
  { name: "FeatureFrameSection", category: "Sections", variants: 1, render: () => (
    <FeatureFrameSection
      features={[{
        label: "FRAME",
        headline: "Copy plus diagram",
        points: ["Token border", "Responsive rows"],
        diagram: <FeatureMiniDiagram variant="layer-stack" size={70} />,
      }]}
      className="w-full !px-0 !py-0 [&>div]:!max-w-none [&_.grid]:!grid-cols-1 [&_h3]:!text-xs [&_li]:!text-[9px] [&_.relative.flex]:!min-h-[80px] [&_.p-6]:!p-3"
    />
  )},
  { name: "BlueprintGridSection", category: "Sections", variants: 1, span: 2, render: () => (
    <BlueprintGridSection
      cards={[{
        title: "Blueprint",
        subtitle: "Staggered card",
        diagram: <FeatureMiniDiagram variant="hub-spoke" size={64} />,
        specRows: [{ label: "TOKENS", value: "519" }],
        callouts: ["typed"],
      }]}
      className="w-full !px-0 !py-0 [&>div]:!max-w-none [&_.grid]:!grid-cols-1 [&_.p-5]:!p-3"
    />
  )},

  /* ================================================================ */
  /* Playbook — the 10 compositional moves                             */
  /* ================================================================ */
  { name: "GapPixelGrid", category: "Playbook", variants: 2, span: 2, render: () => (
    <GapPixelGrid columns={{ md: 3 }} className="w-full">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <GapPixelCell key={n} className="p-3 flex items-center justify-center">
          <span className="text-[10px] font-mono text-[var(--s-text-muted)]">Cell {n}</span>
        </GapPixelCell>
      ))}
    </GapPixelGrid>
  )},
  { name: "MonoLabel", category: "Playbook", variants: 3, render: () => (
    <div className="flex flex-col gap-3">
      <MonoLabel variant="muted">Infrastructure</MonoLabel>
      <MonoLabel variant="accent">FAQ</MonoLabel>
      <MonoLabel variant="inverse" size="sm">Ships Immediately</MonoLabel>
    </div>
  )},
  { name: "BorderStack", category: "Playbook", variants: 2, span: 2, render: () => (
    <BorderStack className="w-full">
      {["Nav", "Hero", "Features", "Footer"].map((s) => (
        <div key={s} className="py-2 px-3 text-[10px] text-[var(--s-text-muted)]">{s}</div>
      ))}
    </BorderStack>
  )},
  { name: "AccentCTA", category: "Playbook", variants: 3, render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <AccentCTA size="sm">Get Started</AccentCTA>
      <AccentCTA size="sm" glow={false} className="bg-transparent !text-[var(--s-primary)] border border-[var(--s-primary)]">Docs</AccentCTA>
    </div>
  )},
  { name: "TabularValue", category: "Playbook", variants: 5, render: () => (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-[var(--s-text-muted)]">Revenue</span>
        <TabularValue size="md">$24,800.00</TabularValue>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-[var(--s-text-muted)]">Users</span>
        <TabularValue size="md">1,247</TabularValue>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-[var(--s-text-muted)]">Uptime</span>
        <TabularValue size="md" muted>99.98%</TabularValue>
      </div>
    </div>
  )},
  { name: "DensityText", category: "Playbook", variants: 7, render: () => (
    <div className="flex flex-col gap-1.5 w-full">
      <DensityText role="chrome">Chrome · 10px</DensityText>
      <DensityText role="counter">Counter · 11px</DensityText>
      <DensityText role="detail">Detail · 12px</DensityText>
      <DensityText role="nav">Nav · 13px</DensityText>
      <DensityText role="body">Body · 14px</DensityText>
      <DensityText role="base">Base · 16px</DensityText>
    </div>
  )},
  { name: "FrostedPanel", category: "Playbook", variants: 2, span: 2, render: () => (
    <div className="flex gap-2 w-full h-20">
      <FrostedPanel edge="right" className="flex-1 p-3 flex items-center justify-center">
        <span className="text-[10px] text-[var(--s-text-muted)]">Frosted</span>
      </FrostedPanel>
      <FrostedPanel edge="left" variant="solid" className="flex-1 p-3 flex items-center justify-center">
        <span className="text-[10px] text-[var(--s-text-muted)]">Solid</span>
      </FrostedPanel>
    </div>
  )},
  { name: "CardCell", category: "Playbook", variants: 1, span: 2, render: () => (
    <CardCell
      title="Edge Compute"
      footer={<MonoLabel size="xs">12 regions</MonoLabel>}
      padding="12px"
      className="w-full border border-[var(--s-border)]"
    >
      Deploy at the edge with sub-50ms cold starts.
    </CardCell>
  )},

  /* ================================================================ */
  /* Additional UI                                                     */
  /* ================================================================ */
  { name: "Typography", category: "UI", variants: 10, render: () => (
    <div className="flex flex-col gap-1 w-full overflow-hidden">
      <H3 className="!text-sm !border-0 !pb-0">Heading 3</H3>
      <H4 className="!text-xs">Heading 4</H4>
      <Lead className="!text-[11px]">Lead paragraph text</Lead>
      <Muted className="!text-[10px]">Muted secondary text</Muted>
      <InlineCode className="!text-[10px] w-fit">inline code</InlineCode>
    </div>
  )},
  { name: "Blockquote", category: "UI", variants: 1, render: () => (
    <Blockquote className="text-[11px] !pl-3">
      Design is not just what it looks like — design is how it works.
    </Blockquote>
  )},
  { name: "ResizablePanel", category: "UI", variants: 2, span: 2, render: () => (
    <div className="w-full border border-[var(--s-border)] rounded-[var(--s-radius-md,6px)] overflow-hidden" style={{ height: 96 }}>
      <ResizablePanelGroup>
        <ResizablePanelComp defaultSize={50}>
          <div className="flex items-center justify-center h-full text-[10px] text-[var(--s-text-muted)]">Left</div>
        </ResizablePanelComp>
        <ResizableHandle withHandle />
        <ResizablePanelComp defaultSize={50}>
          <div className="flex items-center justify-center h-full text-[10px] text-[var(--s-text-muted)]">Right</div>
        </ResizablePanelComp>
      </ResizablePanelGroup>
    </div>
  )},
  { name: "PreviewCard", category: "Overlays", variants: 1, render: () => (
    <PreviewCard>
      <PreviewCardTrigger render={<button type="button" className="text-xs underline text-[var(--s-primary)] bg-transparent border-0 cursor-pointer" />}>
        Hover for preview
      </PreviewCardTrigger>
      <PreviewCardContent title="Sigil UI" description="A token-driven design system with 46 presets." />
    </PreviewCard>
  )},
  /* ================================================================ */
  /* Added component expansion demos                                  */
  /* ================================================================ */

  /* Overlays */
  { name: "Modal", category: "Overlays", variants: 1, render: () => <Modal trigger={<Button size="sm">Open</Button>} title="Modal" description="Token-driven dialog shell." /> },
  { name: "ConfirmDialog", category: "Overlays", variants: 1, render: () => <ConfirmDialog trigger={<Button size="sm" variant="outline">Confirm</Button>} title="Confirm action" description="Review before continuing." /> },
  { name: "PromptDialog", category: "Overlays", variants: 1, render: () => <PromptDialog trigger={<Button size="sm" variant="outline">Prompt</Button>} title="Rename" placeholder="Project name" /> },
  { name: "ResponsiveDialog", category: "Overlays", variants: 1, render: () => <ResponsiveDialog trigger={<Button size="sm">Responsive</Button>} title="Responsive dialog" description="Adapts to app flows." /> },
  { name: "Lightbox", category: "Overlays", variants: 1, render: () => <Lightbox trigger={<Button size="sm" variant="outline">Preview</Button>} src="https://placehold.co/640x360/png" alt="Preview" caption="Image preview" /> },
  { name: "ImagePreview", category: "Overlays", variants: 1, render: () => <ImagePreview src="https://placehold.co/320x180/png" alt="Preview" className="h-20 w-32" /> },
  { name: "Spotlight", category: "Overlays", variants: 1, render: () => <SpotlightDemo /> },
  { name: "CommandMenu", category: "Overlays", variants: 1, render: () => <SpotlightDemo command /> },
  { name: "ActionMenu", category: "Overlays", variants: 1, render: () => <ActionMenu trigger={<Button size="sm" variant="outline">Actions</Button>} items={[{ label: "Copy" }, { label: "Duplicate" }, { label: "Archive" }]} /> },
  { name: "OverflowMenu", category: "Overlays", variants: 1, render: () => <OverflowMenu items={[{ label: "Edit" }, { label: "Share" }, { label: "Delete" }]} /> },
  { name: "MegaMenu", category: "Overlays", variants: 1, span: 2, render: () => <MegaMenu className="grid-cols-3 p-3"><div className="text-xs">Platform</div><div className="text-xs">Components</div><div className="text-xs">Docs</div></MegaMenu> },
  { name: "ContextPanel", category: "Overlays", variants: 1, render: () => <ContextPanel trigger={<Button size="sm" variant="outline">Panel</Button>}>Contextual content</ContextPanel> },
  { name: "PopoverForm", category: "Overlays", variants: 1, span: 2, render: () => <PopoverForm trigger={<Button size="sm" variant="outline">Form</Button>}><Input placeholder="Email" /><Button size="sm">Submit</Button></PopoverForm> },
  { name: "FloatingPanel", category: "Overlays", variants: 1, render: () => <FloatingPanel className="text-xs">Floating panel</FloatingPanel> },
  { name: "TooltipGroup", category: "Overlays", variants: 1, render: () => <TooltipGroup><Tooltip content="Grouped timing"><Button size="sm" variant="outline">Hover</Button></Tooltip></TooltipGroup> },
  { name: "Tour", category: "Overlays", variants: 1, render: () => <TourDemo /> },
  { name: "TourStep", category: "Overlays", variants: 1, render: () => <TourStep className="text-xs">Tour step content</TourStep> },
  { name: "Coachmark", category: "Overlays", variants: 1, render: () => <Coachmark trigger={<Button size="sm" variant="outline">Tip</Button>} title="Coachmark" description="Guide a user." /> },
  { name: "HotkeyProvider", category: "Overlays", variants: 1, render: () => <HotkeyProviderDemo /> },
  { name: "ShortcutRecorder", category: "Overlays", variants: 1, render: () => <ShortcutRecorder defaultValue={["Meta", "K"]} size="sm" /> },

  /* Forms */
  { name: "SearchInput", category: "Forms", variants: 1, render: () => <SearchInput placeholder="Search components..." /> },
  { name: "CurrencyInput", category: "Forms", variants: 1, render: () => <CurrencyInput placeholder="0.00" /> },
  { name: "PhoneInput", category: "Forms", variants: 1, render: () => <PhoneInput placeholder="+1 (555) 000-0000" /> },
  { name: "TimePicker", category: "Forms", variants: 1, render: () => <TimePicker defaultValue="09:30" /> },
  { name: "DateTimePicker", category: "Forms", variants: 1, render: () => <DateTimePicker /> },
  { name: "DateRangeField", category: "Forms", variants: 1, span: 2, render: () => <DateRangeField label="Range" placeholder="Pick a date range" /> },
  { name: "MultiSelect", category: "Forms", variants: 1, render: () => <MultiSelect options={[{ value: "react", label: "React" }, { value: "sigil", label: "Sigil" }, { value: "docs", label: "Docs" }]} defaultValue={["react", "sigil"]} /> },
  { name: "Autocomplete", category: "Forms", variants: 1, render: () => <Autocomplete options={[{ value: "modal", label: "Modal" }, { value: "table", label: "Table" }]} placeholder="Pick component" /> },
  { name: "CreatableSelect", category: "Forms", variants: 1, span: 2, render: () => <CreatableSelect options={[{ value: "sigil", label: "Sigil" }]} placeholder="Create option" /> },
  { name: "AsyncSelect", category: "Forms", variants: 1, render: () => <AsyncSelect placeholder="Async options" /> },
  { name: "SegmentedTabs", category: "Forms", variants: 1, render: () => <SegmentedTabs items={[{ value: "preview", label: "Preview" }, { value: "code", label: "Code" }]} /> },
  { name: "RangeSlider", category: "Forms", variants: 1, render: () => <RangeSlider label="Confidence" valueLabel="72%" defaultValue={[72]} /> },
  { name: "DualRangeSlider", category: "Forms", variants: 1, render: () => <DualRangeSlider defaultValue={[20, 80]} /> },
  { name: "FileDropzone", category: "Forms", variants: 1, span: 2, render: () => <FileDropzone label="Drop files here" description="or browse" className="min-h-28" /> },
  { name: "ImageUpload", category: "Forms", variants: 1, span: 2, render: () => <ImageUpload label="Upload image" className="min-h-28" /> },
  { name: "AvatarUpload", category: "Forms", variants: 1, span: 2, render: () => <AvatarUpload previewUrl="https://placehold.co/128x128/png" label="Avatar" /> },
  { name: "ColorField", category: "Forms", variants: 1, render: () => <ColorField defaultValue="#3b82f6" /> },
  { name: "ComboboxField", category: "Forms", variants: 1, span: 2, render: () => <ComboboxField label="Component" options={[{ value: "modal", label: "Modal" }, { value: "select", label: "Select" }]} /> },
  { name: "CheckboxCard", category: "Forms", variants: 1, render: () => <CheckboxCard defaultChecked title="Enable sync" description="Selectable card" /> },
  { name: "RadioCard", category: "Forms", variants: 1, render: () => <RadioGroup defaultValue="pro"><RadioCard value="pro" title="Pro" description="Best for teams" /></RadioGroup> },
  { name: "SwitchField", category: "Forms", variants: 1, render: () => <SwitchField label="Notifications" description="Product updates" defaultChecked /> },
  { name: "SliderField", category: "Forms", variants: 1, render: () => <SliderField label="Volume" valueLabel="40%" defaultValue={[40]} /> },
  { name: "StepperField", category: "Forms", variants: 1, render: () => <StepperField defaultValue={3} /> },
  { name: "TagsField", category: "Forms", variants: 1, render: () => <TagsField defaultValue={["radix", "tokens"]} /> },
  { name: "CopyInput", category: "Forms", variants: 1, render: () => <CopyInput defaultValue="sigil add button" readOnly /> },

  /* Feedback */
  { name: "StatusBadge", category: "Feedback", variants: 1, render: () => <StatusBadge status="success">Operational</StatusBadge> },
  { name: "StatusDot", category: "Feedback", variants: 1, render: () => <div className="flex items-center gap-2"><StatusDot status="online" /> Online</div> },
  { name: "StatusPill", category: "Feedback", variants: 1, render: () => <StatusPill status="warning">Pending</StatusPill> },
  { name: "OnlineIndicator", category: "Feedback", variants: 1, render: () => <OnlineIndicator status="online" label="Online" /> },
  { name: "PresenceAvatar", category: "Feedback", variants: 1, render: () => <PresenceAvatar fallback="KL" status="online" /> },
  { name: "Notification", category: "Feedback", variants: 1, span: 2, render: () => <Notification title="Deploy complete" description="Docs published." unread /> },
  { name: "NotificationList", category: "Feedback", variants: 1, span: 2, render: () => <NotificationList><Notification title="One" description="First" /><Notification title="Two" description="Second" /></NotificationList> },
  { name: "InlineAlert", category: "Feedback", variants: 1, render: () => <InlineAlert variant="info">Inline alert</InlineAlert> },
  { name: "Callout", category: "Feedback", variants: 1, render: () => <Callout variant="info" title="Token-first" description="Reads var(--s-*)." /> },
  { name: "BannerAlert", category: "Feedback", variants: 1, render: () => <BannerAlert variant="warning" title="Heads up" description="Banner alert" /> },
  { name: "ErrorState", category: "Feedback", variants: 1, render: () => <ErrorState title="Error" description="Try again." /> },
  { name: "LoadingState", category: "Feedback", variants: 1, render: () => <LoadingState title="Loading" description="Fetching data." /> },
  { name: "SuccessState", category: "Feedback", variants: 1, render: () => <SuccessState title="Success" description="All set." /> },
  { name: "ProgressSteps", category: "Feedback", variants: 1, span: 2, render: () => <ProgressSteps currentStep={1} steps={[{ label: "Install" }, { label: "Configure" }, { label: "Ship" }]} /> },
  { name: "TimelineProgress", category: "Feedback", variants: 1, render: () => <TimelineProgress value={66}>2 of 3 stages</TimelineProgress> },
  { name: "ToastAction", category: "Feedback", variants: 1, render: () => <ToastAction>Undo</ToastAction> },
  { name: "ToastPromise", category: "Feedback", variants: 1, render: () => <Button size="sm" variant="outline" onClick={() => void ToastPromise(Promise.resolve(), { loading: "Saving", success: "Saved", error: "Failed" })}>Toast promise</Button> },
  { name: "SkeletonCard", category: "Feedback", variants: 1, render: () => <SkeletonCard /> },
  { name: "SkeletonTable", category: "Feedback", variants: 1, render: () => <SkeletonTable /> },
  { name: "SpinnerOverlay", category: "Feedback", variants: 1, span: 2, render: () => <div className="relative h-24 w-full rounded-[var(--s-card-radius)] border border-[var(--s-border)]"><SpinnerOverlay /></div> },

  /* Data */
  { name: "DescriptionList", category: "Data", variants: 1, render: () => <DescriptionList items={[{ label: "Package", value: "components" }, { label: "Mode", value: "tokens" }]} /> },
  { name: "KeyValue", category: "Data", variants: 1, render: () => <KeyValue label="Preset" value="sigil" /> },
  { name: "PropertyList", category: "Data", variants: 1, render: () => <PropertyList items={[{ label: "Status", value: "Ready" }, { label: "Count", value: "300+" }]} /> },
  { name: "StatCard", category: "Data", variants: 1, render: () => <StatCard label="Components" value="300+" change={<Trend value={50} />} /> },
  { name: "MetricGrid", category: "Data", variants: 1, span: 2, render: () => <MetricGrid><StatCard label="Components" value="300+" /><StatCard label="Presets" value="46" /></MetricGrid> },
  { name: "Trend", category: "Data", variants: 1, render: () => <Trend value={24} /> },
  { name: "SparkArea", category: "Data", variants: 1, render: () => <SparkArea values={[4, 8, 6, 12, 10, 16]} /> },
  { name: "SparkBar", category: "Data", variants: 1, render: () => <SparkBar values={[4, 8, 6, 12, 10, 16]} /> },
  { name: "DataList", category: "Data", variants: 1, render: () => <DataList><DataListItem><span>Modal</span><StatusBadge status="success">Ready</StatusBadge></DataListItem></DataList> },
  { name: "DataListItem", category: "Data", variants: 1, render: () => <DataList><DataListItem><span>Component</span><span>Demo</span></DataListItem></DataList> },
  { name: "DataGrid", category: "Data", variants: 1, span: 2, render: () => <DataGrid columns={2}><StatCard label="A" value="12" /><StatCard label="B" value="24" /></DataGrid> },
  { name: "DataToolbar", category: "Data", variants: 1, span: 2, render: () => <DataToolbar><DataFilters searchPlaceholder="Filter..." /><Button size="sm" variant="outline">Export</Button></DataToolbar> },
  { name: "DataFilters", category: "Data", variants: 1, render: () => <DataFilters searchPlaceholder="Filter rows..." /> },
  { name: "DataPagination", category: "Data", variants: 1, render: () => <DataPagination page={2} pageCount={8} /> },
  { name: "ColumnVisibility", category: "Data", variants: 1, render: () => <ColumnVisibility columns={[{ id: "name", label: "Name" }, { id: "status", label: "Status", visible: false }]} /> },
  { name: "BulkActions", category: "Data", variants: 1, render: () => <BulkActions><span className="text-xs">3 selected</span><Button size="sm" variant="outline">Archive</Button></BulkActions> },
  { name: "EmptyTable", category: "Data", variants: 1, render: () => <EmptyTable message="No rows found." /> },
  { name: "Listbox", category: "Data", variants: 1, render: () => <Listbox value="modal" options={[{ value: "modal", label: "Modal" }, { value: "sheet", label: "Sheet" }]} /> },
  { name: "VirtualList", category: "Data", variants: 1, render: () => <VirtualList items={["Modal", "MultiSelect", "StatusBadge", "DataToolbar"]} /> },
  { name: "TreeTable", category: "Data", variants: 1, span: 2, render: () => <TreeTable headers={["Status"]} rows={[{ id: "components", label: "Components", values: ["Ready"], children: [{ id: "modal", label: "Modal", values: ["Ready"] }] }]} /> },

  /* Layout and navigation */
  { name: "ContainerQuery", category: "Layout", variants: 1, render: () => <ContainerQuery><Card><CardHeader><CardTitle>Container</CardTitle></CardHeader></Card></ContainerQuery> },
  { name: "SplitPane", category: "Layout", variants: 1, render: () => <SplitPane left={<div className="border border-[var(--s-border)] p-2 text-xs">Left</div>} right={<div className="border border-[var(--s-border)] p-2 text-xs">Right</div>} /> },
  { name: "Dock", category: "Navigation", variants: 1, render: () => <Dock className="static translate-x-0"><Button size="icon-sm" variant="ghost">A</Button><Button size="icon-sm" variant="ghost">B</Button></Dock> },
  { name: "TopBar", category: "Navigation", variants: 1, render: () => <TopBar className="static min-h-10 text-xs">Top bar</TopBar> },
  { name: "BottomBar", category: "Navigation", variants: 1, render: () => <BottomBar className="static min-h-10 text-xs">Bottom bar</BottomBar> },
  { name: "MobileNav", category: "Navigation", variants: 1, render: () => <MobileNav><Button size="sm" variant="ghost">Docs</Button><Button size="sm" variant="ghost">UI</Button></MobileNav> },
  { name: "SidebarNav", category: "Navigation", variants: 1, render: () => <SidebarNav><a href="#">Overview</a><a href="#">Components</a></SidebarNav> },
  { name: "AppHeader", category: "Layout", variants: 1, render: () => <AppHeader title="Components" description="Browse catalog" actions={<Button size="sm">New</Button>} /> },
  { name: "PageHeader", category: "Layout", variants: 1, render: () => <PageHeader title="Page title" description="Page heading block" /> },
  { name: "SectionHeader", category: "Layout", variants: 1, render: () => <SectionHeader title="Section" description="Section heading block" /> },
  { name: "ContentTabs", category: "Navigation", variants: 1, span: 2, render: () => <ContentTabs tabs={[{ value: "preview", label: "Preview", content: "Preview content" }, { value: "code", label: "Code", content: "Code content" }]} /> },
  { name: "AnchorNav", category: "Navigation", variants: 1, render: () => <AnchorNav items={[{ href: "#overview", label: "Overview" }, { href: "#props", label: "Props" }]} /> },
  { name: "TableOfContents", category: "Navigation", variants: 1, render: () => <TableOfContents items={[{ href: "#preview", label: "Preview" }, { href: "#usage", label: "Usage" }]} /> },
  { name: "ScrollSpy", category: "Navigation", variants: 1, render: () => <ScrollSpy items={[{ href: "#preview", label: "Preview" }, { href: "#usage", label: "Usage" }]} /> },
  { name: "MasonryGrid", category: "Layout", variants: 1, span: 2, render: () => <MasonryGrid><Card><CardHeader><CardTitle>One</CardTitle></CardHeader></Card><Card><CardHeader><CardTitle>Two</CardTitle></CardHeader><CardContent>More</CardContent></Card></MasonryGrid> },
  { name: "MediaCard", category: "UI", variants: 1, span: 2, render: () => (
    <MediaCard
      className="grid w-full grid-cols-[minmax(120px,0.8fr)_1fr] overflow-hidden"
      media={<img src="https://placehold.co/320x180/png" alt="Preview" className="h-full min-h-28 w-full object-cover" />}
      title="Media card"
      description="Image plus content"
    />
  )},
  { name: "ResourceCard", category: "UI", variants: 1, span: 2, render: () => (
    <ResourceCard
      className="w-full"
      title="Resource"
      description="Linked docs resource"
      href="/docs"
    />
  )},
  { name: "FeatureCard", category: "UI", variants: 1, span: 2, render: () => (
    <FeatureCard
      className="w-full h-full"
      icon={<Zap size={20} />}
      title="Feature"
      description="Token-driven summary card for landing-page feature grids."
    />
  )},
  { name: "PricingCard", category: "UI", variants: 1, span: 2, render: () => (
    <PricingCard
      className="grid w-full grid-cols-[1fr_auto] items-start gap-4"
      title="Team"
      description="For teams"
      price="$29"
      features={["350+ components", "46 presets"]}
      action={<Button size="sm">Start</Button>}
    />
  )},
  { name: "TestimonialCarousel", category: "UI", variants: 1, span: 2, render: () => (
    <TestimonialCarousel className="w-full [&>*]:min-w-[calc(50%-0.5rem)]">
      <Card><CardContent className="p-4">“Token-first.”</CardContent></Card>
      <Card><CardContent className="p-4">“Docs built in.”</CardContent></Card>
    </TestimonialCarousel>
  )},

  /* Developer */
  { name: "CodeTabs", category: "Developer", variants: 1, span: 2, render: () => <CodeTabs tabs={[{ value: "tsx", label: "TSX", code: "<Button>Ship</Button>", language: "tsx" }]} /> },
  { name: "CodePreview", category: "Developer", variants: 1, span: 2, render: () => <CodePreview preview={<Button size="sm">Preview</Button>} code={`<Button>Preview</Button>`} language="tsx" /> },
  { name: "CopyButton", category: "Developer", variants: 1, render: () => <CopyButton value="npx @sigil-ui/cli add button" size="sm">Copy command</CopyButton> },
  { name: "TokenPreview", category: "Developer", variants: 1, render: () => <TokenPreview name="--s-primary" /> },
  { name: "ThemeSwatch", category: "Developer", variants: 1, render: () => <ThemeSwatch name="Sigil" selected /> },
  { name: "ThemeSwitcher", category: "Developer", variants: 1, span: 2, render: () => <ThemeSwitcher value="sigil" themes={[{ value: "sigil", label: "Sigil" }, { value: "mono", label: "Mono" }]} /> },
  { name: "PromptInput", category: "Developer", variants: 1, span: 2, render: () => <PromptInput placeholder="Generate a component..." /> },
  { name: "ChatMessage", category: "Developer", variants: 1, render: () => <ChatMessage role="assistant">Components stay token-first.</ChatMessage> },
  { name: "ChatThread", category: "Developer", variants: 1, span: 2, render: () => <ChatThread><ChatMessage role="user">Show dialogs.</ChatMessage><ChatMessage role="assistant">Use Modal.</ChatMessage></ChatThread> },
  { name: "MessageComposer", category: "Developer", variants: 1, span: 2, render: () => <MessageComposer placeholder="Message..." /> },
  { name: "ActivityTimeline", category: "Developer", variants: 1, span: 2, render: () => <ActivityTimeline items={[{ title: "Component added", description: "Modal docs generated." }, { title: "Build passed", description: "Docs compiled." }]} /> },
  { name: "AuditLog", category: "Developer", variants: 1, span: 2, render: () => <AuditLog><DataListItem><span>Kevin</span><span>Updated docs</span></DataListItem></AuditLog> },
  { name: "Changelog", category: "Developer", variants: 1, span: 2, render: () => <Changelog><Card><CardHeader><CardTitle>v0.1.0</CardTitle><CardDescription>Added catalog pages.</CardDescription></CardHeader></Card></Changelog> },
  { name: "VersionBadge", category: "Developer", variants: 1, render: () => <VersionBadge version="0.1.0" /> },
  { name: "KeyboardKey", category: "Developer", variants: 1, render: () => <KeyboardKey>⌘K</KeyboardKey> },

];

export function ComponentShowcase() {
  return (
    <TooltipProvider>
      <Toaster position="bottom-right" />
      <Sonner position="bottom-right" />
      <ComponentCatalog cells={CELLS} getDocsHref={getDocsHref} />
    </TooltipProvider>
  );
}
