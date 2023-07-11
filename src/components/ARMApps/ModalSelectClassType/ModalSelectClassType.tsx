import React, { FC, useEffect, useState } from 'react';
import {Button, Form, message, Modal, Select} from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { batchClassService, useGetFolderClassesQuery } from '../../../services/batchClassService';
import { useAppDispatch } from '../../../store/redux';
import {
    documentService,
    useCreateDocumentMutation,
    useGetDocumentClassQuery
} from '../../../services/documentService';
import { useCreateFolderMutation } from '../../../services/folderService';
import { ICreateFolderRequest } from '../../../services/interface/IFolderService';
import { ICreateDocumentRequest } from '../../../services/interface/IDocumentService';
import { batchService } from '../../../services/batchService';
import { EventDataNode } from 'antd/lib/tree';
import { IFetchBatchResponseData } from '../../../services/interface/IBatchService';
import { useBatchSelection } from '../hooks/useBatchSelection';

interface IModalSelectClassType {
    isModalOpen: boolean
    node?: EventDataNode<any>
    setIsModalOpen: (isVisible:boolean) => void
    isFolder: boolean
    isCreate?: boolean
}

interface IOption {
    value: string
    label: string
}

const ModalSelectClassType: FC<IModalSelectClassType> = ({ isModalOpen, node, setIsModalOpen, isFolder, isCreate=false }) => {
    const [options, setOptions] = useState<IOption[]>([{value: '0', label: ''}]);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    const { currentBatch } = useSelector((state: RootState) => state.batchReducer);
    const { data: folderClasses, isLoading: folderIsLoading } = useGetFolderClassesQuery(currentBatch?.batchClass.id || 0, { skip: !currentBatch?.batchClass.id })
    const { data: docClasses, isLoading: docIsLoading } = useGetDocumentClassQuery(currentBatch?.batchClass.id || 0, { skip: !currentBatch?.batchClass.id })
    const [createFolder] = useCreateFolderMutation();
    const [createDoc] = useCreateDocumentMutation();

    const [form] = Form.useForm();
    const { handleSelectBatch, handleGetBatch } = useBatchSelection();
    const dispatch = useAppDispatch();

    //#region Hendlers
    const handleOk = () => {
        form.submit();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleHelp = () => {
        message.info('Help')
    }
    //#endregion

    const onFinish = (values: any) => {
        if (!currentBatch) return;

        setIsStarted(true);

        const valFolder: ICreateFolderRequest = {
            batchId: currentBatch.id,
            folderClassId: Number(values.classTypes),
            moduleId: 9
        };

        const valDoc: ICreateDocumentRequest = {
            folderId: Number(node.key.split('-')[1]),
            documentClassId: Number(values.classTypes),
            moduleId: 9
        };

        if (isFolder) {
            createFolder(valFolder).unwrap()
                .then((resp) => {
                    if (resp.succeeded) {
                        setIsModalOpen(false);
                        form.resetFields();
                        dispatch(batchService.util.invalidateTags(['Batch']));
                        handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                        handleGetBatch();

                        message.success(`Папка успешно создана!`);
                    } else {
                        console.log(resp)
                        message.error(resp.message);
                    }
                    setIsStarted(false);
                })
                .catch((err) => {
                    console.error(err);
                    message.error(err.data.Message || err.status || err.toString());
                    setIsStarted(false);
                });
        } else {
            createDoc(valDoc).unwrap()
                .then((resp) => {
                    if (resp.succeeded) {
                        setIsModalOpen(false);
                        form.resetFields();
                        dispatch(batchService.util.invalidateTags(['Batch']));
                        handleSelectBatch(currentBatch as unknown as IFetchBatchResponseData);
                        handleGetBatch();

                        message.success(`Документы успешно созданы!`);
                    } else {
                        console.log(resp)
                        message.error(resp.message);
                    }
                    setIsStarted(false);
                })
                .catch((err) => {
                    console.error(err);
                    message.error(err.data.Message || err.status || err.toString());
                    setIsStarted(false);
                });
        }
    };

    useEffect(() => {
        if (!isModalOpen) return;

        dispatch(documentService.util.invalidateTags(['DocumentClasses']));
        dispatch(batchClassService.util.invalidateTags(['FolderClasses']));
    }, [isModalOpen]);

    useEffect(() => form.resetFields(), [options]);

    useEffect(() => {
        const targetClasses = isFolder ? folderClasses : docClasses;

        if (!targetClasses || !targetClasses.succeeded || !targetClasses.data) return;

        const opt: IOption[] = targetClasses.data.map(i => ({value: i.id.toString(), label: i.label}));

        setOptions(opt);
    }, [folderClasses, docClasses, isFolder]);

    return (
        <Modal
            title={`Выбор типа класса ${isFolder ? 'папки' : 'документов'}`}
            onCancel={handleCancel}
            open={isModalOpen}
            style={{minWidth: "300px", width: "fit-сontent"}}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                    loading={isStarted}
                >
                    {isCreate ? 'Создать' : 'Ок'}
                </Button>,
                <Button
                    key="cancel"
                    onClick={handleCancel}
                >
                    Отмена
                </Button>,
                <Button
                    key="help"
                    onClick={handleHelp}
                    disabled
                >
                    Помощь
                </Button>
            ]}
        >
            <Form
                form={form}
                name="ModalSelectClassType"
                onFinish={onFinish}
                initialValues={{
                    classTypes: options[0]?.value
                }}

            >
                <Form.Item
                    name="classTypes"
                    style={{minWidth: "300px"}}
                >
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        loading={folderIsLoading || docIsLoading}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                        }
                        options={options}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalSelectClassType;