import React, { FC } from 'react';
import { Modal } from 'antd';

interface IConfirmationModal {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    title: string;
    description: string | React.ReactNode;
    callback?: () => void;
}

const ModalConfirmation: FC<IConfirmationModal> = ({title, description, callback, isModalOpen, setIsModalOpen}) => {
    const handlerOk = () => {
        if (callback) callback();
        setIsModalOpen(false);
    };
    const handlerCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handlerOk}
            onCancel={handlerCancel}
            okText="Ок"
            cancelText="Отмена"
        >
            {description}
        </Modal>
    );
};

export default ModalConfirmation;