import Block from '../../framework/Block';
import Avatar from '../avatar/avatar';
import Icon from '../icon/icon';
import FileInput from '../fileinput/fileInput';

import { mainURL } from '../../utils/HTTPTransport';


interface IAvatarUploadProps {
    currentAvatar: string;
    onAvatarSelected?: (file: File) => void;
}

export default class AvatarUpload extends Block {
    constructor(props: IAvatarUploadProps) {
        const avatar = new Avatar({
            src: props.currentAvatar,
            className: 'profile__avatar-img'
        });

        const fileInput = new FileInput({
            name: 'avatar',
            accept: 'image/*',
            events: {
                change: (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    if (input.files && input.files[0] && props.onAvatarSelected) {
                        props.onAvatarSelected(input.files[0]);
                    }
                }
            }
        });

        super({
            ...props,
            avatar,
            editIcon: new Icon({ name: 'Edit' }),
            fileInput
        });
    }

    public updateAvatar(newSrc: unknown) {
        this.children.avatar.setProps({ src: `${mainURL}/resources${newSrc}` });
    }

    render(): string {
        return `
            <div class="avatar profile__avatar">
                <label class="profile__avatar-change">
                    {{{avatar}}}
                    <div class="profile__avatar-overlay">
                        {{{editIcon}}}
                    </div>
                    {{{fileInput}}}
                </label>
            </div>
        `;
    }
}
