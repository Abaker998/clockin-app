import React, { useState } from 'react';

export const ClockInCard = () => {
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [screen, setScreen] = useState('menu');
    const [clockInTime, setClockInTime] = useState('');
    const [clockOutTime, setClockOutTime] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [history, setHistory] = useState<{ clock_in: string; clock_out: string | null }[]>([]);

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: password })
        });

        if (response.ok) {
            const data = await response.json();
            setUserName(data.name);
            setUserId(data.userId);
            setLoggedIn(true);
        } else {
            alert('Invalid PIN');
            setPassword('');
        }
    };

    const handleClockIn = async () => {
        const response = await fetch('http://localhost:3001/api/clock-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            const data = await response.json();
            setClockInTime(data.clockIn);
            setScreen('clockin');
        } else {
            const err = await response.json();
            alert(err.error);
        }
    };

    const handleClockOut = async () => {
        const response = await fetch('http://localhost:3001/api/clock-out', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            const data = await response.json();
            setClockOutTime(data.clockOut);
            setScreen('clockout');
        } else {
            const err = await response.json();
            alert(err.error);
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setPassword('');
        setUserName('');
        setUserId(null);
        setClockInTime('');
        setClockOutTime('');
        setScreen('menu');
    };

    const colors = {
        card: '#ffffff',
        primary: '#4a6cf7',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        gray: '#6b7280',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        bg: '#f0f2f5',
    };

    const buttonBase = {
        padding: '14px 28px',
        margin: '6px',
        fontSize: '16px',
        fontWeight: '600' as const,
        borderRadius: '12px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        maxWidth: '280px',
    };

    const greenButton = { ...buttonBase, backgroundColor: colors.success };
    const blueButton = { ...buttonBase, backgroundColor: colors.primary };
    const redButton = { ...buttonBase, backgroundColor: colors.danger };
    const grayButton = { ...buttonBase, backgroundColor: colors.gray };
    const orangeButton = { ...buttonBase, backgroundColor: colors.warning };

    const numButton = {
        width: '70px',
        height: '70px',
        margin: '5px',
        fontSize: '24px',
        fontWeight: '600' as const,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#e5e7eb',
        color: colors.text,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '700px',
        minHeight: '500px',
        padding: '40px',
        backgroundColor: colors.card,
        borderRadius: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        textAlign: 'center' as const,
    };

    const pageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '20px',
    };

    const headingStyle = {
        fontSize: '28px',
        fontWeight: '700' as const,
        color: colors.text,
        marginBottom: '30px',
    };

    const subText = {
        fontSize: '15px',
        color: colors.textLight,
        margin: '4px 0',
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                {loggedIn ? (
                    <div>
                        {screen === 'menu' ? (
                            <div>
                                <p style={{ fontSize: '14px', color: colors.textLight, marginBottom: '4px' }}>Welcome back</p>
                                <h1 style={{ ...headingStyle, marginBottom: '40px' }}>{userName}</h1>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <button style={greenButton} onClick={handleClockIn}>🕐 Clock In</button>
                                    <button style={blueButton} onClick={handleClockOut}>🕑 Clock Out</button>
                                    <button style={orangeButton} onClick={async () => {
                                        const response = await fetch(`http://localhost:3001/api/history/${userId}`);
                                        if (response.ok) {
                                            const data = await response.json();
                                            setHistory(data.records);
                                        }
                                        setScreen('history');
                                    }}>📋 History</button>
                                    <div style={{ marginTop: '12px' }}>
                                        <button style={{ ...redButton, backgroundColor: 'transparent', color: colors.danger, border: `2px solid ${colors.danger}` }} onClick={handleLogout}>Exit</button>
                                    </div>
                                </div>
                            </div>

                        ) : screen === 'clockin' ? (
                            <div>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <h1 style={headingStyle}>You're Clocked In</h1>
                                <div style={{ backgroundColor: colors.bg, padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                    <p style={subText}>Started at</p>
                                    <p style={{ fontSize: '20px', fontWeight: '600', color: colors.text }}>{clockInTime}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <button style={blueButton} onClick={handleClockOut}>🕑 Clock Out</button>
                                    <button style={grayButton} onClick={() => setScreen('menu')}>Back to Menu</button>
                                </div>
                            </div>

                        ) : screen === 'clockout' ? (
                            <div>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                                <h1 style={headingStyle}>You're Clocked Out</h1>
                                <div style={{ backgroundColor: colors.bg, padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={subText}>In:</span>
                                        <span style={{ fontWeight: '600', color: colors.text }}>{clockInTime || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={subText}>Out:</span>
                                        <span style={{ fontWeight: '600', color: colors.text }}>{clockOutTime}</span>
                                    </div>
                                </div>
                                <button style={grayButton} onClick={() => setScreen('menu')}>Back to Menu</button>
                            </div>

                        ) : screen === 'history' ? (
                            <div>
                                <h1 style={headingStyle}>History</h1>
                                {history.length === 0 ? (
                                    <p style={subText}>No records yet</p>
                                ) : (
                                    <div>
                                        {history.map((record: { clock_in: string; clock_out: string | null }, index: number) => (
                                            <div key={index} style={{
                                                backgroundColor: '#ffffff',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                marginBottom: '10px',
                                                textAlign: 'left',
                                                border: `1px solid ${colors.border}`,
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={subText}>In:</span>
                                                    <span style={{ fontSize: '14px', color: colors.text }}>{record.clock_in}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={subText}>Out:</span>
                                                    <span style={{ fontSize: '14px', color: colors.text }}>{record.clock_out || 'Still clocked in'}</span>
                                                </div>
                                                <p style={{ textAlign: 'right', fontWeight: '700', color: colors.primary, margin: '4px 0 0 0', fontSize: '15px' }}>
                                                    {record.clock_out
                                                        ? ((new Date(record.clock_out).getTime() - new Date(record.clock_in).getTime()) / 3600000).toFixed(2) + ' hrs'
                                                        : 'In progress'}
                                                </p>
                                            </div>
                                        ))}
                                        <div style={{
                                            marginTop: '16px',
                                            padding: '14px 18px',
                                            backgroundColor: colors.primary,
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '18px',
                                        }}>
                                            Total: {history.reduce((total: number, record: { clock_in: string; clock_out: string | null }) => {
                                                if (record.clock_out) {
                                                    return total + (new Date(record.clock_out).getTime() - new Date(record.clock_in).getTime()) / 3600000;
                                                }
                                                return total;
                                            }, 0).toFixed(2)} hours
                                        </div>
                                    </div>
                                )}
                                <div style={{ marginTop: '16px' }}>
                                    <button style={grayButton} onClick={() => setScreen('menu')}>Back to Menu</button>
                                </div>
                            </div>

                        ) : (
                            <div>
                                <h1 style={headingStyle}>{screen}</h1>
                            </div>
                        )}
                    </div>

                ) : (
                    <div>
                        <h1 style={headingStyle}>Enter Your PIN</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '220px',
                                    padding: '16px',
                                    fontSize: '36px',
                                    borderRadius: '16px',
                                    border: `2px solid ${colors.border}`,
                                    textAlign: 'center',
                                    letterSpacing: '16px',
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                                <button key={num} style={numButton} onClick={() => setPassword(password + num.toString())}>{num}</button>
                            ))}
                            <button style={{ ...numButton, backgroundColor: colors.danger, color: 'white' }} onClick={() => setPassword('')}>✕</button>
                            <button style={numButton} onClick={() => setPassword(password + '0')}>0</button>
                            <button style={{ ...numButton, backgroundColor: colors.success, color: 'white' }} onClick={handleLogin}>✓</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};