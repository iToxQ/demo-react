import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import {
    CaretDownOutlined, FileDoneOutlined,
    LoginOutlined,
    QuestionCircleOutlined, ScanOutlined,
    SettingOutlined,
    UserOutlined,
    SwitcherOutlined,
    BarChartOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../../store/redux';
import { logout } from '../../../store/reducers/authSlice';
import ModalOptions from '../ModalOptions/ModalOptions';
import { useNavigate } from 'react-router-dom';

const HeaderUserMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isModalOptions, setIsModalOptions] = useState(false);
    const isScan = window.location.pathname !== '/verification';
    const navigate = useNavigate();
    
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Профиль',
            disabled: true,
            icon: <UserOutlined/>
        },
        {
            key: '2',
            label: 'Помощь',
            disabled: true,
            icon: <QuestionCircleOutlined/>
        },
        {
            type: 'divider',
        },
        {
            key: '5',
            label: 'Админпанель',
            icon: <TeamOutlined />,
            onClick: () => navigate('/admin/users'),
        },
        {
            key: '6',
            label: 'Дашборд',
            icon: <BarChartOutlined />,
            onClick: () => navigate('/admin/dash'),
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: 'Настройки',
            icon: <SettingOutlined/>,
            onClick: () => setIsModalOptions(true)
        },
        {
            key: '4',
            label: 'Сменить АРМ',
            icon: <SwitcherOutlined />,
            style: {width: '150px'},
            children: [
                {
                    key: '4-1',
                    label: 'Сканировщик',
                    disabled: isScan,
                    icon: <ScanOutlined />,
                    onClick: () => navigate('/scan'),
                },
                {
                    key: '4-2',
                    label: 'Верификатор',
                    disabled: !isScan,
                    icon: <FileDoneOutlined />,
                    onClick: () => navigate('/verification'),
                }
            ]
        },
        {
            type: 'divider',
        },
        {
            key: '7',
            label: 'Выйти',
            icon: <LoginOutlined/>,
            onClick: () => dispatch(logout())
        },
    ];

    return (
        <>
            <Dropdown menu={{items}}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space align="center">
                        <Avatar size="small" icon={<UserOutlined/>} style={{backgroundColor: '#2e33b7'}}/>
                        Administrator
                        <CaretDownOutlined/>
                    </Space>
                </a>
            </Dropdown>
            
            <ModalOptions isModalOpen={isModalOptions} setIsModalOpen={setIsModalOptions} />
        </>
    );
};

export default HeaderUserMenu;