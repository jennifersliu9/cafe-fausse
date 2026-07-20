import { aboutContent } from '../data/about'
import './About.css'

function About() {
  return (
    <div className="page about-page container">
      <header className="page-header">
        <p className="eyebrow">Our Story</p>
        <h1>About Us</h1>
        <p>{aboutContent.history}</p>
      </header>

      <section className="founders-grid">
        {aboutContent.founders.map((founder) => (
          <article key={founder.name} className="founder-card">
            <h2>{founder.name}</h2>
            <p className="founder-role">{founder.role}</p>
            <p>{founder.bio}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default About
