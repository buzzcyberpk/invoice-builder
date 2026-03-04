import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
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
            setError('Invalid email address or password');
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#384259', // Dark navy background
            fontFamily: 'Inter, -apple-system, sans-serif',
            padding: '24px'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#ffffff',
                padding: '40px 48px',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '435px',
                position: 'relative'
            }}>
                {/* Close Button X */}
                <div style={{ position: 'absolute', top: '24px', right: '24px', cursor: 'pointer' }}>
                    <i className="fa fa-times" style={{ fontSize: '20px', color: '#272b30', fontWeight: 'bold' }}></i>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
                    {/* Logo Substitute (Receipt Icon) */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#A4C6F4',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '52px',
                            background: '#F8F9FA',
                            borderRadius: '4px',
                            position: 'relative',
                            boxShadow: '-2px 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                position: 'absolute', top: '8px', left: '0', right: '0', textAlign: 'center', color: '#4f575e', fontSize: '20px', fontWeight: 'bold', lineHeight: '1'
                            }}>$</div>
                            <div style={{ background: '#FFC107', width: '8px', height: '4px', position: 'absolute', top: '32px', left: '6px' }}></div>
                            <div style={{ background: '#ced4da', width: '18px', height: '4px', position: 'absolute', top: '32px', left: '16px' }}></div>
                            <div style={{ background: '#FFC107', width: '8px', height: '4px', position: 'absolute', top: '40px', left: '6px' }}></div>
                            <div style={{ background: '#ced4da', width: '18px', height: '4px', position: 'absolute', top: '40px', left: '16px' }}></div>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '20px', fontWeight: '400', color: '#4f575e', margin: 0 }}>Free invoice builder login</h1>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderLeft: '4px solid #b91c1c', borderRadius: '4px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#4f575e' }}>
                        Email address <span style={{ color: '#dc2020' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            background: '#eff2f9', // Light grayish blue from screenshot
                            color: '#101213',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.border = '1px solid #1e79f2'}
                        onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#4f575e' }}>
                        Password <span style={{ color: '#dc2020' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingRight: '40px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                background: '#eff2f9',
                                color: '#101213',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.border = '1px solid #1e79f2'}
                            onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#adb5bd',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px', color: '#4f575e' }}>
                        <input type="checkbox" data-checkbox className="checkbox" style={{ marginRight: '8px' }} />
                        Remember me
                    </label>
                    <a href="#" style={{ color: '#4263eb', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#4263eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'wait' : 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.2s',
                        boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#3854c8'}
                    onMouseOut={(e) => e.target.style.background = '#4263eb'}
                >
                    {isSubmitting ? (
                        <span><i className="fa fa-spinner fa-spin"></i> Authenticating...</span>
                    ) : (
                        'Login'
                    )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#272b30', fontWeight: '600' }}>
                    Don't have an account? <a href="#" style={{ color: '#4263eb', marginLeft: '4px', textDecoration: 'none' }}>Sign up here</a>
                </div>

                <div style={{ margin: '24px auto', width: '70%', height: '1px', background: '#e9ecef' }}></div>

                <button
                    type="button"
                    onClick={() => {
                        // Demo behavior for guest
                        login('admin', 'password123');
                        navigate('/');
                    }}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#4263eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.2s',
                        boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#3854c8'}
                    onMouseOut={(e) => e.target.style.background = '#4263eb'}
                >
                    <i className="fa fa-file-text-o"></i> Continue as guest
                </button>
            </form>
        </div>
    );
};

export default Login;
