import { Container } from "./styles";


interface Props {
    value?: string | number;
    label?: string;
    id?: string;
    name?: string;
    className?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    errorText?: string;
    fit?: boolean;
    onChange?(e: React.ChangeEvent<unknown>): void;
    onBlur?(e: React.FocusEvent<unknown>): void;
}

const InputRange: React.FC<Props> = ({
    value = '',
    id,
    name,
    label,
    className = '',
    autoFocus = false,
    readOnly = false,
    disabled = false,
    hidden = false,
    min = 0,
    max = 500,
    step = 1,
    errorText,
    fit = false,
    onChange,
    onBlur
}) => {

    return (
        <Container className={className}>
            {label && (
                <label
                    htmlFor={id || name}
                    className={errorText ? 'invalid' : ''}
                >
                    {label}
                </label>
            )}
            <p>{value} dias</p>
            <input
                value={value == null ? "" : value}
                id={id || name}
                name={name}
                type="range"
                autoFocus={autoFocus}
                readOnly={readOnly}
                onChange={onChange}
                onBlur={onBlur}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                hidden={hidden}
                className={errorText ? 'has-error' : ''}
                aria-label={label || `Campo do tipo range`}
                aria-errormessage={errorText}
                aria-invalid={errorText && errorText!=='' ? true : false}
            />
            {!fit && (
                <small role="alert">
                    {`${errorText != null ? errorText : ""}`}
                </small>
            )}
        </Container>
    );
}

export default InputRange;