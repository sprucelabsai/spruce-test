import StackCleaner from './StackCleaner'

export default class AssertionError extends Error {
	public constructor(message: string, stack?: string) {
		super(message)
		this.message = StackCleaner.clean(message ?? this.message ?? '') + '\n\n\n'
		this.stack = StackCleaner.clean(stack ?? this.stack ?? '')
	}
}
