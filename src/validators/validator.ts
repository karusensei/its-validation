import { Report } from "../reports/exports"
import { TValidatorName } from "./validators.validators"


export interface IValidator {
	name: TValidatorName | string
	message: string
	challenge: any
	validate(value: any): boolean
	report(value?: any): Report
}


export class Validator implements IValidator {

	name = "generic"
	message = "generic validator don't pass"
	challenge: any

	constructor(challenge?: any, message?: string) {
		this.message = message ?? this.message
		this.validate = challenge ?? this.validate
	}

	setValidate(validate: (value: any) => boolean): void {
		this.validate = validate
	}

	validate(value: any): boolean {
		throw new Error("Method not implemented.")
	}

	report(value?: any): Report {
		return {
			name: this.name,
			pass: this.validate(value),
			message: this.message,
			challenge: this.challenge,
			value: value
		}
	}
}