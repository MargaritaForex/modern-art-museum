export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
}

export class BusinessLogicException extends Error {
    public readonly type: BusinessError;

    constructor(message: string, type: BusinessError) {
        super(message);
        this.type = type;
        this.name = 'BusinessLogicException';
    }
} 