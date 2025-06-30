import Block from '../../framework/Block';

export const createStaticBlock = (html: string, children: Record<string, Block> = {}) => {
    return class StaticBlock extends Block {
        constructor() {
            super({ ...children });
        }

        render() {
            return html;
        }
    };
};
