// @ts-ignore
import mitt from 'mitt'

/**
 * 传递对话框的确定按钮点击的事件
 */
export function sendDialogConfirm() {
  emitter.emit('dialog_confirm')
}

/**
 * 传递对话框确定按钮点击后处理完成的事件
 */
export function sendDialogConfirmHandlerOk() {
  emitter.emit('dialog_confirm_handler_ok')
}

/**
 * 传递对话框的取消按钮点击的事件
 */
export function sendDialogCancel() {
  emitter.emit('dialog_cancel')
}

let emitter = mitt()
export default emitter
