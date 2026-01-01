import React from 'react';
import { useLoginPageModel } from './LoginPage.model';
import './LoginPage.styles.css';

export const LoginPage: React.FC = () => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit
    } = useLoginPageModel();

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo and Application Name */}
                <div className="login-branding">
                    <img
                        src="/logo.png"
                        alt="Ark Alliance Logo"
                        className="login-logo"
                    />
                    <h1 className="login-app-name">Ark.Alliance.Portfolio</h1>
                </div>

                <div className="login-header">
                    <h2 className="login-title">Admin Portal</h2>
                    <p className="login-subtitle">Sign in to manage your portfolio</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="login-footer">
                    © {new Date().getFullYear()} Ark Alliance Ecosystem
                </p>
            </div>
        </div>
    );
};

