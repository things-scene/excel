!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("@hatiolab/things-scene"),require("xlsx")):"function"==typeof define&&define.amd?define(["@hatiolab/things-scene","xlsx"],t):(e=e||self)["things-scene-excel"]=t(e.scene,e.XLSX)}(this,function(e,t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var r="data:image/png;base64,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";const a={mutable:!1,resizable:!0,rotatable:!0,properties:[{type:"string",label:"src",name:"src",placeholder:"Excel File URL"}]};async function h(e){const r=await fetch(e,{method:"GET",headers:{"Content-Type":"application/xlsx"},credentials:"include"}),a=t.read(await r.arrayBuffer(),{type:"array"});var h={};return a.SheetNames.forEach(e=>{var r=t.utils.sheet_to_json(a.Sheets[e]);r.length&&(h[e]=r)}),console.log("result",h),h}class s extends(e.DataSource(e.RectPath(e.Shape))){static get image(){return s._image||(s._image=new Image,s._image.src=r),s._image}dispose(){super.dispose()}ready(){const{src:e}=this.state;e&&h(e).then(e=>{this.setState("data",e)})}render(e){var{left:t,top:r,width:a,height:h}=this.bounds;e.beginPath(),e.drawImage(s.image,t,r,a,h)}get nature(){return a}get src(){return this._src}set src(e){this._src=e,e&&h(e).then(e=>{this.setState("data",e)})}}return e.Component.register("excel",s),[s]});
//# sourceMappingURL=things-scene-excel.js.map
