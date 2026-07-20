import { cn } from '@/lib/utils'
import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import { awards, galleryImages, reviews } from '../data/gallery'
import './Gallery.css'

function Gallery() {
  const [activeImage, setActiveImage] = useState(null)

  return (
    <div className="page gallery-page container">
      <header className="page-header">
        <p className="eyebrow">Ambiance & Accolades</p>
        <h1>Gallery</h1>
        <p>Explore the dining room, signature dishes, and moments behind the pass.</p>
      </header>

      <section className="gallery-grid" aria-label="Restaurant photo gallery">
        {galleryImages.slice(1).map((image) => (
          <button
            key={image.id}
            type="button"
            className={cn('gallery-card', image.objectFit === 'contain' && 'gallery-card--contain')}
            onClick={() => setActiveImage(image)}
          >
            <img
              src={image.thumbUrl ?? image.url}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              width={600}
              height={400}
              className={image.objectFit === 'contain' ? 'gallery-card-image--contain' : undefined}
            />
            <div className="gallery-card-overlay">
              <h3>{image.title}</h3>
              <p>{image.category}</p>
            </div>
          </button>
        ))}
      </section>

      <section className="awards-section">
        <div>
          <h2>Awards</h2>
          <ul>
            {awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Customer Reviews</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <blockquote key={review.source}>
                <p>“{review.quote}”</p>
                <cite>— {review.source}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <Lightbox image={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  )
}

export default Gallery
