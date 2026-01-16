// components/NotificationProvider.jsx
import { SnackbarProvider } from 'notistack'

export const NotificationProvider = ({ 
  children, 
  maxSnack = 3,
  autoHideDuration = 7000 
}) => {
  return (
    <SnackbarProvider
      maxSnack={maxSnack}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {children}
    </SnackbarProvider>
  )
}