# Creating Custom Themes

This guide explains how to add custom themes to the HckrNews Dark Mode extension.

## Understanding Theme Structure

Each theme is defined using CSS custom properties (CSS variables). Here's the basic structure:

```css
:root {
  --bg-primary: #1a1b1e;        /* Main background color */
  --bg-secondary: #23272f;      /* Secondary background (unused currently, for future) */
  --text-primary: #e8e6e3;      /* Main text color */
  --accent: #ff8c42;            /* Accent color for buttons and highlights */
  --link: #64a9ff;              /* Regular link color */
  --visited: #b392f0;           /* Visited link color */
  --selected-nav-text: #64a9ff; /* Color for selected/active navigation items */
  --selected-nav-border: #64a9ff; /* Border color for selected/active navigation items */
  --hover-nav-text: #4a8cd4;   /* Color when hovering over links */
}
```

## How to Add a New Theme

### Step 1: Choose Your Colors

Pick a color palette for your theme. Consider:
- **Contrast**: Ensure good readability between background and text colors
- **Accessibility**: Aim for WCAG AA compliance (4.5:1 contrast ratio for normal text)
- **Harmony**: Colors should work well together

### Step 2: Add Your Theme to `content.js`

1. Open `content.js`
2. Find the `themes` object (around line 5)
3. Add your theme following this format:

```javascript
const themes = {
    // ... existing themes ...
    
    myCustomTheme: `:root { 
        --bg-primary: #your-bg-color; 
        --bg-secondary: #your-secondary-bg; 
        --text-primary: #your-text-color; 
        --accent: #your-accent-color; 
        --link: #your-link-color; 
        --visited: #your-visited-link-color; 
        --selected-nav-text: #your-selected-color; 
        --selected-nav-border: #your-border-color; 
        --hover-nav-text: #your-hover-color; 
    }`,
};
```

**Important**: 
- Use camelCase for the theme name (e.g., `myCustomTheme`, not `my-custom-theme`)
- Keep all CSS in a single line within the backticks
- Don't forget the semicolons after each property

### Step 3: Add Theme to Popup Menu

1. Open `popup.html`
2. Find the `<select id="themeSelect">` element
3. Add a new option:

```html
<option value="myCustomTheme">My Custom Theme</option>
```

**Note**: The `value` attribute must match exactly the theme name you used in `content.js`

## Example: Creating a "Forest" Theme

Here's a complete example of adding a new theme:

### In `content.js`:

```javascript
const themes = {
    // ... existing themes ...
    
    forest: `:root { 
        --bg-primary: #1a2f1a; 
        --bg-secondary: #243324; 
        --text-primary: #d4e8d4; 
        --accent: #7cb342; 
        --link: #81c784; 
        --visited: #aed581; 
        --selected-nav-text: #81c784; 
        --selected-nav-border: #81c784; 
        --hover-nav-text: #66bb6a; 
    }`,
};
```

### In `popup.html`:

```html
<select id="themeSelect" aria-label="Select theme">
    <!-- ... existing options ... -->
    <option value="forest">Forest</option>
</select>
```

## Color Recommendations

### Background Colors
- **--bg-primary**: Should be the darkest color in your palette
- **--bg-secondary**: Slightly lighter than primary (for future use)
- Recommended range: `#000000` to `#2a2a2a`

### Text Colors
- **--text-primary**: Should have high contrast with background
- Recommended: Light colors (`#c0c0c0` to `#ffffff`)
- Test contrast ratio: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Link Colors
- **--link**: Should be bright and distinct from text
- **--visited**: Should be noticeably different from regular links
- **--hover-nav-text**: Usually a brighter or darker variant of link color
- Common choices: Blues, greens, cyans, purples

### Accent Color
- **--accent**: Used for buttons and highlights
- Should stand out against the background
- Consider warm colors for visibility (oranges, yellows, reds)

## Testing Your Theme

1. Save your changes to both files
2. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the reload icon for HckrNews Dark Mode
3. Visit [hckrnews.com](https://hckrnews.com)
4. Click the extension icon and select your new theme
5. Verify:
   - Background and text are readable
   - Links are visible and distinguishable
   - Hover states work correctly
   - Visited links appear different

## Browser Developer Tools Tips

To experiment with colors before committing:

1. Visit hckrnews.com with dark mode enabled
2. Open DevTools (F12)
3. In the Console, type:

```javascript
document.documentElement.style.setProperty('--link', '#your-color');
document.documentElement.style.setProperty('--visited', '#your-color');
// ... test other properties
```

This lets you preview colors in real-time!

## Existing Theme References

Here are some popular themes you can use as inspiration:

- **default**: Balanced dark theme with blue links
- **dracula**: Purple-tinted with high contrast
- **solarizedDark**: Low contrast, easy on the eyes
- **tokyoNight**: Blue-tinted with excellent readability
- **catppuccin**: Pastel-like colors with soft contrast
- **cyberpunk2077**: High contrast neon theme

Check `content.js` to see their exact color values.

## Troubleshooting

### Theme not appearing in dropdown
- Verify the theme name matches exactly in both files (case-sensitive)
- Ensure you reloaded the extension

### Colors not applying
- Check for syntax errors (missing semicolons, quotes, or commas)
- Verify all CSS property names are correct (double-dash prefix)
- Make sure the format matches existing themes exactly

### Links not visible
- Increase contrast between `--link` and `--bg-primary`
- Ensure `--visited` is sufficiently different from `--link`
- Test with browser's color contrast tools

## Contributing Your Theme

If you've created a great theme, consider contributing it back:

1. Fork the repository
2. Add your theme
3. Test it thoroughly
4. Submit a pull request with:
   - Theme name and description
   - Screenshot showing the theme in action
   - Why the theme is useful/unique

## Advanced: Dynamic Themes

For advanced users who want to create themes programmatically or load them from external sources, you could extend the extension to:

- Load themes from JSON files
- Allow users to create themes via a color picker UI
- Import/export theme files
- Sync custom themes across devices

These features would require modifying the popup UI and storage logic. Feel free to experiment and contribute!

---

**Need Help?** Open an issue on [GitHub](https://github.com/abdul/hckrnews-dark-mode) with your theme code and a description of the problem.
