import useLocale from '@hooks/useLocale';
import clsx from 'clsx';
import { AriaRole, forwardRef, ReactNode, RefObject } from 'react';

/**
 * Handles dynamic intl linking.
 */
const Link = forwardRef(function Link({ children, className, href, id, role, blue, popup }: Props, ref) {
    const [, hl] = useLocale();
    const link = href.startsWith('/') ? (hl === 'en_us' ? href : `/intl/${hl}${href}`) : href;

    return (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a ref={ref as RefObject<HTMLAnchorElement>} rel={popup ? 'noreferer' : undefined} target={popup ? '_blank' : undefined} id={id} href={link} className={clsx('inline-block', className, {
            'text-blue-500': blue
        })} role={role}>
            {children}
        </a>
    );
});

export default Link;

interface Props {
    children: ReactNode;
    id?: string;
    popup?: boolean;
    blue?: boolean;
    className?: string;
    href: string;
    noBr?: boolean;
    role?: AriaRole;
}
