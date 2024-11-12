import {
	UseFormRegister,
	FieldError,
	FieldValues,
	Control,
} from 'react-hook-form'
import ErrorLabel from './error-label'

import AvatarEditorField from './avatar-editor-field'
import EmailField from './email-field'
import LanguagePrimaryField from './language-primary-field'
import LanguagesSpokenField from './languages-spoken-field'
import PasswordField from './password-field'
import UsernameField from './username-field'
import UserRoleField from './user-role-field'

type AnyFieldType = {
	error: FieldError
	tabIndex?: number
	autoFocus?: boolean
}

export type FieldProps = AnyFieldType & {
	register: UseFormRegister<FieldValues>
}
export type ControlledFieldProps = AnyFieldType & {
	control: Control
}

export {
	AvatarEditorField,
	EmailField,
	ErrorLabel,
	LanguagePrimaryField,
	LanguagesSpokenField,
	PasswordField,
	UsernameField,
	UserRoleField,
}
