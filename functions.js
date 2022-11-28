const arrToVal = arr => {return new DataView(new Uint8Array(arr).buffer).getInt32()}

function parsechunkdata(data, chunktype)
{
    switch(chunktype)
    {
        case "PLTE":
            var str = "Palette entries:\n"
            var index = 0
            for (var offset = 0; offset < data.length; offset += 3)
            {
                str += "Entry " + index + ": " + data[offset] + ", " + data[offset + 1] + ", " + data[offset + 2] + "\n"
                index++
            }
            return str
        case "IHDR":
            width =
            data[0] +
            data[1] +
            data[2] +
            data[3]

            height =
            data[4] +
            data[5] +
            data[6] +
            data[7]

            bitdepth = data[8]


            coltype = coltypes[data[9]]

            isvalid = // this should be the same in every png file
            imageraw[0] == 137   &&
            imageraw[1] == 80    &&
            imageraw[2] == 78    &&
            imageraw[3] == 71    &&
            imageraw[4] == 13    &&
            imageraw[5] == 10    &&
            imageraw[6] == 26    &&
            imageraw[7] == 10    &&
            coltype != undefined &&
            height > 0           &&
            width > 0            &&
            bitdepthisvalid(data[9], data[8])

            return "Header Data:" +
            "\nSize: " + width.toString() + "x" + height.toString() +
            "\nBitDepth: " + bitdepth +
            "\nColour Type: " + coltype + " (" + data[9] + ")" +
            "\nValid Header: " + isvalid
        case "gAMA":
            gamaVal = arrToVal([
                data[0],
                data[1],
                data[2],
                data[3]
            ])

            return "Gamma value: " + gamaVal / 100000 + " (" + gamaVal + "÷100000)"
        case "sRGB":
            return "Rendering intent: " + renderingintents[data[0]]
        case "tRNS":
            if (IHDR[9] == 0)
                return "Greyscale value being used as transparent: " + arrToVal([data[0], data[1]])
            if (IHDR[9] == 2)
                return "RGB value being used as transparent: " + arrToVal([data[0], data[1]]) + ", " + arrToVal([data[2], data[3]]) + ", " + arrToVal([data[4], data[5]])
            if (IHDR[9] == 3)
                var str = ""
                for (var i = 0; i < data.length; i++) str += "Alpha for palette " + i + ": " + data[i] + "\n"
                return str
    }
}

function addchunks(data, index)
{
    //console.log(`Adding chunk... err?: ${data.err}`)
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
        document.querySelector("#ch_type").innerText = chunks[index].type
        document.querySelector("#ch_desc").innerText = chunks[index].description
        document.querySelector("#ch_size").innerText = chunks[index].metadata.len
        document.querySelector("#ch_offset").innerText = chunks[index].metadata.offset
        document.querySelector("#ch_flag1").innerText = chunks[index].flags.critical
        document.querySelector("#ch_flag2").innerText = chunks[index].flags.public
        document.querySelector("#ch_flag3").innerText = chunks[index].flags.valid
        document.querySelector("#ch_flag4").innerText = chunks[index].flags.safetocopy
        if (includesutf8.includes(chunks[index].type))
        document.querySelector("#ch_special_contents").innerText = new TextDecoder().decode(chunks[index].data)
        else
        document.querySelector("#ch_special_contents").innerText = ""

        if (chunks[index].data.toString().length > 30)
        document.querySelector("#ch_data").innerText = chunks[index].data.toString().slice(0, 27) + "..."
        else
        document.querySelector("#ch_data").innerText = chunks[index].data

        if (canparse.includes(chunks[index].type))
        document.querySelector("#ch_special_parsed").innerText = parsechunkdata(chunks[index].data, chunks[index].type)
        else
        document.querySelector("#ch_special_parsed").innerText = ""
    })
}

const iscapital = str => { return str == str.toUpperCase() }
const bitdepthisvalid = (coltype, bitdepth) => {return validbitdepths[coltype].includes(bitdepth)}
