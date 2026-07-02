interface Props {
  token: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function SignInButton({ token, onSignIn, onSignOut }: Props) {
  if (token) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-emerald-600 font-medium">✓ YouVersion connected</span>
        <button
          onClick={onSignOut}
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded px-2.5 py-1.5 transition-colors font-medium"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
      Sign in with YouVersion
      <span className="text-amber-500 font-normal">— unlocks NIV, AMP, NASB &amp; more</span>
    </button>
  );
}
