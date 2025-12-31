import React, { useState } from 'react';
import { ProjectFeatureDto } from '../../../../Ark.Portfolio.Share/dtos/project.dto';
import { Icon } from '../generic/Icon';

interface CarouselProps {
    items: ProjectFeatureDto[];
}

export const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

    if (items.length === 0) return null;

    const activeItem = items[activeIndex];

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Display */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{ backgroundImage: `url(${activeItem.imageUrl || ''})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 backdrop-blur-sm">
                            <Icon name={activeItem.icon || 'box'} size="md" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{activeItem.title}</h3>
                    </div>
                    <p className="text-slate-300 text-lg max-w-2xl">{activeItem.description}</p>
                </div>

                {/* Controls */}
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all border border-white/10">
                    <Icon name="arrow-left" size="md" />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all border border-white/10">
                    <Icon name="arrow-right" size="md" />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-4 mt-6">
                {items.map((item, idx) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveIndex(idx)}
                        className={`group relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                    </button>
                ))}
            </div>
        </div>
    );
};

