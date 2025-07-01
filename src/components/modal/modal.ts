import Block from '../../framework/Block';
import Button from '../button/button';
import { IBlockProps } from '../../utils/types';
import Field from '../field/field';
import { validateField } from '../../utils/validation';

interface ModalProps extends IBlockProps {
    title: string;
    content: string | Block;
    confirmText?: string;
    cancelText?: string;
    visible: boolean;
    isInput?: boolean;
    onConfirm?: (inputValue?: string) => void;
    inputValue?: string;
}

export default class Modal extends Block<ModalProps> {

    constructor(props: ModalProps) {
        const confirmButton = new Button({
            text: props.confirmText || 'Подтвердить',
            className: 'button-blue',
            type: 'submit',
            events: {
                click: (e: Event) => this.handleSubmit(e)
            }
        });

        const okButton = new Button({
            text: props.confirmText || 'Подтвердить',
            className: 'button-primary',
            events: {
                click: () => this.handleConfirm()
            }
        });

        const cancelButton = new Button({
            text: props.cancelText || 'Отмена',
            className: 'button-red',
            type: 'button',
            events: {
                click: () => this.handleCancel()
            }
        });
        const modalInput = new Field({
            id: 'modalInput',
            name: 'name',
            type: 'text',
            placeholder: '',
            className: 'auth-field',
        });
        const contentBlock = props.content;
        super({
            ...props,
            cancelButton,
            confirmButton,
            okButton,
            contentBlock,
            visible: false,
            modalInput,
            events: {
                submit: (e: Event) => e.preventDefault()
            }
        });
    }

    public showModal(title: string,
        content: string | Block, onConfirm?: () => void) {
        this.setProps({
            title, content, visible: true, isInput: false,
            onConfirm: onConfirm
        });
    }

    public showModalWithInput(title: string,
        modaltype?: string, onConfirm?: (inputValue?: string) => void) {
        let inputPlaceholder = 'Логин'
        if (modaltype === 'modalChatname') {
            inputPlaceholder = 'Название'
        }
        this.children.modalInput.setProps({
            placeholder: inputPlaceholder,
            error: ''
        })
        this.setProps({
            title, content: '', visible: true, isInput: true,
            inputPlaceholder: inputPlaceholder, onConfirm,
            inputValue: ''
        })
    }

    private handleSubmit(e: Event) {
        e.preventDefault();
        const fieldComponent = this.children.modalInput as Field;
        const value = fieldComponent.getValue();

        const validationType = this.props.modaltype === 'modalLogin' ? 'login' : 'chatName';
        const errors = validateField(validationType, value);

        if (!errors) {
            this.setProps({ inputValue: value });
            if (this.props.onConfirm) {
                this.props.onConfirm(value);
            }
            fieldComponent.setProps({ value: '' });
            fieldComponent.clearInput();
            this.hideModal();
        } else {
            fieldComponent.setProps({ error: errors })
            fieldComponent.setInputError()
        }
    }

    private handleConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
        this.hideModal();
    }
    public hideModal() {
        this.setProps({ visible: false });
    }

    private handleCancel() {
        this.hideModal();
    }
    render() {
        return `
            <div class="modal${this.props.visible ? " show" : ""}">
                <div class="modal__content">
                    <h2 class="modal__title">${this.props.title}</h2>
                    ${this.props.isInput ? `<form> ` : ''}
                    <div class="modal__body">
                        {{{ content }}}
                        ${this.props.isInput ? `{{{ modalInput }}}` : ''}
                    </div>

                    <div class="modal__footer">
                        {{{ cancelButton }}}
                         ${this.props.isInput ? '{{{ confirmButton }}}' : '{{{okButton}}}'}
                    </div>
                    ${this.props.isInput ? `</form>` : ''}
                </div>
            </div>
        `;
    }
}
