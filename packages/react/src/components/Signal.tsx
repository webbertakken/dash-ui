export interface SignalProps {
  weak?: boolean;
}

export function Signal({ weak = false }: SignalProps) {
  return (
    <span className={`signal ${weak ? 'weak' : ''}`.trim()}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
