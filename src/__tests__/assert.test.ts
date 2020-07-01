import AbstractSpruceTest from '../AbstractSpruceTest'
import assert from '../assert'
import test from '../decorators'

interface ICustomObj {
	testStr: string
}

export default class AssertTest extends AbstractSpruceTest {
	@test()
	protected static async canHandleAsyncThrows() {
		let hitError = false

		await assert.doesThrowAsync(
			async () =>
				new Promise(() => {
					hitError = true
					throw new Error('should catch')
				})
		)

		assert.isTrue(hitError)
	}

	@test()
	protected static async canDetectNoErrorThrown() {
		let hitCallback = true
		let detectedNoThrow = false

		try {
			assert.doesThrow(async () => {
				hitCallback = true
			})
		} catch (err) {
			detectedNoThrow = true
			assert.isOk(err)
		}

		assert.isTrue(hitCallback)
		assert.isTrue(detectedNoThrow)
	}

	@test()
	protected static isEqual() {
		assert.doesThrow(() => assert.isEqual('hello', 'world'), /not equal/)
		assert.isEqual(1, 1)
	}

	@test()
	protected static isAbove() {
		assert.isAbove(10, 5)
		assert.doesThrow(() => assert.isAbove(5, 10), /is not above/)
	}

	@test()
	protected static async isBelow() {
		assert.isBelow(5, 10)
		assert.doesThrow(() => assert.isBelow(10, 5), /is not below/)
	}

	@test()
	protected static async typeTests() {
		assert.isType<string>('string')
		assert.isType<number>(123)

		const myCustomObj: ICustomObj = {
			testStr: 'blah'
		}

		assert.isType<ICustomObj>(myCustomObj)
		assert.areSameType(true, true)
	}

	@test()
	protected static async canMatchErrorByString() {
		assert.doesThrow(() => {
			throw new Error('Match on string')
		}, 'on string')

		await assert.doesThrowAsync(async () => {
			throw new Error('canMatchErrorByString: Match on string')
		}, 'on string')
	}

	@test()
	protected static async doesNotMatchErrorByBadString() {
		let errorThrown = false
		try {
			assert.doesThrow(() => {
				throw new Error('doesNotMatchErrorByBadString: Match on string')
			}, 'on string2')
		} catch (err) {
			errorThrown = true
		}

		assert.isTrue(errorThrown)
	}

	@test()
	protected static async throwMatchesErrorByRegex() {
		assert.doesThrow(() => {
			throw new Error('Match on string')
		}, /on STRING/i)

		await assert.doesThrowAsync(async () => {
			throw new Error('Match on string')
		}, /on STRING/i)
	}

	@test()
	protected static async throwReturnsTheError() {
		const err = assert.doesThrow(() => {
			throw new Error('Match on string')
		})

		assert.isEqual(err.message, 'Match on string')

		const err2 = await assert.doesThrowAsync(async () => {
			throw new Error('Match on string')
		})

		assert.isEqual(err2.message, 'Match on string')
	}

	@test()
	protected static async doesNotMatchErrorByBadRegex() {
		let errorThrown = false
		try {
			assert.doesThrow(() => {
				throw new Error('Match on string')
			}, /on string2/)
		} catch (err) {
			errorThrown = true
		}

		assert.isTrue(errorThrown)
	}

	@test()
	protected static async doesNotMatchErrorByBadRegexAsync() {
		let errorThrown = false
		try {
			await assert.doesThrowAsync(async () => {
				throw new Error('Match on string')
			}, /on string2/)
		} catch (err) {
			errorThrown = true
		}

		assert.isTrue(errorThrown)
	}

	@test('asserts is string (test will pass, types will fail)')
	protected static async assertIsString() {
		const path = ((): string | undefined => {
			return 'test'
		})()

		assert.isString(path)
		assert.isType<string>(path)
	}

	@test('include uses string to match string', 'hello world', 'world')
	@test(
		'include uses partial and matches 0th level',
		{ hello: 'world', taco: 'bell' },
		{ taco: 'bell' }
	)
	@test(
		'include can find string as value on 0th level',
		{ hello: 'world', taco: 'bell' },
		'bell'
	)
	@test(
		'include can find object on 1st level',
		{ hello: 'world', taco: 'bell', flavor: { cheese: true, buffalo: true } },
		{ 'flavor.cheese': true }
	)
	@test(
		'include can find object on 2nd level',
		{
			hello: 'world',
			taco: 'bell',
			flavor: { cheese: { size: 'large', buffalo: true } }
		},
		{ 'flavor.cheese.size': 'large' }
	)
	@test(
		'include can search inside array with index',
		{
			flavors: [{ cheese: true }, { peperoni: true }]
		},
		{ 'flavors[0].cheese': true }
	)
	@test(
		'include can search inside array without index',
		{
			flavors: [{ cheese: true }, { peperoni: true }]
		},
		{ 'flavors[].peperoni': true }
	)
	@test(
		'include can search inside array without index',
		{
			flavors: [
				{ size: 'large', toppings: [{ meat: true }, { cheese: true }] },
				{ size: 'small' }
			]
		},
		{ 'flavors[].toppings[].meat': true }
	)
	@test(
		'include can search array without index',
		[{ cheese: true }, { meat: true }],
		{ meat: true }
	)
	@test(
		'include can search array without index',
		[{ cheese: true }, { meat: true }],
		{ '[].meat': true }
	)
	protected static includeTests(haystack: any, needle: any) {
		assert.doesInclude(haystack, needle)
	}

	@test()
	protected static doesIncludeFails() {
		assert.doesThrow(
			() => assert.doesInclude('taco', 'bravo'),
			/does not include "bravo"/
		)

		assert.doesThrow(
			() => assert.doesInclude({ hello: 'world' }, 'taco'),
			/does not include "taco"/
		)
	}

	@test()
	protected static hasAllFunctionsAndPasses() {
		const obj = { func1: () => {}, func2() {}, foo: 'bar' }
		assert.hasAllFunctions(obj, ['func1', 'func2'])
	}

	@test()
	protected static hasAllFunctionsAndFails() {
		const obj = { func1: () => {}, func2() {}, foo: 'bar' }
		let errorHit = false
		try {
			assert.hasAllFunctions(obj, ['func1', 'func3'])
		} catch (err) {
			errorHit = true
			assert.doesInclude(err.message, 'func3')
		}

		assert.isTrue(errorHit)
	}

	@test()
	protected static isOk() {
		const run = (): string | undefined => {
			return 'test'
		}

		const value = run()
		assert.isOk(value)

		assert.isType<string>(value)

		assert.doesThrow(() => assert.isOk(false), /is not ok/)
		assert.doesThrow(() => assert.isOk(undefined), /is not ok/)
		assert.doesThrow(() => assert.isOk(null), /is not ok/)
	}

	@test()
	protected static isString() {
		assert.isString('test')
		assert.doesThrow(() => assert.isString(true), 'not a string')
	}

	@test()
	protected static isTrue() {
		assert.isTrue(true)
		assert.doesThrow(() => assert.isTrue(false), 'does not equal true')
	}

	@test()
	protected static isFalse() {
		assert.isFalse(false)
		assert.doesThrow(() => assert.isFalse(true), 'does not equal false')
	}
}
