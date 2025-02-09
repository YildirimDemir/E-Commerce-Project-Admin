'use client';

import React, { useState } from 'react'
import Style from './adminsettings.module.css'
import UpdatePassword from './Settings/UpdatePassword';
import UpdateUser from './Settings/UpdateAdmin';
import DeleteUser from './Settings/DeleteAdmin';

export default function AdminSettings() {

    const [selectedSetting, setSelectedSetting] = useState<string>('info');

  return (
    <div className={Style.settingsPage}>
       <div className={Style.settingsArea}>

       <div className={Style.settingsSidebar}>
            <button
              className={Style.chooseBtn}
              onClick={() => setSelectedSetting('info')}
            >
                User Info
            </button>
            <button
              className={Style.chooseBtn}
              onClick={() => setSelectedSetting('password')}
            >
                Password
            </button>
            <button
              className={Style.chooseBtn}
              onClick={() => setSelectedSetting('delete')}
            >
                Delete 
            </button>
        </div>
        <div className={Style.selectedSettingArea}>
            {selectedSetting === 'info' && <UpdateUser />}
            {selectedSetting === 'password' && <UpdatePassword />}
            {selectedSetting === 'delete' && <DeleteUser />}
        </div>

       </div>
    </div>
  )
}
