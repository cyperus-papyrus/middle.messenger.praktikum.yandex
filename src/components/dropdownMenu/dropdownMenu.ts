import Block from '../../framework/Block';
import { IBlockProps } from '../../utils/types';

interface DropdownMenuProps extends IBlockProps {
    isOpen: boolean;
    position?: 'left' | 'right';
    toggleButton: Block;
    items: Block[];
}

interface DropdownMenuState {
    isOpen: boolean;
}

export default class DropdownMenu extends Block<DropdownMenuProps> {

    constructor(props: DropdownMenuProps) {
        const initialState: DropdownMenuState = {
            isOpen: props.isOpen || false
        };

        const children: Record<string, Block> = {
            toggleButton: props.toggleButton
        };

        props.items.forEach((item, index) => {
            children[`item${index}`] = item;
        });

        super({
            ...props,
            ...children,
            events: {
                click: (e: Event) => { e.stopPropagation(); this.toggleMenu(); }
            },
            initialState
        });
    }

    toggleMenu() {
        const isOpen = !this.props.isOpen;
        this.setProps({ isOpen });
    }


    render() {
        const items = Object.keys(this.children)
            .filter(key => key.startsWith('item'))
            .map(key => `{{{ ${key} }}}`)
            .join('');

        return `
            <div class="dropdown-menu ${this.props.isOpen ? 'dropdown-menu--open' : ''}">
                {{{ toggleButton }}}

                ${this.props.isOpen ? `
                    <div class="dropdown-menu__content
                    dropdown-menu__content--${this.props.position || 'right'}">
                        ${items}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
