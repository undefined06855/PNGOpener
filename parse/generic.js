function parse(event)
{
    console.log(event.dataTransfer.files[0])
    if (
        event.dataTransfer.files.length == 0 ||
        event.dataTransfer.files[0].type != "image/png"
    ) {}
    else
    {
        try {document.querySelector("#chunks").childNodes[2].remove()}
        catch (e) {}
        document.querySelector("#chunks").querySelectorAll("fieldset").forEach(e => e.remove()); IHDR = new Uint8Array(); IDAT = new Uint8Array()

        var reader = new FileReader();

        const file = event.dataTransfer.files[0]
    
        reader.onload = function() {
            console.log(`File name: ${file.name}`)

            var arrayBuffer = this.result
            imageraw = new Uint8Array(arrayBuffer)

            filetype =
            String.fromCharCode(imageraw[1]) +
            String.fromCharCode(imageraw[2]) +
            String.fromCharCode(imageraw[3])

            chunkType = ""
            chunkLen = 0
            offset = 8
            curChunk = 0

            validchunks = true

            IDAT = []
            IHDR = ["N/A"]

            chunks = []

            while (chunkType != "IEND")
            {
                chunkLen = arr32ToVal([
                    imageraw[offset + 0],
                    imageraw[offset + 1],
                    imageraw[offset + 2],
                    imageraw[offset + 3]
                ])
                
                chunkType =
                    String.fromCharCode(imageraw[offset + 4]) +
                    String.fromCharCode(imageraw[offset + 5]) +
                    String.fromCharCode(imageraw[offset + 6]) +
                    String.fromCharCode(imageraw[offset + 7])

                chunkDesc = descs[chunkType]

                chunkLenStr = chunkLen.toString().padStart(3, "0") // pads length

                data = imageraw.slice(offset + 8, offset + 8 + chunkLen)
                //                             ^           ^
                //        counteract the length and type metadata in the chunk

                console.log(chunkType)
                if (chunkType == "IHDR") IHDR = data
                if (chunkType == "IDAT") IDAT += data

                chunks.push({
                    type: chunkType,
                    description: chunkDesc,
                    crc: mergeToHex(imageraw.slice(offset + 8 + chunkLen, offset + 8 + chunkLen + 4)),
                    metadata: {
                        len: chunkLen,
                        offset: offset
                    },
                    flags: {
                        critical:     iscapital(chunkType.charAt(0)),
                        public:       iscapital(chunkType.charAt(1)),
                        valid:        iscapital(chunkType.charAt(2)),
                        safetocopy: iscapital(chunkType.charAt(3)),
                    },
                    data: data
                })

                chunkDesc = descs[chunkType]

                if (chunkDesc == undefined)
                {
                    addchunks({
                        "name": chunkType,
                        "desc": "Erronious chunk.",
                        "err": true
                    }, curChunk)
                }
                else
                {
                    addchunks({
                        "name": chunkType,
                        "desc": chunkDesc,
                        "err": false
                    }, curChunk)
                }

                offset += chunkLen + 4 + 4 + 4
                curChunk++
            }

            IDAT = Uint8Array.from(IDAT)


            // parse IHDR:

            width =
            IHDR[0] +
            IHDR[1] +
            IHDR[2] +
            IHDR[3]

            height =
            IHDR[4] +
            IHDR[5] +
            IHDR[6] +
            IHDR[7]

            bitdepth = IHDR[8]


            coltype = coltypes[IHDR[9]]

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
            bitdepthisvalid(IHDR[9], IHDR[8])


            console.table({
                "Filename": file.name,
                "Type": filetype,
                "Physical size": file.size,
                "Size": width.toString() + "x" + height.toString() ,
                "Bitdepth": bitdepth,
                "Coltype": coltype + " (" + IHDR[9] + ")",
                "Header valid": isvalid,
                "Chunks valid": validchunks
            })
        }

        reader.readAsArrayBuffer(file);
        event.preventDefault()
    }
}
