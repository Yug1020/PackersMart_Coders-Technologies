import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.API_BASE || 'http://localhost:3000'
const api = axios.create({ baseURL: API_BASE })

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  propertyType: '',
  pickUp: '',
  dropOff: '',
  movingDate: '',
  movingSize: '',
  additionalInformation: '',
}

const supportedCities = ['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad']
const propertyTypes = ['Domestic', 'Commercial']

const buildLeadPayload = (form) => ({
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  phone: Number(form.phone),
  email: form.email.trim().toLowerCase(),
  pickUp: form.pickUp,
  dropOff: form.dropOff,
  // Always serialize this field, even if a stale browser state has no value.
  // That lets the client show a clear validation message instead of submitting
  // an incomplete request that the Lead schema rejects.
  propertyType: String(form.propertyType ?? '').trim(),
  movingDate: form.movingDate,
  movingSize: form.movingSize,
  additionalInformation: form.additionalInformation.trim(),
})

function Icon({ name, size = 22, strokeWidth = 1.9 }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.8 20c.8-3.2 2.9-4.8 6.2-4.8s5.4 1.6 6.2 4.8" /></>,
    phone: <><rect x="7" y="2.8" width="10" height="18.4" rx="1.8" /><path d="M10 5.5h4M11 18.8h2" /></>,
    mail: <><rect x="3.2" y="5" width="17.6" height="14" rx="1.5" /><path d="m4 6 8 6 8-6" /></>,
    category: <><path d="m12 3 3.2 5.2H8.8L12 3ZM5 12h4v4H5zM15 12h4v4h-4z" /><path d="M12 12v4" /></>,
    origin: <><circle cx="12" cy="12" r="7.1" /><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" /></>,
    location: <><path d="M19 10.2c0 4.9-7 10-7 10s-7-5.1-7-10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M7.5 3v4M16.5 3v4M3.5 9h17" /></>,
    notes: <><path d="M5 6h14M5 12h14M5 18h9" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></>,
    bolt: <path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    timer: <><circle cx="12" cy="13" r="7" /><path d="M12 9v4l2.5 1.5M9 3h6" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    truck: <><path d="M3 6h10v10H3zM13 10h4l4 4v2h-8z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
    shield: <><path d="M12 3 19 6v5.2c0 4.4-2.9 7.7-7 9.8-4.1-2.1-7-5.4-7-9.8V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="1.5" /><path d="M9 4V2h6v2M8.5 9h7M8.5 13h7M8.5 17h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .2.1a1.8 1.8 0 0 1-1.8 3.1l-.2-.1a1.8 1.8 0 0 0-2.7 1.6v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-2.7-1.6l-.2.1a1.8 1.8 0 1 1-1.8-3.1l.2-.1a1.8 1.8 0 0 0 0-3.2l-.2-.1a1.8 1.8 0 1 1 1.8-3.1l.2.1a1.8 1.8 0 0 0 2.7-1.6v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 2.7 1.6l.2-.1a1.8 1.8 0 1 1 1.8 3.1l-.2.1a1.8 1.8 0 0 0 0 3.2Z" /></>,
  }

  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function BrandMark() {
  return <div className="brand-mark" aria-label="PackersMart Logistics logo"><Icon name="shield" size={20} /><span>LOGISTICS</span></div>
}

function Header() {
  return <header className="topbar">
    <div className="topbar-inner">
      <div className="brand-lockup"><BrandMark /><span>Customer Portal</span></div>
      <div className="profile-button"><Icon name="user" size={24} /></div>
    </div>
  </header>
}

function Stepper({ currentStep }) {
  const steps = ['Register', 'Verify', 'Matches']
  return <div className="stepper" aria-label={`Step ${currentStep} of 3`}>
    {steps.map((step, index) => {
      const number = index + 1
      const complete = number < currentStep
      const active = number === currentStep
      return <div className="step-group" key={step}>
        <div className={`step-badge ${complete ? 'complete' : active ? 'active' : ''}`}>
          {complete ? <Icon name="check" size={18} strokeWidth={2.5} /> : number}
        </div>
        <span className={`step-label ${active || complete ? 'current' : ''}`}>{step}</span>
        {number < steps.length && <div className="step-line" />}
      </div>
    })}
  </div>
}

