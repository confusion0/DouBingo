interface ButtonProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    type?: "button" | "reset";
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, size, type, className, children, style, onClick }) => {
    const buttonVariants = {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "rounded-md h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }

    return (
        <button
            className={[
                buttonVariants.variants.variant[variant || "default"],
                buttonVariants.variants.size[size || "default"],
                "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                className
            ].join(" ")}
            onClick={onClick}
            type={type}
            style={style}
        >
            {children}
        </button>
    )
}

export default Button;