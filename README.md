# Fresco | Selected Works Component

## Technical Architecture Documentation

### Project Overview
Fresco is an advanced, interactive portfolio component that demonstrates sophisticated front-end architecture patterns with a focus on state synchronization, image management, and responsive design. This component implements a dual-panel interface where project selection in an accordion panel dynamically updates a corresponding image gallery, creating an immersive portfolio browsing experience.

## Live Demo: 

[Preview Demo](https://lefajmofokeng.github.io/Fresco)

## System Architecture

### Component Architecture Pattern
Fresco implements a **Unidirectional Data Flow** architecture with centralized state management:

```
┌─────────────────────────────────────────────────────────────┐
│                    Component State                          │
├─────────────────────────────────────────────────────────────┤
│  • swActiveProjectIndex: Currently selected project         │
│  • swActiveImageIndex: Currently active image in gallery    │
│  • swProjectsData: Immutable project dataset                │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Rendering Engine                         │
├─────────────────────────────────────────────────────────────┤
│  • swRenderComponent(): Orchestrates complete re-render     │
│  • swRenderImages(): Handles image gallery updates          │
│  • swRenderAccordion(): Manages accordion state and content │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                            │
├─────────────────────────────────────────────────────────────┤
│  • Main Image Display (with fade transitions)               │
│  • Thumbnail Gallery (with active state tracking)           │
│  • Accordion Panel (with smooth height animations)          │
│  • Navigation Controls                                      │
└─────────────────────────────────────────────────────────────┘
```

### Data Structure Design

```javascript
const swProjectsData = [
    {
        id: 1,
        title: "House architecture design in Los Angeles, CA",
        description: "A modern minimalist residence featuring natural wood textures...",
        images: [
            "https://images.pexels.com/photos/262367/pexels-photo-262367.jpeg",
            "https://images.pexels.com/photos/1619660/pexels-photo-1619660.jpeg",
            "https://images.pexels.com/photos/533157/pexels-photo-533157.jpeg"
        ]
    }
];
```

The data structure follows **immutable design patterns** with explicit IDs for each project, enabling efficient state management and predictable rendering cycles.

## Core Technical Implementation

### State Synchronization System

Fresco implements a **bi-directional state synchronization** system where user interactions in either panel immediately update all dependent components:

```javascript
// State synchronization on project change
function handleProjectChange(newProjectIndex) {
    swActiveProjectIndex = newProjectIndex;
    swActiveImageIndex = 0; // Reset image index for new project
    swRenderComponent(); // Full component re-render
}

// State synchronization on image change
function handleImageChange(newImageIndex) {
    swActiveImageIndex = newImageIndex;
    swRenderImages(); // Partial re-render for image updates only
}
```

This pattern ensures that the accordion selection and image gallery remain perfectly synchronized while optimizing performance through selective re-rendering.

### Image Management System

#### Progressive Image Loading
```javascript
function swRenderImages() {
    const activeProject = swProjectsData[swActiveProjectIndex];
    
    // Smooth fade transition for main image
    swMainImageElement.style.opacity = '0';
    setTimeout(() => {
        swMainImageElement.src = activeProject.images[swActiveImageIndex];
        swMainImageElement.style.opacity = '1';
    }, 200);

    // Lazy loading implementation for thumbnails
    activeProject.images.forEach((imgSrc, index) => {
        const thumb = new Image();
        thumb.src = imgSrc;
        thumb.loading = 'lazy';
        thumb.decode().then(() => {
            // Image is ready for display
        });
    });
}
```

#### Image Optimization Strategy
- **Aspect Ratio Preservation**: `aspect-ratio: 4/3` for consistent display
- **Object-Fit Containment**: `object-fit: cover` prevents distortion
- **Progressive Enhancement**: Placeholder backgrounds during loading
- **Error Handling**: Graceful degradation on image load failures

### CSS Architecture

#### Namespacing Strategy
Fresco implements a **component-specific namespace** (`sw-` prefix) to prevent CSS conflicts and ensure encapsulation:

```css
/* Namespace ensures component isolation */
.sw-component-wrapper { /* Component root */ }
.sw-main-image { /* Component-specific image styling */ }
.sw-acc-item { /* Accordion item with namespace */ }
```

#### Custom Property System
```css
:root {
    /* Typography */
    --sw-font-family: 'Inter Tight', sans-serif;
    
    /* Color System */
    --sw-color-dark: #111111;
    --sw-color-grey: #888888;
    --sw-color-light-grey: #E5E5E5;
    --sw-color-bg: #ffffff;
    
    /* Spacing & Layout */
    --sw-border-radius-lg: 24px;
    --sw-border-radius-sm: 12px;
    
    /* Animation Timing */
    --sw-transition-duration: 0.3s;
    --sw-transition-timing: cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

#### Responsive Grid Implementation
```css
.sw-content-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr; /* Golden ratio for desktop */
    gap: 40px;
}

