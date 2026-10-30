'use client';
export default function ConfirmButton({ children, message = 'Delete this?', className = 'btn alt sm' }) {
  return <button className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}
