// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
export { cn } from "./utils";
export { useCopyToClipboard } from "./use-copy-to-clipboard";

// ---------------------------------------------------------------------------
// Sound
// ---------------------------------------------------------------------------
export {
  SigilSoundContext,
  SigilSoundProvider,
  useSigilSound,
  type SigilSoundName,
  type SigilSoundContextValue,
} from "./sound-context";

// ---------------------------------------------------------------------------
// Layout primitives
// ---------------------------------------------------------------------------
export { Stack, type StackProps } from "./layout/Stack";
export { SigilGrid, SigilGridCell, type SigilGridProps, type SigilGridCellProps } from "./layout/Grid";
export { Section, type SectionProps } from "./layout/Section";
export { Frame, type FrameProps } from "./layout/Frame";
export { PageGrid, type PageGridProps } from "./layout/PageGrid";
export { Margin, type MarginProps } from "./layout/Margin";
export { Gutter, type GutterProps } from "./layout/Gutter";
export {
  SigilPageGrid, SigilFrame, SigilPage, SigilGutter, SigilFullBleed,
  SIGIL_RHYTHM_STYLES,
  SigilActionRow, SigilGhostLink, SigilHero, SigilHeroContent,
  SigilHeroDescription, SigilHeroLayout, SigilHeroMedia, SigilHeroTitle,
  SigilInline, SigilMonoBlock,
  SigilRhythmBox, SigilSectionHeader, SigilStack,
  SigilViewCode,
  useIsInsidePageGrid, usePageGridConfig,
  type SigilPageGridProps, type SigilFrameProps, type SigilFullBleedProps,
  type SigilPageProps, type SigilPageChrome, type SigilRhythmMode, type SigilBandStroke,
  type PageGridConfig, type SigilGutterProps,
  type SigilActionRowProps, type SigilGhostLinkProps, type SigilInlineProps,
  type SigilHeroContentProps, type SigilHeroDescriptionProps,
  type SigilHeroLayoutProps, type SigilHeroMediaProps, type SigilHeroProps,
  type SigilHeroTitleProps,
  type SigilMonoBlockProps, type SigilRhythmBoxProps,
  type SigilSectionHeaderProps, type SigilStackProps, type SigilViewCodeProps,
} from "./layout/SigilPageGrid";
export { SigilSection, type SigilSectionProps } from "./layout/SigilSection";
export { SigilNavbar, type SigilNavbarProps } from "./layout/SigilNavbar";
export { Divider, type DividerPattern, type DividerProps } from "./layout/Divider";
export { Divider as SigilDivider } from "./layout/Divider";
export { Hairline, type HairlineProps } from "./layout/Hairline";
export { HRule, type HRuleProps } from "./layout/HRule";
export { BentoGrid, BentoCell as BentoGridCell, type BentoGridProps, type BentoCellProps as BentoGridCellProps } from "./layout/BentoGrid";
export { VoronoiBento, VoronoiCell, type VoronoiBentoProps } from "./layout/VoronoiBento";
export { LayoutControls, type LayoutControlsProps } from "./layout/LayoutControls";
export { SectionDivider, type SectionDividerProps, type SectionDividerPattern } from "./layout/SectionDivider";
export { Box, type BoxProps } from "./layout/Box";
export { Container, type ContainerProps } from "./layout/Container";
export { Flex, type FlexProps } from "./layout/Flex";
export { SimpleGrid, type SimpleGridProps } from "./layout/SimpleGrid";
export { Center, type CenterProps } from "./layout/Center";
export { Spacer, type SpacerProps } from "./layout/Spacer";
export { AppShell, type AppShellProps } from "./layout/AppShell";
export { Main, type MainProps } from "./layout/Main";
export { Aside, type AsideProps } from "./layout/Aside";
export { Header, type HeaderProps } from "./layout/Header";
export { Banner, type BannerProps, type BannerVariant } from "./layout/Banner";
export { PageShell, type PageShellProps } from "./layout/PageShell";

