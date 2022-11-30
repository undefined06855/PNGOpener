const arr32ToVal = arr => {return new DataView(new Uint8Array(arr).buffer).getUint32()}
const arr16ToVal = arr => {return new DataView(new Uint8Array(arr).buffer).getUint16()}

const isCapital = str => { return str == str.toUpperCase() }
const bitDepthValid = (coltype, bitdepth) => {return validbitdepths[coltype].includes(bitdepth)}
const toDetail = (name, value, newl) => { return `<span class="detail">${name}: <span>${value}</span></span>${newl ? "<br/>" : ""}` }

function mergeToHex(arr)
{
    var str = ""
    for (i in arr) str += arr[i].toString(16)
    return str.toUpperCase()
}
function textToNullChar(arr, index = 0)
{
    var str = ""
    for (var i = index; i < arr.length; i++)
    {
        const byte = arr[i]
        if (byte === 0) return {str: str, end: i}
        str += String.fromCharCode(byte)
    }
    return {str: str, end: arr.length}
}

function addchunks(data, index)
{
    chunk = document.createElement("fieldset")
    title = document.createElement("legend")

    document.getElementById("chunks").appendChild(chunk)

    title.innerText = data.name

    chunk.classList.add("chunk")
    data.err ? chunk.classList.add("err") : ""
    
    descDiv = document.createElement("div")
    descDiv.innerText = data.desc

    chunk.appendChild(title)

    chunk.appendChild(descDiv)

    chunk.setAttribute("index", index)

    chunk.addEventListener("click", event => {
        console.log(event.target.getAttribute("index"))
        const index = event.target.getAttribute("index")

        document.querySelector("#docu_button").disabled = false

        document.querySelector("#ch_type").innerText = chunks[index].type
        document.querySelector("#ch_desc").innerText = chunks[index].description
        document.querySelector("#ch_size").innerText = chunks[index].metadata.len
        document.querySelector("#ch_offset").innerText = chunks[index].metadata.offset
        document.querySelector("#ch_crc").innerText = chunks[index].crc
        document.querySelector("#ch_flag1").innerText = chunks[index].flags.critical
        document.querySelector("#ch_flag2").innerText = chunks[index].flags.public
        document.querySelector("#ch_flag3").innerText = chunks[index].flags.valid
        document.querySelector("#ch_flag4").innerText = chunks[index].flags.safetocopy

        if (chunks[index].data.toString().length > 30)
        document.querySelector("#ch_data").innerText = chunks[index].data.toString().slice(0, 27) + "..."
        else
        document.querySelector("#ch_data").innerText = chunks[index].data

        if (canparse.includes(chunks[index].type))
        document.querySelector("#ch_special_parsed").innerHTML = specialParse(chunks[index].data, chunks[index].type)
        else
        document.querySelector("#ch_special_parsed").innerHTML = ""
    })
}
