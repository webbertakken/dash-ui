import { useState, useCallback } from 'react';

export interface CarouselSlide {
  id: string;
  title: string;
  description?: string;
  color?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  label: string;
  className?: string;
}

export function Carousel({ slides, label, className }: CarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );

  return (
    <section
      className={`carousel${className ? ' ' + className : ''}`}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="carousel-track" aria-live="polite" aria-atomic="false">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={`carousel-slide${i === index ? ' is-active' : ''}`}
            aria-hidden={i !== index ? true : undefined}
          >
            {slide.color && (
              <div
                className="carousel-slide-accent"
                style={{ background: slide.color }}
                aria-hidden="true"
              />
            )}
            <div className="carousel-slide-body">
              <div className="carousel-slide-title">{slide.title}</div>
              {slide.description && (
                <div className="carousel-slide-desc">{slide.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-btn"
          aria-label="Previous slide"
          onClick={prev}
        >
          &#8249;
        </button>
        <div
          role="tablist"
          aria-label="Choose slide to display"
          className="carousel-indicators"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${slide.title}`}
              className={`carousel-dot${i === index ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="carousel-btn"
          aria-label="Next slide"
          onClick={next}
        >
          &#8250;
        </button>
      </div>
    </section>
  );
}