// ---------------------------------------------------------------------------
// Core UI
// ---------------------------------------------------------------------------
export { Button, type ButtonProps } from "./ui/Button";
export { Badge, type BadgeProps } from "./ui/Badge";
export {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  type CardProps,
} from "./ui/Card";
export { Label, type LabelProps } from "./ui/Label";
export { Input, type InputProps } from "./ui/Input";
export { Textarea, type TextareaProps } from "./ui/Textarea";
export {
  Select, SelectTrigger, SelectContent, SelectItem,
  SelectGroup, SelectLabel, SelectValue, SelectSeparator,
  type SelectProps, type SelectTriggerProps,
} from "./ui/Select";
export { Checkbox, type CheckboxProps } from "./ui/Checkbox";
export { Switch, type SwitchProps } from "./ui/Switch";
export { Slider, type SliderProps } from "./ui/Slider";
export { Progress, type ProgressProps } from "./ui/Progress";
export { Separator, type SeparatorProps } from "./ui/Separator";
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "./ui/Avatar";
export { Skeleton, type SkeletonProps } from "./ui/Skeleton";
export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
} from "./ui/Table";
export {
  Tabs, TabsList, TabsTrigger, TabsContent,
  type TabsProps, type TabsTriggerProps, type TabsContentProps,
} from "./ui/Tabs";
export {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  type AccordionProps, type AccordionItemProps, type AccordionTriggerProps, type AccordionContentProps,
} from "./ui/Accordion";
export { Tooltip, TooltipProvider, type TooltipProps } from "./ui/Tooltip";
export { ScrollArea, type ScrollAreaProps } from "./ui/ScrollArea";
export { SigilCursor, type SigilCursorProps, type SigilCursorVariant } from "./ui/SigilCursor";
export { KPI, type KPIProps } from "./ui/KPI";
export { Terminal, type TerminalProps } from "./ui/Terminal";
export { CodeBlock, type CodeBlockProps } from "./ui/CodeBlock";
export { LoadingSpinner, LoadingSpinner as Spinner, SPINNER_NAMES, type LoadingSpinnerProps, type LoadingSpinnerProps as SpinnerProps, type SpinnerVariant } from "./ui/LoadingSpinner";
export {
  Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage,
  type FormProps, type FormFieldProps, type FormItemProps, type FormLabelProps,
  type FormControlProps, type FormDescriptionProps, type FormMessageProps,
} from "./ui/Form";
export { Combobox, type ComboboxProps, type ComboboxOption } from "./ui/Combobox";
export { Calendar, CalendarDayButton, type CalendarProps } from "./ui/Calendar";
export {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots,
  type CarouselProps, type CarouselContentProps, type CarouselItemProps, type CarouselButtonProps, type CarouselDotsProps,
} from "./ui/Carousel";
export { Alert, AlertTitle, AlertDescription, type AlertProps, type AlertTitleProps, type AlertDescriptionProps, type AlertVariant, type AlertFill } from "./ui/Alert";
export { Collapsible, CollapsibleTrigger, CollapsibleContent, type CollapsibleContentProps } from "./ui/Collapsible";
export { RadioGroup, RadioGroupItem, type RadioGroupProps, type RadioGroupItemProps } from "./ui/RadioGroup";
export { Toggle, type ToggleProps } from "./ui/Toggle";
export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps } from "./ui/ToggleGroup";
export { DatePicker, DateRangePicker, type DatePickerProps, type DateRangePickerProps, type DateRange } from "./ui/DatePicker";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./ui/InputOTP";
export { NumberField, type NumberFieldProps } from "./ui/NumberField";
export { Meter, type MeterProps } from "./ui/Meter";
export { AspectRatio, type AspectRatioProps } from "./ui/AspectRatio";
export { DataTable, type DataTableProps } from "./ui/DataTable";
export { ChartContainer, ChartTooltip, ChartLegend } from "./ui/Chart";
export { Field, Fieldset, FieldLabel, FieldDescription, FieldError } from "./ui/Field";
export {
  CheckboxGroup, CheckboxGroupItem,
  type CheckboxGroupProps, type CheckboxGroupItemProps, type CheckboxGroupItemConfig,
} from "./ui/CheckboxGroup";
export { Stepper, type StepperProps, type StepperStepConfig } from "./ui/Stepper";
export {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
  type ResizablePanelGroupProps, type ResizablePanelProps, type ResizableHandleProps,
} from "./ui/ResizablePanel";
export { SplitButton, type SplitButtonProps } from "./ui/SplitButton";
export { Item, ItemGroup, type ItemProps, type ItemGroupProps } from "./ui/Item";
export {
  InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupButton, InputGroupText,
  type InputGroupProps, type InputGroupInputProps, type InputGroupTextareaProps, type InputGroupAddonProps, type InputGroupButtonProps,
} from "./ui/InputGroup";
export { ButtonGroup, type ButtonGroupProps } from "./ui/ButtonGroup";
export { Kbd, KbdGroup, type KbdProps, type KbdGroupProps } from "./ui/Kbd";
export { Empty, type EmptyProps } from "./ui/Empty";
export { NativeSelect, type NativeSelectProps } from "./ui/NativeSelect";
export {
  H1, H2, H3, H4, Paragraph, Lead, Large, Small, Muted, InlineCode, Blockquote,
} from "./ui/Typography";
export { DirectionProvider, useDirection, type DirectionProviderProps } from "./ui/Direction";
export { Clipboard, type ClipboardProps } from "./ui/Clipboard";
export { TagsInput, type TagsInputProps } from "./ui/TagsInput";
export { ColorPicker, type ColorPickerProps } from "./ui/ColorPicker";
export { FileUpload, type FileUploadProps } from "./ui/FileUpload";
export { TreeView, type TreeViewProps, type TreeNode } from "./ui/TreeView";
export { Editable, type EditableProps } from "./ui/Editable";
export { RatingGroup, type RatingGroupProps } from "./ui/RatingGroup";
export { SignaturePad, type SignaturePadProps } from "./ui/SignaturePad";
export { Panel, PanelHead, type PanelProps, type PanelHeadProps } from "./ui/Panel";
export { BrailleSpinner, type BrailleSpinnerProps, type BrailleSpinnerName } from "./ui/BrailleSpinner";
export { AccessibleIcon, type AccessibleIconProps } from "./ui/AccessibleIcon";
export { VisuallyHidden, type VisuallyHiddenProps } from "./ui/VisuallyHidden";
export { SegmentedControl, SegmentedControlItem, type SegmentedControlProps, type SegmentedControlItemProps } from "./ui/SegmentedControl";
export { CircularProgress, type CircularProgressProps } from "./ui/CircularProgress";
export { PasswordInput, type PasswordInputProps } from "./ui/PasswordInput";
export * from "./ui/AdvancedInputs";
export * from "./ui/StatusFeedback";
export * from "./ui/Productivity";

