import React from 'react';
import { Button } from 'antd';
import { FileTextFilled, SearchOutlined, OrderedListOutlined, PushpinFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store/store';

import Styles from './BatchDetails.module.scss';

const BatchDetails = () => {
    const { currentItem, currentBatch, countItems } = useSelector((state: RootState) => state.batchReducer);

    return (
        <div className={Styles.row}>
            <div className={Styles.topPanel}>
                <div className={Styles.leftButtons}>
                    <Button
                        type="text"
                        icon={<SearchOutlined/>}
                        disabled
                    />
                    <Button
                        type="text"
                        icon={<OrderedListOutlined/>}
                        disabled
                    />
                    <Button
                        type="text"
                        icon={<FileTextFilled/>}
                        disabled
                    />
                </div>
                <div className={Styles.rightButtons}>
                    <Button
                        type="text"
                        icon={<PushpinFilled/>}
                        disabled
                    />
                </div>
            </div>
            <div className={Styles.details}>
                <p>Пакет: {currentItem?.batch?.name || '-'}</p>
                <p>Папка: {currentItem?.folder?.name || '-'}</p>
                <p>Документ: {currentItem?.document?.name || '-'}</p>
                <p>Страница: {currentItem?.page?.name || '-'}</p>
                <hr/>
                <p>Всего страниц: {countItems?.numberOfPages || '-'}</p>
                <p>Всего документов: {countItems?.numberOfDocuments || '-'}</p>
                <p>Всего папок: {currentBatch?.folders.length || '-'}</p>
            </div>
        </div>
    );
};

export default BatchDetails;