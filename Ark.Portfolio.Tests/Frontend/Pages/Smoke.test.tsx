import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Smoke Test', () => {
    it('renders basic JSX', () => {
        render(<div data-testid="smoke">Smoke</div>);
        expect(screen.getByTestId('smoke')).toBeInTheDocument();
    });
});