// ---------------------------------------------------------------------------
// Data display recipes
// ---------------------------------------------------------------------------
export * from "./data/DataComponents";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export {
  Navbar, NavbarLogo, NavbarLinks, NavbarActions,
  type NavbarProps, type NavbarLogoProps, type NavbarLinksProps, type NavbarActionsProps,
} from "./navigation/Navbar";
export { Footer, type FooterProps, type FooterColumn } from "./navigation/Footer";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "./navigation/Breadcrumb";
export { Pagination, type PaginationProps } from "./navigation/Pagination";
export {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem, SidebarGroup, SidebarGroupLabel,
  type SidebarProps, type SidebarGroupProps, type SidebarGroupLabelProps, type SidebarItemProps,
} from "./navigation/Sidebar";
export {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} from "./navigation/NavigationMenu";
export {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator,
} from "./navigation/Menubar";
export { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem, ToolbarLink, type ToolbarProps } from "./navigation/Toolbar";
export { SocialIcons, type SocialIconsProps, type SocialLink } from "./navigation/SocialIcons";
export * from "./navigation/AppSurfaces";
export {
  MagneticNav, MagneticNavItem, MagneticNavLink,
  type MagneticNavProps, type MagneticNavItemProps, type MagneticNavLinkProps,
} from "./navigation/MagneticNav";

