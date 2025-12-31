import React from 'react';
import { TimelineProps } from './Timeline.types';
import { cn } from '../../../utils/cn';
import './Timeline.styles.css';

export const Timeline: React.FC<TimelineProps> = ({
    entries,
    className
}) => {
    return (
        <div className={cn('timeline', className)}>
            {entries.map((entry) => (
                <div key={entry.id} className="timeline__item">
                    <div className="timeline__marker">
                        {entry.icon || <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="timeline__content">
                        <span className="timeline__date">{entry.date}</span>
                        <h3 className="timeline__title">{entry.title}</h3>
                        {entry.subtitle && <div className="timeline__subtitle">{entry.subtitle}</div>}
                        {entry.description && <p className="timeline__desc">{entry.description}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

