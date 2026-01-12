import './App.css';

function App() {
  return (
    <div className="bg-base min-h-screen p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div>
          <h1 className="h1 text-primary mb-2">VU Design System</h1>
          <p className="body-lg-regular text-secondary">
            Your Figma tokens and typography are ready!
          </p>
        </div>

        {/* Typography - Headings */}
        <section className="card space-y-6">
          <h2 className="headline">Typography - Headings</h2>
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-16">H1</span>
              <span className="h1">The quick brown fox</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-16">H2</span>
              <span className="h2">The quick brown fox</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-16">H3</span>
              <span className="h3">The quick brown fox</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-16">H4</span>
              <span className="h4">The quick brown fox</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-16">H5</span>
              <span className="h5">The quick brown fox</span>
            </div>
          </div>
        </section>

        {/* Typography - Body */}
        <section className="card space-y-6">
          <h2 className="headline">Typography - Body & Text</h2>
          <div className="space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Headline</span>
              <span className="headline">Interview Dashboard</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Body Large</span>
              <span className="body-lg-regular">Practice interviews with AI coaching</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Body</span>
              <span className="body-regular">Your next interview is scheduled for tomorrow</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Footnote</span>
              <span className="footnote-regular">Last updated 5 minutes ago</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Caption</span>
              <span className="caption-regular">AI-powered feedback</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Small</span>
              <span className="small-regular">Terms and conditions apply</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="small-medium text-subtle w-28">Overline</span>
              <span className="overline">New Feature</span>
            </div>
          </div>
        </section>

        {/* Typography - Mono */}
        <section className="card space-y-6">
          <h2 className="headline">Typography - Monospace</h2>
          <div className="space-y-3">
            <p className="body-mono">const score = calculatePerformance();</p>
            <p className="footnote-mono">interview_id: 8f14e45f-ceea-367a</p>
            <p className="caption-mono">00:45:32</p>
          </div>
        </section>

        {/* Numbers */}
        <section className="card space-y-6">
          <h2 className="headline">Typography - Numbers</h2>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="number-lg text-accent">98%</p>
              <p className="caption-regular text-secondary">Score</p>
            </div>
            <div className="text-center">
              <p className="number-md">24</p>
              <p className="caption-regular text-secondary">Interviews</p>
            </div>
            <div className="text-center">
              <p className="number-sm-mono">03:45:12</p>
              <p className="caption-regular text-secondary">Duration</p>
            </div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="card space-y-4">
          <h2 className="headline">Brand Colors</h2>
          <div className="flex gap-2">
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-100)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-200)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-300)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-400)' }} />
            <div
              className="h-12 w-12 rounded-lg"
              style={{ backgroundColor: 'var(--brand-default)' }}
            />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-600)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-700)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-800)' }} />
            <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: 'var(--brand-900)' }} />
          </div>
          <p className="caption-regular text-subtle">Primary: #ff5d31 (Darkred)</p>
        </section>

        {/* Buttons */}
        <section className="card space-y-4">
          <h2 className="headline">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-ghost">Ghost Button</button>
            <button className="btn btn-primary" disabled>
              Disabled
            </button>
          </div>
        </section>

        {/* Inputs */}
        <section className="card space-y-4">
          <h2 className="headline">Inputs</h2>
          <div className="max-w-md space-y-3">
            <div>
              <label className="label-sm text-secondary mb-1 block">Email Address</label>
              <input className="input" placeholder="Enter your email..." />
            </div>
            <div>
              <label className="label-sm text-secondary mb-1 block">Disabled</label>
              <input className="input" placeholder="Disabled input" disabled />
            </div>
          </div>
        </section>

        {/* Text Colors */}
        <section className="card space-y-4">
          <h2 className="headline">Text Colors</h2>
          <div className="space-y-2">
            <p className="body-medium text-primary">Primary Text (90% white)</p>
            <p className="body-medium text-secondary">Secondary Text (70% white)</p>
            <p className="body-medium text-tertiary">Tertiary Text (50% white)</p>
            <p className="body-medium text-subtle">Subtle Text (30% white)</p>
            <p className="body-medium text-accent">Accent Text (Brand color)</p>
          </div>
        </section>

        {/* Labels */}
        <section className="card space-y-4">
          <h2 className="headline">Labels</h2>
          <div className="flex gap-6">
            <div>
              <span className="label-lg">Label Large Medium</span>
            </div>
            <div>
              <span className="label-lg-regular text-secondary">Label Large Regular</span>
            </div>
            <div>
              <span className="label-sm">Label Small Medium</span>
            </div>
            <div>
              <span className="label-sm-regular text-secondary">Label Small Regular</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
