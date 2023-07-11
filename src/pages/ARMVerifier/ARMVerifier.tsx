import React, { useRef } from 'react';
import Styles from './ARMVerifier.module.scss';
import VerificationPanel from './VerificationPanel/VerificationPanel';
import PageViewer from '../../components/ARMApps/PageViewer/PageViewer2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ARMVerifier = () => {
    const panelBlock = useRef<HTMLDivElement>(null);
    const { currentPage } = useSelector(({pageReducer}: RootState) => pageReducer);

    const reSize = (clientX: number) => {
        let dragX = clientX;
        let block = panelBlock.current;

        document.onmousemove = function onMouseMove(e) {
            if(block) block.style.width =  block.offsetWidth + e.clientX - dragX + "px";

            dragX = e.clientX;
        }

        document.onmouseup = () => document.onmousemove = document.onmouseup = null;
    };

    return (
        <div className={Styles.ARMVerifier}>
            <div
                ref={panelBlock}
                className={Styles.verificationPanel}
            >
                <VerificationPanel/>
            </div>
            <hr onMouseDown={(e) => reSize(e.clientX)} className={Styles.hr}/>
            <div className={Styles.rightBlock}>
                <PageViewer
                    image={currentPage?.tempJpgFileBytes}
                />
            </div>
        </div>
    );
};

export default ARMVerifier;