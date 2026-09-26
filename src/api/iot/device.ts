import service from '@/utils/request'

export function useIotDeviceApi(id: number) {
	return service.get('/iot/device/' + id)
}

export const useIotDeviceSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/iot/device', dataForm)
	} else {
		return service.post('/iot/device', dataForm)
	}
}

// Send command, wait for device reply
export const useIotDeviceSyncSendCommandApi = (dataForm: any) => {
	return service.post('/iot/device/syncSendCommand', dataForm)
}
// Send command, wait for device reply, debug mode
export const useIotDeviceSyncSendCommandDebugApi = (dataForm: any) => {
	return service.post('/iot/device/syncSendCommand/debug', dataForm)
}

// Send command, do not wait for device reply
export function useIotDeviceAsyncSendCommandApi(dataForm: any) {
	return service.post('/iot/device/asyncSendCommand', dataForm)
}

//Simulate device property data report
export function useIotDeviceSimulateDeviceReportAttributeDataApi(dataForm: any) {
	return service.post('/iot/device/simulateDeviceReportAttributeData', dataForm)
}
