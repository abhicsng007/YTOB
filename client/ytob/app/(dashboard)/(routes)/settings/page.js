"use client";

import React, { useState } from 'react';
import SettingsPopup from '@/components/ui/SettingsPopup';

const Settings = () => {
  

  return (
    <div>
      <SettingsPopup isOpen={true} />
    </div>
  );
};

export default Settings;