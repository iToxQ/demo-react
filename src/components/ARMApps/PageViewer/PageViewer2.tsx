//https://www.npmjs.com/package/react-zoom-pan-pinch
//https://www.npmjs.com/package/react-easy-panzoom
//https://www.npmjs.com/package/react-viewer

import React, { useRef } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import Styles from './PageViewer.module.scss'
import { Button, message } from 'antd';

import { ReactComponent as PrevAll } from "../../../assets/icons/prevAll.svg"
import { ReactComponent as Prev } from "../../../assets/icons/prev.svg"
import { ReactComponent as Arr1 } from "../../../assets/icons/arr1.svg"
import { ReactComponent as Arr2 } from "../../../assets/icons/arr2.svg"
import { ReactComponent as Next } from "../../../assets/icons/next.svg"
import { ReactComponent as NextAll } from "../../../assets/icons/nextAll.svg"
import { ReactComponent as ZoomOut } from "../../../assets/icons/zoomOut.svg"
import { ReactComponent as ZoomIn } from "../../../assets/icons/zoomIn.svg"
import { ReactComponent as ZoomCancel } from "../../../assets/icons/zoomCancel.svg"
import { ReactComponent as FullView } from "../../../assets/icons/fullView.svg"
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import useBatchPanel from '../BatchPanel/useBatchPanel';
import { batchLevel } from '../../../constants';


