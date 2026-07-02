import Layout from '../components/Layout';

const videos = [
  {
    title: 'How to Write in Cursive — Full Alphabet',
    channel: 'Cursive Writing Tutorial',
    description: 'A complete walkthrough of every uppercase and lowercase cursive letter, with slow demonstrations and common mistake corrections.',
    youtubeId: 'EUL5KBJmUaI',
  },
  {
    title: 'Why Handwriting Still Matters',
    channel: 'The Art of Learning',
    description: 'Research-backed look at why writing by hand improves memory, comprehension, and focus compared to typing.',
    youtubeId: 'mfHjiG2RdBk',
  },
  {
    title: 'Cursive Handwriting Practice for Beginners',
    channel: 'Improve Your Handwriting',
    description: 'Step-by-step beginner lessons covering letter formation, connections between letters, and consistent sizing on ruled lines.',
    youtubeId: 'oTMT-bLFSC4',
  },
  {
    title: 'Scripture Writing — Tips for a Meaningful Practice',
    channel: 'Faith & Flourish',
    description: 'How to make Scripture writing a daily habit — choosing verses, setting up your space, and slowing down in the Word.',
    youtubeId: 'P0B7kFYMIwg',
  },
  {
    title: 'The Science of Handwriting and Memory',
    channel: 'Veritasium',
    description: 'A deep dive into the neuroscience behind why handwriting activates more of the brain than keyboard input.',
    youtubeId: 'MKUou8ibsto',
  },
  {
    title: 'Improving Letter Spacing & Consistency in Cursive',
    channel: 'Cursive Logic',
    description: 'Advanced tips for making your cursive look polished — even baseline, consistent slant, and fluid letter connections.',
    youtubeId: 'hz4oRjS9UeM',
  },
];

const links = [
  {
    title: 'YouVersion Bible App',
    url: 'https://www.youversion.com',
    description: 'The Bible app powering our verse content — with reading plans, devotionals, and hundreds of translations.',
  },
  {
    title: 'Blue Vinyl Fonts — LearningCurve',
    url: 'https://www.bvfonts.com',
    description: 'The creator of the LearningCurve cursive font family used in every Cursive Verses worksheet.',
  },
  {
    title: 'Handwriting Without Tears',
    url: 'https://www.lwtears.com',
    description: 'A leading curriculum for teaching handwriting to children, trusted by schools and homeschool families.',
  },
  {
    title: 'The Spencerian System (Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/Spencerian_script',
    description: 'The historical American cursive style — the basis for much of modern cursive instruction.',
  },
];

function VideoCard({ video }: { video: typeof videos[0] }) {
  return (
    <div className="rounded-xl border border-brand-deep/10 overflow-hidden hover:border-brand-teal/40 transition-colors">
      <div className="relative bg-brand-cream/60" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-brand-blue-light font-medium mb-1">{video.channel}</p>
        <h3 className="font-semibold text-brand-deep text-sm mb-1 leading-snug">{video.title}</h3>
        <p className="text-xs text-brand-deep/60 leading-relaxed">{video.description}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-brand-deep mb-2">Resources</h1>
        <p className="text-brand-deep/60 mb-12 max-w-xl">
          Helpful videos and links for learning cursive, building a Scripture writing practice, and understanding the science behind handwriting.
        </p>

        <h2 className="text-lg font-semibold text-brand-deep mb-5">Video Tutorials</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {videos.map(v => <VideoCard key={v.youtubeId} video={v} />)}
        </div>

        <h2 className="text-lg font-semibold text-brand-deep mb-5">Helpful Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {links.map(l => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-brand-deep/10 p-4 hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-colors block"
            >
              <p className="font-medium text-brand-deep text-sm mb-1">{l.title} ↗</p>
              <p className="text-xs text-brand-deep/60 leading-relaxed">{l.description}</p>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}
