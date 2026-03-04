import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultRecentInvoices = [
    { id: 'XS3052', client: 'Bailey Baykrich', date: '27/01/2026', amount: 240.00, currency: '$' },
    { id: 'XS00291', client: 'Faizan Saleem', date: '24/04/2025', amount: 18000.00, currency: 'rs ' },
    { id: 'XS02669', client: 'Suraj Donga', date: '17/04/2025', amount: 250.00, currency: '£' },
    { id: 'XS04010', client: 'John Doe', date: '10/04/2025', amount: 1500.00, currency: '$' },
];

const defaultAllInvoices = [
    { id: 'XS3052', type: 'Invoice', client: 'Bailey Baykrich', issueDate: '27/01/2026', dueDate: '28/01/2026', total: 240.00, currency: '$' },
    { id: 'XS00291', type: 'Invoice', client: 'Faizan Saleem', issueDate: '24/04/2025', dueDate: '25/04/2025', total: 18000.00, currency: 'rs' },
    { id: 'XS02669', type: 'Invoice', client: 'Suraj Donga', issueDate: '17/04/2025', dueDate: '18/04/2025', total: 250.00, currency: '£' },
    { id: 'XS04010', type: 'Invoice', client: 'John Doe', issueDate: '10/04/2025', dueDate: '11/04/2025', total: 1500.00, currency: '$' },
    { id: 'XS04011', type: 'Invoice', client: 'Jane Smith', issueDate: '01/04/2025', dueDate: '05/04/2025', total: 3200.00, currency: '$' },
];

