import React, { useRef, useState, useEffect } from 'react';

const CONTACTS = [
  { icon: '✉', label: 'Email',    val: 'kalpesh.nagare.dev@gmail.com', hasArrow: true },
  { icon: '📞', label: 'Phone',    val: '+91 7083938175',               hasArrow: true },
  { icon: '📍', label: 'Location', val: 'Pune, India · Remote OK',      hasArrow: false },
  { icon: '🔗', label: 'LinkedIn', val: 'linkedin.com/in/kalpesh-nagare', hasArrow: true },
];

function TerminalOutput({ lines }) {
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <span className={`conn-${line.type}`}
                dangerouslySetInnerHTML={{ __html: line.text }} />
          <br />
        </React.Fragment>
      ))}
    </>
  );
}

export default function CoreSection() {
  const [lines, setLines]       = useState([
    { type: 'sys', text: '[SYS] Connection established to system core.' },
    { type: 'sys', text: '[SYS] Type your message below to initiate contact.' },
    { type: 'msg', text: 'Enter your name:' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [step, setStep]         = useState(0);
  const [uname, setUname]       = useState('');
  const [placeholder, setPlaceholder] = useState('Type name...');
  const outRef = useRef(null);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [lines]);

  function pushLine(type, text) {
    setLines((prev) => [...prev, { type, text }]);
  }

  function send() {
    const v = inputVal.trim();
    if (!v) return;
    pushLine('user', '&gt; ' + v);
    setInputVal('');

    if (step === 0) {
      setUname(v);
      setStep(1);
      setTimeout(() => {
        pushLine('sys', `[SYS] Hello, ${v}. Enter your message:`);
        setPlaceholder('Type message...');
      }, 400);
    } else if (step === 1) {
      setStep(2);
      setTimeout(() => {
        pushLine('sys', '[SYS] Transmitting to kalpesh.nagare.dev&#64;gmail.com...');
        setTimeout(() => {
          pushLine('sys', '[SYS] &#x2713; Signal delivered. Response within 24hrs.');
          setDisabled(true);
          setPlaceholder('Connection active...');
        }, 900);
      }, 500);
    }
  }

  return (
    <section id="core">
      <div className="sec-label rv">Section 07</div>
      <div className="sec-title rv d1">System Core</div>
      <div className="sec-sub rv d2">// Establishing connection to developer...</div>

      <div className="core-grid rv d3">
        {/* Contact info */}
        <div className="contact-list">
          {CONTACTS.map((c) => (
            <div key={c.label} className="contact-row">
              <div className="contact-icon">{c.icon}</div>
              <div className="contact-info">
                <div className="contact-lbl">{c.label}</div>
                <div className="contact-val">{c.val}</div>
              </div>
              {c.hasArrow && <span className="contact-arr">→</span>}
            </div>
          ))}
        </div>

        {/* Connection terminal */}
        <div className="conn-terminal">
          <div className="conn-bar">
            <div className="h-dots">
              <div className="h-dot" /><div className="h-dot" /><div className="h-dot" />
            </div>
            <div className="conn-title">terminal@kalpesh ~ connect</div>
          </div>
          <div className="conn-out" id="connOut" ref={outRef}>
            <TerminalOutput lines={lines} />
          </div>
          <div className="conn-input-row">
            <span className="conn-prompt">&gt;</span>
            <input
              className="conn-input"
              id="connInput"
              value={inputVal}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button className="conn-send" id="connSend" onClick={send}>➤</button>
          </div>
        </div>
      </div>
    </section>
  );
}
