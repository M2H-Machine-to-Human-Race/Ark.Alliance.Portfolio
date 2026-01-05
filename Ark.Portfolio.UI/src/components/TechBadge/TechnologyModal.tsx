/**
 * @fileoverview TechnologyModal Component
 * Wrapper around ark-alliance-react-ui BadgeDetailModal
 * 
 * @module components/TechBadge/TechnologyModal
 */

import React from 'react';
import { TechnologyDto } from '@ark/portfolio-share';
import { BadgeDetailModal } from 'ark-alliance-react-ui';

interface TechnologyModalProps {
    technology: TechnologyDto | null;
    onClose: () => void;
}

/**
 * TechnologyModal Component
 * Wrapper around BadgeDetailModal to display technology details
 */
export const TechnologyModal: React.FC<TechnologyModalProps> = ({
    technology,
    onClose
}) => {
    if (!technology) return null;

    // Map TechnologyDto to BadgeDetailData
    const detailData = {
        name: technology.name,
        color: technology.color,
        description: technology.description,
        icon: technology.icon,
        category: technology.category,
        links: technology.website ? [{ label: 'Official Website', url: technology.website }] : [],
        // Map versions if available
        version: technology.versions && technology.versions.length > 0
            ? technology.versions[technology.versions.length - 1]
            : undefined
    };

    return (
        <BadgeDetailModal
            isOpen={!!technology}
            onClose={onClose}
            data={detailData}
        />
    );
};
