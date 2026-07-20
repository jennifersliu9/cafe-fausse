import { menuCategories } from '../data/menu'
import { publicImages } from '../data/images'
import './Menu.css'

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

function Menu() {
  return (
    <div className="page menu-page container">
      <header className="page-header menu-page-header">
        <p className="eyebrow">Seasonal Selections</p>
        <h1>Menu</h1>
        <p>Thoughtfully crafted dishes featuring French tradition and local ingredients.</p>
      </header>

      <div className="menu-hero">
        <img
          src={publicImages.ribeyeSteak}
          alt="Prime ribeye steak with garlic mashed potatoes"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="menu-grid">
        {menuCategories.map((category) => (
          <section key={category.name} className="menu-category">
            {category.image && (
              <div className="menu-category-image">
                <img
                  src={category.image}
                  alt={category.imageAlt ?? category.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <h2>{category.name}</h2>
            <ul>
              {category.items.map((item) => (
                <li key={item.name} className={`menu-item${item.image ? ' menu-item--with-image' : ''}`}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? item.name}
                      className="menu-item-image"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="menu-item-body">
                    <div className="menu-item-header">
                      <h3>{item.name}</h3>
                      <span>{formatPrice(item.price)}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Menu
