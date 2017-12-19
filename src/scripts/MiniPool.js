export default class MiniPool{

	constructor(loop){

		this._used = []
		this._free = [];
		this._loop = loop;
		this._resetFunc = undefined
		this._index = 0;
	}
	get resetFunc(){
		return this._resetFunc;
	}

	set resetFunc(val){
		if(typeof val == "function")
			this._resetFunc = val;
		else
			this._resetFunc = undefined;
	}

	Return(obj){
		let usedIndex = this._used.indexOf(obj);
		if( usedIndex > -1){
			if(this._resetFunc){
			//console.log("Reset", obj);
				obj = this._resetFunc(obj);
			}
				this._used.slice(usedIndex, usedIndex + 1);
				this._free.push(obj);
		}
	}

	add(val){
		
		this._free.push(val);
		let _this = this;
		val.Return = function() {
			_this.Return(val);
		}

	}

	get last() {
		if(this._free.length > 0){
			let obj = this._free.shift()
			this._used.push(obj);
			return obj;
		}
		else {
		 	if(this._used.length > 0 && this._loop){
		 		return this._used[0];
		 	} 
		 } 
		return null;
	}
}