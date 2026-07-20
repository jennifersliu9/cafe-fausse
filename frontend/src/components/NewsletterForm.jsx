import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { subscribeNewsletter } from '../api/client'
import './NewsletterForm.css'

function NewsletterForm({ compact = false, centered = false }) {  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setLoading(true)

    try {
      const result = await subscribeNewsletter({ email })
      setStatus({ type: 'success', message: result.message })
      setEmail('')
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className={`newsletter-form ${compact ? 'compact' : ''} ${centered ? 'centered' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      {compact ? (
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      ) : (
        <Button type="submit" variant="outline" size="lg" disabled={loading} className="w-full">
          {loading ? 'Subscribing…' : 'Subscribe'}
        </Button>
      )}      {status.message && (
        <p className={`form-message ${status.type}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  )
}

export default NewsletterForm