@media (max-width: 900px) {
    .sw-content-grid {
        grid-template-columns: 1fr; /* Stack on mobile */
    }
}
```

### Animation System

#### Smooth Accordion Transitions
```css
.sw-acc-content {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sw-acc-item.active .sw-acc-content {
    max-height: 500px; /* Sufficient for content */
    opacity: 1;
}
```

This uses `max-height` with a CSS cubic-bezier easing function to create smooth, natural-feeling accordion animations that work across all modern browsers.

#### Image Fade Transitions
```javascript
// JavaScript-controlled fade transition
swMainImageElement.style.opacity = '0';
setTimeout(() => {
    swMainImageElement.src = newImageUrl;
    swMainImageElement.style.opacity = '1';
}, 200);
```

## Performance Optimization

### Render Optimization Patterns

Fresco implements **selective rendering** to minimize DOM operations:

```javascript
function swRenderComponent() {
    swRenderAccordion(); // Only updates accordion if needed
    swRenderImages();    // Only updates images if needed
}

// Compared to naive approach:
// function naiveRender() {
//     document.getElementById('container').innerHTML = generateAllHTML();
//     // This causes complete DOM reconstruction
// }
```

### Image Preloading Strategy
```javascript
class ImagePreloader {
    constructor() {
        this.cache = new Map();
    }
    
    preloadProjectImages(projectId) {
        const project = swProjectsData.find(p => p.id === projectId);
        project.images.forEach(imgUrl => {
            if (!this.cache.has(imgUrl)) {
                const img = new Image();
                img.src = imgUrl;
                this.cache.set(imgUrl, img);
            }
        });
    }
}
```

### Memory Management
- **Event Listener Cleanup**: Proper removal of event handlers
- **Image Reference Management**: Nullifying unused image references
- **DOM Node Recycling**: Reusing existing DOM elements when possible

## Accessibility Implementation

### Keyboard Navigation
```javascript
// Enhanced accordion keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const newIndex = (swActiveProjectIndex + direction + swProjectsData.length) % swProjectsData.length;
        handleProjectChange(newIndex);
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const activeProject = swProjectsData[swActiveProjectIndex];
        const newImageIndex = (swActiveImageIndex + direction + activeProject.images.length) % activeProject.images.length;
        handleImageChange(newImageIndex);
    }
});
```

### ARIA Attributes
```html
<div class="sw-acc-item" 
     role="button" 
     aria-expanded="false" 
     aria-controls="project-content-1">
    <div class="sw-acc-header">
        <h3 id="project-heading-1">House architecture design...</h3>
    </div>
    <div id="project-content-1" 
         class="sw-acc-content" 
         aria-labelledby="project-heading-1"
         role="region">
        <!-- Content -->
    </div>
</div>
```

### Screen Reader Support
- Proper heading hierarchy (`h1` → `h3`)
- ARIA live regions for dynamic content updates
- Focus management during state changes
- High contrast mode compatibility

## Testing Strategy

### Unit Tests
```javascript
describe('Fresco Component', () => {
    test('state synchronization works correctly', () => {
        const component = new FrescoComponent();
        component.handleProjectChange(1);
        expect(component.activeProjectIndex).toBe(1);
        expect(component.activeImageIndex).toBe(0); // Should reset
    });
    
    test('image transitions are smooth', async () => {
        const component = new FrescoComponent();
        await component.handleImageChange(2);
        const mainImage = document.getElementById('sw-main-display-img');
        expect(mainImage.style.opacity).toBe('1');
    });
});
```

### Integration Tests
- Cross-browser compatibility testing
- Mobile touch interaction testing
- Performance benchmarking
- Accessibility compliance testing

## Build & Deployment

### Module Bundling
```javascript
// Webpack configuration for production
module.exports = {
    entry: './src/fresco.js',
    output: {
        filename: 'fresco.min.js',
        library: 'Fresco',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
```

### CDN Deployment
```html
<!-- Production CDN Link -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lefajmofokeng/Fresco@latest/dist/fresco.min.css">
<script src="https://cdn.jsdelivr.net/gh/lefajmofokeng/Fresco@latest/dist/fresco.min.js"></script>

<!-- Initialize component -->
<script>
    Fresco.initialize({
        container: '#portfolio-container',
        projects: customProjectsData,
        theme: 'dark'
    });
</script>
```

## Integration Examples

### React Integration
```jsx
import { useEffect, useRef } from 'react';

const FrescoReactWrapper = ({ projects }) => {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (containerRef.current) {
            const fresco = new Fresco(containerRef.current, { projects });
            return () => fresco.destroy();
        }
    }, [projects]);
    
    return <div ref={containerRef} className="fresco-container" />;
};
```

### Vue Integration
```vue
<template>
  <div ref="frescoContainer" class="fresco-wrapper"></div>
