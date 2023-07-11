import React from 'react'
import { Popconfirm } from 'antd';

import Styles from './NavbarButton.module.scss'

const NavbarButton = ({button}: any) => {
    let rootClassName = Styles.NavbarButton;

    if (button.disabled === true) {
        rootClassName = [rootClassName, Styles.disabled].join(' ');
    }

    const defaultButton = () => (
        <button
            className={rootClassName}
            onClick={() => {
                if (!button.popConfirm || button.popConfirm.hidden) {
                    button.onClick();
                }
            }}
            title={button.label}>
            <div className={Styles.icon_wrapper}>
                {button.icon}
            </div>
            <div className={Styles.label}>
                <span>{button.label}</span>
            </div>
        </button>
    );

    const popConfirm = (children: React.ReactNode) => (
        <Popconfirm
            placement="rightTop"
            title={button.popConfirm.title}
            description={button.popConfirm.description}
            icon={button.popConfirm.icon}
            onConfirm={button.onClick}
        >
            {children}
        </Popconfirm>
    );

    return (
        <>
            {button.popConfirm && !button.popConfirm.hidden
                ? popConfirm(defaultButton())
                : defaultButton()
            }
        </>
    );
};

export default NavbarButton