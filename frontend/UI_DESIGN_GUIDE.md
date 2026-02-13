# UI Design System - SmartDoc

## Design Philosophy
Modern SaaS-inspired design with clean aesthetics, inspired by Notion, Vercel, and Linear.

## Color Palette

### Primary Colors
- Primary 50: `#eef2ff` - Light backgrounds
- Primary 100: `#e0e7ff` - Hover states
- Primary 500: `#6366f1` - Main brand color
- Primary 600: `#4f46e5` - Primary buttons
- Primary 700: `#4338ca` - Active states

### Accent
- Accent: `#8b5cf6` - Purple highlights

### Semantic Colors
- Success: Green shades
- Error: Red shades
- Warning: Orange shades

## Components

### Button Variants
```jsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
```

### Card
```jsx
<Card>Content here</Card>
<Card hover={false}>No hover effect</Card>
```

### Badge
```jsx
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
```

### FileUpload
```jsx
<FileUpload onFileSelect={(file) => console.log(file)} accept=".zip" />
```

### StatsCard
```jsx
<StatsCard
  icon="📦"
  label="Total Projects"
  value={42}
  trend="+12% this month"
  color="primary"
/>
```

### CodeBlock
```jsx
<CodeBlock code={codeString} language="javascript" />
```

### Skeleton Loaders
```jsx
<Skeleton variant="title" />
<Skeleton variant="text" />
<Skeleton variant="card" />
```

## Animations
- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up effect
- `animate-shimmer` - Shimmer loading effect

## Utility Classes
- `.glass` - Glassmorphism effect
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style

## Best Practices
1. Use semantic HTML
2. Maintain consistent spacing (Tailwind spacing scale)
3. Use rounded-xl for modern look
4. Add hover states for interactive elements
5. Include loading states
6. Ensure mobile responsiveness
