import type { ChangeEvent } from 'react'
import languages from 'lib/languages'

interface SelectMultipleLanguagesInputProps {
	selectedLanguages: string[]
	setSelectedLanguages: (languages: string[]) => void
	except?: string
}

export default function SelectMultipleLanguagesInput({
	selectedLanguages,
	setSelectedLanguages,
	except,
}: SelectMultipleLanguagesInputProps) {
	const handleSelectedLanguage = (lang: string) => {
		setSelectedLanguages([
			lang,
			...selectedLanguages.filter(
				(lan: string) => lan !== null && lan !== lang
			),
		])
	}
	const handleRemoveLanguage = (lang: string) => {
		setSelectedLanguages([
			...selectedLanguages.filter(
				(lan: string) => lan !== null && lan !== lang
			),
		])
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		console.log(`handle change`, event.target.value, event.target.checked)
		const lang: string = event.target.value
		if (event.target.checked) {
			handleSelectedLanguage(lang)
		} else {
			handleRemoveLanguage(lang)
		}
	}

	return (
		<div className="h-40 overflow-auto rounded border py-3">
			{Object.keys(languages).map((k) => (
				<p key={`languages-spoken-${k}`} className="flex">
					<label className="w-full px-3 py-1 has-[:checked]:bg-primary has-[:checked]:text-white">
						<input
							type="checkbox"
							className="mr-2 rounded"
							value={k}
							name="languages_spoken"
							onChange={handleChange}
							checked={
								(selectedLanguages && selectedLanguages.indexOf(k) !== -1) ||
								k === except
							}
						/>
						{languages[k]}
					</label>
				</p>
			))}
		</div>
	)
}
