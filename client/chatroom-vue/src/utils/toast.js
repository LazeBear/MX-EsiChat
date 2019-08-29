import { ToastProgrammatic as Toast } from 'buefy';

function showErrorToast(msg) {
  Toast.open({
    duration: 5000,
    message: msg,
    type: 'is-danger'
  });
}

function showSuccessToast(msg) {
  Toast.open({
    duration: 5000,
    message: msg,
    type: 'is-success'
  });
}

export default {
  showErrorToast,
  showSuccessToast
};
