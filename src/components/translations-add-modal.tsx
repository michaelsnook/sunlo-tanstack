'use client'

import { type FormEvent, useState } from 'react'
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import Modal from 'react-modal'
import supabase from 'lib/supabase-client'
import SelectLanguageYouKnow from 'components/select-language-you-know'
import Loading from 'components/loading'
import toast from 'react-hot-toast'
import { ErrorShow } from 'components/errors'
import { TranslationRow, SelectOption } from 'types/main'
import { PostgrestError } from '@supabase/supabase-js'

export default function AddTranslationsModal({
  phrase,
  isOpen = false,
  open,
  close,
  className = '',
  children = null,
}) {
  const queryClient = useQueryClient()
  const [translationLang, setTranslationLang] = useState('')
  const addTranslation = useMutation({
    mutationFn: async (text: string) => {
      if (typeof text !== 'string' || !(text.length > 0))
        throw Error('there is no translation text')
      console.log(`Running mutation with`, text, translationLang, phrase.id)
      const { data, error } = await supabase
        .from('phrase_translation')
        .insert({
          phrase_id: phrase.id,
          lang: translationLang,
          text,
        })
        .select()
      if (error) throw error
      console.log(`The Data`, data)
      return data[0]
    },
    onSuccess: (data) => {
      console.log(`onSuccess with data`, data)
      toast.success('Added a new translation')
      queryClient.invalidateQueries()
      close()
    },
  }) as UseMutationResult<TranslationRow, PostgrestError>

  return (
    <>
      <Modal
        className="page-card w-app"
        overlayClassName="bg-black/70 fixed top-0 bottom-0 left-0 right-0 flex place-items-center backdrop-blur-sm"
        isOpen={isOpen}
        onRequestClose={() => {
          close()
          addTranslation.reset()
        }}
      >
        <h1 className="h2">
          Add a translation for &ldquo;{phrase.text}&rdquo;
        </h1>
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            console.log(`Submitting form with`, e)
            const val = e.target?.['translation_text']?.value ?? ''
            addTranslation.mutate(val)
          }}
        >
          <fieldset className="space-y-4" disabled={addTranslation.isPending}>
            <div className="form-control">
              <label>Into which language?</label>
              <SelectLanguageYouKnow
                disabledLang={phrase.lang}
                onChange={(val: SelectOption) => setTranslationLang(val.value)}
              />
            </div>
            <div className="form-control">
              <label>What is the translation?</label>
              <textarea className="s-input" name="translation_text" />
            </div>
            {/*<div className="text-sm">
              Is there a more literal translation that might help understand the
              meaning?
            </div>*/}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={addTranslation.isPending}
            >
              {addTranslation.isPending ?
                <Loading />
              : `Submit translation`}
            </button>
            <ErrorShow show={!!addTranslation.error}>
              {addTranslation.error?.['code'] === '23505' ?
                `This translation already exists for this phrase`
              : addTranslation.error?.message}
            </ErrorShow>
          </fieldset>
        </form>
      </Modal>

      <button
        onClick={() => open()}
        role="button"
        className={className || 'rounded-full align-text-bottom hover:outline'}
      >
        {children ? children : <PlusCircleIcon />}
      </button>
    </>
  )
}

const PlusCircleIcon = ({ className = 'size-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)
