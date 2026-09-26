import service from '@/utils/request'

export const useMenuNavApi = () => {
	return service.get('/sys/menu/nav')
}

export const useAuthorityListApi = () => {
	return service.get('/sys/menu/authority')
}

export const useMenuListApi = (type: Number) => {
	// Menu type 0: menu  1: button  2: API
	const menuType = type === 2 ? 2 : 0

	return service.get('/sys/menu/list?type=' + menuType)
}

export const useMenuApi = (id: Number) => {
	return service.get('/sys/menu/' + id)
}

export const useMenuSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sys/menu', dataForm)
	} else {
		return service.post('/sys/menu', dataForm)
	}
}
