import { Avatar, type AvatarProps } from './Avatar.js';

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
  ariaLabel?: string;
}

export function AvatarGroup({ avatars, max = 5, size = 'md', ariaLabel = 'Avatar group' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  return (
    <span className="avatar-group" role="list" aria-label={ariaLabel}>
      {visible.map((av, i) => (
        <span key={i} role="listitem" className="avatar-group-item">
          <Avatar {...av} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          role="listitem"
          className={`avatar avatar-${size} avatar-overflow`}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
