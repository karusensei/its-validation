import { GenericField } from "./fields"
import { ISchemaReport } from "./reports.types"
import { ISchema, ISchemaDef } from "./schema.types"
import { RequiredValidator, IValidatorReport } from "./validators/exports"

export class Schema implements ISchema {
	schema: ISchemaDef
	validators: [RequiredValidator] = [new RequiredValidator(true)]

	constructor(schemaDef: ISchemaDef, message?: string) {
		this.schema = schemaDef
		this.validators = [new RequiredValidator(true, message)]
	}

	private get toArray(): [string, GenericField | Schema][] {
		return Object.entries(this.schema)
	}

	get serialized() {
		return this.schema
	}

	get toJSON() {
		return JSON.stringify(this.serialized)
	}

	get requiredValidator(): RequiredValidator {
		return this.validators.find(validator => validator.name === "required") as RequiredValidator
	}

	get required(): boolean {
		return this.requiredValidator.required ?? false
	}

	/**
	 * 
	 * @param j JSON String of serialized Schema
	 */
	static parse(j: {[key: string]: any}): Schema {
		try {
			let schemaDef: ISchemaDef = {}
			Object.entries(j).forEach(([fieldname, _field]) => {
				if (_field.schema) {
					let field = (_field as ISchema)
					const schema = Schema.parse(field.schema)
					let fieldRequired = field.validators[0]
					schema.setValidators([new RequiredValidator(fieldRequired.challenge, fieldRequired.message)])
					schemaDef[fieldname] = schema
				} else {
					schemaDef[fieldname] = GenericField.parse(_field)
				}
			});
			return new Schema(schemaDef)
		} catch (error) {
			throw new Error(`Cannot parsing schema : submited structure does not represent a valid string of schema definition. Please make sure that the definition submitted was generated by the Schema class\n${JSON.stringify(j)}`)
		}

	}

	static parseJsonString(j: string) {
		return this.parse(JSON.parse(j))
	}

	setRequired(message?: string) {
		this.validators = [new RequiredValidator(true, message)]
		return this
	}

	setValidators(validators: [RequiredValidator]) {
		this.validators = validators
		return this
	}

	validate(data?: { [key: string]: any }): boolean {
		if (data) {
			return this.toArray.every(([fieldname, field]) => field.validate(data[fieldname]) ?? false)
		} else if (this.required) {
			return false
		} else {
			return true
		}
	}

	report(data?: { [key: string]: any }): ISchemaReport | IValidatorReport[] {
		if (data) {
			let report: ISchemaReport = {}
			this.toArray.forEach(([fieldname, field]) => report[fieldname] = field.report(data[fieldname]))
			return report
		} else if (this.required) {
			return [this.validators[0].report(undefined)]
		} else {
			return [this.validators[0].report(undefined)]
		}
	}
}