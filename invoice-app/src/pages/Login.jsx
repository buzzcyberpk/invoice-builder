import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('buzzpk@gmail.com');
    const [password, setPassword] = useState('u3J@zHL@PH4#dgA');
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background-login)' }}>
            <div data-container="" className="login-screen" id="LoginDiv" style={{ width: '100%', maxWidth: '440px', background: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', position: 'relative' }}>
                <div data-block="CoreWidgets.WB_Login" className="OSBlockWidget" id="$b4">
                    <form data-form="" onSubmit={handleSubmit} className="login-form position-relative" id="b4-LoginForm">
                        <div data-container="" className="absolute-top-right margin-top-base position-absolute margin-right-base" style={{ position: 'absolute', top: '24px', right: '24px', cursor: 'pointer' }}>
                            <i data-icon="" className="icon hand-onhover rotate-icon fa fa-times fa-2x" style={{ fontSize: '24px', color: '#272b30' }}></i>
                        </div>

                        <div data-container="" className="login-logo" style={{ textAlign: 'center' }}>
                            <div data-container="" id="b4-DivImage" style={{ textAlign: 'center' }}>
                                <img data-image="" src="/InvoiceBuilder/img/InvoiceBuilder_CW.Invoice.png?INeLRY_F4sR+RpxpAEBbdQ" alt="Free invoice builder login" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                            </div>
                            <h1 data-advancedhtml="" className="margin-top-base" style={{ marginTop: '16px', marginBottom: '32px' }}>
                                <span data-expression="" className="heading5 text-neutral-8" style={{ fontSize: '20px', color: '#4f575e', fontWeight: '400' }}>Free invoice builder login</span>
                            </h1>
                        </div>

                        {error && (
                            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                                {error}
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
                                        type="text"
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
                                        <div className="input-with-icon-content-icon center ph" id="b4-b1-Icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                            >
                                                <i data-icon="" className={`icon fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} fa-1x`} id="b4-EyeIcon" style={{ color: '#adb5bd' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div data-container="" className="margin-top-l" style={{ marginTop: '32px' }}>
                            <div data-block="Adaptive.Columns2" className="OSBlockWidget" id="b4-$b3">
                                <div data-container="" className="columns columns2 gutter-base tablet-break-none phone-break-none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="columns-item" id="b4-b3-Column1">
                                        <div data-block="Utilities.AlignCenter" className="OSBlockWidget" id="b4-$b4">
                                            <div className="vertical-align flex-direction-row" id="b4-b4-Content" style={{ display: 'flex', alignItems: 'center' }}>
                                                <span>
                                                    <input data-checkbox="" className="checkbox" type="checkbox" aria-label="Remember me the password" tabIndex="3" id="b4-Checkbox1" />
                                                </span>
                                                <label data-label="" className="font-size-s margin-left-s OSFillParent" htmlFor="b4-Checkbox1" style={{ marginLeft: '8px', cursor: 'pointer', color: '#6a7178' }}>
                                                    <span className="white-space-nowrap">Remember me</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns-item" id="b4-b3-Column2">
                                        <div data-container="" style={{ textAlign: 'right' }}>
                                            <a data-link="" href="#" aria-label="Forgot password? Click here to recover it">
                                                <span className="font-semi-bold" style={{ fontWeight: 600, color: '#4263eb' }}>Forgot password?</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div data-container="" className="login-button margin-top-l" style={{ marginTop: '24px' }}>
                            <div data-block="Utilities.ButtonLoading" className="OSBlockWidget" id="b4-$b5">
                                <div className="osui-btn-loading OSInline full-width osui-btn-loading-show-spinner" id="b4-b5-Button" aria-busy="false" aria-live="polite" aria-atomic="true">
                                    <button data-button="" className="btn btn-primary OSFillParent" type="submit" style={{ width: '100%', height: '48px', background: '#4263eb', border: 'none', borderRadius: '4px' }}>
                                        {isSubmitting ? (
                                            <span><i className="fa fa-spinner fa-spin"></i></span>
                                        ) : (
                                            'Login'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div data-container="" className="margin-top-m text-align-center" style={{ marginTop: '24px', textAlign: 'center', color: '#272b30' }}>
                            <span className="font-semi-bold" style={{ fontWeight: 600 }}>Don't have an account?</span>
                            <a data-link="" className="ThemeGrid_MarginGutter" href="#">
                                <span className="margin-left-s font-semi-bold" style={{ marginLeft: '8px', fontWeight: 600, color: '#4263eb' }}>Sign up here</span>
                            </a>
                        </div>

                        <div data-container="" className="text-align-center" style={{ textAlign: 'center', margin: '24px 0' }}>
                            <div data-container="" className="ThemeGrid_Width8" style={{ width: '66%', margin: '0 auto' }}>
                                <div data-block="Utilities.Separator" className="OSBlockWidget" id="b4-$b8">
                                    <div data-container="" className="padding-top-base padding-bottom-base">
                                        <div data-container="" className="separator separator-horizontal background-neutral-4" style={{ height: '1px', background: '#dee2e6' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div data-container="" className="margin-top-s">
                            <button
                                data-button=""
                                className="btn btn-primary full-width"
                                type="button"
                                onClick={() => {
                                    login('admin', 'password123');
                                    navigate('/');
                                }}
                                style={{ width: '100%', height: '48px', background: '#4263eb', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <i data-icon="" className="icon fa fa-file-text-o fa-1x"></i>
                                <span className="white-space-nowrap margin-left-s" style={{ marginLeft: '8px' }}>Continue as guest</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
