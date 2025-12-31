export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
    activeRoute: string;
}

