import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const invoiceIdParam = searchParams.get('id');

    const [items, setItems] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [invoiceNo, setInvoiceNo] = useState(`XS${Math.floor(1000 + Math.random() * 9000)}`);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const invoiceRef = useRef(null);

    const addItem = () => {
        setItems([
            ...items,
            { id: Date.now(), name: '', description: '', quantity: 1, price: 0, tax: 0 }
        ]);
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const calculateTax = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price * (item.tax / 100)), 0);
    };

    // Extra fields visibility state
    const [showCustomField, setShowCustomField] = useState(false);
    const [showCompanyInfo, setShowCompanyInfo] = useState(false);
    const [showClientInfo, setShowClientInfo] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const [recipient, setRecipient] = useState('');
    const [clientsList, setClientsList] = useState([]);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        // Load dynamic clients from storage, or fallback to empty
        const storedClients = JSON.parse(localStorage.getItem('invoiceApp_clients') || '[]');
        setClientsList(storedClients);

        // Load settings for logo and company info
        const storedSettings = JSON.parse(localStorage.getItem('invoiceApp_settings') || 'null');
        setSettings(storedSettings);
    }, []);

    useEffect(() => {
        if (invoiceIdParam) {
            const savedAll = JSON.parse(localStorage.getItem('invoiceApp_all') || '[]');
            const existingInv = savedAll.find(i => i.id === invoiceIdParam);
            if (existingInv) {
                setInvoiceNo(existingInv.id);
                // Convert dates back from DD/MM/YYYY if needed, or leave if standard
                if (existingInv.currency) {
                    if (existingInv.currency === '$') setCurrency('USD');
                    else if (existingInv.currency === '£') setCurrency('GBP');
                    else if (existingInv.currency === 'rs') setCurrency('PKR');
                    else setCurrency(existingInv.currency);
                }
                const clientObj = clientsList.find(c => c.name === existingInv.client);
                if (clientObj) setRecipient(clientObj.id.toString());
            }
        }
    }, [invoiceIdParam]);

    const handleSave = () => {
        const clientName = recipient ? clientsList.find(c => c.id.toString() === recipient)?.name : 'Unknown Client';
        let currSymbol = '$';
        if (currency === 'EUR') currSymbol = '€';
        if (currency === 'GBP') currSymbol = '£';
        if (currency === 'PKR') currSymbol = 'rs';

        const totalValue = calculateSubtotal() + calculateTax();

        const newInv = {
            id: invoiceNo,
            type: 'Invoice',
            client: clientName,
            issueDate: new Date(issueDate).toLocaleDateString('en-GB'),
            dueDate: new Date(dueDate).toLocaleDateString('en-GB'),
            total: totalValue,
            currency: currSymbol
        };

        const savedAll = JSON.parse(localStorage.getItem('invoiceApp_all') || '[]');
        const existingIdx = savedAll.findIndex(i => i.id === invoiceNo);
        if (existingIdx >= 0) {
            savedAll[existingIdx] = newInv;
        } else {
            savedAll.unshift(newInv);
        }
        localStorage.setItem('invoiceApp_all', JSON.stringify(savedAll));

        const savedRecent = JSON.parse(localStorage.getItem('invoiceApp_recent') || '[]');
        const recInv = { id: invoiceNo, client: clientName, date: newInv.issueDate, amount: totalValue, currency: currSymbol };
        const recIdx = savedRecent.findIndex(i => i.id === invoiceNo);
        if (recIdx >= 0) {
            savedRecent[recIdx] = recInv;
        } else {
            savedRecent.unshift(recInv);
        }
        localStorage.setItem('invoiceApp_recent', JSON.stringify(savedRecent.slice(0, 4)));

        alert('Invoice successfully saved to Dashboard!');
    };

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        if (!recipient) {
            alert('Please select a client from the "To" dropdown before downloading the PDF.');
            return;
        }

        try {
            // Create a hidden clone of the invoice to force standard desktop width regardless of user's screen
            // But first, replace the input fields with static spans in the clone to completely avoid html2canvas input clipping 
            const originalElement = invoiceRef.current;
            const clone = originalElement.cloneNode(true);

            // Swap inputs for static text in the clone so it captures perfectly
            const clonedInputs = clone.querySelectorAll('input, select, textarea');
            clonedInputs.forEach(input => {
                const span = document.createElement('span');
                span.textContent = input.value || input.options?.[input.selectedIndex]?.text || '';
                span.style.cssText = input.style.cssText;
                span.style.display = 'inline-block';
                span.style.border = 'none';
                span.style.background = 'transparent';
                span.style.padding = '0'; // Remove padding that causes vertical clipping
                span.style.margin = '0';

                // For the main ID, make sure line-height matches font size
                if (span.style.fontSize === '24px') {
                    span.style.lineHeight = '24px';
                    span.style.paddingBottom = '4px'; // Give it a bit of breathing room
                }

                input.parentNode.replaceChild(span, input);
            });

            // Force a standard desktop width on the clone
            const targetWidth = 1000;
            clone.style.width = `${targetWidth}px`;
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0px';
            // Add padding to the top of the clone to ensure nothing gets cut off
            clone.style.paddingTop = '20px';
            clone.classList.add('desktop-pdf-force');

            document.body.appendChild(clone);

            // Wait a tiny bit for any swapped images (like base64 logos) to settle
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: true, // Crucial for base64 uploaded logos
                windowWidth: targetWidth,
                width: targetWidth,
                scrollY: -window.scrollY // Prevent scroll position from offsetting the capture
            });

            // Cleanup the hidden clone
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ format: 'a4', unit: 'px' });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${invoiceNo}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Failed to generate PDF');
        }
    };

    const handleDelete = () => {
        if (window.confirm('Delete this invoice?')) {
            const savedAll = JSON.parse(localStorage.getItem('invoiceApp_all') || '[]');
            const savedRecent = JSON.parse(localStorage.getItem('invoiceApp_recent') || '[]');

            localStorage.setItem('invoiceApp_all', JSON.stringify(savedAll.filter(i => i.id !== invoiceNo)));
            localStorage.setItem('invoiceApp_recent', JSON.stringify(savedRecent.filter(i => i.id !== invoiceNo)));

            alert('Invoice deleted!');
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

            {/* Main Workspace */}
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                    <select className="form-control" style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid var(--color-neutral-5)' }}>
                        <option>Blank Template</option>
                        <option>Web Development Template</option>
                        <option>Developer Template</option>
                        <option>Marketing Template</option>
                    </select>
                </div>

                <div ref={invoiceRef} className="card" style={{ padding: '40px', backgroundColor: '#fff', boxShadow: 'var(--shadow-m)', borderRadius: '8px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div style={{ paddingRight: '20px' }}>
                            {settings?.logo ? (
                                <img src={settings.logo} alt="Company Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                            ) : (
                                <img src="https://ui-avatars.com/api/?name=XS&background=4267B2&color=fff&font-size=0.5&bold=true" alt="Default Logo" style={{ width: '80px', height: '80px', borderRadius: '8px' }} />
                            )}
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginBottom: '16px' }}>
                                <select style={{ padding: '8px', fontSize: '24px', fontWeight: 'bold', border: 'none', background: 'transparent', textAlign: 'right' }}>
                                    <option>Invoice</option>
                                </select>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>#</div>
                                <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} style={{ fontSize: '24px', fontWeight: 'bold', border: '1px dashed var(--color-neutral-5)', padding: '4px 8px', width: '150px', textAlign: 'right' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                                <span className="text-neutral-7">Issue date</span>
                                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={{ border: '1px dashed var(--color-neutral-5)', padding: '8px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                                <span className="text-neutral-7">Due date</span>
                                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ border: '1px dashed var(--color-neutral-5)', padding: '8px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
                        <div style={{ flex: 1 }}>
                            <h4 className="heading4 margin-bottom-s">From</h4>
                            <div style={{ border: '1px solid transparent', padding: '16px', background: 'var(--color-neutral-1)', borderRadius: '4px' }}>
                                <strong>XTREME IT SOLUTIONS(SMC-PRIVATE)LIMITED</strong><br />
                                Rawalpindi, Pakistan<br />
                                contact@freeinvoicebuilder.com<br />
                                03125438870
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 className="heading4 margin-bottom-s">To</h4>
                            {!recipient ? (
                                <div style={{ border: '1px dashed var(--color-neutral-5)', padding: '16px', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-neutral-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-user" style={{ color: 'var(--color-neutral-6)' }}></i>
                                        </div>
                                        <div>
                                            <div className="text-neutral-7">Recipient name</div>
                                            <div className="text-neutral-5" style={{ fontSize: '12px' }}>Recipient contact details</div>
                                        </div>
                                    </div>
                                    <select
                                        className="form-control"
                                        style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }}
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                    >
                                        <option value="">Select a client...</option>
                                        {clientsList.map(c => <option key={c.id} value={c.id}>{c.companyName || `${c.firstName} ${c.lastName}`}</option>)}
                                    </select>
                                </div>
                            ) : (
                                (() => {
                                    const selectedClient = clientsList.find(c => c.id.toString() === recipient);
                                    return (
                                        <div style={{ border: '1px solid transparent', padding: '16px', borderRadius: '4px', background: 'var(--color-neutral-1)', position: 'relative', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                            <i className="fa fa-times" style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', color: 'var(--color-neutral-6)', zIndex: 10 }} onClick={() => setRecipient('')}></i>
                                            {selectedClient?.logo && (
                                                <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                                    <img src={selectedClient.logo} alt="Client Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                                </div>
                                            )}
                                            <div style={{ paddingRight: '24px' }}>
                                                <strong>{selectedClient?.companyName || `${selectedClient?.firstName} ${selectedClient?.lastName}`}</strong><br />
                                                {selectedClient?.email && <>{selectedClient.email}<br /></>}
                                                {selectedClient?.phone && <>{selectedClient.phoneCode} {selectedClient.phone}<br /></>}
                                                {selectedClient?.country}
                                            </div>
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    </div>

                    {/* Optional Toggled Fields Area */}
                    {(showCompanyInfo || showClientInfo || showCustomField) && (
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap', padding: '16px', backgroundColor: 'var(--color-neutral-1)', borderRadius: '4px' }}>
                            {showCompanyInfo && (
                                <div style={{ flex: '1 1 30%' }}>
                                    <label className="text-neutral-7 margin-bottom-s display-block">Extra Company Info</label>
                                    <input type="text" className="form-control" placeholder="Company Registration No..." style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                                </div>
                            )}
                            {showClientInfo && (
                                <div style={{ flex: '1 1 30%' }}>
                                    <label className="text-neutral-7 margin-bottom-s display-block">Extra Client Details</label>
                                    <input type="text" className="form-control" placeholder="Client Reference..." style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                                </div>
                            )}
                            {showCustomField && (
                                <div style={{ flex: '1 1 30%' }}>
                                    <label className="text-neutral-7 margin-bottom-s display-block">Custom Field</label>
                                    <input type="text" className="form-control" placeholder="PO Number..." style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginBottom: '40px' }}>
                        {items.length > 0 && (
                            <table style={{ width: '100%', marginBottom: '16px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--color-neutral-2)' }}>
                                        <th style={{ textAlign: 'left', padding: '12px' }}>Item description</th>
                                        <th style={{ textAlign: 'right', padding: '12px', width: '80px' }}>Qty</th>
                                        <th style={{ textAlign: 'right', padding: '12px', width: '120px' }}>Unit price</th>
                                        <th style={{ textAlign: 'right', padding: '12px', width: '150px' }}>Tax</th>
                                        <th style={{ textAlign: 'right', padding: '12px', width: '120px' }}>Subtotal</th>
                                        <th data-html2canvas-ignore="true" style={{ width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <tr>
                                                <td style={{ padding: '8px 0' }}>
                                                    <input type="text" placeholder="Name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }} />
                                                </td>
                                                <td style={{ padding: '8px 0 8px 8px' }}>
                                                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', textAlign: 'right' }} />
                                                </td>
                                                <td style={{ padding: '8px 0 8px 8px' }}>
                                                    <input type="number" min="0" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', textAlign: 'right' }} />
                                                </td>
                                                <td style={{ padding: '8px 0 8px 8px' }}>
                                                    <select value={item.tax} onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px' }}>
                                                        <option value={0}>Non Taxable</option>
                                                        <option value={5}>Tax (5%)</option>
                                                        <option value={10}>Tax (10%)</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '8px 0 8px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                                                    {(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td data-html2canvas-ignore="true" style={{ padding: '8px 0 8px 8px', textAlign: 'center' }}>
                                                    <i className="fa fa-times" style={{ cursor: 'pointer', color: 'var(--color-neutral-6)' }} onClick={() => removeItem(item.id)}></i>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-neutral-3)' }}>
                                                    <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', background: 'var(--color-neutral-1)' }} />
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <button
                            data-html2canvas-ignore="true"
                            onClick={addItem}
                            style={{ width: '100%', padding: '16px', border: '2px dashed var(--color-neutral-5)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', textAlign: 'center' }}>
                            <i className="fa fa-plus margin-right-s"></i> Add new Invoice Item
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                        <div style={{ width: '350px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-neutral-3)' }}>
                                <span>Currency</span>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: 'bold' }}>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="PKR">PKR</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-neutral-3)' }}>
                                <span>Subtotal</span>
                                <strong>{calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-neutral-3)' }}>
                                <span>Tax</span>
                                <strong>{calculateTax().toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontSize: '20px' }}>
                                <strong>Total</strong>
                                <strong>{(calculateSubtotal() + calculateTax()).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                            </div>
                        </div>
                    </div>

                    {(showDescription || showPayment) && (
                        <div style={{ marginBottom: '40px', display: 'flex', gap: '24px' }}>
                            {showDescription && (
                                <div style={{ flex: 1 }}>
                                    <h4 className="heading4 margin-bottom-s">Invoice Description</h4>
                                    <textarea placeholder="General details about this invoice..." style={{ width: '100%', padding: '16px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }}></textarea>
                                </div>
                            )}
                            {showPayment && (
                                <div style={{ flex: 1 }}>
                                    <h4 className="heading4 margin-bottom-s">Payment details</h4>
                                    <textarea placeholder="Bank account, IBAN, SWIFT..." style={{ width: '100%', padding: '16px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }}></textarea>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <h4 className="heading4 margin-bottom-s">Invoice terms</h4>
                        <textarea placeholder="Terms and conditions" style={{ width: '100%', padding: '16px', border: '1px solid var(--color-neutral-4)', borderRadius: '4px', minHeight: '100px', resize: 'vertical' }}></textarea>
                    </div>

                </div>
            </div>

            {/* Right Action Sidebar */}
            <div data-html2canvas-ignore="true" style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Utilities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn" onClick={() => setShowCustomField(!showCustomField)} style={{ justifyContent: 'flex-start', width: '100%', background: showCustomField ? 'var(--color-primary-selected)' : 'transparent' }}>
                        <i className="fa fa-cube margin-right-s"></i> Add custom field
                    </button>
                    <button className="btn" onClick={() => setShowCompanyInfo(!showCompanyInfo)} style={{ justifyContent: 'flex-start', width: '100%', background: showCompanyInfo ? 'var(--color-primary-selected)' : 'transparent' }}>
                        <i className="fa fa-building margin-right-s"></i> Add company info
                    </button>
                    <button className="btn" onClick={() => setShowClientInfo(!showClientInfo)} style={{ justifyContent: 'flex-start', width: '100%', background: showClientInfo ? 'var(--color-primary-selected)' : 'transparent' }}>
                        <i className="fa fa-user margin-right-s"></i> Add client info
                    </button>
                    <button className="btn" onClick={() => setShowDescription(!showDescription)} style={{ justifyContent: 'flex-start', width: '100%', background: showDescription ? 'var(--color-primary-selected)' : 'transparent' }}>
                        <i className="fa fa-pencil margin-right-s"></i> Add description
                    </button>
                    <button className="btn" onClick={() => setShowPayment(!showPayment)} style={{ justifyContent: 'flex-start', width: '100%', background: showPayment ? 'var(--color-primary-selected)' : 'transparent' }}>
                        <i className="fa fa-dollar margin-right-s"></i> Add payment
                    </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ background: '#5fa1db', borderColor: '#5fa1db' }} onClick={handleDelete}>
                        <i className="fa fa-trash-o margin-right-s"></i> Delete invoice
                    </button>
                    <button className="btn btn-primary" style={{ background: '#1a79cb', borderColor: '#1a79cb' }} onClick={handleDownload}>
                        <i className="fa fa-file-pdf-o margin-right-s"></i> Download PDF
                    </button>
                    <button className="btn btn-primary" style={{ background: '#0e4370', borderColor: '#0e4370' }} onClick={handleSave}>
                        <i className="fa fa-floppy-o margin-right-s"></i> Save
                    </button>
                </div>

            </div>

        </div>
    );
};

export default InvoiceEditor;
