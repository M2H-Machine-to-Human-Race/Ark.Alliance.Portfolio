/**
 * @fileoverview Smoke Test
 * Basic sanity test to verify Jest and React Testing Library are working.
 * This test should always pass and serves as a baseline health check.
 * 
 * @author Armand Richelet-Kleinberg
 * @module Frontend/Pages
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Smoke Test', () => {
    it('renders basic JSX', () => {
        render(<div data-testid="smoke">Smoke</div>);
        expect(screen.getByTestId('smoke')).toBeInTheDocument();
    });
});
