'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ThemeProviderCustom } from './theme-context'
import { useThemeMode } from './theme-context'

function InnerThemeWrapper({ children }) {
  const { theme } = useThemeMode()
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  )
}

export default function ThemeWrapper({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProviderCustom>
        <InnerThemeWrapper>{children}</InnerThemeWrapper>
      </ThemeProviderCustom>
    </AppRouterCacheProvider>
  )
}
