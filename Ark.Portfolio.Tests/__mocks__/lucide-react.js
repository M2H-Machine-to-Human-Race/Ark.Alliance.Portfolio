/**
 * @fileoverview Lucide React Mock
 * Provides mock implementations for lucide-react icons used in tests.
 * 
 * @author Armand Richelet-Kleinberg
 */

const React = require('react');

// Create a mock icon component factory
const createMockIcon = (name) => {
    const MockIcon = (props) => React.createElement('span', {
        'data-testid': `icon-${name.toLowerCase()}`,
        ...props
    });
    MockIcon.displayName = name;
    return MockIcon;
};

module.exports = {
    Briefcase: createMockIcon('Briefcase'),
    GraduationCap: createMockIcon('GraduationCap'),
    Server: createMockIcon('Server'),
    Monitor: createMockIcon('Monitor'),
    Cloud: createMockIcon('Cloud'),
    Database: createMockIcon('Database'),
    Cpu: createMockIcon('Cpu'),
    Wrench: createMockIcon('Wrench'),
    AlertCircle: createMockIcon('AlertCircle'),
    RefreshCw: createMockIcon('RefreshCw'),
    Languages: createMockIcon('Languages'),
    Heart: createMockIcon('Heart'),
    Landmark: createMockIcon('Landmark'),
    Star: createMockIcon('Star'),
    Code: createMockIcon('Code'),
    TrendingUp: createMockIcon('TrendingUp'),
    Truck: createMockIcon('Truck'),
    ShoppingCart: createMockIcon('ShoppingCart'),
    Building2: createMockIcon('Building2'),
    Wallet: createMockIcon('Wallet'),
    Stethoscope: createMockIcon('Stethoscope'),
    Plane: createMockIcon('Plane'),
    Factory: createMockIcon('Factory'),
    Shield: createMockIcon('Shield'),
    Zap: createMockIcon('Zap'),
    Music: createMockIcon('Music'),
    Box: createMockIcon('Box'),
    Gamepad2: createMockIcon('Gamepad2'),
    Camera: createMockIcon('Camera'),
    Brain: createMockIcon('Brain'),
    Layers: createMockIcon('Layers'),
    GitBranch: createMockIcon('GitBranch'),
};
