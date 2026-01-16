// hooks/useNotification.js
import { enqueueSnackbar } from 'notistack'

export const useNotification = () => {
  const showSuccess = (message, options = {}) => {
    enqueueSnackbar(message, { variant: 'success', ...options })
  }

  const showError = (message, options = {}) => {
    enqueueSnackbar(message, { variant: 'error', ...options })
  }

  const showWarning = (message, options = {}) => {
    enqueueSnackbar(message, { variant: 'warning', ...options })
  }

  const showInfo = (message, options = {}) => {
    enqueueSnackbar(message, { variant: 'info', ...options })
  }

  return { showSuccess, showError, showWarning, showInfo }
}