function Field({ label, icon, children, className = '' }) {
  return <label className={`field ${className}`}>
    <span className="field-label">{label}</span>
    <span className="field-control"><span className="field-icon"><Icon name={icon} size={21} /></span>{children}</span>
  </label>
}

function RegisterForm({ form, setForm, onSubmit, loading, error }) {
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const today = new Date().toISOString().slice(0, 10)

  return <section className="register-card card-surface">
    <div className="card-decor decor-blue" />
    <div className="register-heading">
      <div className="feature-icon"><Icon name="truck" size={28} /></div>
      <div>
        <h1>Get Instant Relocation<br className="desktop-only" /> Quotes</h1>
        <p>Fill out your move details to get matched with<br className="desktop-only" /> verified logistics partners instantly.</p>
      </div>
    </div>
    <form onSubmit={onSubmit} className="register-form">
      <div className="form-grid">
        <Field label="First Name *" icon="user"><input value={form.firstName} onChange={update('firstName')} placeholder="John" minLength={3} maxLength={15} required /></Field>
        <Field label="Last Name *" icon="user"><input value={form.lastName} onChange={update('lastName')} placeholder="Doe" minLength={3} maxLength={15} required /></Field>
        <Field label="Mobile Number (10 digits) *" icon="phone"><input value={form.phone} onChange={update('phone')} placeholder="9876543210" type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" required /></Field>
        <Field label="Email Address *" icon="mail"><input value={form.email} onChange={update('email')} placeholder="john@example.com" type="email" required /></Field>
        <Field label="Property Type *" icon="category"><select id="propertyType" name="propertyType" value={form.propertyType} onChange={update('propertyType')} required><option value="" disabled>Select property type</option>{propertyTypes.map((propertyType) => <option value={propertyType} key={propertyType}>{propertyType}</option>)}</select><span className="select-arrow"><Icon name="chevron" size={18} /></span></Field>
        <Field label="Moving Size *" icon="category"><select value={form.movingSize} onChange={update('movingSize')} required><option value="" disabled>Select moving size</option><option value="Small">Small</option><option value="Medium">Medium</option><option value="Large">Large</option></select><span className="select-arrow"><Icon name="chevron" size={18} /></span></Field>
        <Field label="Pickup City *" icon="origin"><select value={form.pickUp} onChange={update('pickUp')} required><option value="" disabled>Select pickup city</option>{supportedCities.map((city) => <option value={city} key={city}>{city}</option>)}</select><span className="select-arrow"><Icon name="chevron" size={18} /></span></Field>
        <Field label="Destination City *" icon="location"><select value={form.dropOff} onChange={update('dropOff')} required><option value="" disabled>Select destination city</option>{supportedCities.map((city) => <option value={city} key={city}>{city}</option>)}</select><span className="select-arrow"><Icon name="chevron" size={18} /></span></Field>
        <Field label="Moving Date *" icon="calendar"><input value={form.movingDate} onChange={update('movingDate')} min={today} type="date" required /></Field>
        <Field label="Additional Information" icon="notes" className="requirements-field"><textarea value={form.additionalInformation} onChange={update('additionalInformation')} placeholder="Fragile items, elevator availability, etc." rows="1" /></Field>
      </div>
      {error && <div className="form-error register-form-error" role="alert">{error}</div>}
      <div className="form-actions"><button className="primary-button" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> Sending...</> : <>Send Verification OTP <Icon name="arrow" size={22} /></>}</button></div>
    </form>
  </section>
}

function OtpInput({ value, onChange, inputRef, onKeyDown }) {
  return <input ref={inputRef} className="otp-input" value={value} onChange={onChange} onKeyDown={onKeyDown} inputMode="numeric" maxLength={1} aria-label="OTP digit" />
}

