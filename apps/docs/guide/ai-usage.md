# AI Usage Guide

GlaceUI is designed to be AI-friendly, with comprehensive documentation optimized for LLM consumption.

## For AI Coding Assistants

When using GlaceUI with AI tools like Claude, Copilot, or Cursor:

1. **Import the CSS**: Always include `import '@glace-ui/core/css'` in your entry file
2. **Use the plugin or individual imports**: Either `app.use(GlacePlugin)` or import components individually
3. **Set up theming**: Call `useGlaceTheme()` in your root component

## llms.txt

GlaceUI provides an `llms.txt` file at the project root following the llms.txt specification. This gives AI tools a structured overview of the library.

## Component Quick Reference

All components use the `Glace` prefix and follow consistent patterns:

- Props use kebab-case in templates: `blur-intensity`, `close-on-overlay`
- All components support the standard glace CSS classes with `glace-` BEM prefix
- Visual variants: `variant` prop (component-specific values)
- Sizes: `size` prop (`sm`, `md`, `lg`, or component-specific)
- Accessibility: ARIA attributes are built-in, no extra configuration needed
