import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const NewClient = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const fileInputRef = useRef(null);

    const [logo, setLogo] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('-');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('+93');
    const [phone, setPhone] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [website, setWebsite] = useState('');
    const [currency, setCurrency] = useState('-');
    const [additionalInfo, setAdditionalInfo] = useState('');

    const handlePhoneChange = (e) => {
        // Remove non-numeric characters for strict number restriction
        const onlyNums = e.target.value.replace(/\D/g, '');
        setPhone(onlyNums);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!companyName.trim() || !email.trim()) {
            addToast('Please fill in the required fields (Company name, Email address).', 'error');
            return;
        }

        const newClient = {
            id: Date.now().toString(),
            logo,
            companyName,
            country,
            firstName,
            lastName,
            email,
            phoneCode,
            phone,
            address1,
            address2,
            postalCode,
            city,
            website,
            currency,
            additionalInfo,
            initials: companyName.substring(0, 2).toUpperCase(),
            bg: '#' + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0'), // Random profile background color
        };

        const existingClients = JSON.parse(localStorage.getItem('invoiceApp_clients') || '[]');
        existingClients.unshift(newClient); // Add to beginning
        localStorage.setItem('invoiceApp_clients', JSON.stringify(existingClients));

        navigate('/clients');
    };

    return (
        <>
            <div className="content-breadcrumbs ph"></div>
            <div className="content-top display-flex align-items-center"></div>

            <div className="content-middle">
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', backgroundColor: '#fff', borderRadius: 'var(--border-radius-soft)', boxShadow: 'var(--shadow-m)' }}>
                    <h1 className="heading2 margin-bottom-l">New client</h1>

                    <div style={{ marginBottom: '32px' }}>
                        <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Client Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleLogoUpload}
                        />
                        <div
                            style={{ border: '2px dashed var(--color-neutral-4)', borderRadius: 'var(--border-radius-soft)', padding: logo ? '10px' : '40px', textAlign: 'center', cursor: 'pointer', background: 'var(--color-neutral-1)' }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {logo ? (
                                <img src={logo} alt="Uploaded logo preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
                            ) : (
                                <>
                                    <i className="fa fa-picture-o fa-2x text-neutral-6 margin-bottom-s"></i>
                                    <div className="text-neutral-7">Choose logo or drop it here</div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Company name <span className="text-red">*</span></label>
                            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Country</label>
                            <select value={country} onChange={e => setCountry(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }}>
                                <option>-</option>
                                <option>United States</option>
                                <option>Pakistan</option>
                                <option>Germany</option>
                                <option>United Kingdom</option>
                                <option>Australia</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>First name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Last name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Email address <span className="text-red">*</span></label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Phone number</label>
                            <div style={{ display: 'flex' }}>
                                <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)} style={{ padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid var(--color-neutral-4)', borderRight: 'none', background: 'var(--color-neutral-1)', width: '80px' }}>
                                    <option>+93</option>
                                    <option>+1</option>
                                    <option>+92</option>
                                    <option>+49</option>
                                    <option>+44</option>
                                    <option>+61</option>
                                </select>
                                <input type="text" value={phone} onChange={handlePhoneChange} placeholder="70 123 4567" className="form-control" style={{ flex: 1, padding: '10px', borderRadius: '0 4px 4px 0', border: '1px solid var(--color-neutral-4)' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Address line 1</label>
                            <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Address line 2</label>
                            <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Postal code</label>
                            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>City</label>
                            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Web site</label>
                            <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Invoice currency</label>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)' }}>
                                <option>-</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label className="text-neutral-8 font-weight-bold" style={{ display: 'block', marginBottom: '8px' }}>Additional info</label>
                        <textarea value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-soft)', border: '1px solid var(--color-neutral-4)', minHeight: '100px' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button className="btn" onClick={() => navigate('/clients')}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            <i className="fa fa-floppy-o margin-right-s"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewClient;
