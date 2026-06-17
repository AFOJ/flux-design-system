import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "preact/compat";
import type { JSX } from "preact/jsx-runtime";

export default function Label(props: Readonly<ComponentPropsWithoutRef<"label">>): JSX.Element {
    const { children, class: className, ...restProps } = props
    return (
        <label {...restProps} class={clsx(["[font-size:var(--res-mobile-font-size-body-xs)] font-(--font-font-weight-paragraph-regular)", "text-(--text-colour-body)", className])}>
            {children}
        </label>
    )
}