// ---------------------------------------------------------------------------
// Overlays
// ---------------------------------------------------------------------------
export {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  type DialogProps, type DialogTriggerProps, type DialogContentProps, type DialogCloseProps,
} from "./overlays/Dialog";
export {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  type SheetProps, type SheetTriggerProps, type SheetContentProps,
} from "./overlays/Sheet";
export {
  Popover, PopoverTrigger, PopoverContent,
  type PopoverProps, type PopoverTriggerProps, type PopoverContentProps,
} from "./overlays/Popover";
export { toast, Toaster, type ToasterProps } from "./overlays/Toast";
export {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
  type AlertDialogContentProps,
} from "./overlays/AlertDialog";
export {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandDialog,
} from "./overlays/Command";
export {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator,
  ContextMenuCheckboxItem, ContextMenuLabel, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
} from "./overlays/ContextMenu";
export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "./overlays/DropdownMenu";
export {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose,
} from "./overlays/Drawer";
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./overlays/HoverCard";
export { Sonner, sonnerToast, type SonnerProps } from "./overlays/Sonner";
export { PreviewCard, PreviewCardTrigger, PreviewCardContent } from "./overlays/PreviewCard";
export * from "./overlays/ComposedOverlays";

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------
export { Shape, type ShapeProps, type ShapeVariant, type ShapeSize } from "./shapes/Shape";
export { Diamond, type DiamondProps } from "./shapes/Diamond";
export { Hexagon, type HexagonProps } from "./shapes/Hexagon";
export { Triangle, type TriangleProps } from "./shapes/Triangle";
export { Diagonal, type DiagonalProps } from "./shapes/Diagonal";

// ---------------------------------------------------------------------------
// 3D / Animated
// ---------------------------------------------------------------------------
export { Box3D, type Box3DProps } from "./3d/Box3D";
export { Box3DGrid, type Box3DGridProps, type Box3DGridItem } from "./3d/Box3DGrid";
export { Card3D, type Card3DProps } from "./3d/Card3D";
export { ExplodedBox3D, type ExplodedBox3DProps } from "./3d/ExplodedBox3D";
export { FloatingUI, type FloatingUIProps } from "./3d/FloatingUI";
export { IsometricView, type IsometricViewProps } from "./3d/IsometricView";
export { IsometricPrism, type IsometricPrismProps } from "./3d/IsometricPrism";
export { IsometricCylinder, type IsometricCylinderProps } from "./3d/IsometricCylinder";
export { IsometricScene, type IsometricSceneProps } from "./3d/IsometricScene";

