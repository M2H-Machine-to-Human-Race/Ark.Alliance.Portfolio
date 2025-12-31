# Frontend Component Architecture - Complete Specification

## Core Architecture Principles

### Design Pattern: **MVVM (Model-View-ViewModel)**

Implement a strict MVVM architecture for all components to ensure:
- **Separation of concerns** between UI and business logic
- **Testability** and maintainability
- **Reusability** across the application
- **Clear data flow** and state management

---

## Component Structure Standards

### File Organization (MANDATORY)

**Every component MUST be separated into distinct files:**

```
ComponentName/
├── ComponentName.tsx          # Component logic and structure (TSX)
├── ComponentName.styles.css   # Component-specific styles (CSS)
├── ComponentName.model.ts     # ViewModel and data models
├── ComponentName.types.ts     # TypeScript interfaces and types
├── ComponentName.md           # Component documentation
└── index.ts                   # Public exports
```

### Why This Structure?

✅ **Separation of Concerns**: HTML structure (TSX), styling (CSS), and logic (Model) are completely separated  
✅ **Maintainability**: Easy to locate and modify specific aspects of a component  
✅ **Scalability**: New team members can quickly understand component organization  
✅ **Reusability**: Components can be easily extracted and reused  

---

## Base Component Architecture

### 1. **BaseComponent (Abstract Base Class)**

Create a foundational base class that all components inherit from:

```typescript
// BaseComponent.model.ts
export abstract class BaseComponentModel {
  protected isLoading: boolean = false;
  protected error: string | null = null;
  protected isVisible: boolean = true;
  
  // Lifecycle methods
  abstract onInit(): void;
  abstract onDestroy(): void;
  
  // Common utilities
  protected handleError(error: Error): void;
  protected setLoading(state: boolean): void;
  protected toggleVisibility(): void;
}
```

**Each component MUST:**
- Extend `BaseComponentModel`
- Implement its own specific ViewModel
- Never directly call API endpoints (use dedicated API service layer)

---

## Data Flow & API Separation

### ❌ NEVER DO THIS:
```typescript
// BAD: Component directly calling API
const ProjectCard = () => {
  const data = await fetch('/api/projects'); // ❌ WRONG
}
```

### ✅ CORRECT APPROACH:
```typescript
// GOOD: Component uses ViewModel which uses API service
const ProjectCard = () => {
  const viewModel = useProjectCardViewModel();
  // ViewModel internally uses ProjectApiService
}
```

### Architecture Layers:

```
Component (TSX)
    ↓
ViewModel (Model)
    ↓
API Service Layer (api/)
    ↓
Backend API
```

**API Service Layer Structure:**
```
src/api/
├── services/
│   ├── ProjectApiService.ts
│   ├── CVApiService.ts
│   └── ProfileApiService.ts
├── client/
│   └── apiClient.ts           # Axios/Fetch configuration
└── index.ts
```

---

## Required Generic Components

### 1. **Panel Component** (Container Base)

**Purpose**: Reusable container with consistent structure

```
Panel/
├── Panel.tsx
├── Panel.styles.css
├── Panel.model.ts
├── Panel.types.ts
└── Panel.md
```

**Features**:
- Configurable header, body, and footer sections
- Responsive layout
- Shadow/border variants
- Loading states
- Error boundaries

**Usage Pattern**:
```typescript
<Panel
  header={<PanelHeader title="Projects" />}
  footer={<PanelFooter actions={[...]} />}
>
  {/* Content */}
</Panel>
```

---

### 2. **Header Component** (Reusable)

**Purpose**: Generic header for panels and pages

```
Header/
├── Header.tsx
├── Header.styles.css
├── Header.model.ts
├── Header.types.ts
└── Header.md
```

**Features**:
- Title and subtitle support
- Action buttons/icons
- Breadcrumb integration
- Sticky/fixed positioning options
- Theme variants (dark/light)

**Variants**:
- `PanelHeader` - For panel components
- `PageHeader` - For full pages
- `SectionHeader` - For page sections

---

### 3. **Footer Component** (Reusable)

**Purpose**: Generic footer for panels and pages

```
Footer/
├── Footer.tsx
├── Footer.styles.css
├── Footer.model.ts
├── Footer.types.ts
└── Footer.md
```

