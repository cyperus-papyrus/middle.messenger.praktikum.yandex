import Block from '../../framework/Block';
import { IBlockEvents } from '../../utils/types';

interface IFileInputProps {
    name?: string;
    className?: string;
    attr?: Record<string, string>;
    events?: IBlockEvents;
    accept?: string;
}

export default class FileInput extends Block {
    constructor(props: IFileInputProps) {
        const changeHandler = props.events?.change
            ? (e: Event) => props.events?.change?.(e)
            : () => { };

        const events: IBlockEvents = {
            ...(props.events || {}),
            change: changeHandler
        };

        super({
            ...props,
            events
        });
    }

    public openFileDialog() {
        const input = this.element?.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
            input.click();
        }
    }

    render(): string {
        return `
            <input
                type="file"
                accept="{{accept}}"
                class="file-input {{className}}"
                name="{{name}}"
                style="display: none;"
            />
        `;
    }
}
