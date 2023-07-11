import React, { ReactElement, useState } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { ReactComponent as Add } from "../../../assets/icons/add.svg"
import { ReactComponent as Open } from "../../../assets/icons/open.svg"
import { ReactComponent as Close } from "../../../assets/icons/close.svg"
import { ReactComponent as Pause } from "../../../assets/icons/pause.svg"
import { ReactComponent as Scan } from "../../../assets/icons/scan.svg"
import { ReactComponent as ScanAll } from "../../../assets/icons/scanAll.svg"
import { ReactComponent as StopScan } from "../../../assets/icons/stopScan.svg"
import { ReactComponent as ChangePage } from "../../../assets/icons/changePage.svg"
import { ReactComponent as DelPage } from "../../../assets/icons/delPage.svg"
import { ReactComponent as RejectPage } from "../../../assets/icons/rejectPage.svg"
import { ReactComponent as AcceptPage } from "../../../assets/icons/acceptPage.svg"
import { ReactComponent as SplitPages } from "../../../assets/icons/splitPages.svg"
import { ReactComponent as UnitePages } from "../../../assets/icons/unitePages.svg"
import { ReactComponent as ChangeClass } from "../../../assets/icons/changeClass.svg"

import Styles from './Toolbar.module.scss';
import NavbarGroup from './NavbarGroup/NavbarGroup';
import ModalBatchOpen from '../ModalBatchOpen/ModalBatchOpen';
import ModalScanSource from '../ModalScanSource/ModalScanSource';
import ModalBatchCreate from '../ModalBatchCreate/ModalBatchCreate';
import ModalSelectClassType from '../ModalSelectClassType/ModalSelectClassType';
import { RootState } from '../../../store/store';
import {
    batchService,
    useCloseBatchMutation,
    useRemoveBatchMutation,
    useScanSuspendBatchMutation
} from '../../../services/batchService';
import useBatchPanel from '../BatchPanel/useBatchPanel';
import { useRemovePageMutation } from '../../../services/pageService';
import { useBatchSelection } from '../hooks/useBatchSelection';
import { IFetchBatchResponseData } from '../../../services/interface/IBatchService';
import { useRemoveDocumentMutation } from '../../../services/documentService';
import { useRemoveFolderMutation } from '../../../services/folderService';
import ModalConfirmation from './ModalConfirmation/ModalConfirmation';
import { useAppDispatch } from '../../../store/redux';
import { setCheckedKeys, setIsLoading } from '../../../store/reducers/batchSlice';


// import '../../../utils/scanner.js';
// import scanner from 'scanner.js';

const clickTEST = () => message.info('Navbar button')

interface IPopConfirm {
    title: string;
    description: string;
    icon?: React.ReactNode;
    hidden?: boolean;
}

interface IToolbarButton {
    id: number;
    label: string;
    icon: ReactElement;
    disabled?: boolean;
    onClick: () => void;
    popConfirm?: IPopConfirm;
}

interface IToolbarButtonGroup {
    id: number;
    label: string;
    isHidden?: boolean;
    buttons: IToolbarButton[];
}

