import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Simulate network delay for UI feedback
        await new Promise(r => setTimeout(r, 600));

        const success = login(username, password);

        if (success) {
            navigate('/');
        } else {
            setError('Invalid username or password');
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--color-neutral-2)',
            fontFamily: 'var(--font-primary)'
        }}>
            <div style={{
                background: 'var(--color-neutral-1)',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--color-primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        color: 'white',
                        fontSize: '32px'
                    }}>
                        <i className="fa fa-lock"></i>
                    </div>
                    <h2 className="heading3" style={{ margin: 0 }}>Log in to your account</h2>
                    <p className="text-neutral-5" style={{ marginTop: '8px' }}>Enter your credentials to access the invoice builder</p>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="margin-bottom-m">
                        <label className="text-neutral-7 display-block margin-bottom-s">Username</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }}
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="margin-bottom-m">
                        <label className="text-neutral-7 display-block margin-bottom-s">Password</label>
                        <input
                            type="password"
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {isSubmitting ? (
                            <span><i className="fa fa-spinner fa-spin"></i> Authenticating...</span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-neutral-5)' }}>
                        Default credentials: admin / password123
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
