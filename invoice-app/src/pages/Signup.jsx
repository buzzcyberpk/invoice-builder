import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        const { success, data, error: authError } = await signup(username, password);

        if (success) {
            // Supabase requires email confirmation by default. If we disabled it, they are logged in.
            // If email confirmation is enabled, we should show a message.
            if (data?.session) {
                navigate('/'); 
            } else {
                setSuccessMessage('Signup successful! Please check your email to confirm your account.');
                setIsSubmitting(false);
            }
        } else {
            setError(authError || 'An error occurred during signup');
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background-login)' }}>
            <div data-container="" className="login-screen" id="SignupDiv" style={{ width: '100%', maxWidth: '440px', background: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', position: 'relative' }}>
                <div data-block="CoreWidgets.WB_Login" className="OSBlockWidget" id="$b4">
                    <form data-form="" onSubmit={handleSubmit} className="login-form position-relative" id="b4-SignupForm">
                       
                        <div data-container="" className="login-logo" style={{ textAlign: 'center' }}>
                            <div data-container="" id="b4-DivImage" style={{ textAlign: 'center' }}>
                                <img data-image="" src="https://app.freeinvoicebuilder.com/InvoiceBuilder/img/InvoiceBuilder_CW.Invoice.png?INeLRY_F4sR+RpxpAEBbdQ" alt="Logo" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                            </div>
                            <h1 data-advancedhtml="" className="margin-top-base" style={{ marginTop: '16px', marginBottom: '32px' }}>
                                <span data-expression="" className="heading5 text-neutral-8" style={{ fontSize: '20px', color: '#4f575e', fontWeight: '400' }}>Create an Account</span>
                            </h1>
                        </div>

                        {error && (
                            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div style={{ padding: '12px', background: '#d1fae5', color: '#065f46', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                                {successMessage}
                            </div>
                        )}

                        <div data-container="" className="login-inputs margin-top-m">
                            <div data-container="">
                                <label data-label="" className="margin-bottom-s mandatory OSFillParent" htmlFor="b4-Input_UsernameVal" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#4f575e' }}>Email address</label>
                                <span className="input-text">
                                    <input
                                        data-input=""
                                        className="form-control OSFillParent"
                                        required=""
                                        type="email"
                                        aria-required="true"
                                        tabIndex="1"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        id="b4-Input_UsernameVal"
                                        style={{ width: '100%', padding: '14px', background: '#f6f5f9', border: '1px solid #ced4da', borderRadius: '4px' }}
                                    />
                                </span>
                            </div>

                            <div data-container="" className="margin-top-base" style={{ marginTop: '16px' }}>
                                <label data-label="" className="margin-bottom-s mandatory OSFillParent" htmlFor="b4-Input_PasswordVal" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#4f575e' }}>Password</label>
                                <div data-block="Interaction.InputWithIcon" className="OSBlockWidget" id="b4-$b1">
                                    <div data-container="" className="input-with-icon input-with-icon-right" id="b4-b1-InputWithIconWrapper" style={{ position: 'relative' }}>
                                        <div className="input-with-icon-input" id="b4-b1-Input">
                                            <span className="input-password">
                                                <input
                                                    data-input=""
                                                    className="form-control login-password OSFillParent"
                                                    required=""
                                                    type={showPassword ? "text" : "password"}
                                                    aria-required="true"
                                                    tabIndex="2"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    id="b4-Input_PasswordVal"
                                                    style={{ width: '100%', padding: '14px', paddingRight: '40px', background: '#f6f5f9', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div data-container="" className="margin-top-base" style={{ marginTop: '16px' }}>
                                <label data-label="" className="margin-bottom-s mandatory OSFillParent" htmlFor="b4-Input_ConfirmPasswordVal" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#4f575e' }}>Confirm Password</label>
                                <div data-block="Interaction.InputWithIcon" className="OSBlockWidget" id="b4-$b2">
                                    <div data-container="" className="input-with-icon input-with-icon-right" id="b4-b2-InputWithIconWrapper" style={{ position: 'relative' }}>
                                        <div className="input-with-icon-input" id="b4-b2-Input">
                                            <span className="input-password">
                                                <input
                                                    data-input=""
                                                    className="form-control login-password OSFillParent"
                                                    required=""
                                                    type={showPassword ? "text" : "password"}
                                                    aria-required="true"
                                                    tabIndex="3"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    id="b4-Input_ConfirmPasswordVal"
                                                    style={{ width: '100%', padding: '14px', paddingRight: '40px', background: '#f6f5f9', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', color: '#4263eb' }}
                                >
                                    {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                                </button>
                            </div>
                        </div>

                        <div data-container="" className="login-button margin-top-l" style={{ marginTop: '24px' }}>
                            <div data-block="Utilities.ButtonLoading" className="OSBlockWidget" id="b4-$b5">
                                <div className="osui-btn-loading OSInline full-width osui-btn-loading-show-spinner" id="b4-b5-Button" aria-busy="false" aria-live="polite" aria-atomic="true">
                                    <button data-button="" className="btn btn-primary OSFillParent" type="submit" style={{ width: '100%', height: '48px', background: '#4263eb', border: 'none', borderRadius: '4px' }}>
                                        {isSubmitting ? (
                                            <span><i className="fa fa-spinner fa-spin"></i></span>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div data-container="" className="margin-top-m text-align-center" style={{ marginTop: '24px', textAlign: 'center', color: '#272b30' }}>
                            <span className="font-semi-bold" style={{ fontWeight: 600 }}>Already have an account?</span>
                            <Link to="/login" data-link="" className="ThemeGrid_MarginGutter">
                                <span className="margin-left-s font-semi-bold" style={{ marginLeft: '8px', fontWeight: 600, color: '#4263eb' }}>Log in here</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
