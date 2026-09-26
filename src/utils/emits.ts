import mitt, { Emitter } from 'mitt'

export default mitt() as Emitter<any>

export const enum MittEvent {
	// Left menu tree
	LeftTree = 'leftTree'
}
