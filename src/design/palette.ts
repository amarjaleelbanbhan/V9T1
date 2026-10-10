/** Shared palette for CSS, SVG, and WebGL. Preserve the supplied teal/slate identity. */
export const palette = {
  background: '#031716', surface: '#032F30', panel: '#274D60', line: '#0A7075',
  text: '#EDF7F8', muted: '#B3D4DD', input: '#6BA3BE', weight: '#0C969C',
  activation: '#0C969C', error: '#FF9078', gradient: '#B8E6ED',
} as const;
export function installPalette() {
  for (const [role, color] of Object.entries(palette)) {
    document.documentElement.style.setProperty(`--${role}`, color);
  }
}