**Features**:
- Action buttons (Save, Cancel, Submit, etc.)
- Pagination controls
- Status information
- Responsive button layout
- Loading states

**Variants**:
- `PanelFooter` - For panel components
- `PageFooter` - For full pages
- `FormFooter` - For form submissions

---

### 4. **Carousel Component**

**Purpose**: Image/content slideshow with smooth transitions

```
Carousel/
├── Carousel.tsx
├── Carousel.styles.css
├── Carousel.model.ts
├── Carousel.types.ts
└── Carousel.md
```

**Features**:
- Auto-play with configurable intervals
- Manual navigation (prev/next arrows)
- Dot indicators
- Keyboard navigation
- Touch/swipe gestures (mobile)
- Lazy loading for images
- Transition animations (fade, slide, zoom)
- Responsive breakpoints

**ViewModel Responsibilities**:
```typescript
export class CarouselViewModel extends BaseComponentModel {
  private currentIndex: number = 0;
  private items: CarouselItem[] = [];
  private autoPlayInterval: number | null = null;
  
  public next(): void;
  public previous(): void;
  public goToSlide(index: number): void;
  public startAutoPlay(): void;
  public stopAutoPlay(): void;
}
```

---

### 5. **Timeline Component** (CV History)

**Purpose**: Visual timeline for career history, education, and achievements

```
Timeline/
├── Timeline.tsx
├── Timeline.styles.css
├── Timeline.model.ts
├── Timeline.types.ts
├── TimelineItem/
│   ├── TimelineItem.tsx
│   ├── TimelineItem.styles.css
│   └── TimelineItem.types.ts
└── Timeline.md
```

**Features**:
- Vertical timeline layout
- Chronological or reverse-chronological order
- Icon/image support for each entry
- Expandable/collapsible details
- Date formatting
- Color-coded categories (work, education, projects)
- Animations on scroll
- Responsive mobile layout

**Data Structure**:
```typescript
interface TimelineEntry {
  id: string;
  date: Date | DateRange;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  category: TimelineCategory;
  details?: TimelineDetail[];
}
```

**ViewModel Responsibilities**:
```typescript
export class TimelineViewModel extends BaseComponentModel {
  private entries: TimelineEntry[] = [];
  private sortOrder: 'asc' | 'desc' = 'desc';
  private filterCategory: TimelineCategory | 'all' = 'all';
  
  public sortByDate(order: 'asc' | 'desc'): void;
  public filterByCategory(category: TimelineCategory): void;
  public expandEntry(id: string): void;
  public collapseEntry(id: string): void;
}
```

---

## Additional Essential Components

### 6. **Card Component**
- Project cards
- Profile cards
- Info cards
- Hover effects and interactions

### 7. **Grid Component**
- Responsive grid layout
- Configurable columns
- Gap control
- Masonry layout option

### 8. **Button Component**
- Multiple variants (primary, secondary, outline, ghost)
- Size options (small, medium, large)
- Loading states
- Icon support
- Disabled states

### 9. **Modal/Dialog Component**
- Overlay management
- Focus trapping
- Accessibility (ARIA)
- Animation transitions
- Size variants

### 10. **Navigation Component**
- Main navigation menu
- Breadcrumbs
- Sidebar navigation
- Mobile responsive menu

---

## Documentation Requirements

### Component Documentation Template (ComponentName.md)

```markdown
# ComponentName

## Overview
Brief description of the component's purpose and use cases.

## Props/Interface
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| ... | ... | ... | ... | ... |

## Usage Examples

### Basic Usage
\`\`\`tsx
<ComponentName prop1="value" />
\`\`\`

### Advanced Usage
\`\`\`tsx
<ComponentName 
  prop1="value"
  prop2={complexValue}
  onEvent={handleEvent}
/>
\`\`\`

## Styling

### CSS Classes
- `.component-name` - Root class
- `.component-name__element` - BEM element class
- `.component-name--modifier` - BEM modifier class

### CSS Custom Properties
- `--component-primary-color`
- `--component-spacing`

## Accessibility
- ARIA attributes used
- Keyboard navigation support
- Screen reader considerations

## ViewModel Methods
List of public methods and their purposes

## Dependencies
- Internal component dependencies
- External library dependencies

## Notes
Any special considerations, known issues, or future improvements
```

