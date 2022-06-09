const nota = document.getElementById("nota")
const fondo = document.getElementById("fondo")
const letra = document.getElementById("letra")
const button =  document.getElementById("agregar")
const borrar =  document.getElementById("borrar")

window.addEventListener("load",()=>{
    console.log(letra)
    letra.value = "#ffffff"
})
console.log(fondo.value)
const indexedDb = window.indexedDB
let db
const peticion = indexedDb.open(`notas`,1)
peticion.onsuccess=()=>{
    db=peticion.result
    console.log(`OPEN`,db)
    readData()
}
peticion.onupgradeneeded=()=>{
    db=peticion.result
    const objectStore=db.createObjectStore(`ListaNotas`,{
        autoIncrement: true
    })
    console.log(`CREATE`,db)
}

// * Leer datos de usuario
const readData=()=>{
    const transaction=db.transaction([`ListaNotas`],`readonly`)
    const objectStore=transaction.objectStore(`ListaNotas`)
    const request=objectStore.openCursor()
    request.onsuccess = (e)=>{
        const cursor=e.target.result
        if(cursor){
            console.log(cursor.value)  
            const box = document.getElementById("container")
            let info = document.createElement("textarea")
            let div = document.createElement("div")
            info.value=cursor.value.descripcion
            info.setAttribute("readonly", "")
            info.setAttribute("readonly", "")

            div.classList.add("w-3/4","mx-auto","mt-4","rounded")
            info.classList.add("bg-transparent","text-center","w-full")
            info.classList.add("focus:outline-none","px-3")
            box.appendChild(div)
            div.appendChild(info)
            div.style.backgroundColor = cursor.value.fondo;
            info.style.color = cursor.value.letra;
            cursor.continue()
        }else{
            console.log("No more data")
        }
    }
}
button.addEventListener("click",()=>{
    location.reload()
    let notas={
        fondo:fondo.value,
        descripcion:nota.value,
        letra:letra.value
    }
    const transaction=db.transaction([`ListaNotas`],`readwrite`)
    const objectStore=transaction.objectStore(`ListaNotas`)
    const request=objectStore.add(notas)
})
borrar.addEventListener("click",()=>{
    let confirmacion = confirm("Se borraran todas tu notas ¿Deseas continuar?")
    if (confirmacion == true) {
    const transaction = db.transaction([`ListaNotas`],`readwrite`)
    const objectStore = transaction.objectStore(`ListaNotas`)
    const request = objectStore.openCursor()
    request.onsuccess = (e) =>{
        const cursor = e.target.result
        location.reload()
        if(cursor){
            objectStore.clear()
            cursor.continue()
        }
    }
    }
})

peticion.onerror=()=>{
    console.log(`Error`,error)}