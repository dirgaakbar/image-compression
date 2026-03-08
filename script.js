const upload = document.getElementById("upload")
const dropZone = document.getElementById("drop-zone")
const processBtn = document.getElementById("processBtn")

upload.addEventListener("change", previewImage)

dropZone.addEventListener("dragover",e=>{
e.preventDefault()
})

dropZone.addEventListener("drop",e=>{
e.preventDefault()
upload.files = e.dataTransfer.files
previewImage()
})

function previewImage(){

const file = upload.files[0]
if(!file) return

const url = URL.createObjectURL(file)

document.getElementById("afterImg").src = url
}

processBtn.onclick = async ()=>{

const file = upload.files[0]

if(!file){
alert("Pilih foto dulu")
return
}

const mode = document.getElementById("mode").value
const format = document.getElementById("format").value
const quality = parseFloat(document.getElementById("quality").value)

const options = {
maxSizeMB:1,
maxWidthOrHeight:parseInt(document.getElementById("maxWidth").value),
initialQuality:quality,
useWebWorker:true,
fileType:format
}

const compressed = await imageCompression(file,options)

let resultBlob = compressed

if(mode==="enhance"){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const img = new Image()
img.src = URL.createObjectURL(compressed)

await new Promise(r=>img.onload=r)

canvas.width = img.width
canvas.height = img.height

ctx.filter="contrast(1.08) saturate(1.05) brightness(1.02)"
ctx.drawImage(img,0,0)

resultBlob = await new Promise(res=>canvas.toBlob(res,format,quality))

}

showResult(file,resultBlob)

}

function showResult(original,compressed){

const beforeURL = URL.createObjectURL(original)
const afterURL = URL.createObjectURL(compressed)

document.getElementById("beforeImg").src = beforeURL
document.getElementById("afterImg").src = afterURL

const originalSize=(original.size/1024/1024).toFixed(2)
const compressedSize=(compressed.size/1024/1024).toFixed(2)

const saved=Math.round((1-compressed.size/original.size)*100)

document.getElementById("sizeStats").innerText=`${originalSize}MB → ${compressedSize}MB`
document.getElementById("savedStats").innerText=`Hemat ${saved}%`

const download=document.getElementById("downloadBtn")

download.href=afterURL
download.download=`HD_Optimized_${Date.now()}.${compressed.type.split("/")[1]}`

document.getElementById("result").classList.remove("hidden")

}

const slider=document.getElementById("slider")
const before=document.getElementById("beforeImg")

slider.onmousedown=e=>{
document.onmousemove=e=>{
const rect=slider.parentElement.getBoundingClientRect()
let x=e.clientX-rect.left
let percent=(x/rect.width)*100

if(percent<0)percent=0
if(percent>100)percent=100

before.style.width=percent+"%"
slider.style.left=percent+"%"
}
}

document.onmouseup=()=>document.onmousemove=null
