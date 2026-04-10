// File: src/components/common/Button.tsx

import styles from './Button.module.css'

type ButtonProps = {
    label: string
    onClick?: () => void
    variant?: 'primary' | 'danger' | 'secondary'
    disabled?: boolean
    type?: 'button' | 'submit'
    fullWidth?: boolean
}

function Button({
    label,
    onClick,
    variant = 'primary',
    disabled = false,
    type = 'button',
    fullWidth = false
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${styles.button}
                ${styles[variant]}
                ${fullWidth ? styles.fullWidth : ''}
            `}
        >
            {label}
        </button>
    )
}

export default Button