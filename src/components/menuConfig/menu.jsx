'use client'
import { MenuItem, Menu, Select, FormControl, InputLabel } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import BarChartIcon from '@mui/icons-material/BarChart'
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined'
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined'
import { useThemeMode } from '@/components/providers/theme-context'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function MenuComp({ anchorEl, open, onClose }) {
  const { toggleTheme } = useThemeMode()
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value
    setLanguage(selectedLang)
    i18n.changeLanguage(selectedLang)
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ width: '900px', borderRadius: '60px' }}
    >
      <MenuItem sx={{ display: 'flex', gap: '30px', width: '290px' }}>
        <SettingsIcon />
        <span>{t('layout.mores.setting')}</span>
      </MenuItem>
      <MenuItem sx={{ display: 'flex', gap: '30px', width: '290px' }}>
        <BarChartIcon />
        <span>{t('layout.mores.action')}</span>
      </MenuItem>
      <MenuItem
        onClick={() => {
          toggleTheme()
          onClose()
        }}
        sx={{ display: 'flex', gap: '30px', width: '290px', cursor: 'pointer' }}
      >
        <BedtimeOutlinedIcon />
        <span>{t('layout.mores.mode')}</span>
      </MenuItem>
      <MenuItem sx={{ display: 'flex', gap: '30px', width: '290px' }}>
        <SmsFailedOutlinedIcon />
        <span>{t('layout.mores.problem')}</span>
      </MenuItem>

      <MenuItem sx={{ width: '290px' }}>
        <FormControl fullWidth size="small">
          <InputLabel>{t('layout.language')}</InputLabel>
          <Select
            value={language}
            label={t('layout.language')}
            onChange={handleLanguageChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="tj">Тоҷикӣ</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
      
      </MenuItem>
    </Menu>
  )
}