// ---------------------------------------------------------------------------
// Diagrams
// ---------------------------------------------------------------------------
export { Diagram, type DiagramProps, type DiagramGridVariant } from "./diagrams/Diagram";
export { ExplodedView, type ExplodedViewProps, type ExplodedViewLayer } from "./diagrams/ExplodedView";
export { FlowDiagram, type FlowDiagramProps, type FlowNode, type FlowConnection } from "./diagrams/FlowDiagram";
export { Timeline, type TimelineProps, type TimelineEntry } from "./diagrams/Timeline";
export { ComparisonTable, type ComparisonTableProps, type ComparisonFeature } from "./diagrams/ComparisonTable";
export { ArchitectureDiagram, type ArchitectureDiagramProps, type ArchitectureLayer } from "./diagrams/ArchitectureDiagram";
export { DiagramNode, type DiagramNodeProps, type DiagramNodeVariant, type DiagramNodeSize } from "./diagrams/DiagramNode";
export { DiagramConnector, type DiagramConnectorProps, type ConnectorVariant, type ConnectorDirection } from "./diagrams/DiagramConnector";
export { DiagramCalloutLine, type DiagramCalloutLineProps } from "./diagrams/DiagramCalloutLine";
export { DiagramLabel, type DiagramLabelProps } from "./diagrams/DiagramLabel";
export { CrossHatch, type CrossHatchProps } from "./diagrams/CrossHatch";
export { PipelineDiagram, type PipelineDiagramProps, type PipelineStep } from "./diagrams/PipelineDiagram";
export { StackDiagram, type StackDiagramProps, type StackLayer } from "./diagrams/StackDiagram";
export { HubSpokeDiagram, type HubSpokeDiagramProps, type SpokeNode } from "./diagrams/HubSpokeDiagram";
export { BeforeAfterDiagram, type BeforeAfterDiagramProps } from "./diagrams/BeforeAfterDiagram";
export { EcosystemDiagram, type EcosystemDiagramProps, type EcosystemNode } from "./diagrams/EcosystemDiagram";
export { HubRouteDiagram, type HubRouteDiagramProps } from "./diagrams/templates/HubRouteDiagram";
export { GlobeDiagram, type GlobeDiagramProps, type GlobeCity } from "./diagrams/templates/GlobeDiagram";
export { OrbitDiagram, type OrbitDiagramProps } from "./diagrams/templates/OrbitDiagram";
export { StreamFlowDiagram, type StreamFlowDiagramProps } from "./diagrams/templates/StreamFlowDiagram";
export { IsometricStackDiagram, type IsometricStackDiagramProps, type IsoStackLayer } from "./diagrams/templates/IsometricStackDiagram";
export { PlatformHubDiagram, type PlatformHubDiagramProps } from "./diagrams/templates/PlatformHubDiagram";
export { FeatureMiniDiagram, type FeatureMiniDiagramProps, type FeatureMiniVariant } from "./diagrams/templates/FeatureMiniDiagram";
export { SankeyDiagram, type SankeyDiagramProps } from "./diagrams/templates/SankeyDiagram";
export { MermaidDiagram, type MermaidDiagramProps } from "./diagrams/templates/MermaidDiagram";
export {
  WaterfallChart, type WaterfallChartProps, type WaterfallStep, type WaterfallRow,
} from "./diagrams/templates/WaterfallChart";
export {
  CapabilityGrid, type CapabilityGridProps, type CapabilityItem, type CapabilityCategory, type CapabilityCallout,
} from "./diagrams/templates/CapabilityGrid";
export {
  IsolationStack, type IsolationStackProps, type IsolationLayer,
  type ComparisonColumn, type ComparisonRow as IsolationComparisonRow,
} from "./diagrams/templates/IsolationStack";
export {
  StatePersistence, type StatePersistenceProps, type PersistenceActiveItem, type PersistedStateRow,
} from "./diagrams/templates/StatePersistence";
export {
  RadarChart, type RadarChartProps, type RadarAxis, type RadarSeries,
} from "./diagrams/templates/RadarChart";
export {
  TreeDiagram, type TreeDiagramProps, type TreeDiagramNode,
} from "./diagrams/templates/TreeDiagram";
export {
  GanttChart, type GanttChartProps, type GanttTask, type GanttGroup,
} from "./diagrams/templates/GanttChart";
export {
  FunnelChart, type FunnelChartProps, type FunnelStep,
} from "./diagrams/templates/FunnelChart";
export {
  MatrixDiagram, type MatrixDiagramProps, type MatrixCell,
} from "./diagrams/templates/MatrixDiagram";
export {
  DependencyGraph, type DependencyGraphProps, type DepNode, type DepEdge,
} from "./diagrams/templates/DependencyGraph";
export {
  DonutChart, type DonutChartProps, type DonutSegment,
} from "./diagrams/templates/DonutChart";
export {
  NetworkGraph, type NetworkGraphProps, type NetworkNode, type NetworkEdge,
} from "./diagrams/templates/NetworkGraph";
export {
  HeatmapGrid, type HeatmapGridProps, type HeatmapCell,
} from "./diagrams/templates/HeatmapGrid";
export {
  VennDiagram, type VennDiagramProps, type VennCircle,
} from "./diagrams/templates/VennDiagram";
export {
  PricingTable, type PricingTableProps, type PricingColumn, type PricingFeature,
} from "./diagrams/templates/PricingTable";
export {
  ChangelogTable, type ChangelogTableProps, type ChangelogRelease, type ChangelogEntry, type ChangelogEntryType,
} from "./diagrams/templates/ChangelogTable";
export {
  StatusTable, type StatusTableProps, type ServiceEntry, type ServiceStatus,
} from "./diagrams/templates/StatusTable";
export {
  SpecTable, type SpecTableProps, type SpecRow, type SpecGroup,
} from "./diagrams/templates/SpecTable";
export {
  LeaderboardTable, type LeaderboardTableProps, type LeaderboardRow,
} from "./diagrams/templates/LeaderboardTable";
export {
  BarChart, type BarChartProps, type BarChartBar, type BarChartGroup,
} from "./diagrams/templates/BarChart";
export {
  PieChart, type PieChartProps, type PieSlice,
} from "./diagrams/templates/PieChart";
export {
  LineChart, type LineChartProps, type LineChartSeries, type LineChartPoint,
} from "./diagrams/templates/LineChart";
export {
  AreaChart, type AreaChartProps, type AreaChartSeries, type AreaChartPoint,
} from "./diagrams/templates/AreaChart";
export {
  CommitGrid, type CommitGridProps, type CommitDay,
} from "./diagrams/templates/CommitGrid";
export {
  SparkLine, type SparkLineProps,
} from "./diagrams/templates/SparkLine";
export {
  UsageGauge, type UsageGaugeProps,
} from "./diagrams/templates/UsageGauge";
export {
  BillingChart, type BillingChartProps, type BillingPeriod,
} from "./diagrams/templates/BillingChart";
export {
  ProgressRing, type ProgressRingProps, type ProgressRingTrack,
} from "./diagrams/templates/ProgressRing";
export {
  MetricCard, type MetricCardProps,
} from "./diagrams/templates/MetricCard";
export {
  ActivityFeed, type ActivityFeedProps, type ActivityEntry, type ActivityEntryVariant,
} from "./diagrams/templates/ActivityFeed";
export {
  MiniBarList, type MiniBarListProps, type MiniBarItem,
} from "./diagrams/templates/MiniBarList";

