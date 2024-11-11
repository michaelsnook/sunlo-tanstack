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

export type FieldProps = {
	register: UseFormRegister<FieldValues>
	error: FieldError
}
export type ControlledFieldProps = {
	control: Control
	error: FieldError
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
