import React  from 'react';
import Styles from './VerificationPanel.module.scss';
import GroupBox from '../../../components/UI/GroupBox/GroupBox';

const VerificationPanel = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.namePage}>
                <span>
                    Акт выполненных работ 009
                </span>
            </div>
            <div className={Styles.infoField}>
                <span>
                    0 полей действительно, 0 полей недействительно (60 невидимых полей, 0 полей только для чтения)
                </span>
            </div>
            <div className={Styles.groupBoxList}>
                {Array.from({ length: 14 }, (_, index) => index).map((x, i) =>
                    <GroupBox key={i} title={`Тип комплекта, ответственный [${x}]`} isCollapsible>
                        {x}
                    </GroupBox>
                )}
            </div>
            <div className={Styles.bottom}>
                <div>
                    <div className={Styles.infoField}>
                        <span>
                            Внутренний редактор
                        </span>
                    </div>
                </div>
                <div>
                    <div className={Styles.infoField}>
                        <span>
                            Текущая ошибка
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPanel;