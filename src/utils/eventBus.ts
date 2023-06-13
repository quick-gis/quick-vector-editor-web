// @ts-ignore
import mitt from 'mitt'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'

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

/**
 * 底图关闭事件
 * @param plt
 */
export function closeDiTuLayer(plt: ProdLayersTypeEnum) {
  emitter.emit('closeDiTuLayer', plt)
}

/**
 * 底图开启事件
 * @param plt
 */
export function openDiTuLayer(plt: ProdLayersTypeEnum) {
  emitter.emit('openDiTuLayer', plt)
}

/**
 * 矢量图关闭事件
 * @param value
 */
export function closeVectorLayer(value: string) {
  emitter.emit('closeVectorLayer', value)
}
/**
 * 矢量图开启事件
 * @param value
 */
export function openVectorLayer(value: string) {
  emitter.emit('openVectorLayer', value)
}

let emitter = mitt()
export default emitter
