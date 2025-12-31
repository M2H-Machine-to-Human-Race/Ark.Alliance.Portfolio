import { IconDefinition } from '../Icon.types';

export class IconRegistry {
    private static icons: Map<string, IconDefinition> = new Map();

    public static register(icons: IconDefinition[]): void {
        icons.forEach(icon => {
            this.icons.set(icon.name, icon);
        });
    }

    public static get(name: string): IconDefinition | undefined {
        return this.icons.get(name);
    }

    public static getAll(): IconDefinition[] {
        return Array.from(this.icons.values());
    }
}

// Initial Registration of common icons
// These are simple example paths (standard generic shapes)
IconRegistry.register([
    { name: 'chevron-right', path: 'M9 18l6-6-6-6' },
    { name: 'chevron-down', path: 'M6 9l6 6 6-6' },
    { name: 'folder', path: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { name: 'file', path: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z' },
    { name: 'check', path: 'M20 6L9 17l-5-5' },
    { name: 'x', path: 'M18 6L6 18M6 6l12 12' },
    { name: 'menu', path: 'M4 6h16M4 12h16M4 18h16' }
]);

