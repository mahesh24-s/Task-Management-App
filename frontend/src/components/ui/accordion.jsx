import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/cn"

const Accordion = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
    </div>
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props}>
        {children}
    </div>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, onClick, isOpen, ...props }, ref) => {
    // Note: In a real radix implementation, state is handled by context. 
    // Here we might need to pass isOpen/onClick manually if not using context.
    // For simplicity in this prompt-response cycle, I'll rely on the parent controlling it or internal state if simple.
    // Actually, to make it truly simple without Context API overhead for just this:
    // I'll make the Accordion managing state? No, that's complex.
    // I will make a generic accessible Accordion that assumes it's being used as uncontrolled or simple controlled.
    // Let's implement a simple Context based one.
    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={onClick}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef(({ className, children, isOpen, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            isOpen ? "block" : "hidden",
            className
        )}
        {...props}
    >
        <div className="pb-4 pt-0">{children}</div>
    </div>
))
AccordionContent.displayName = "AccordionContent"

// Simple controlled wrapper for easier usage
const SimpleAccordionItem = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <AccordionItem className={className}>
            <AccordionTrigger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                {title}
            </AccordionTrigger>
            <AccordionContent isOpen={isOpen}>
                {children}
            </AccordionContent>
        </AccordionItem>
    );
};


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, SimpleAccordionItem }
