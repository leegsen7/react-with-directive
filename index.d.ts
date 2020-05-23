declare module "react-with-directive" {
    interface DirectiveOptions {
        priority?: number;
        install: Function;
    }
    function defineDirective(directiveOptions: DirectiveOptions): void;
}
