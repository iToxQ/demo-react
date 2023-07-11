import React, { FC, ReactNode, useState } from 'react';
import Styles from './GroupBox.module.scss';

interface IGroupBox {
    title?: string;
    isCollapsible?: boolean;
    isStart?: boolean;
    isEnd?: boolean;
    children?: ReactNode;
}

const GroupBox: FC<IGroupBox> = ({ title, isCollapsible, isStart, isEnd, children }) => {
    const [isShow, setIsShow] = useState<boolean>(false);

    const containerClassName = [
        Styles.container,
        isStart ? Styles.start : '',
        isEnd ? Styles.end : ''
    ].join(' ');

    const handlerShow = () => {
        setIsShow(!isShow);
    };

    return (
        <>{isCollapsible ?
            <div className={Styles.containerCollapsible}>
                <div className={Styles.title} onClick={handlerShow}>
                    {title}
                    <div
                        className={Styles.collapsible}
                        style={{
                            transform: `rotate(-${isShow ? '' : '9'}0deg)`
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
                            <path d="M0.5 1L4.5 5L8.5 1" stroke="#121212" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                {isShow &&
                    <div className={Styles.content}>
                        {children}
                    </div>
                }
            </div>
            :
            <div className={containerClassName}>
                <div className={Styles.wrapper}>
                    {title &&
                        <div className={Styles.title}>
                            {title}
                        </div>
                    }
                    <div className={Styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        }</>
    );
};

export default GroupBox;