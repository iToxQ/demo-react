import React, { useState } from 'react';
import { message, Menu, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {ScanOutlined, FileDoneOutlined} from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
        <a href="/Scan">
            <ScanOutlined /> Scan
        </a>
    ),
  },
  {
    key: '2',
    label: (
        <a href="/verification">
            <FileDoneOutlined /> Verification
        </a>
    ),
  },
];

const HeaderMenu: React.FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const isScan = window.location.pathname !== '/verification';

  return (
      <Dropdown menu={{ items }}>
        <div>
          {isScan ? <ScanOutlined /> : <FileDoneOutlined />}
        </div>
      </Dropdown>
  );
};

export default HeaderMenu;