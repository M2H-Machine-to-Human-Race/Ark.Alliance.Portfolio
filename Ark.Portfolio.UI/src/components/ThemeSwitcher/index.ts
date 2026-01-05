/**
 * @fileoverview ThemeSwitcher Module Barrel Export
 * @module components/ThemeSwitcher
 */

// View component
export { ThemeSwitcher, default } from './ThemeSwitcher';
export type { ThemeSwitcherProps } from './ThemeSwitcher';

// ViewModel
export { useThemeSwitcherModel, THEME_CONFIGS } from './ThemeSwitcher.model';
export type { ThemeSwitcherModel, ThemeConfigItem } from './ThemeSwitcher.model';