// ---------------------------------------------------------------------------
// Marketing
// ---------------------------------------------------------------------------
export { Hero, type HeroProps, type HeroAction } from "./marketing/Hero";
export { FeatureFrame, type FeatureFrameProps } from "./marketing/FeatureFrame";
export { Pricing, type PricingProps } from "./marketing/Pricing";
export { CTA, type CTAProps, type CTAAction } from "./marketing/CTA";
export { LogoBar, type LogoBarProps, type LogoBarItem } from "./marketing/LogoBar";
export { TestimonialCard, type TestimonialCardProps } from "./marketing/TestimonialCard";
export { AnnouncementBar, type AnnouncementBarProps } from "./marketing/AnnouncementBar";
export { PricingTiers, type PricingTiersProps, type PricingTier } from "./marketing/PricingTiers";
export { UnitPricing, type UnitPricingProps, type PricingUnit } from "./marketing/UnitPricing";
export { CostCalculator, type CostCalculatorProps, type CostSlider, type CostEstimate } from "./marketing/CostCalculator";
export { BlogGrid, type BlogGridProps, type BlogPost } from "./marketing/BlogGrid";
export { BlogHeader, type BlogHeaderProps } from "./marketing/BlogHeader";
export { FeatureGrid, type FeatureGridProps, type FeatureRow } from "./marketing/FeatureGrid";

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------
export { Pattern, type PatternProps, type PatternVariant } from "./patterns/Pattern";
export { Cross, type CrossProps } from "./patterns/Cross";
export { Tessellation, type TessellationProps, type TessellationVariant } from "./patterns/Tessellation";
export { GrainGradient, type GrainGradientProps, type GrainTint, type GrainIntensity } from "./patterns/GrainGradient";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------
export { SectionHeading, type SectionHeadingProps } from "./sections/SectionHeading";
export { HeroSection, type HeroSectionProps } from "./sections/HeroSection";
export { FeatureSection, type FeatureSectionProps, type FeatureItem } from "./sections/FeatureSection";
export { CTASection, type CTASectionProps, type CTAAction as CTASectionAction } from "./sections/CTASection";
export { FAQSection, type FAQSectionProps, type FAQItem } from "./sections/FAQSection";
export { StatsSection, type StatsSectionProps, type StatItem } from "./sections/StatsSection";
export { BentoSection, type BentoSectionProps, type BentoCell } from "./sections/BentoSection";
export { TestimonialsSection, type TestimonialsSectionProps, type TestimonialItem } from "./sections/TestimonialsSection";
export { LogoCloudSection, type LogoCloudSectionProps, type LogoCloudItem } from "./sections/LogoCloudSection";
export { ComparisonSection, type ComparisonSectionProps, type ComparisonFeature as ComparisonSectionFeature } from "./sections/ComparisonSection";
export { CodeShowcaseSection, type CodeShowcaseSectionProps, type CodeTab } from "./sections/CodeShowcaseSection";
export { TeamSection, type TeamSectionProps, type TeamMember } from "./sections/TeamSection";
export { TimelineSection, type TimelineSectionProps, type TimelineEvent } from "./sections/TimelineSection";
export { NewsletterSection, type NewsletterSectionProps } from "./sections/NewsletterSection";
export { FooterSection, type FooterSectionProps, type FooterLinkGroup } from "./sections/FooterSection";
export { LargeTextSection, type LargeTextSectionProps } from "./sections/LargeTextSection";
export { FeatureShowcaseSection, type FeatureShowcaseSectionProps, type FeatureShowcaseRow } from "./sections/FeatureShowcaseSection";
export { InstallSection, type InstallSectionProps, type InstallCommand } from "./sections/InstallSection";
export { GradientBannerSection, type GradientBannerSectionProps } from "./sections/GradientBannerSection";
export {
  FeatureFrameSection, type FeatureFrameSectionProps, type FeatureFrameRowProps,
} from "./sections/FeatureFrameSection";
export {
  BlueprintGridSection, type BlueprintGridSectionProps, type BlueprintCardData, type BlueprintSpecRow,
} from "./sections/BlueprintGridSection";