---

## Sample Project Analysis

### Action Required: **Study the Reference Project**

**Location**: Root of the workspace (sample project)

**What to Analyze**:
1. **Component structure patterns** - How are components organized?
2. **Naming conventions** - File and class naming standards
3. **Design patterns** - What patterns are being used?
4. **Styling approach** - CSS methodology (BEM, CSS Modules, etc.)
5. **State management** - How is state handled?
6. **API integration** - How do components communicate with backend?
7. **Reusability patterns** - How are components made generic?
8. **UI/UX patterns** - Visual design language and interactions

**Questions to Answer**:
- How does the sample handle responsive design?
- What animation/transition patterns are used?
- How is accessibility implemented?
- What loading and error states are shown?
- How is the component hierarchy structured?

---

## UI/UX Excellence Standards

### Think Like a UI/UX Architecture Genius

**Principles to Follow**:

1. **Consistency is King**
   - Same spacing throughout (8px grid system)
   - Consistent color usage
   - Uniform border radius
   - Predictable interaction patterns

2. **Performance First**
   - Lazy load images and heavy components
   - Optimize re-renders
   - Use CSS transforms for animations
   - Implement virtual scrolling for long lists

3. **Accessibility Always**
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation
   - Focus management
   - Color contrast ratios (WCAG AA minimum)

4. **Mobile-First Design**
   - Start with mobile layout
   - Progressive enhancement for larger screens
   - Touch-friendly targets (minimum 44x44px)
   - Gesture support

5. **Micro-Interactions**
   - Hover states
   - Focus indicators
   - Loading animations
   - Success/error feedback
   - Smooth transitions

6. **Visual Hierarchy**
   - Clear typography scale
   - Strategic use of white space
   - Visual weight and emphasis
   - Color to guide attention

---

## Component Composition Patterns

### Example: Building a Project Card

```typescript
<Panel className="project-card">
  <PanelHeader 
    title={project.title}
    subtitle={project.category}
    actions={<BookmarkButton />}
  />
  
  <Carousel images={project.screenshots} />
  
  <div className="project-card__content">
    <p>{project.description}</p>
    <TagList tags={project.technologies} />
  </div>
  
  <PanelFooter>
    <Button variant="primary">View Details</Button>
    <Button variant="outline">Live Demo</Button>
  </PanelFooter>
</Panel>
```

**Notice**:
- Composition of generic components
- Clear hierarchy
- Reusable parts (Header, Footer, Carousel)
- Semantic structure

---

## Implementation Checklist

### For Each Component:

- [ ] Create folder with proper structure (TSX, CSS, Model, Types, Docs)
- [ ] Extend BaseComponentModel
- [ ] Implement ViewModel with business logic
- [ ] Separate all styles into CSS file
- [ ] Create TypeScript interfaces
- [ ] Write comprehensive documentation
- [ ] No direct API calls (use API service layer)
- [ ] Implement accessibility features
- [ ] Add loading and error states
- [ ] Test on mobile and desktop
- [ ] Peer code review
- [ ] Add to Storybook (component library showcase)

---

## Success Metrics

✅ **Zero coupling** between components and API endpoints  
✅ **100% separation** of TSX, CSS, and logic files  
✅ **Complete documentation** for every component  
✅ **Consistent** visual language across all components  
✅ **Reusable** components with clear props interfaces  
✅ **Accessible** to WCAG AA standards minimum  
✅ **Performant** with optimized rendering  
✅ **Responsive** across all device sizes  

---

## Next Steps

1. **Analyze the sample project** thoroughly
2. **Create BaseComponentModel** and base classes
3. **Implement Panel, Header, Footer** as foundation
4. **Build Carousel and Timeline** components
5. **Create remaining generic components** (Cards, Buttons, etc.)
6. **Document everything** as you build
7. **Set up Storybook** for component showcase
8. **Create usage examples** for other developers

---

**Remember**: You're not just building components—you're architecting a **design system** that will serve as the foundation for the entire application. Build it with the precision and foresight of a master craftsman.