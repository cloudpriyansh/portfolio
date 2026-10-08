// Sizes describe the entire four-frame strip, not a single visible frame.
const sizes = '(max-width: 380px) 1060px, (max-width: 760px) 1140px, 1380px';
const sources = (format: 'avif' | 'webp') =>
  [1200, 1380, 2016, 2172].map(width => `/hero/developer-${width}.${format} ${width}w`).join(', ');

export function HeroCharacter() {
  return <>
    <link rel="preload" as="image" type="image/avif" imageSrcSet={sources('avif')} imageSizes={sizes} fetchPriority="high"/>
    <div className="character-space">
      <picture>
        <source type="image/avif" srcSet={sources('avif')} sizes={sizes}/>
        <img className="character-sprite" src="/hero/developer-2172.webp" srcSet={sources('webp')} sizes={sizes}
          width={2172} height={724} alt="Animated developer character working on a laptop" fetchPriority="high" loading="eager" decoding="async"/>
      </picture>
    </div>
  </>;
}
