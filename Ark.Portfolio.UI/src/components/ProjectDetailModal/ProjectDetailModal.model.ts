/**
 * @fileoverview ProjectDetailModal ViewModel
 * Manages modal state, gallery navigation, and focus management.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProjectCardData } from '../ProjectGrid/ProjectGrid.model';

/**
 * ProjectDetailModal configuration
 */
export interface ProjectDetailModalConfig {
    project: ProjectCardData | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (project: ProjectCardData) => void;
    showAdmin?: boolean;
}

/**
 * ProjectDetailModal ViewModel state
 */
export interface ProjectDetailModalModel {
    /** Current project data */
    project: ProjectCardData | null;
    /** Is modal open */
    isOpen: boolean;
    /** Current gallery image index */
    galleryIndex: number;
    /** Gallery images */
    galleryImages: string[];
    /** Is lightbox open */
    isLightboxOpen: boolean;
    /** Show admin controls */
    showAdmin: boolean;

    // Actions
    close: () => void;
    nextImage: () => void;
    prevImage: () => void;
    goToImage: (index: number) => void;
    openLightbox: (index: number) => void;
    closeLightbox: () => void;
    handleEdit: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * ProjectDetailModal ViewModel hook
 */
export const useProjectDetailModalModel = (config: ProjectDetailModalConfig): ProjectDetailModalModel => {
    const {
        project,
        isOpen,
        onClose,
        onEdit,
        showAdmin = false,
    } = config;

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Extract gallery images from project
    const galleryImages = project?.imageUrl ? [project.imageUrl] : [];

    // Reset gallery index when project changes
    useEffect(() => {
        setGalleryIndex(0);
        setIsLightboxOpen(false);
    }, [project?.id]);

    // Focus management - trap focus in modal
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            // Focus will be set by the modal component
        } else {
            // Restore focus when closing
            previousActiveElement.current?.focus();
        }
    }, [isOpen]);

    // Handle Escape key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isLightboxOpen) {
                    setIsLightboxOpen(false);
                } else if (isOpen) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, isLightboxOpen, onClose]);

    const close = useCallback(() => {
        onClose();
    }, [onClose]);

    const nextImage = useCallback(() => {
        if (galleryImages.length > 1) {
            setGalleryIndex(prev => (prev + 1) % galleryImages.length);
        }
    }, [galleryImages.length]);

    const prevImage = useCallback(() => {
        if (galleryImages.length > 1) {
            setGalleryIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
        }
    }, [galleryImages.length]);

    const goToImage = useCallback((index: number) => {
        if (index >= 0 && index < galleryImages.length) {
            setGalleryIndex(index);
        }
    }, [galleryImages.length]);

    const openLightbox = useCallback((index: number) => {
        setGalleryIndex(index);
        setIsLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    const handleEdit = useCallback(() => {
        if (onEdit && project) {
            onEdit(project);
        }
    }, [onEdit, project]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
            case 'Escape':
                e.preventDefault();
                if (isLightboxOpen) {
                    closeLightbox();
                } else {
                    close();
                }
                break;
        }
    }, [prevImage, nextImage, isLightboxOpen, closeLightbox, close]);

    return {
        project,
        isOpen,
        galleryIndex,
        galleryImages,
        isLightboxOpen,
        showAdmin,
        close,
        nextImage,
        prevImage,
        goToImage,
        openLightbox,
        closeLightbox,
        handleEdit,
        handleKeyDown,
    };
};

export default useProjectDetailModalModel;