const Toolbar = () => {
    const [isModalCreateBatch, setIsModalCreateBatch] = useState(false);
    const [isModalOpenScanSource, setIsModalOpenScanSource] = useState(false);
    const [isModalBatchOpen, setIsModalBatchOpen] = useState(false);
    const [isModalSelectClassType, setIsModalSelectClassType] = useState(false);

    const [isModalConfirmation, setIsModalConfirmation] = useState(false);
    const [titleModalConfirmation, setTitleModalConfirmation] = useState('');
    const [descriptionModalConfirmation, setDescriptionModalConfirmation] = useState('');
    const [callbackModalConfirmation, setCallbackModalConfirmation] = useState<()=>void>();

    const { clearBatchPanel } = useBatchPanel();
    const { handleGetBatch, handleSelectBatch } = useBatchSelection();

    const { currentItem, currentBatch, checkedKeys } = useSelector(({ batchReducer }: RootState) => batchReducer);
    const { confirmations } = useSelector(({ settingsReducer }: RootState) => settingsReducer);
    const [closeBatch] = useCloseBatchMutation();
    const [scanSuspendBatch] = useScanSuspendBatchMutation();
    const [removePage] = useRemovePageMutation();
    const [removeDocuments] = useRemoveDocumentMutation();
    const [removeFolder] = useRemoveFolderMutation();
    const [removeBatch] = useRemoveBatchMutation();

    const dispatch = useAppDispatch();
    const isScan = window.location.pathname !== '/verification';

    //#region Handlers
    const handlerCloseBatch = () => {
        if (!currentBatch) return;

        closeBatch(currentBatch?.id).unwrap()
            .then((resp) => {
                if (resp.succeeded) {
                    clearBatchPanel();
                    localStorage.setItem('currentBatch', '0');

                    message.success('Пачка успешно закрыта!');
                } else {
                    message.error(resp.message);
                }
            })
            .catch((err) => {
                console.error(err);
                message.error(err.data.Message || err.status || err.toString());
            })
    };

    const handlerScanSuspendBatch = () => {
        if (!currentBatch) return;

        scanSuspendBatch(currentBatch?.id).unwrap()
            .then((resp) => {
                if (resp.succeeded) {
                    clearBatchPanel();
                    localStorage.setItem('currentBatch', '0');

                    message.success('Пачка успешно отложена!');
                } else {
                    message.error(resp.message);
                }
            })
            .catch((err) => {
                console.error(err);
                message.error(err.data.Message || err.status || err.toString());
            })
    };

    const handlerDelPage = () => {
        if (!currentBatch) return;

        const delItem = (keys: React.Key[]) => {
            return new Promise((resolve, reject) => {
                if (!keys.length) {
                    resolve(false);
                    return;
                }

                const code: string = keys[0].toString().split('-')[0];
                const ids: number[] = keys.map(key => Number(key.toString().split('-')[1]));

                //#region Callback's
                const rBatch = () => {
                    dispatch(setIsLoading(true));

                    removeBatch(ids).unwrap()
                        .then((resp) => {
                            if (resp.succeeded) {
                                handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                                handleGetBatch();
                                clearBatchPanel();

                                dispatch(batchService.util.invalidateTags(['Batch']));
                                dispatch(setIsLoading(false));

                                message.success('Пачка успешно удалена!');
                            } else {
                                dispatch(setIsLoading(false));
                                message.error(resp.message);
                            }
                            resolve(true);
                        })
                        .catch((err) => {
                            console.error(err);
                            message.error(err.data.Message || err.status || err.toString());
                            resolve(true);
                            dispatch(setIsLoading(false));
                        })
                };

                const rFolder = () => removeFolder(ids).unwrap()
                    .then((resp) => {
                        if (resp.succeeded) {
                            handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                            handleGetBatch();
                            dispatch(batchService.util.invalidateTags(['Batch']));

                            message.success('Папка успешно удалена!');
                        } else {
                            message.error(resp.message);
                        }
                        resolve(true);
                    })
                    .catch((err) => {
                        console.error(err);
                        message.error(err.data.Message || err.status || err.toString());
                        resolve(true);
                    });

                const rDocuments = () => removeDocuments(ids).unwrap()
                    .then((resp) => {
                        if (resp.succeeded) {
                            handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                            handleGetBatch();
                            dispatch(batchService.util.invalidateTags(['Batch']));

                            message.success('Документы успешно удалены!');
                        } else {
                            message.error(resp.message);
                        }
                        resolve(true);
                    })
                    .catch((err) => {
                        console.error(err);
                        message.error(err.data.Message || err.status || err.toString());
                        resolve(true);
                    });

                const rPage = () => removePage(ids).unwrap()
                    .then((resp) => {
                        if (resp.succeeded) {
                            handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                            handleGetBatch();
                            dispatch(batchService.util.invalidateTags(['Batch']));

                            message.success('Страница успешно удалена!');
                        } else {
                            message.error(resp.message);
                        }
                        resolve(true);
                    })
                    .catch((err) => {
                        console.error(err);
                        message.error(err.data.Message || err.status || err.toString());
                        resolve(true);
                    });
                //#endregion

                switch (code) {
                    case '0':
                        if (confirmations.deletingBatch) {
                            showModalConfirmation(
                                'Подтверждение',
                                'Вы точно хотите удалить выбранную пачку?',
                                rBatch
                            );
                        }
                        else {
                            rBatch();
                        }
                        break;
                    case '1':
                        if (confirmations.deletingFolder)
                            showModalConfirmation(
                                'Подтверждение',
                                'Вы точно хотите удалить выбранную папку?',
                                rFolder
                            );
                        else
                            rFolder();
                        break;
                    case '2':
                        if (confirmations.deletingDocument)
                            showModalConfirmation(
                                'Подтверждение',
                                'Вы точно хотите удалить выбранные документы?',
                                rDocuments
                            );
                        else
                            rDocuments();
                        break;
                    case '3':
                        if (confirmations.deletingPage) {
                            showModalConfirmation(
                                'Подтверждение',
                                `Вы точно хотите удалить страниц${ids.length === 1 ? 'у' : 'ы'}?`,
                                rPage
                            );
                        }
                        else {
                            rPage();
                        }
                        break;
                }
            });
        };

        if (checkedKeys.length > 0) {
            const bathes: React.Key[] = [];
            const files: React.Key[] = [];
            const documents: React.Key[] = [];
            const pages: React.Key[] = [];

            checkedKeys.forEach(key => {
                switch (key.toString().split('-')[0]) {
                    case '0':
                        bathes.push(key);
                        break;
                    case '1':
                        files.push(key);
                        break;
                    case '2':
                        documents.push(key);
                        break;
                    case '3':
                        pages.push(key);
                        break;
                }
            });

            delItem(pages).then(() =>
                delItem(documents).then(() =>
                    delItem(files).then(() =>
                        delItem(bathes).then(() => dispatch(setCheckedKeys([])))
                    )
                )
            );
        } else if (currentItem?.key) {
            delItem(currentItem?.key).then(() => dispatch(setCheckedKeys([])));
        }


    };
    //#endregion

    const showModalConfirmation = (title: string, desc: string, call: () => void) => {
        setTitleModalConfirmation(title);
        setDescriptionModalConfirmation(desc);
        setCallbackModalConfirmation(() => call);
        setIsModalConfirmation(true);
    };

    const ToolbarButtonsGroups: IToolbarButtonGroup[] = [
        {
            id: 10100,
            label: 'Пакет',
            buttons: [
                {
                    id: 10101,
                    label: 'Создать',
                    icon: <Add/>,
                    disabled: !isScan,
                    onClick: () => setIsModalCreateBatch(true)
                },
                {
                    id: 10102,
                    label: 'Открыть',
                    icon: <Open/>,
                    onClick: () => setIsModalBatchOpen(true)
                },
                {
                    id: 10103,
                    label: 'Закрыть',
                    icon: <Close/>,
                    disabled: !currentBatch || currentBatch.id === 0,
                    onClick: () => handlerCloseBatch(),
                    popConfirm: {
                        title: 'Закрытие пачки',
                        description: 'Вы точно хотите закрыть текущую пачку?',
                        icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
                        hidden: !confirmations.closingBatch
                    }
                },
                {
                    id: 10104,
                    label: 'Отложить',
                    icon: <Pause/>,
                    disabled: !currentBatch || currentBatch.id === 0,
                    onClick: () => handlerScanSuspendBatch()
                }
            ]
        },
        {
            id: 10200,
            label: 'Сканирование',
            isHidden: !isScan,
            buttons: [
                {
                    id: 10201,
                    label: 'Сканировать',
                    icon: <Scan/>,
                    disabled: !currentItem?.batch,
                    onClick: () => setIsModalOpenScanSource(true)
                },
                {
                    id: 10202,
                    label: 'Сканировать\nвсе',
                    icon: <ScanAll/>,
                    disabled: true,
                    onClick: clickTEST
                },
                {
                    id: 10203,
                    label: 'Остановить',
                    icon: <StopScan/>,
                    disabled: true,
                    onClick: clickTEST
                },
                {
                    id: 10203,
                    label: 'Заменить',
                    icon: <ChangePage/>,
                    disabled: true,
                    onClick: clickTEST
                }
            ]
        },
        {
            id: 10300,
            label: 'Редактировать',
            buttons: [
                {
                    id: 10301,
                    label: 'Удалить',
                    icon: <DelPage/>,
                    disabled: !currentItem?.batch && !checkedKeys.length,
                    onClick: handlerDelPage
                },
                {
                    id: 10302,
                    label: 'Пометить ошибочным',
                    icon: <RejectPage/>,
                    disabled: true,
                    onClick: clickTEST
                },
                {
                    id: 10303,
                    label: 'Снять ошибку',
                    icon: <AcceptPage/>,
                    disabled: true,
                    onClick: clickTEST
                }
            ]
        },
        {
            id: 10700,
            label: 'Папка',
            buttons: [
                {
                    id: 10701,
                    label: 'Изменить\nкласс',
                    icon: <ChangeClass/>,
                    disabled: true,
                    onClick: () => setIsModalSelectClassType(true)
                }
            ]
        },
        {
            id: 10800,
            label: 'Документ',
            buttons: [
                {
                    id: 10801,
                    label: 'Разделить',
                    icon: <SplitPages/>,
                    disabled: true,
                    onClick: clickTEST
                },
                {
                    id: 10802,
                    label: 'Объединить',
                    icon: <UnitePages/>,
                    disabled: true,
                    onClick: clickTEST
                }
            ]
        }
    ]

    return (
        <>
            <div className={Styles.Navbar__panel}>
                <div className={Styles.Navbar__panel_left}>
                    {ToolbarButtonsGroups.map((group) =>
                        !group.isHidden && <NavbarGroup group={group} key={group.label}/>
                    )}
                </div>
                <div className={Styles.Navbar__panel_right}/>
            </div>

            <ModalConfirmation
                isModalOpen={isModalConfirmation}
                setIsModalOpen={setIsModalConfirmation}
                title={titleModalConfirmation}
                description={descriptionModalConfirmation}
                callback={callbackModalConfirmation}
            />

            <ModalBatchCreate isModalOpen={isModalCreateBatch} setIsModalOpen={setIsModalCreateBatch}/>
            <ModalScanSource isModalOpen={isModalOpenScanSource} setIsModalOpen={setIsModalOpenScanSource}/>
            <ModalBatchOpen isModalOpen={isModalBatchOpen} setIsModalOpen={setIsModalBatchOpen}/>
            <ModalSelectClassType isModalOpen={isModalSelectClassType} setIsModalOpen={setIsModalSelectClassType}
                                  isFolder={true}/>
        </>
    );
}

export default Toolbar;
