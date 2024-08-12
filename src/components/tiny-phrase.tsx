const TinyPhrase = ({ lang = null, text }) => (
  <>
    {lang && (
      <span className="badge badge-neutral font-mono font-normal transition-none group-hover:badge-outline">
        {lang}
      </span>
    )}{' '}
    <span lang={lang}>&ldquo;{text}&rdquo;</span>
  </>
)

export default TinyPhrase
