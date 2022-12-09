import { equal } from "assert";
import { Validator, IValidatorConstructor, IValidatorConstructorParams } from "./validator";

export interface PlayTest {

	validator: Validator
	test: any,
	shouldBe: boolean

}


export function EqualTests(
	validatorName: string,
	playtests: PlayTest[]
) {

	describe(`${validatorName}`, () => {
		describe(`validate() : ${playtests.length} tests`, () => {

			playtests.forEach((playtest, index) => {


				it(`${index + 1}) ${validatorName}(${JSON.stringify(playtest.validator.challenge, undefined , 2)})
	validate( ${playtest.test} ) === ${playtest.shouldBe}
`,
					() => {
						equal(
							playtest.validator.validate(playtest.test),
							playtest.shouldBe
						)

					})
			})
		})
	});
}