function VerifyCard({ form, lead, onBack, onVerify, onResend, loading, success, error }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300)
  const refs = useRef([])
  const maskedPhone = useMemo(() => {
    const phone = form.phone || ''
    return phone.length >= 4 ? `+91 (${phone.slice(0, 3)}) ***-${phone.slice(-2)}` : '+91 (555) ***-**12'
  }, [form.phone])

  useEffect(() => {
    if (timeLeft <= 0) return undefined
    const timer = window.setInterval(() => setTimeLeft((time) => Math.max(0, time - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [timeLeft])

  useEffect(() => { refs.current[0]?.focus() }, [])

  const updateDigit = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) refs.current[index - 1]?.focus()
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 5) refs.current[index + 1]?.focus()
  }

  const submit = (event) => {
    event.preventDefault()
    onVerify(otp.join(''))
  }

  const fillDemoOtp = () => {
    const demoOtp = String(lead?.otp || '').padStart(6, '0').slice(0, 6)
    setOtp(demoOtp.split(''))
    refs.current[5]?.focus()
  }

  const resend = async () => {
    setOtp(['', '', '', '', '', ''])
    setTimeLeft(300)
    await onResend()
    refs.current[0]?.focus()
  }

  const time = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`

  return <section className="verify-card card-surface">
    <div className="card-decor decor-amber" />
    <div className="verify-icon"><Icon name="lock" size={38} /></div>
    <h1>Verify Your Mobile</h1>
    <p className="verify-copy">We've sent a 6-digit verification code to <strong>{maskedPhone}</strong></p>
    <div className="demo-banner">
      <Icon name="bolt" size={24} />
      <div><strong>TEST DEMO BANNER</strong><span>Generated OTP: <b>{lead?.otp || '------'}</b></span></div>
      <button type="button" onClick={fillDemoOtp}>Auto-Fill</button>
    </div>
    <form onSubmit={submit}>
      <div className="otp-row">{otp.map((digit, index) => <OtpInput key={index} value={digit} inputRef={(element) => { refs.current[index] = element }} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} />)}</div>
      <div className="otp-meta"><span><Icon name="timer" size={20} /> Expires in: <strong>{time}</strong></span><button type="button" onClick={resend} disabled={loading}>Resend Code</button></div>
      {error && <div className="form-error" role="alert">{error}</div>}
      {success && <div className="form-success" role="status"><Icon name="check" size={18} /> {success}</div>}
      <div className="verify-actions"><button type="button" className="secondary-button" onClick={onBack}>Back</button><button type="submit" className="primary-button" disabled={loading || timeLeft === 0 || otp.join('').length !== 6}>{loading ? <><span className="spinner" /> Verifying...</> : <>Verify &amp; Match</>}</button></div>
    </form>
  </section>
}

function BottomNav() {
  return <nav className="bottom-nav" aria-label="Primary navigation">
    <a href="#customer" className="nav-item active"><Icon name="truck" size={23} /><span>Customer</span></a>
    <a href="#admin" className="nav-item"><Icon name="shield" size={23} /><span>Admin</span></a>
    <a href="#bookings" className="nav-item"><Icon name="clipboard" size={23} /><span>Bookings</span></a>
    <a href="#settings" className="nav-item"><Icon name="settings" size={23} /><span>Settings</span></a>
  </nav>
}

function App() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getErrorMessage = (requestError, fallback) => requestError.response?.data?.message || requestError.message || fallback
  const isValidPropertyType = (propertyType) => propertyTypes.includes(propertyType)

  const handleRegistration = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const payload = buildLeadPayload(form)
    if (!isValidPropertyType(payload.propertyType)) {
      setError('Please select either Domestic or Commercial as the property type.')
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/lead/createlead', payload)
      setLead(response.data?.data || response.data)
      setStep(2)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to send the verification code. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (otp) => {
    setError('')
    setSuccess('')
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setLoading(true)
    try {
      const response = await api.post(`/lead/${lead.lead_id}/verify-otp`, { otp })
      setSuccess(response.data?.message || 'OTP verified successfully. Your lead is now matched.')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'The OTP could not be verified. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    const payload = buildLeadPayload(form)
    if (!isValidPropertyType(payload.propertyType)) {
      setError('Please go back and select a property type before requesting another OTP.')
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/lead/createlead', payload)
      setLead(response.data?.data || response.data)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to resend the verification code. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => { setError(''); setSuccess(''); setStep(1) }

  return <div className="app-shell min-h-screen" id="customer">
    <Header />
    <main className="page-content">
      <Stepper currentStep={step === 2 ? (success ? 3 : 2) : 1} />
      {step === 1 ? <RegisterForm form={form} setForm={setForm} onSubmit={handleRegistration} loading={loading} error={error} /> : <VerifyCard form={form} lead={lead} onBack={goBack} onVerify={handleVerify} onResend={handleResend} loading={loading} success={success} error={error} />}
    </main>
    <BottomNav />
  </div>
}

export default App
