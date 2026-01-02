/**
 * @fileoverview ResumePageV2 Component Tests
 * Tests the Resume page view layer using mocked model hook.
 * 
 * Tests Cover:
 * - Loading state rendering
 * - Error state rendering
 * - Content display with profile data
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { ResumePageV2 } from '@ui/pages/ResumeV2/ResumePageV2';
import * as ResumeModel from '@ui/pages/ResumeV2/ResumePageV2.model';

// Fix for React 18/Router v6 type mismatch (TS2786)
const MemoryRouter = Router as any;

// Mock the model hook
jest.mock('@ui/pages/ResumeV2/ResumePageV2.model', () => ({
    useResumePageV2Model: jest.fn(),
    // We don't need to mock interfaces, they are erased at runtime
}));

// Mock child components to avoid deep rendering issues and strict unit testing
jest.mock('@ui/components/HeaderV2', () => ({
    HeaderV2: () => <div data-testid="header-v2">HeaderV2</div>
}));
jest.mock('@ui/components/TimelineV2', () => ({
    TimelineV2: (props: any) => <div data-testid="timeline-v2">{props.items.length} items</div>
}));

describe('ResumePageV2', () => {
    const mockUseResumePageV2Model = ResumeModel.useResumePageV2Model as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        mockUseResumePageV2Model.mockReturnValue({
            isLoading: true,
            error: null,
            profileSummary: '',
            experienceItems: [],
            educationItems: [],
            skillCategories: []
        });

        render(
            <MemoryRouter>
                <ResumePageV2 />
            </MemoryRouter>
        );
        expect(screen.getByText('Loading resume...')).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
        mockUseResumePageV2Model.mockReturnValue({
            isLoading: false,
            error: 'Failed to fetch',
            profileSummary: '',
            experienceItems: [],
            educationItems: [],
            skillCategories: []
        });

        render(
            <MemoryRouter>
                <ResumePageV2 />
            </MemoryRouter>
        );
        expect(screen.getByText('Unable to Load Resume')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });

    it('renders content correctly when data is loaded', () => {
        mockUseResumePageV2Model.mockReturnValue({
            isLoading: false,
            error: null,
            profileSummary: 'Experienced Architect',
            experienceItems: [{ id: '1' }],
            educationItems: [{ id: '2' }],
            skillCategories: [{ id: 's1', name: 'Coding', skills: [], gradient: 'red', icon: 'Code' }],
            isAdmin: false
        });

        render(
            <MemoryRouter>
                <ResumePageV2 />
            </MemoryRouter>
        );
        expect(screen.getByText('My')).toBeInTheDocument();
        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.getByText('Experienced Architect')).toBeInTheDocument();
        expect(screen.getAllByTestId('timeline-v2')).toHaveLength(2); // Exp + Edu
        expect(screen.getByText('Coding')).toBeInTheDocument();
    });
});