// ---------------------------------------------------------------------------
// Playbook — compositional moves from the Reticle design language
// ---------------------------------------------------------------------------
export {
  GapPixelGrid, GapPixelCell, type GapPixelGridProps, type GapPixelCellProps,
  MonoLabel, type MonoLabelProps, type MonoLabelVariant, type MonoLabelSize,
  BorderStack, type BorderStackProps,
  AccentCTA, AccentActive, type AccentCTAProps, type AccentCTASize, type AccentActiveProps,
  TabularValue, type TabularValueProps, type TabularValueSize,
  FeaturedGrid, type FeaturedGridProps,
  DensityText, type DensityTextProps, type DensityRole,
  FrostedPanel, type FrostedPanelProps, type FrostedPanelEdge,
  CardCell, type CardCellProps,
} from "./playbook";

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

// Core GSAP
export { gsap, ScrollTrigger, PRESETS, animateElement, type AnimationPreset, type PresetName } from "./animation/animate";
export { useSigilAnimate, type UseSigilAnimateConfig } from "./animation/useSigilAnimate";
export { AnimateOnScroll, type AnimateOnScrollProps } from "./animation/AnimateOnScroll";

// Hooks
export { useInView, type UseInViewOptions } from "./animation/useInView";
export { useReducedMotion } from "./animation/useReducedMotion";

// Reveal wrappers
export { FadeIn, type FadeInProps } from "./animation/FadeIn";
export { SlideIn, type SlideInProps } from "./animation/SlideIn";
export { ScaleIn, type ScaleInProps } from "./animation/ScaleIn";
export { BlurFade, type BlurFadeProps } from "./animation/BlurFade";
export { Stagger, type StaggerProps } from "./animation/Stagger";
export { AnimateOnMount, type AnimateOnMountProps } from "./animation/AnimateOnMount";

// Text animations
export { TextReveal, type TextRevealProps } from "./animation/TextReveal";
export { LetterPullUp, type LetterPullUpProps } from "./animation/LetterPullUp";
export { WordRotate, type WordRotateProps } from "./animation/WordRotate";
export { TypeWriter, type TypeWriterProps } from "./animation/TypeWriter";
export { NumberTicker, type NumberTickerProps } from "./animation/NumberTicker";
export { GradientText, type GradientTextProps } from "./animation/GradientText";

// Scroll-driven
export { ScrollProgress, type ScrollProgressProps } from "./animation/ScrollProgress";
export { ParallaxLayer, type ParallaxLayerProps } from "./animation/ParallaxLayer";

// Decorative
export { Marquee, type MarqueeProps } from "./animation/Marquee";
export { Ripple, type RippleProps } from "./animation/Ripple";
export { Pulse, type PulseProps } from "./animation/Pulse";

// ---------------------------------------------------------------------------
// Effects
// ---------------------------------------------------------------------------
export {
  ProximityGlow, ProximityGlowCard,
  type ProximityGlowProps, type ProximityGlowCardProps,
} from "./effects/ProximityGlow";

// ---------------------------------------------------------------------------
// EvilCharts (animated Recharts + Motion)
// ---------------------------------------------------------------------------
export {
  EvilLineChart,
  EvilAreaChart,
  EvilBarChart,
  EvilPieChart,
  EvilBrush,
  useEvilBrush,
  type EvilBrushRange,
  type ChartConfig,
} from "./charts";
