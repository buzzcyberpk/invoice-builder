import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockClients = [
    { id: '1', initials: 'FD', companyName: 'FMC Digital Inc', email: 'hello@fmcdigital.com', country: 'Germany', bg: '#4267B2' },
    { id: '2', initials: 'RP', companyName: 'REUNION PAPETERIE', email: 'contact@reunionpapeterie.com', country: 'Réunion', bg: '#37b24d' },
    { id: '3', initials: 'VM', companyName: 'Vita Milano', email: 'vita@milano.it', country: 'Italy', bg: '#f59f00' },
    { id: '4', initials: 'BP', companyName: 'BLACK PEARL', email: 'black@pearl.com', country: 'Réunion', bg: '#000000' },
    { id: '5', initials: 'PN', companyName: 'PROVENTA NL', email: 'proventa@nl.com', country: 'Netherlands', bg: '#d6336c' },
    { id: '6', initials: 'IT', firstName: 'Ivan', lastName: 'Tupa', companyName: 'Tupa Industries', email: 'ivan@tupa.com', country: 'Serbia', bg: '#0d8091' },
];

const Clients = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const storedClients = JSON.parse(localStorage.getItem('invoiceApp_clients') || 'null');
        if (storedClients && storedClients.length > 0) {
            setClients(storedClients);
        } else {
            localStorage.setItem('invoiceApp_clients', JSON.stringify(mockClients));
            setClients(mockClients);
        }
    }, []);

    const filteredClients = clients.filter(c =>
        (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    };

    return (
        <>
            <div className="content-breadcrumbs ph"></div>
            <div className="content-top display-flex align-items-center"></div>

            <div className="content-middle">
                <div className="margin-bottom-base display-flex justify-content-space-between align-items-center">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <h1 id="Screen_Title">
                            <span>Clients</span>
                        </h1>
                        <div style={{ position: 'relative' }}>
                            <i className="fa fa-search" style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-neutral-6)' }}></i>
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid var(--color-neutral-4)', minWidth: '220px' }}
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/clients/new')}
                        type="button"
                    >
                        <i className="icon fa fa-plus fa-1x"></i>
                        <span className="margin-left-s">Add Client</span>
                    </button>
                </div>

                {filteredClients.length === 0 ? (
                    <div className="text-center" style={{ padding: '64px', border: '1px dashed var(--color-neutral-5)', borderRadius: '8px', marginTop: '32px', textAlign: 'center' }}>
                        <div className="text-neutral-6 heading4">No clients match your search.</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                        {currentClients.map((client, idx) => (
                            <div key={client.id || idx} className="card" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow-xs)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: client.bg || '#4267B2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', overflow: 'hidden' }}>
                                        {client.logo ? (
                                            <img src={client.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            client.initials || (client.companyName ? client.companyName.substring(0, 2).toUpperCase() : 'NA')
                                        )}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h3 className="heading4" style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.companyName || `${client.firstName} ${client.lastName}`}</h3>
                                        {client.company && <div className="text-neutral-7" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.company}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span className="text-neutral-7" style={{ width: '120px', flexShrink: 0 }}>Email:</span>
                                        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.email || '-'}</strong>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <span className="text-neutral-7" style={{ width: '120px', flexShrink: 0 }}>Country:</span>
                                        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.country || '-'}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredClients.length > 0 && (
                    <div className="display-flex align-items-center justify-content-space-between" style={{ marginTop: '32px' }}>
                        <div className="text-neutral-7">{startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length} items</div>
                        <div className="pagination display-flex" style={{ gap: '8px' }}>
                            <button className="btn" onClick={handlePrev} disabled={currentPage === 1} style={{ padding: '0 8px', minWidth: '32px', opacity: currentPage === 1 ? 0.5 : 1 }}>&lt;</button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`btn ${currentPage === i + 1 ? 'btn-primary' : ''}`} onClick={() => setCurrentPage(i + 1)} style={{ padding: '0 8px', minWidth: '32px' }}>{i + 1}</button>
                            ))}

                            <button className="btn" onClick={handleNext} disabled={currentPage === totalPages} style={{ padding: '0 8px', minWidth: '32px', opacity: currentPage === totalPages ? 0.5 : 1 }}>&gt;</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Clients;
