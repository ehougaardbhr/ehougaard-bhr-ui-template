interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 96,
};

const radiusMap = {
  small: 'var(--radius-xx-small)',
  medium: 'var(--radius-x-small)',
  large: 'var(--radius-medium)',
};

export function Avatar({ src, alt = '', size = 'medium', className = '' }: AvatarProps) {
  const pixelSize = sizeMap[size];
  const radius = radiusMap[size];

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: radius,
        boxShadow: 'var(--shadow-300)',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ borderRadius: radius }}
      />
    </div>
  );
}

export default Avatar;
