import {Button, DatePicker, Form, Input, InputNumber, message, Select} from 'antd';
import Modal from 'antd/es/modal/Modal';
import React, {FC, ReactNode, useEffect, useState} from 'react';
import Styles from './ModalBatchCreate.module.scss'
import GroupBox from '../../UI/GroupBox/GroupBox';
import {useFetchBatchClassesQuery, useGetBatchClassQuery} from '../../../services/batchClassService';
import {useCreateBatchUIScanMutation} from '../../../services/batchService';
import {ICreateBatchUIScanRequest} from '../../../services/interface/IBatchService';
import {IBatchClassField} from '../../../services/interface/IService';
import {useAppDispatch} from '../../../store/redux';
import {selectBatch} from '../../../store/reducers/batchSlice';
import dayjs from 'dayjs';

interface ICreateBatchModal {
    isModalOpen: boolean
    setIsModalOpen: (isVisible:boolean) => void
}

const ModalBatchCreate: FC<ICreateBatchModal> = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const [batchClassId, setBatchClassId] = useState<number>(0);
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [batchFieldsForm, setBatchFieldsForm] = useState<ReactNode>(undefined);
    const {data: currentBatchClass} = useGetBatchClassQuery(batchClassId, { skip: !batchClassId });
    const {data: batchClasses, isLoading} = useFetchBatchClassesQuery('');
    const [createBatchUIScan] = useCreateBatchUIScanMutation();
    const dispatch = useAppDispatch();

    //#region Handles
    const handleOk = () =>  {
        form.submit();
    }
    const handleCancel = () =>  {
        setIsModalOpen(false);
        form.resetFields();
        setBatchFieldsForm(undefined);
        setBatchClassId(0);
    }
    const handleScan = () =>  {
        message.info('Scan');
    }
    const handleHelp = () =>  {
        message.info('Help');
    }
    //#endregion

    const onCreateBatchUIScan = async (values: ICreateBatchUIScanRequest) => {
        if (!currentBatchClass || !currentBatchClass.data) {
            return;
        }

        const fields: IBatchClassField[] = currentBatchClass.data.batchClassFields;

        values.batchFields = fields.map(field => {
            let val: string = values[field.name as keyof ICreateBatchUIScanRequest]?.toString() || '';

            if (field.fieldType.name === "DateTimeWOtz") {
                val = dayjs(val).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            }

            return {
                value: val,
                batchClassFieldId: field.id
            };
        });

        setIsCreate(true);

        createBatchUIScan(values).unwrap()
            .then((resp) => {
                if (resp.succeeded) {
                    setIsModalOpen(false);
                    form.resetFields();

                    message.success(`Пачка успешно создана!`);

                    localStorage.setItem('currentModuleId', '9');

                    if (resp.data) {
                        dispatch(selectBatch(resp?.data));
                    } else {
                        message.error(`Не удалось получить пачку`);
                    }

                } else {
                    message.error(resp.message);
                }
                setIsCreate(false);
            })
            .catch((err) => {
                console.error(err);
                message.error(err.data.Message || err.status || err.toString());
                setIsCreate(false);
            })
    };

    useEffect(() => {
        if (!currentBatchClass?.succeeded || currentBatchClass.data == null) {
            currentBatchClass?.message &&
            message.error(currentBatchClass?.message);

            return;
        }

        const batchFields = currentBatchClass.data.batchClassFields;

        const fieldType = (type: string) => {
            switch (type) {
                case 'Integer':
                    return (<InputNumber max={2147483647} min={0}/>);
                case type.match(/^String(\d+)$/)?.[0]:
                    const maxLength = Number(type.substring(6));
                    return (<Input maxLength={maxLength}/>);
                case 'DateTimeWOtz':
                    return (<DatePicker />);
            }
        }

        const form = batchFields.map((batchField) => (
            !batchField.isHidden &&
            <Form.Item
                label={batchField.label}
                name={batchField.name}
                labelCol={{ span: 7 }}
                key={batchField.id}
                rules={[{ required: !batchField.isNullable, message: 'Please input!' }]}
            >
                {fieldType(batchField.fieldType.name)}
            </Form.Item>
        ));

        setBatchFieldsForm(form);
    }, [currentBatchClass])

    return (
        <Modal
            title="Создать пачку"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                    loading={isCreate}
                >
                    Ок
                </Button>,
                <Button
                    key="cancel"
                    onClick={handleCancel}
                >
                    Отменить
                </Button>,
                <Button
                    disabled
                    key="scan"
                    onClick={handleScan}
                >
                    Сканировать
                </Button>,
                <Button
                    key="help"
                    onClick={handleHelp}
                >
                    Помощь
                </Button>
            ]}
            width={745}
        >
            <Form
                form={form}
                name="CreateBatch"
                labelCol={{ span: 5 }}
                autoComplete="off"
                initialValues={{priority: 0}}
                onFinish={onCreateBatchUIScan}
            >
                <Form.Item
                    label="Класс пачки"
                    style={{marginBottom: "0"}}
                >
                    <Input.Group
                        compact={true}
                        style={{display: "flex"}}
                    >
                            <Form.Item
                                name="batchClassId"
                                style={{flex: "1"}}
                            >
                                <Select
                                    placeholder="Select batch class"
                                    options={batchClasses?.data?.map(batchClass => ({
                                        value: batchClass.id,
                                        label: batchClass.label
                                    }))}
                                    onChange={(val) => setBatchClassId(val)}
                                    loading={isLoading}
                                    disabled={isLoading}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Приоритет"
                                name="priority"
                                className={Styles.priority}
                            >
                                <InputNumber min={1} max={10}/>
                            </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.Item
                    label="Описание"
                    name="description"
                >
                    <Input allowClear />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            Название&nbsp;
                        </span>
                    }
                    name="name"
                    rules={[{ required: true, message: 'Пожалуйста, заполните поле "Название"!' }]}
                >
                    <Input />
                </Form.Item>

                <GroupBox title="Batch Fields" isStart isEnd>
                    <div className={Styles.batchFields}>
                        {batchFieldsForm}
                    </div>
                </GroupBox>
            </Form>
        </Modal>
    );
};

export default ModalBatchCreate;