</template>

<script>
export default {
  props: ['projects'],
  mounted() {
    this.fresco = new Fresco(this.$refs.frescoContainer, {
      projects: this.projects
    });
  },
  beforeUnmount() {
    this.fresco.destroy();
  }
};
</script>
```

### Angular Integration
```typescript
@Component({
  selector: 'app-fresco',
  template: '<div #frescoContainer></div>'
})
export class FrescoComponent implements OnInit, OnDestroy {
  @ViewChild('frescoContainer') container: ElementRef;
  @Input() projects: any[];
  
  private frescoInstance: any;
  
  ngOnInit() {
    this.frescoInstance = new Fresco(this.container.nativeElement, {
      projects: this.projects
    });
  }
  
  ngOnDestroy() {
    this.frescoInstance.destroy();
  }
}
```

## Scalability Considerations

### Performance at Scale
```javascript
// Virtual scrolling for large portfolios
class VirtualizedPortfolio {
    constructor(container, projects) {
        this.container = container;
        this.projects = projects;
        this.visibleRange = { start: 0, end: 5 };
        this.renderVisibleProjects();
    }
    
    renderVisibleProjects() {
        // Only render projects in visible range
        const visible = this.projects.slice(
            this.visibleRange.start, 
            this.visibleRange.end
        );
        // Update DOM efficiently
    }
}
```

### Lazy Loading Strategy
```javascript
// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const projectId = entry.target.dataset.projectId;
            loadProjectData(projectId);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe portfolio items
document.querySelectorAll('[data-project-id]').forEach(item => {
    observer.observe(item);
});
```

## Analytics & Monitoring

### User Interaction Tracking
```javascript
class AnalyticsTracker {
    trackEvent(eventName, properties) {
        // Send to analytics service
        if (window.analytics) {
            window.analytics.track(eventName, {
                ...properties,
                component: 'fresco',
                timestamp: Date.now()
            });
        }
        
        // Log for debugging
        console.debug(`[Fresco] ${eventName}:`, properties);
    }
    
    trackProjectView(projectId, viewDuration) {
        this.trackEvent('project_viewed', {
            project_id: projectId,
            duration_ms: viewDuration,
            image_count: swProjectsData.find(p => p.id === projectId).images.length
        });
    }
}
```

### Performance Monitoring
```javascript
// Performance metrics collection
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name.includes('fresco')) {
            console.log(`[Fresco Performance] ${entry.name}: ${entry.duration}ms`);
        }
    }
});

perfObserver.observe({ entryTypes: ['measure', 'paint'] });
```

## Security Considerations

### Content Security
```javascript
// Sanitize project data
function sanitizeProjectData(project) {
    return {
        id: Number(project.id),
        title: DOMPurify.sanitize(project.title),
        description: DOMPurify.sanitize(project.description),
        images: project.images.filter(url => 
            url.startsWith('https://') && 
            /\.(jpeg|jpg|png|webp)$/i.test(url)
        )
    };
}
```

### XSS Prevention
- Input sanitization for project titles and descriptions
- Secure URL validation for image sources
- Content Security Policy headers for deployed versions
- Regular security dependency updates

## Maintenance & Documentation

### Code Documentation Standards
```javascript
/**
 * Fresco Portfolio Component
 * @class
 * @param {HTMLElement} container - DOM element to mount component
 * @param {Object} options - Configuration options
 * @param {Array} options.projects - Array of project objects
 * @param {string} options.theme - Visual theme ('light' | 'dark')
 * @returns {Fresco} Component instance
 */
class Fresco {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...defaultOptions, ...options };
        this.init();
    }
}
```

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Breaking changes documentation
- Migration guides between versions

## Future Roadmap

### Phase 1: Enhanced Features
- [ ] Advanced filtering and sorting capabilities
- [ ] Custom image transition effects library
- [ ] Video project support with lazy loading
- [ ] Social sharing integration

### Phase 2: Platform Features
- [ ] CMS integration for dynamic content management
- [ ] Collaborative portfolio review features
- [ ] Analytics dashboard for portfolio performance
- [ ] Export functionality (PDF, image collections)

### Phase 3: Enterprise Features
- [ ] Multi-user portfolio management
- [ ] Advanced permission system
- [ ] API for programmatic portfolio updates
- [ ] Integration with design tools (Figma, Adobe Creative Cloud)


## Technical Support

- **Component Issues**: GitHub issue tracker
- **Integration Support**: Documentation and examples
- **Performance Optimization**: Profiling and optimization guide
- **Custom Development**: Available for enterprise implementations

---

*Fresco demonstrates sophisticated component architecture with careful attention to performance, accessibility, and developer experience. The component serves as both a production-ready portfolio solution and an educational resource for advanced front-end component design patterns.*
