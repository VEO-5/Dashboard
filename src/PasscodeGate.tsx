import React, { useState, useEffect, useRef } from "react";

const PASSCODE = "claude";

// Using exact LIGHT theme tokens from Dashboard for 1:1 consistency
const THEME = {
    bg: "#ECEEF0",        // Light grey background
    card: "#FFFFFF",      // Pure white card
    cardBorder: "#EEEDEA",
    input: "#FFFFFF",
    inputBorder: "#DEDBD5",
    text: "#1A1A1A",      // Dark text
    text2: "#5A5A5A",
    text4: "#A0A0A0",
    green: "#4A7C59",     // Forest green from LIGHT theme
    addBtn: "#4A7C59",
    addBtnText: "#FFFFFF",
};

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("subbie_unlocked") === "true");
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!unlocked && inputRef.current) {
            inputRef.current.focus();
        }
    }, [unlocked]);

    if (unlocked) return <>{children}</>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.toLowerCase() === PASSCODE) {
            setError(false);
            setFadeOut(true);
            setTimeout(() => {
                sessionStorage.setItem("subbie_unlocked", "true");
                setUnlocked(true);
            }, 500);
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setTimeout(() => setError(false), 2000);
            setValue("");
            if (inputRef.current) inputRef.current.focus();
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; height: 100vh; overflow: hidden; }

        @keyframes gateFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gateCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gateShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes gateFadeOut {
          from { opacity: 1; transform: scale(1); filter: blur(0); }
          to { opacity: 0; transform: scale(1.02); filter: blur(8px); }
        }
        
        .gate-card {
          background: ${THEME.card};
          border: 1px solid ${THEME.cardBorder};
          border-radius: 28px;
          padding: 48px 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: gateCardIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
        }

        .gate-input-group {
          position: relative;
          width: 100%;
          margin-bottom: 24px;
        }

        .gate-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 14px;
          border: 1px solid ${THEME.inputBorder};
          background: ${THEME.input};
          color: ${THEME.text};
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gate-input:focus {
          border-color: ${THEME.green};
          box-shadow: 0 0 0 4px rgba(74, 124, 89, 0.08);
        }

        .gate-input.error {
          border-color: #C75050;
        }

        .gate-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: ${THEME.text4};
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .gate-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: ${THEME.addBtn};
          color: ${THEME.addBtnText};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(74, 124, 89, 0.2);
        }

        .gate-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(74, 124, 89, 0.25);
        }

        .gate-btn:active {
          transform: translateY(0);
        }
      `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: THEME.bg,
                zIndex: 99999,
                animation: fadeOut ? "gateFadeOut .5s ease forwards" : "gateFadeIn .8s ease",
            }}>
                {/* Subtle grid pattern background */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `radial-gradient(${THEME.inputBorder} 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                    opacity: 0.3,
                    pointerEvents: "none"
                }} />

                <div className="gate-card" style={{ animation: shake ? "gateShake 0.4s ease" : undefined }}>
                    {/* Logo Icon - Matching Dashboard Theme */}
                    <div style={{ marginBottom: 32 }}>
                        <svg width="60" height="60" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="10" fill={THEME.green} fillOpacity="0.1" />
                            <path
                                d="M10 18C10 16.8954 10.8954 16 12 16H20C21.1046 16 22 16.8954 22 18V20C22 21.1046 21.1046 22 20 22H12C10.8954 22 10 21.1046 10 20V18Z"
                                fill={THEME.green}
                                fillOpacity="0.8"
                            />
                            <path
                                d="M10 12C10 10.8954 10.8954 10 12 10H20C21.1046 10 22 10.8954 22 12V14C22 15.1046 21.1046 16 20 16H12C10.8954 16 10 15.1046 10 14V12Z"
                                fill={THEME.green}
                                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.06))" }}
                            />
                        </svg>
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 36 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: THEME.text, letterSpacing: "-0.6px", marginBottom: 8 }}>
                            Developer Access
                        </h1>
                        <p style={{ fontSize: 13.5, color: THEME.text4, lineHeight: 1.5 }}>
                            Please enter the access code to preview the dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div className="gate-input-group">
                            <input
                                ref={inputRef}
                                type="password"
                                className={`gate-input ${error ? 'error' : ''}`}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Access Code"
                                autoComplete="off"
                            />
                            <div className="gate-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                        </div>

                        <div style={{ height: 20, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {error && (
                                <span style={{ fontSize: 12.5, color: "#C75050", fontWeight: 600 }}>
                                    Incorrect access code
                                </span>
                            )}
                        </div>

                        <button type="submit" className="gate-btn">
                            Unlock Dashboard
                        </button>
                    </form>

                    <div style={{ marginTop: 32, fontSize: 11, fontWeight: 500, color: THEME.text4, textAlign: "center", letterSpacing: "0.2px" }}>
                        🔒 DEVELOPMENT PREVIEW ON
                    </div>
                </div>
            </div>
        </>
    );
}
