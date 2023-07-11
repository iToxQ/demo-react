import { useEffect, useState } from 'react';
import { FormInstance, message } from 'antd';

import { batchService, useFetchBatchQuery, useGetBatchQuery } from '../../../services/batchService';
import { IFetchBatchResponseData } from '../../../services/interface/IBatchService';
import { useAppDispatch } from '../../../store/redux';
import { selectBatch, setCounts } from '../../../store/reducers/batchSlice';
import { IBatch } from '../../../services/interface/IService';
import useBatchPanel from '../BatchPanel/useBatchPanel';

interface IMiniBatch {
    id: number,
    numberOfDocuments: number
    numberOfPages: number
}

export const useBatchSelection = () => {
    const [selectedBatch, setSelectedBatch] = useState<IFetchBatchResponseData | IMiniBatch |  undefined >();
    const [onGet, setOnGet] = useState<boolean>(false);
    const [moduleId, setModuleId] = useState<number>(9);
    const { clearBatchPanel } = useBatchPanel();
    const { data: batchList, isLoading: batchListIsLoading } = useFetchBatchQuery({ ModuleId: moduleId });
    const { data: currentBatch, isLoading: batchIsLoading, isError } = useGetBatchQuery(selectedBatch?.id ?? 0, { skip: !onGet });
    const dispatch = useAppDispatch();

    const handleSelectBatch = (batch: IFetchBatchResponseData | IMiniBatch, form?: FormInstance) => {
        setSelectedBatch(batch);
        form?.setFieldsValue(batch);
    };

    const handleGetBatch = () => {
        setOnGet(true);
    };

    const handleCancel = () => {
        setOnGet(false);
        setSelectedBatch(undefined);
    };

    const sortBatch = (batch: IBatch) => {
        let sortedBatch: IBatch = JSON.parse(JSON.stringify(batch));

        // tree.folders.sort((a, b) => a.folderNo - b.folderNo); TODO: раскомментить когда исправят нумерацию папок
        sortedBatch.folders.forEach((f) => {
            f.documents.sort((a, b) => a.docNo - b.docNo);
            f.documents.forEach((d) => {
                d.pages.sort((a, b) => a.pageNo - b.pageNo);
            });
        });

        return sortedBatch;
    };

    useEffect(() => {
        if (currentBatch && currentBatch.data) {
            if (currentBatch.succeeded) {
                dispatch(selectBatch(sortBatch(currentBatch.data)));  // с сортировкой по нумерации
                // dispatch(selectBatch(currentBatch.data)); TODO: раскомментить когда сделают сортировку на бэке
                dispatch(batchService.util.invalidateTags(['Batch']));

                dispatch(setCounts({
                    numberOfDocuments: selectedBatch?.numberOfDocuments ?? 0,
                    numberOfPages: selectedBatch?.numberOfPages ?? 0
                }));

                handleCancel();
            } else {
                message.error(currentBatch.message);
            }

            localStorage.setItem('currentBatch', currentBatch.data.id.toString());
            localStorage.setItem('numberOfDocuments', (selectedBatch?.numberOfDocuments ?? 0).toString());
            localStorage.setItem('numberOfPages', (selectedBatch?.numberOfPages ?? 0).toString());
            setOnGet(false);
        }
    }, [currentBatch]);

    useEffect(() => {
        if (isError) {
            clearBatchPanel();
        }
    }, [isError]);

    return {
        selectedBatch,
        batchList,
        batchListIsLoading,
        batchIsLoading,
        handleSelectBatch,
        handleGetBatch,
        handleCancel,
        setModuleId,
    };
};
