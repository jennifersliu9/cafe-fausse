import { useEffect } from 'react'
import './Lightbox.css'

function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [image, onClose])

  if (!image) {
    return null
  }

  return (
    <div className="lightbox-overlay" onClick={onClose} role="presentation">
      <div
        className="lightbox-content"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={image.title}
      >
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <img
          src={image.url}
          alt={image.alt}
          className={image.objectFit === 'contain' ? 'lightbox-image--contain' : undefined}
        />
        <div className="lightbox-caption">
          <h3>{image.title}</h3>
          <p>{image.category}</p>
        </div>
      </div>
    </div>
  )
}

export default Lightbox
