import { useState, useEffect } from 'react';

export const useDashboardPageModel = () => {
    // Placeholder data for now, can be replaced with API calls later
    const [stats, setStats] = useState({
        totalProjects: 4,
        activeWidgets: 3,
        cvViews: 128
    });

    return {
        stats
    };
};

