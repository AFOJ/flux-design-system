import type { ReactNode } from "preact/compat"

export default function Required(props: Readonly<{children?: ReactNode}>) {
    const {children} = props
    return (
        <span class="[font-size:var(--res-mobile-font-size-body-xs)] text-(--text-colour-body) font-light">
        <span class="text-(--text-colour-warning)">*</span> {children}
    </span>
    )
}