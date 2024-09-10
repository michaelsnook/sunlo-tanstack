import { useProfile } from 'lib/hooks'
import Loading from './loading'
import { allLanguageOptions, makeLanguageOptions } from 'lib/languages'
import { SelectOption } from 'types/main'
import Select from 'react-select'

export default function SelectLanguageYouKnow({ onChange, disabledLang }) {
  const { data, isPending } = useProfile()
  if (isPending) return <Loading />
  const languages_spoken = data?.languages_spoken || []
  const selectOptions =
    !languages_spoken.length ? allLanguageOptions : (
      [
        {
          label: 'Your langauges',
          options: makeLanguageOptions(languages_spoken),
        },
        {
          label: 'Other languages',
          options: allLanguageOptions.filter(
            (option) => languages_spoken.indexOf(option.value) === -1
          ),
        },
      ]
    )
  return (
    <Select
      name="translationLang"
      options={selectOptions}
      classNames={{
        control: () => 's-input',
        menuList: () =>
          'bg-base-100 text-base-content py-2 rounded ring-1 -mt-px',
        option: () => 'hover:bg-primary hover:text-white px-2',
      }}
      unstyled
      styles={{
        option: (_styles, { isDisabled }) => {
          return isDisabled ? { opacity: 0.5 } : null
        },
      }}
      isOptionDisabled={(option: SelectOption) => option.value === disabledLang}
      placeholder="Select a language..."
      onChange={onChange}
      aria-label="Select a language for your translation"
    />
  )
}