const PageViewer = ({ image, initialScale=1 }: any) => {
    const transformComponentRef = useRef<ReactZoomPanPinchRef>(null!);
    const { currentBatch, currentItem } = useSelector((state: RootState) => state.batchReducer);
    const { selectedPagePos } = useSelector((state: RootState) => state.pageReducer);
    const { onSelect } = useBatchPanel();

    const zoomToImage = () => {
        const { zoomToElement } = transformComponentRef.current;
        zoomToElement('imgExample');
    }

    const handlerPrevAll = () => {
        if (!currentBatch) return;

        const pageId = currentBatch.folders[0].documents[0].pages[0].id;

        const key = `${batchLevel.page}-${pageId}`;

        setSelect(key, 0, 0, 0);
    };

    const handlerPrev = () => {
        if (!currentBatch) return;

        const indices = selectedPagePos.split('-').map(Number);

        if (indices.length < 5) {
            while (indices.length !== 5) {
                indices.push(0);
            }
        }

        let [_, __, folderPos, documentsPos, pagePos] = indices;
        let pageId;

        const getDetails = (fPos: number, dPos: number, pPos: number) => {
            const folder = currentBatch.folders[fPos];
            const document = folder.documents[dPos];
            const page = document.pages[pPos];

            return { page, fPos, dPos, pPos };
        }

        if (pagePos) {
            ({ page: { id: pageId } } = getDetails(folderPos, documentsPos, pagePos - 1));
            pagePos--;
        } else if (documentsPos) {
            const pPos = currentBatch.folders[folderPos].documents[documentsPos - 1].pages.length - 1;
            ({ page: { id: pageId }, dPos: documentsPos, pPos: pagePos } = getDetails(folderPos, documentsPos - 1, pPos));
        } else if (folderPos) {
            const dPos = currentBatch.folders[folderPos - 1].documents.length - 1;
            const pPos = currentBatch.folders[folderPos - 1].documents[dPos].pages.length - 1;
            ({ page: { id: pageId }, fPos: folderPos, dPos: documentsPos, pPos: pagePos } = getDetails(folderPos - 1, dPos, pPos));
        } else {
            const fPos = currentBatch.folders.length - 1;
            const dPos = currentBatch.folders[fPos].documents.length - 1;
            const pPos = currentBatch.folders[fPos].documents[dPos].pages.length - 1;
            ({ page: { id: pageId }, fPos: folderPos, dPos: documentsPos, pPos: pagePos } = getDetails(fPos, dPos, pPos));
        }

        const key = `${batchLevel.page}-${pageId}`;

        setSelect(key, folderPos, documentsPos, pagePos);
    };

    const handlerNext = () => {
        if (!currentBatch) return;

        const indices = selectedPagePos.split('-').map(Number);

        if (indices.length < 5) {
            while (indices.length !== 5) {
                indices.push(0);
            }
        }

        let [_, __, folderPos, documentsPos, pagePos] = indices;
        let pageId: number;

        const getDetails = (fPos: number, dPos: number, pPos: number) => {
            const folder = currentBatch.folders[fPos];
            const document = folder.documents[dPos];
            const page = document.pages[pPos];

            return { page, fPos, dPos, pPos };
        }

        const folderLength = currentBatch.folders.length - 1;
        const documentsLength = currentBatch.folders[folderPos].documents.length - 1;
        const pageLength = currentBatch.folders[folderPos].documents[documentsPos].pages.length - 1;

        if (pagePos !== pageLength) {
            ({ page: { id: pageId } } = getDetails(folderPos, documentsPos, pagePos + 1));
            pagePos++;
        } else if (documentsPos !== documentsLength) {
            ({ page: { id: pageId }, dPos: documentsPos, pPos: pagePos } = getDetails(folderPos, documentsPos + 1, 0));
            pagePos = 0;
        } else if (folderPos !== folderLength) {
            ({ page: { id: pageId }, fPos: folderPos, dPos: documentsPos, pPos: pagePos } = getDetails(folderPos + 1, 0, 0));
            documentsPos = 0;
            pagePos = 0;
        } else {
            ({ page: { id: pageId }, fPos: folderPos, dPos: documentsPos, pPos: pagePos } = getDetails(0, 0, 0));
            folderPos = 0;
            documentsPos = 0;
            pagePos = 0;
        }

        const key = `${batchLevel.page}-${pageId}`;

        setSelect(key, folderPos, documentsPos, pagePos);
    };

    const handlerNextAll = () => {
        if (!currentBatch) return;

        const folderLength = currentBatch.folders.length - 1 || 0;
        const folder = currentBatch.folders[folderLength];

        const documentsLength = folder?.documents.length - 1;
        const documents = folder?.documents[documentsLength];

        const pageLength = documents?.pages.length - 1;
        const pageId = documents?.pages[pageLength].id;

        const key = `${batchLevel.page}-${pageId}`;

        setSelect(key, folderLength, documentsLength, pageLength);
    };

    const setSelect = (key: React.Key, folderPos: number, documentsPos: number, pagePos: number) => {
        const info = {
            event: 'select' as any,
            selected: true,
            selectedNodes: [],
            nativeEvent: new MouseEvent('click'),
            node: {
                key: key,
                pos: `0-0-${folderPos}-${documentsPos}-${pagePos}`
            }
        };

        onSelect([key], info);
    };

    const Control = ({ zoomIn, zoomOut, resetTransform }: any) => [
        { onClick: () => handlerPrevAll(), children: <PrevAll /> },
        { onClick: () => handlerPrev(), children: <Prev /> },
        { onClick: () => handlerNext(), children: <Next /> },
        { onClick: () => handlerNextAll(), children: <NextAll /> },

        { onClick: () => zoomIn(), children: <ZoomIn /> },
        { onClick: () => zoomOut(), children: <ZoomOut /> },
        { onClick: () => resetTransform(), children: <ZoomCancel /> },
        { onClick: () => resetTransform(), children: <FullView /> },
    ];

    return (
        <TransformWrapper
            initialScale={initialScale}
            //centerOnInit={true}
            centerZoomedOut={true}
            initialPositionX={20}
            initialPositionY={20}
            minScale={initialScale}

            ref={transformComponentRef}
        >
            {(utils) => (
                <>
                    <div className={Styles.navi}>
                        {Control(utils).map((btn, index) =>
                            <Button
                                type="text"
                                onClick={btn.onClick}
                                key={index}
                                disabled={!currentItem?.page}
                            >
                                {btn.children}
                            </Button>
                        )}
                    </div>
                    <TransformComponent wrapperClass={Styles.canvas} contentClass={image && Styles.page}>
                        {image &&
                            <img
                                src={`data:image/jpeg;base64,${image}`}
                                alt="preview"
                                id="imgExample"
                                style={{
                                    width: "100%",
                                    boxShadow: "3px 3px 16px 4px rgb(0 0 0 / 8%)"
                                }}/>
                        }

                    </TransformComponent>
                </>
            )}
        </TransformWrapper>
    );
}


export default PageViewer