const Dashboard = () => {
    const navigate = useNavigate();

    // Initialize from LocalStorage or default map
    const [recentInvoices, setRecentInvoices] = useState(() => {
        const saved = localStorage.getItem('invoiceApp_recent');
        return saved ? JSON.parse(saved) : defaultRecentInvoices;
    });

    const [allInvoices, setAllInvoices] = useState(() => {
        const saved = localStorage.getItem('invoiceApp_all');
        return saved ? JSON.parse(saved) : defaultAllInvoices;
    });

    const [toast, setToast] = useState({ show: false, message: '' });
    const [highlightId, setHighlightId] = useState(null);

    // Save to local storage whenever invoices change
    useEffect(() => {
        localStorage.setItem('invoiceApp_recent', JSON.stringify(recentInvoices));
    }, [recentInvoices]);

    useEffect(() => {
        localStorage.setItem('invoiceApp_all', JSON.stringify(allInvoices));
    }, [allInvoices]);

    const showNotification = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleView = (id) => {
        navigate(`/invoice/new?id=${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete invoice ${id}?`)) {
            setAllInvoices(allInvoices.filter(inv => inv.id !== id));
            setRecentInvoices(recentInvoices.filter(inv => inv.id !== id));
            showNotification(`Invoice ${id} deleted.`);
        }
    };

    const handleDuplicate = (invoice) => {
        // Increment ID logically: XS8091 -> XS8092
        let newId = invoice.id + '-COPY';
        const match = invoice.id.match(/^([A-Za-z]+)(\d+)$/);

        if (match) {
            const prefix = match[1];
            const numStr = match[2];
            let nextNum = parseInt(numStr, 10) + 1;
            newId = `${prefix}${String(nextNum).padStart(numStr.length, '0')}`;

            // Ensure we don't duplicate an existing ID
            while (allInvoices.some(inv => inv.id === newId)) {
                nextNum++;
                newId = `${prefix}${String(nextNum).padStart(numStr.length, '0')}`;
            }
        }

        const duplicatedInv = { ...invoice, id: newId, issueDate: new Date().toLocaleDateString('en-GB') };

        // Put the new invoice at the very top
        setAllInvoices([duplicatedInv, ...allInvoices]);
        setRecentInvoices([
            { id: newId, client: invoice.client, date: duplicatedInv.issueDate, amount: invoice.total, currency: invoice.currency },
            ...recentInvoices.slice(0, 3)
        ]);

        showNotification(`Invoice duplicated successfully as ${newId}.`);

        // Highlight the new row
        setHighlightId(newId);
        setTimeout(() => setHighlightId(null), 2500);
    };

    return (
        <>
            {/* Custom Toast Notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: 'var(--border-radius-soft)',
                    boxShadow: 'var(--shadow-l)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.3s ease'
                }}>
                    <i className="fa fa-info-circle" style={{ fontSize: '20px' }}></i>
                    {toast.message}
                </div>
            )}

            <div className="content-breadcrumbs ph"></div>

            <div className="content-top display-flex align-items-center">
                <div className="content-top-title heading1 ph">
                </div>
                <div className="content-top-actions ph"></div>
            </div>

            <div className="content-middle">
                <div className="margin-bottom-base" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 id="Screen_Title" style={{ margin: 0 }}>
                        <span>Recent invoices</span>
                    </h1>
                    <button
                        className="btn btn-primary ThemeGrid_MarginGutter"
                        onClick={() => navigate('/invoice/new')}
                        type="button"
                        title="Create New Invoice"
                    >
                        <i className="icon fa fa-plus fa-1x"></i>
                        <span className="margin-left-s">New</span>
                    </button>
                </div>

                {/* Recent Invoices Cards */}
                <div id="RecentInvoicesDiv">
                    <div className="osui-gallery" style={{ '--gallery-desktop-items': 4, '--gallery-list-desktop-items': 4, '--gallery-tablet-items': 2, '--gallery-list-tablet-items': 2, '--gallery-phone-items': 1, '--gallery-list-phone-items': 1, '--gallery-gap': 'var(--space-base)' }}>
                        <div className="list list-group OSFillParent" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-base)', paddingBottom: '16px' }}>
                            {recentInvoices.map((inv, idx) => (
                                <div key={inv.id} style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: highlightId === inv.id ? 'scale(1.02)' : 'none' }} onClick={() => handleView(inv.id)}>
                                    <div className="card card-sectioned flex-direction-column" style={{ border: highlightId === inv.id ? '2px solid var(--color-primary)' : '1px solid transparent', height: '100%' }}>
                                        <div className="card-image ph"></div>
                                        <div className="card-sectioned-top flex-direction-column">
                                            <div className="ph card-title">
                                                <div className="vertical-align">
                                                    <img className="avatar avatar-medium border-radius-rounded" src="https://ui-avatars.com/api/?name=XS&background=4267B2&color=fff&font-size=0.5&bold=true" alt="XS Logo" title="XS Logo" />
                                                </div>
                                            </div>
                                            <div className="ph card-content">
                                                <div className="text-align-center">
                                                    <div>
                                                        <span className="font-size-base text-neutral-8">TOTAL</span>
                                                    </div>
                                                    <div className="heading3">
                                                        <span>{inv.currency}{parseFloat(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ph card-bottom">
                                                <div>
                                                    <div style={{ marginBottom: '4px' }}>
                                                        <span style={{ fontWeight: highlightId === inv.id ? 'bold' : 'normal', color: highlightId === inv.id ? 'var(--color-primary)' : 'inherit' }}>Invoice: {inv.id}</span>
                                                    </div>
                                                    <div className="margin-top-s">
                                                        <span>Issue Date: {inv.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* All Invoices Table Container */}
                <div className="margin-top-base margin-bottom-base display-flex align-items-center justify-content-space-between" style={{ marginTop: '32px' }}>
                    <h1 className="heading3">
                        <span>All invoices</span>
                    </h1>
                    <button className="btn ThemeGrid_MarginGutter" type="button">
                        <i className="icon fa fa-filter fa-1x" style={{ color: 'var(--color-primary)' }}></i>
                        <span className="margin-left-s" style={{ color: 'var(--color-primary)' }}>Show filters</span>
                    </button>
                </div>

                <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                    <table className="table">
                        <thead className="table-header">
                            <tr>
                                <th className="sortable">Invoice No# <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th className="sortable">Invoice Type <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th className="sortable">Client <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th className="sortable">Issue Date <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th className="sortable">Due Date <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th className="sortable">Total Value <i className="icon fa fa-long-arrow-down OSFillParent margin-left-s"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allInvoices.map((inv) => (
                                <tr key={inv.id} className="table-row" style={{ backgroundColor: highlightId === inv.id ? 'var(--color-primary-selected)' : 'transparent', transition: 'background-color 1s ease-out' }}>
                                    <td style={{ fontWeight: highlightId === inv.id ? 'bold' : 'normal' }}>{inv.id}</td>
                                    <td>{inv.type}</td>
                                    <td>{inv.client}</td>
                                    <td>{inv.issueDate}</td>
                                    <td>{inv.dueDate}</td>
                                    <td>{inv.currency} {parseFloat(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <i className="icon fa fa-file-text-o fa-lg" style={{ cursor: 'pointer', color: 'var(--color-primary)' }} title="View" onClick={() => handleView(inv.id)}></i>
                                            <i className="icon fa fa-trash-o fa-lg" style={{ cursor: 'pointer', color: 'var(--color-red)' }} title="Delete" onClick={() => handleDelete(inv.id)}></i>
                                            <i className="icon fa fa-clone fa-lg" style={{ cursor: 'pointer', color: 'var(--color-neutral-7)' }} title="Duplicate" onClick={() => handleDuplicate(inv)}></i>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {allInvoices.length === 0 && (
                                <tr className="table-row"><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No invoices found.</td></tr>
                            )}
                        </tbody>
                    </table>
                    <div className="display-flex align-items-center justify-content-space-between" style={{ padding: '16px' }}>
                        <div className="text-neutral-7">1 to {allInvoices.length} of {allInvoices.length} items</div>
                        <div className="pagination display-flex" style={{ gap: '8px' }}>
                            <button className="btn" style={{ padding: '0 8px', minWidth: '32px' }}>&lt;</button>
                            <button className="btn btn-primary" style={{ padding: '0 8px', minWidth: '32px' }}>1</button>
                            <button className="btn" style={{ padding: '0 8px', minWidth: '32px' }}>&gt;</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
