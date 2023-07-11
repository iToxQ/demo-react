import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { IUser } from '../../../services/interface/IService';
import { batchStatus } from '../../../constants';
import { IFetchBatchResponseData } from '../../../services/interface/IBatchService';
import { useBatchSelection } from '../hooks/useBatchSelection';

import Styles from './ModalBatchOpen.module.scss';
import { useAppDispatch } from '../../../store/redux';
import { batchService } from '../../../services/batchService';


interface IModalBatchOpen {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

interface ColumnWidths {
    [key: string]: number;
}

const ModalBatchOpen: FC<IModalBatchOpen> = ({ isModalOpen, setIsModalOpen }) => {
    const [columnWidths, setColumnWidths] = useState<ColumnWidths>({
        name: 200,
        creationUser: 100,
        creationDateTime: 200,
        status: 100,
        priority: 100
    });

    const {
        selectedBatch,
        batchList,
        batchListIsLoading,
        batchIsLoading,
        handleSelectBatch,
        handleGetBatch,
        handleCancel,
        setModuleId,
    } = useBatchSelection();

    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const moduleId = window.location.pathname !== '/verification' ? 9 : 10;

    const handleColumnResize = (columnKey: any, width: any) => {
        setColumnWidths({
            ...columnWidths,
            [columnKey]: width,
        });
    };

    const handleResizeStart = (event: {clientX: any;}, columnKey: string | number) => {
        const initialMouseX = event.clientX;

        const handleMouseMove = (event: {clientX: number;}) => {
            const deltaX = event.clientX - initialMouseX;
            const newWidth = columnWidths[columnKey] + deltaX;
            handleColumnResize(columnKey, newWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const columns: ColumnsType<IFetchBatchResponseData> = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: columnWidths.name,
            onHeaderCell: () => ({
                onMouseDown: (event) => handleResizeStart(event, 'name'),
            }),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Создатель',
            dataIndex: 'creationUser',
            key: 'creationUser',
            width: columnWidths.creationUser,
            onHeaderCell: () => ({
                onMouseDown: (event) => handleResizeStart(event, 'creationUser'),
            }),
            sorter: (a, b) => {
                const nameA = `${a.creationUser.lastname} ${a.creationUser.firstname} ${a.creationUser.middlename}`.toUpperCase();
                const nameB = `${b.creationUser.lastname} ${b.creationUser.firstname} ${b.creationUser.middlename}`.toUpperCase();
                return nameA.localeCompare(nameB);
            },
            render: (user: IUser) => <>{user.lastname} {user.firstname} {user.middlename}</>,
        },
        {
            title: 'Дата и время',
            dataIndex: 'creationDateTime',
            key: 'creationDateTime',
            width: columnWidths.creationDateTime,
            onHeaderCell: () => ({
                onMouseDown: (event) => handleResizeStart(event, 'creationDateTime'),
            }),
            render: (_, batch) => new Date(batch.modifyDateTime || batch.creationDateTime).toLocaleString(),
            sorter: (a, b) =>
                new Date(a.modifyDateTime || a.creationDateTime).getTime()
                -
                new Date(b.modifyDateTime || b.creationDateTime).getTime(),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: columnWidths.status,
            onHeaderCell: () => ({
                onMouseDown: (event) => handleResizeStart(event, 'status'),
            }),
            render: (status) => batchStatus[status],
            sorter: (a, b) => a.status - b.status,
        },
        {
            title: 'Приоритет',
            dataIndex: 'priority',
            key: 'priority',
            width: columnWidths.priority,
            onHeaderCell: () => ({
                onMouseDown: (event) => handleResizeStart(event, 'priority'),
            }),
            sorter: (a, b) => a.priority - b.priority,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
    ];

    const handleOk = async () => {
        localStorage.setItem('currentModuleId', moduleId.toString());

        handleGetBatch();
    };

    const handleModalCancel = () => {
        if (batchIsLoading) return;

        handleCancel();
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleHelp = () => {
        message.info('Help');
    };

    useEffect(() => {
        if (!batchIsLoading) handleModalCancel();
    }, [batchIsLoading]);

    useEffect(() => {
        if (isModalOpen) {
            dispatch(batchService.util.invalidateTags(['Batches']));
        }
    }, [isModalOpen]);

    useEffect(() => {
        setModuleId(moduleId);
    }, []);

    return (
        <Modal
            className={Styles.ModalBatchOpen}
            open={isModalOpen}
            onCancel={handleModalCancel}
            footer={null}
            closable={false}
        >
            <div className={Styles.resizeBlock}>
                <h4 className={Styles.pTitle}>Открыть пачку</h4>
                <div className={Styles.tableWrapper}>
                    <Button
                        id={Styles.closeModal}
                        onClick={handleModalCancel}
                    >
                        ×
                    </Button>
                    <Button
                        id={Styles.ok}
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={batchIsLoading}
                        disabled={!selectedBatch}
                    >
                        Ок
                    </Button>
                    <Button id={Styles.cancel} key="cancel" onClick={handleModalCancel}>
                        Отменить
                    </Button>
                    <Button id={Styles.help} key="help" onClick={handleHelp}>
                        Помощь
                    </Button>
                    <Table
                        dataSource={batchList?.data || undefined}
                        rowKey="id"
                        columns={columns}
                        className={Styles.table}
                        scroll={{ y: 270, x: 1000 }}
                        size={'small'}
                        pagination={false}
                        rowSelection={{
                            selectedRowKeys: [selectedBatch ? selectedBatch.id : 0],
                            columnWidth: 0,
                            type: 'radio',
                        }}
                        onRow={(record) => {
                            return { onClick: () => !batchIsLoading && handleSelectBatch(record, form) };
                        }}
                        loading={batchListIsLoading}
                    />
                </div>
                <div className={Styles.formWrapper}>
                    <Form name="ModalBatchOpen" className={Styles.Form} form={form}>
                        <Form.Item label="Описание" name="description">
                            <Input disabled/>
                        </Form.Item>
                        <div style={{ display: 'flex' }}>
                            <Form.Item label="Количество документов" name="numberOfDocuments">
                                <InputNumber disabled/>
                            </Form.Item>
                            <Form.Item label="Количество страниц" name="numberOfPages">
                                <InputNumber disabled/>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default ModalBatchOpen;