export default function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className="wordmark" style={small ? { fontSize: 15 } : undefined}>
      <svg className="wordmark-moon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 14.5A8.5 8.5 0 1 1 9.5 5a7 7 0 0 0 9.5 9.5z" fill="none" stroke="#d9b96a" strokeWidth="1.4" />
      </svg>
      <span className="wordmark-text">つくよみタロット よみ</span>
    </span>
  );
}
