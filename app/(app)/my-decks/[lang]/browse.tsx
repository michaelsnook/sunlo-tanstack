'use client'

// nextjs: import Link from 'next/link'
import { useState } from 'react'
import Select from 'react-select'
import Loading from 'components/loading'
import ShowError from 'components/show-error'
import BigPhrase from 'components/big-phrase'
import { useLang } from 'lib/hooks'
import { SelectOption } from 'types/main'
import { useLanguagePhrases } from 'lib/preload-language'

export default function Browse({ disable = [] }) {
  // TODO move this to URL state
  const [activePhraseId, setActivePhraseId] = useState('')
  const lang = useLang()
  const { data: phrases, isPending, error } = useLanguagePhrases()
  if (isPending) return <Loading />
  if (error) return <ShowError>{error.message}</ShowError>

  if (Object.keys(phrases).length === 0) {
    return (
      <p className="rounded-lg bg-primary/10 p-6">
        There are no phrases for this language 💩{' '}
        <Link
          href={`/my-decks/${lang}/new-card`}
          className="s-link flex-none place-self-center text-primary"
        >
          you&apos;ll need to add some.
        </Link>
      </p>
    )
  }

  const options: Array<SelectOption> = Object.keys(phrases).map((pid) => {
    return {
      value: phrases[pid].id,
      label: phrases[pid].text,
    }
  })
  const handleChange = (option: SelectOption = null) => {
    setActivePhraseId(option?.value)
  }

  return (
    <div>
      <p className="my-4">Select a phrase to add to your deck</p>
      <Select
        options={options || []}
        isOptionDisabled={(option) => disable?.includes(option.value)}
        placeholder="Find a phrase"
        backspaceRemovesValue
        classNames={{
          control: () => 's-input',
          menuList: () =>
            'bg-base-100 text-base-content py-2 border rounded border-base-content/50 -mt-px',
          option: () =>
            'hover:bg-primary hover:text-white px-2 *:disabled:opacity-50',
        }}
        unstyled
        styles={{
          option: (_styles, { isDisabled }) => {
            return isDisabled ? { opacity: 0.5 } : null
          },
        }}
        aria-label="Select a phrase to add to your deck"
        onChange={handleChange}
        className="my-4"
      />
      {!activePhraseId ? null : (
        <>
          <a className="s-link text-primary" onClick={() => handleChange(null)}>
            &times; Clear selection
          </a>
          <BigPhrase
            phrase_id={activePhraseId}
            onClose={() => handleChange(null)}
          />
        </>
      )}
    </div>
  )
}
