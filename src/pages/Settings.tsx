export default function Settings() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-cinzel font-bold mb-1 gold-text">Settings</h1>
        <p className="text-sm text-text-muted">Manage your choir preferences and system configuration</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="font-cinzel font-bold text-lg mb-4">Choir Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Choir Name</label>
              <input type="text" defaultValue="INHERITANCE CHOIR" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Contact Email</label>
              <input type="email" defaultValue="contact@inheritancechoir.rw" className="w-full p-2.5 bg-bg-input border border-border-default rounded-xl text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/20" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-subtle">
          <h2 className="font-cinzel font-bold text-lg mb-4">Firebase Configuration</h2>
          <p className="text-sm text-text-secondary mb-4">
            Firebase is currently configured via environment variables. To update these settings, please modify your <code className="bg-bg-input px-1.5 py-0.5 rounded text-gold">.env.local</code> file and restart the application.
          </p>
          <div className="bg-bg-elevated border border-border-default rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">Project ID</span>
              <span className="text-sm font-mono text-text-primary">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">Auth Domain</span>
              <span className="text-sm font-mono text-text-primary">{import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not configured'}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button className="gold-bg text-bg-base font-bold font-cinzel tracking-wide px-6 py-2.5 rounded-xl hover:brightness-110 transition-all">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
