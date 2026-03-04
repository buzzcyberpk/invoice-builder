import React, { useState, useEffect, useRef } from 'react';

const Settings = () => {
    const fileInputRef = useRef(null);
    // Basic form state
    const [formData, setFormData] = useState({
        type: 'Company',
        senderName: 'XTREME IT SOLUTIONS(SMC-PRIVATE)LIMITED',
        address1: 'CB 1002, Peoples Colony',
        address2: 'St no 26',
        postalCode: '46000',
        city: 'Rawalpindi',
        country: 'Pakistan',
        email: 'syedarsalantahir@gmail.com',
        phonePrefix: '+92',
        phone: '334 8647727',
        taxNumber: '8287012',
        website: '',
        currency: 'United States Dollar',
        dueDays: '5',
        bankDetails: '',
        logo: null
    });

    // Load from local storage optionally
    useEffect(() => {
        const saved = localStorage.getItem('invoiceApp_settings');
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        localStorage.setItem('invoiceApp_settings', JSON.stringify(formData));
        alert('Settings saved successfully!');
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div className="content-breadcrumbs ph"></div>

            <div className="content-top display-flex align-items-center">
                <div className="content-top-title heading1 ph" style={{ width: '100%' }}>
                    My settings
                </div>
            </div>

            <div className="content-middle">
                <div className="card" style={{ padding: '40px', backgroundColor: '#fff', boxShadow: 'var(--shadow-m)', borderRadius: '8px', maxWidth: '900px', margin: '0 auto' }}>

                    {/* Logo Section */}
                    <div style={{ marginBottom: '32px' }}>
                        <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Invoice logo</span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleLogoUpload}
                        />
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{ color: 'var(--color-primary)', fontSize: '12px', display: 'block', marginBottom: '8px', cursor: 'pointer', textDecoration: 'underline' }}>
                            Upload a logo to be shown on your invoices
                        </div>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{ width: '160px', height: '160px', border: '1px dashed var(--color-neutral-5)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', cursor: 'pointer' }}>
                            {formData.logo ? (
                                <img src={formData.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <img src="https://ui-avatars.com/api/?name=XS&background=4267B2&color=fff&font-size=0.5&bold=true" alt="Default Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        {/* Type Toggle */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>I am</span>
                            <div style={{ display: 'flex', border: '1px solid var(--color-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                                <button
                                    onClick={() => setFormData({ ...formData, type: 'Individual' })}
                                    style={{ flex: 1, padding: '12px', border: 'none', background: formData.type === 'Individual' ? 'var(--color-primary)' : 'transparent', color: formData.type === 'Individual' ? '#fff' : 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Individual
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, type: 'Company' })}
                                    style={{ flex: 1, padding: '12px', border: 'none', background: formData.type === 'Company' ? 'var(--color-primary)' : 'transparent', color: formData.type === 'Company' ? '#fff' : 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Company
                                </button>
                            </div>
                        </div>

                        {/* Sender Name */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Sender name <span style={{ color: 'red' }}>*</span></span>
                            <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Address 1 */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Address line 1</span>
                            <input type="text" name="address1" value={formData.address1} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Address 2 */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Address line 2</span>
                            <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Postal Code */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Postal code</span>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* City */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>City</span>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Country */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Country</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', padding: '12px' }}>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent' }} />
                                <i className="fa fa-times margin-right-s" style={{ color: 'var(--color-neutral-5)', cursor: 'pointer' }} onClick={() => setFormData({ ...formData, country: '' })}></i>
                                <i className="fa fa-chevron-down" style={{ color: 'var(--color-neutral-5)' }}></i>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Email</span>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Phone */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Phone number</span>
                            <div style={{ display: 'flex', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-neutral-2)', padding: '0 12px', borderRight: '1px solid var(--color-neutral-4)' }}>
                                    <div style={{ width: '20px', height: '14px', background: '#ccc', marginRight: '8px' }}></div>
                                    <span style={{ fontSize: '14px' }}>{formData.phonePrefix}</span>
                                    <i className="fa fa-caret-down margin-left-s" style={{ color: 'var(--color-neutral-6)' }}></i>
                                </div>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ border: 'none', padding: '12px', flex: 1, outline: 'none' }} />
                            </div>
                        </div>

                        {/* Tax Number */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Tax registration number</span>
                            <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Website */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Web Site</span>
                            <input type="text" name="website" value={formData.website} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Default Currency */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Default invoice currency</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', padding: '12px' }}>
                                <input type="text" name="currency" value={formData.currency} onChange={handleChange} style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent' }} />
                                <i className="fa fa-times margin-right-s" style={{ color: 'var(--color-neutral-5)', cursor: 'pointer' }} onClick={() => setFormData({ ...formData, currency: '' })}></i>
                                <i className="fa fa-chevron-down" style={{ color: 'var(--color-neutral-5)' }}></i>
                            </div>
                        </div>

                        {/* Invoice Due Days */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Invoice due days</span>
                            <input type="number" name="dueDays" value={formData.dueDays} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                        </div>

                        {/* Bank Details */}
                        <div>
                            <span className="text-neutral-7 margin-bottom-s display-block" style={{ fontSize: '14px' }}>Bank account details</span>
                            <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }}></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button className="btn" style={{ padding: '12px 24px', background: 'var(--color-neutral-1)', border: '1px solid var(--color-neutral-5)', borderRadius: '4px', color: 'var(--color-neutral-8)' }}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSave} style={{ padding: '12px 24px', borderRadius: '4px', background: 'var(--color-primary)', border: 'none', color: '#fff' }}>
                            <i className="fa fa-floppy-o margin-right-s"></i> Save
                        </button>
                        <button className="btn" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--color-primary)', borderRadius: '4px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-key margin-right-s"></i> Change password
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
