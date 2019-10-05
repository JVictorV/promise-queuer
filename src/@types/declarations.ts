export interface PromiseObject<T> {
    object: T;
    attempts: number;
    errors: Error[];
}

export interface CallbackFunction {
    (params?: any): Promise<any> | any;
}

export interface CallbackErrorFunction {
    (params?: any): Promise<any> | any;
}

export interface ResolverFunction<T> {
    (object: T): Promise<any | Error>;
}

export interface RunQueueFunction<T> {
    (resolver: ResolverFunction<T>, callback?: CallbackFunction): Promise<RunQueueFunction<T> | null>;
}
