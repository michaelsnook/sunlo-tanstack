import TinyPhrase from '../src/components/tiny-phrase'
import { cn } from 'lib/utils'
import { PhraseFull } from 'types/main'

function readStatus(status: string) {
  if (!status) return { emoji: '', classString: '' }
  if (status === 'learned')
    return {
      emoji: `✅ `,
      classString: 'bg-success/20 hover:bg-success/30',
    }
  if (status === 'active')
    return {
      emoji: `📖 `,
      classString: 'bg-info/20 hover:bg-info/30',
    }
  return { emoji: `❌ `, classString: 'hover:bg-base-300' }
}

export default function Card({
  status,
  phrase,
}: {
  status: string
  phrase: PhraseFull
}) {
  const { emoji, classString } = readStatus(status)

  return (
    <div className={cn('alert my-2 justify-start shadow-lg', classString)}>
      <div className="flex-none text-xl">{emoji}</div>
      <div className="block">
        <div lang={phrase?.lang} className="mb-2 text-xl font-bold">
          <TinyPhrase {...phrase} />
        </div>
        {phrase?.translations?.length > 0 ?
          <ul>
            {phrase.translations.map((trans) => (
              <li lang={trans.lang} key={`translation-${trans.id}`}>
                <TinyPhrase {...trans} />
              </li>
            ))}
          </ul>
        : <p className="italic text-base-content/80">
            There aren&apos;t any translations, sorry{' '}
            <span className="not-italic">😢</span>
          </p>
        }
      </div>
    </div>
  )
}
