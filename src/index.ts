/// <reference path="./@types/declaration.d.ts>
import { RunQueueFunction, ResolverFunction, CallbackFunction, PromiseObject } from './@types/declarations';

class PromiseQueuer<T> {
	private queue: PromiseObject<T>[] = [];
	private readonly debug: boolean;
	private isRunning: boolean;
	private readonly maxAttempts: number;

	constructor(debugStatus: boolean, maxAttempts: number) {
		this.debug = debugStatus;
		this.isRunning = false;
		this.maxAttempts = maxAttempts;
	}

	public static factory<U>(debugStatus: boolean = false, maxAttempts: number = 5): PromiseQueuer<U> {
		return new PromiseQueuer<U>(debugStatus, maxAttempts);
	}

	private log(message: any, ...optionalParams: any[]): void {
		if (this.debug) {
			console.log('PromiseQueuer::', message, optionalParams);
		}
	}

	private getQueueStatus(): boolean {
		return this.isRunning;
	}

	private setQueueStatus(status: boolean): void {
		this.isRunning = status;
	}

	public getQueue(): PromiseObject<T>[] {
		return this.queue;
	}

	public addToQueue(object: T): void {
		const promiseObject: PromiseObject<T> = {
			errors: [],
			attempts: 0,
			object,
		};
		this.log('Added', object);
		this.queue.push(promiseObject);
	}

	private shiftQueue(): PromiseObject<T> | undefined {
		return this.queue.shift();
	}

	private addAttempt(promiseObject: PromiseObject<T>, error: Error): void {
		promiseObject.attempts += 1;
		promiseObject.errors.push(error);

		this.log('Pushing item to the last position', promiseObject);
		this.queue.push(promiseObject);
	}

	public async runQueue(
		resolver: ResolverFunction<T>,
		callback?: CallbackFunction,
	): Promise<RunQueueFunction<T> | null> {
		this.log(`Running Queue with ${this.queue.length} items`);

		if (this.getQueueStatus()) {
			this.log(`Queue already running`);
		}

		this.setQueueStatus(true);

		const nextItem = this.shiftQueue();

		if (!nextItem) {
			this.log('No items left to run');
			this.setQueueStatus(false);
			return null;
		}

		const result = await resolver(nextItem.object).catch(error => {
			if (nextItem.attempts < this.maxAttempts) {
				this.log('Promise rejected');
				this.addAttempt(nextItem, error);
			} else {
				this.log('Promise rejected. Max attempts reached, ignoring item', nextItem);
			}
			return null;
		});

		if (result) {
			this.log('Promise resolved: ', result);
			if (callback) {
				await callback(result);
			}
		}

		this.setQueueStatus(false);
		return this.runQueue(resolver, callback);
	}
}

export default PromiseQueuer;
export { PromiseQueuer };
