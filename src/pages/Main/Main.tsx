import React, { FC, useEffect, useRef, useState } from "react";
import './Main.scss';
import Styles from './Main.module.scss';
import Toolbar from "../../components/ARMApps/Toolbar/Toolbar";
import AppHeader from "../../components/ARMApps/AppHeader/AppHeader";
import BatchPanel from "../../components/ARMApps/BatchPanel/BatchPanel";
import PageViewer from "../../components/ARMApps/PageViewer/PageViewer2";
import BatchDetails from '../../components/ARMApps/BatchDetails/BatchDetails';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import MainTheme from './Main.theme.json';
import { ConfigProvider, Spin, notification } from 'antd';
import { useBatchSelection } from '../../components/ARMApps/hooks/useBatchSelection';
import { useAppDispatch } from '../../store/redux';
import { setIsLoading } from '../../store/reducers/batchSlice';
import ARMVerifier from '../ARMVerifier/ARMVerifier';
import { useNavigate } from 'react-router-dom';

type BlockType = 'left' | 'right';

const Main: FC = () => {
    document.body.classList.add('appPage');
    document.body.classList.remove('logPage');

    const isScanner = window.location.pathname !== '/verification';
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const leftBlock = useRef<HTMLDivElement>(null);
    const rightBlock = useRef<HTMLDivElement>(null);
    const { currentPage } = useSelector(({pageReducer}: RootState) => pageReducer);
    const { currentBatch, isLoading } = useSelector(({batchReducer}: RootState) => batchReducer);
    const { handleSelectBatch, handleGetBatch } = useBatchSelection();

    const dispatch = useAppDispatch();

    const reSize = (clientX: number, blockName: BlockType) => {
        let dragX = clientX;
        let block = blockName === 'left' ? leftBlock.current : rightBlock.current;

        document.onmousemove = function onMouseMove(e) {
            if (block) {
                const deltaX = e.clientX - dragX;
                block.style.width = block.offsetWidth + (blockName === 'left' ? deltaX : -deltaX) + "px";
            }
            dragX = e.clientX;
        }

        document.onmouseup = () => document.onmousemove = document.onmouseup = null;
    }

    const loadApp = () => {
        const moduleId = Number(localStorage.getItem('currentModuleId'));

        if (moduleId && ((isScanner && moduleId !== 9) || (!isScanner && moduleId !== 10))) {
            if (moduleId === 9)
                navigate('/scan');
            if (moduleId === 10)
                navigate('/verification');

            api['warning']({
                message: 'Обнаружена открытая пачка!',
                description:
                    `Что бы перейти в другую рабочую область, необходимо завершить работу с пачкой (закрыть, отложить или удалить).`,
                placement: 'top',
            });
        }

        const batchID = Number(localStorage.getItem('currentBatch'));
        const ofDoc = Number(localStorage.getItem('numberOfDocuments'));
        const ofPage = Number(localStorage.getItem('numberOfPages'));

        if (!batchID) {
            dispatch(setIsLoading(false));

            return;
        }

        handleSelectBatch({id: batchID, numberOfPages: ofPage, numberOfDocuments: ofDoc});
        handleGetBatch();
    };

    useEffect(() => {
        if (currentBatch?.id)
            dispatch(setIsLoading(false));
    }, [currentBatch]);
    useEffect(loadApp, []);

    return (
        <ConfigProvider theme={MainTheme}>
            {contextHolder}
            {isLoading &&
                <div className={Styles.loading}>
                    <Spin tip="Loading" size="large"/>
                </div>
            }

            <div className={Styles.App}>
                <AppHeader/>
                <Toolbar/>
                <div className={Styles.panels}>
                    <div ref={leftBlock} className={Styles.leftPanel}>
                        <BatchPanel/>
                    </div>
                    <hr onMouseDown={(e) => reSize(e.clientX, "left")} className={Styles.hr}/>
                    {isScanner ?
                        <div className={Styles.ARMScanner}>
                            <div className={Styles.centerPanel}>
                                <PageViewer
                                    image={currentPage?.tempJpgFileBytes}
                                />
                            </div>
                            <hr onMouseDown={(e) => reSize(e.clientX, "right")} className={Styles.hr}/>
                            <div ref={rightBlock} className={Styles.rightPanel}>
                                <BatchDetails/>
                            </div>
                        </div>
                    :
                        <ARMVerifier/>
                    }
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Main;