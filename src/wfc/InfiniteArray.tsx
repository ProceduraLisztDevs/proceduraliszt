
export class InfiniteArray<T> {
	private data: { [index: number]: T; } = {};

	constructor(other?: InfiniteArray<T>) {
		if (other !== undefined) {
			this.data = other.data;
		}
	}

	static fromData<T>(data: { [index: number]: T; }) {
		const array = new InfiniteArray<T>();
		array.data = data;
		return array;
	}

	set(index: number, value: T) {
		this.data[index] = value;
	}

	get(index: number): T | undefined {
		return this.data[index];
	}

	clear() {
		this.data = {};
	}

	toJSON(): { [index: number]: T; } & { __isInfiniteArray: true } {
		return {
			...this.data,
			__isInfiniteArray: true
		};
	}
	
	static fromJSON<T>(jsonData: {[index: number]: T, __isInfiniteArray: boolean }): InfiniteArray<T> {
		const { __isInfiniteArray, ...data } = jsonData;
		const instance = new InfiniteArray<T>();
		instance.data = data;
		return instance;
	}

	entries(): [number, T][] {
		return Object.entries(this.data).map(([key, value]) => [parseInt(key), value]);
	}

	transform<R>(transformer: (value: T) => R): InfiniteArray<R> {
		const newArray = new InfiniteArray<R>();
		for (const [index, value] of this.entries()) {
			newArray.set(index, transformer(value));
		}
		return newArray;
	}
}

export function parseWithInfiniteArray(json: string) {
    return JSON.parse(json, (_key, value) => {
        if (value && value.__isInfiniteArray) {
            return InfiniteArray.fromJSON(value);
        }
        return value;
    });
}
