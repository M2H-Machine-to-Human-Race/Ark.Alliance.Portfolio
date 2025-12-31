import { BaseComponentModel } from '../../base/BaseComponent.model';

export class InputBoxViewModel extends BaseComponentModel {
    private _value: string = '';
    private _isValid: boolean = true;
    private _errorMessage: string | null = null;
    private _isFocused: boolean = false;
    private _validationFn?: (value: string) => string | null;

    constructor(initialValue: string = '', validationFn?: (value: string) => string | null) {
        super();
        this._value = initialValue;
        this._validationFn = validationFn;
    }

    public setValue(value: string): void {
        this._value = value;
        if (this._validationFn) {
            this.validate();
        }
    }

    public validate(): boolean {
        if (!this._validationFn) return true;

        const error = this._validationFn(this._value);
        this._errorMessage = error;
        this._isValid = error === null;
        return this._isValid;
    }

    public setFocused(focused: boolean): void {
        this._isFocused = focused;
    }

    get value(): string { return this._value; }
    get isValid(): boolean { return this._isValid; }
    get errorMessage(): string | null { return this._errorMessage; }
    get isFocused(): boolean { return this._isFocused; }
}

